/*
 * @Author      : Chinge Yang
 * @Date        : 2022-09-08 16:29:51
 * @LastEditTime: 2022-09-26 17:07:35
 * @LastEditors : Chinge Yang
 * @Description : 登录验证的中间件
 * @FilePath    : /ygqygq2-cli-template/src/middleware/loginCheck.js
 */
import { Context, Next } from "koa";

async function loginCheck(ctx: Context, next: Next) {
  const session = ctx.session;

  if (session) {
    const userInfo = (<any>session).userInfo || {};
    if (userInfo && userInfo.username) {
        // 登录验证通过
        await next();
        return;
    }
  }

  // 未登录
  ctx.body = {
    errno: -1,
    message: "用户未登录",
  };
}

export default loginCheck;
