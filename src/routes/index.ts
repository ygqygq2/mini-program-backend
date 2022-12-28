import Router from "@koa/router";
import { Context, Next } from "koa";
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

export default router;
