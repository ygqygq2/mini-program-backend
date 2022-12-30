import config from "../../config";
import Router from "@koa/router";
import {Context, Next} from "koa";
import jsonwebtoken from "jsonwebtoken";
import * as WeixinAuth from "../utils/weixinAuth";

const router = new Router();

router.get("/", async (ctx: Context, next: Next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

router.get("/string", async (ctx: Context, next: Next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx: Context, next: Next) => {
  ctx.body = { title: "koa2 json" };
});

// 测试jwt阻断，在小程序中也有调用，为了测试
router.get("/home", async (ctx: Context, next: Next) => {
  const name = ctx.request.query.name || "";
  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: `ok,${name}`,
  };
});

// 一个web-view页面，是给小程序加载的
router.all("/web-view", async function (ctx) {
  const token = ctx.request.query.token;
  if (token) {
    ctx.cookies.set("Authorization", `Bearer ${token}`, { httpOnly: false });
  }
  const title = "web view";
  await ctx.render("index", {
    title,
  });
});

// 小程序的机要信息
const miniProgramAppId = "wxc3db312ddf9bcb01";
const miniProgramAppSecret = "6bb4f303f55a5893fac810e2ab56faa1";
const weixinAuth = new WeixinAuth(miniProgramAppId, miniProgramAppSecret);

// 这是第一次小程序登陆法
router.post("/wexin-login1", async (ctx: Context) => {
  const { code } = ctx.request.body as any;

  const token = await weixinAuth.getAccessToken(code);
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
  const sessionKey = token.data.session_key;
  console.log("sessionKey", sessionKey);

  const pc = new WXBizDataCrypt(miniProgramAppId, sessionKey);
  const decryptedUserInfo = pc.decryptData(encryptedData, iv);
  console.log("解密后 decryptedUserInfo.openId: ", decryptedUserInfo.openId);

  const authorizationToken = jsonwebtoken.sign({ name: decryptedUserInfo.nickName }, config.JWT_SECRET, {
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
