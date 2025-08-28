const glob = require("glob");
const path = require("path");
const { sep } = path;

/** 
 * middleware loader
 * @param {Object} app Koa实例
 * 
 * 加载middleware, 可通过'app.middleware.${目录}.${文件}' 访问
 * 
    例子：
    app/middleware
      |
      | -- custom-module
              |
              |  -- custom-middleware.js


    => app.middlewares.customModule.customMiddleware
 *
 */
module.exports = (app) => {
  // 读取 app/middleware/**/**.js 下的所有文件
  const middlewares = {};
  const elpisMiddlewarePath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}middleware`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisMiddlewarePath, `.${sep}**${sep}*.js`)
  );
  const businessMiddlewarePath = path.resolve(app.businessPath, "middleware");
  const businessFileList = glob.sync(
    path.resolve(businessMiddlewarePath, `.${sep}**${sep}*.js`)
  );

  [...elpisFileList, ...businessFileList].forEach((file) => {
    // 提取文件名称
    // 截取路径
    // 把'-'统一为驼峰命名
    let name = path
      .resolve(file)
      .replace(elpisMiddlewarePath, "")
      .replace(businessMiddlewarePath, "")
      .replace(sep, "/")
      .replace(/^\//, "")
      .replace(/\.js$/, "");
    // 把'-'转换为驼峰命名
    name = name.replace(/[_-]([a-z])/gi, (_, letter) => letter.toUpperCase());
    let tempMiddleware = middlewares;
    const names = name.split(sep);
    names.forEach((item, index) => {
      if (index === names.length - 1) {
        tempMiddleware[item] = require(file)(app);
      } else {
        tempMiddleware[item] = tempMiddleware[item] || {};
        tempMiddleware = tempMiddleware[item];
      }
    });
  });
  app.middlewares = middlewares;
};
