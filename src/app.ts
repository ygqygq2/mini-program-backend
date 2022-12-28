import path from "path";
import Koa from "koa";
import views from "koa-views";
import json from "koa-json";
import onerror from "koa-onerror";
import bodyparser from "koa-bodyparser";
import logger from "koa-logger";
import session from "koa-generic-session";
import cors from "koa2-cors";
import koaStatic from "koa-static";
import index from "./routes/index";
import users from "./routes/user";

const app = new Koa();

// error handler
onerror(app);

// 服务端支持跨域
app.use(
  cors({
    origin: "http://localhost:8080", // 允许跨域的域名
    credentials: true, // 允许跨域携带cookie
  })
);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(koaStatic(path.join(__dirname, "/public")));

app.use(
  views(path.join(__dirname, "/views"), {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = +new Date() - +start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// session 配置
app.keys = ["session-koa2"];
app.use(
  session({
    cookie: {
      path: "/", // cookie 在根目录下生效
      httpOnly: true, // cookie 只允许后端修改
      maxAge: 24 * 60 * 60 * 1000, // cookie 有效时长
    },
  })
);

// cookie
app.use(async (ctx, next) => {
  // cookie 获取 view
  const view = ctx.cookies.get("view") || "0";
  const n = ~~view + 1;
  ctx.cookies.set("view", n.toString(), { httpOnly: false });
  await next();
});

// routes
app.use(index.routes()).use(index.allowedMethods());
app.use(users.routes()).use(users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

export default app;
