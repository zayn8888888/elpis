const KoaRouter = require("koa-router");
const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * router loader
 * @param {Object} app Koa实例
 *
 * 解析所有 app/router/**/ /*.js 文件,加载到KoaRouter 下
 */
module.exports = (app) => {
  const elpisRouterPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}router`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisRouterPath, `.${sep}**${sep}*.js`)
  );
  const businessRouterPath = path.resolve(app.businessPath, "router");
  const businessFileList = glob.sync(
    path.resolve(businessRouterPath, `.${sep}**${sep}*.js`)
  );
  const router = new KoaRouter();
  // 注册所有路径
  [...elpisFileList, ...businessFileList].forEach((file) => {
    require(file)(app, router);
  });
  router.get("*", async (ctx, next) => {
    ctx.status = 302;
    ctx.redirect(`${app?.options?.homePage ?? "/"}`);
  });
  app.use(router.routes());
  app.use(router.allowedMethods());
};
