import Router from "@koa/router";
// import { Context, Next } from "koa";
import { type Context, type Next } from "koa";
import jsonwebtoken from "jsonwebtoken";

// jwt 配置
const JWT_SECRET = "jwt";
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
      const payload = await util.promisify(jsonwebtoken.verify)(token, JWT_SECRET);
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
  if (user == "ygqygq2" && password == "ly") {
    ctx.status = 200;
    ctx.body = {
      code: 200,
      msg: "Login Successful",
      token:
        "Bearer " +
        jsonwebtoken.sign(
          { name: user }, // Encrypt userToken
          JWT_SECRET,
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

export default router;
