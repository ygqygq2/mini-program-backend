import Router from "@koa/router";
const router = new Router();

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = { title: "koa2 json" };
});

// 测试jwt阻断，在小程序中也有调用，为了测试
router.get("/home", async (ctx, next) => {
  const name = ctx.request.query.name || "";
  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: `ok,${name}`,
  };
});

export default router;
