const path = require("path");
module.exports = (app) => {
  // 配置静态资源目录
  app.use(require("koa-static")(path.join(app.basePath, "./app/public")));

  // 库静态目录
  app.use(require("koa-static")(path.join(__dirname, "./public")));

  // 模板渲染引擎
  const koaNunjucks = require("koa-nunjucks-2");
  app.use(
    koaNunjucks({
      ext: "tpl",
      path: path.join(app.basePath, "./app/public"),
      nunjucksConfig: {
        trimBlocks: true,
        noCache: true,
      },
    })
  );

  // 使用ctx.body 解析中间件
  const bodyParser = require("koa-bodyparser");
  app.use(
    bodyParser({
      formLimit: "100mb",
      enableTypes: ["json", "form", "text"],
    })
  );

  // 错误处理
  app.use(app.middlewares.errorHandler);

  // 引入API 参数校验
  app.use(app.middlewares.apiParamsVerify);

  // 签名验证
  app.use(app.middlewares.apiSignVerify);

  //引入项目处理中间件
  app.use(app.middlewares.projectHandler);
};
