import config from "../../config";
import Router from "@koa/router";
// import { Context, Next } from "koa";
import util from "util";
import jsonwebtoken from "jsonwebtoken";
import WeixinAuth from "../utils/wxAuth";
import weixinDataCrypt from "../utils/wxDataCrypt";

// jwt 配置
const router = new Router({
  prefix: "/user",
});

router.use(async (ctx, next) => {
  // 如果不是登录页，
  // 还有web-view，这是为了测试方便
  if (!ctx.url.includes("login") && !ctx.url.includes("web-view")) {
    try {
      let token = ctx.request.header.authorization || "";
      console.log("token", token);
      token = token.split(" ")[1];
      // 如果签名不对，这里会报错，走到catch分支
      // const payload = await util.promisify(jsonwebtoken.verify)(token, config.jwtSecret);
      const payload = await util.promisify(jsonwebtoken.verify)(token);
      console.log("payload", payload);
      // 404 bug
      await next();
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  } else {
    // 这里status状态不对，也会返回404
    // 所有next都要加await，重要！
    await next();
  }
});

// 登陆
router.get("/login", function (ctx) {
  const { user, password } = ctx.request.query;
  // console.log(user,password);

  // 省略查库过程，将验证过程硬编码
  if (user == "ygqygq2" && password == "ygqygq2") {
    ctx.status = 200;
    ctx.body = {
      code: 200,
      msg: "Login Successful",
      token:
        "Bearer " +
        jsonwebtoken.sign(
          { name: user }, // Encrypt userToken
          config.jwtSecret,
          { expiresIn: "1d" }
        ),
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      msg: "User name password mismatch",
    };
  }
});

// 测试 jwt 阻断
router.all("/home", async function (ctx) {
  const name = ctx.request.query.name || "";
  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: `ok, ${name}`,
  };
});

// 一个web-view页面，是给小程序加载的
router.all("/web-view", async function (ctx) {
  const token = ctx.request.query.token;
  ctx.session.sessionKeyRecordId = ~~ctx.session.sessionKeyRecordId + 1;

  if (token) {
    ctx.cookies.set("Authorization", `Bearer ${token}`, { httpOnly: false });
  }
  const title = "web view from koa" + ctx.session.sessionKeyRecordId;

  await ctx.render("index2", {
    title,
    arr: [1, 2, 3],
    now: new Date(),
  });
});

// 小程序的机要信息
const miniProgramAppId = "wxc3db312ddf9bcb01";
const miniProgramAppSecret = "6bb4f303f55a5893fac810e2ab56faa1";
const weixinAuth = new WeixinAuth(miniProgramAppId, miniProgramAppSecret);

// 这是第一次小程序登陆法
router.post("/wexin-login1", async (ctx) => {
  const { code } = ctx.request.body as any;

  const token = await weixinAuth.getAccessToken(code) as any;
  // const accessToken = token.data.access_token;
  const openid = token.data.openid;

  // const userinfo = await weixinAuth.getUser(openid)
  // 这个地方有错误，invalid credential, access_token is invalid or not latest
  // 拉取不到userInfo

  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: "ok",
    data: openid,
  };
});

// 这是正规的登陆方法
router.post("/wexin-login2", async (ctx) => {
  // console.log('request.body',ctx.request.body);
  const { code, userInfo, encryptedData, iv } = ctx.request.body as any;

  const token = await weixinAuth.getAccessToken(code);
  const sessionKey = (token as any).data.session_key;
  console.log("sessionKey", sessionKey);

  const pc = new weixinDataCrypt(miniProgramAppId, sessionKey);
  const decryptedUserInfo = pc.decryptData(encryptedData, iv);
  console.log("解密后 decryptedUserInfo.openId: ", decryptedUserInfo.openId);

  const authorizationToken = jsonwebtoken.sign({ name: decryptedUserInfo.nickName }, config.jwtSecret, {
    expiresIn: "1d",
  });
  Object.assign(decryptedUserInfo, { authorizationToken });

  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: "ok",
    data: decryptedUserInfo,
  };
});

export default router;
