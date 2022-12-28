import Router from "@koa/router";
// import { Context, Next } from "koa";
import { type Context, type Next } from "koa";
import { login, register } from "@/controller/user";
import loginCheck from "@/middleware/loginCheck";

const router = new Router({
  prefix: "/api/user",
});

interface IsExistParam {
  username: string;
  password: string;
}

// 获取用户信息
router.get("/getUserInfo", loginCheck, async (ctx: Context, next: Next) => {
  if (<any>ctx.session && (<any>ctx.session).userInfo) {
    ctx.body = {
      errno: 0,
      data: (<any>ctx.session).userInfo || {},
    };
  } else {
    ctx.throw(401, "用户未登录");
  }
});

// 登录
router.post("/login", async (ctx: Context, next: Next) => {
  // 获取请求参数
  const { username, password } = ctx.request.body as IsExistParam;
  // 验证登录
  const res = await login(username, password);
  // 登录成功，设置 session
  if (res) {
    // 设置 session
    if (<any>ctx.session && (<any>ctx.session).userInfo) {
      (<any>ctx.session).userInfo = { username };
    }

    // 返回
    ctx.body = {
      errno: 0,
    };
  } else {
    ctx.body = {
      errno: -1,
      message: "登录失败",
    };
  }
});

// 用户注册
router.post("/register", async (ctx: Context, next: Next) => {
  // 获取请求中的用户信息
  const userInfo = ctx.request.body || {};
  // 调用注册方法
  try {
    const newUser = await register(userInfo);
    // 注册成功
    ctx.body = {
      errno: 0,
      data: newUser,
    };
  } catch (ex) {
    // 注册失败
    console.error("注册失败", ex);
    ctx.body = {
      errno: -1,
      message: "注册失败",
    };
  }
});

export default router;
