const glob = require("glob");
const path = require("path");
const { sep } = path;

/** 
 * controller loader
 * @param {Object} app Koa实例
 * 
 * 加载controller, 可通过'app.controller.${目录}.${文件}' 访问
 * 
    例子：
    app/controller
      |
      | -- custom-module
              |
              |  -- custom-controller.js


    => app.controller.customModule.customController
 *
 */
module.exports = (app) => {
  // 读取 app/controller/**/**.js 下的所有文件
  const elpisControllerPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}controller`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisControllerPath, `.${sep}**${sep}*.js`)
  );
  const businessControllerPath = path.resolve(app.businessPath, "controller");
  const businessFileList = glob.sync(
    path.resolve(businessControllerPath, `.${sep}**${sep}*.js`)
  );
  const controllers = {};
  [...elpisFileList, ...businessFileList].forEach((file) => {
    // 提取文件名称
    // 截取路径
    // 把'-'统一为驼峰命名
    let name = path
      .resolve(file)
      .replace(elpisControllerPath, "")
      .replace(businessControllerPath, "")
      .replace(sep, "/")
      .replace(/^\//, "")
      .replace(/\.js$/, "");
    // 把'-'转换为驼峰命名
    name = name.replace(/[_-]([a-z])/gi, (_, letter) => letter.toUpperCase());
    let tempController = controllers;
    const names = name.split(sep);
    names.forEach((item, index) => {
      if (index === names.length - 1) {
        const ControllerModule = require(file)(app);
        tempController[item] = new ControllerModule();
      } else {
        tempController[item] = tempController[item] || {};
        tempController = tempController[item];
      }
    });
  });
  app.controller = controllers;
};
