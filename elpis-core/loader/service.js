const glob = require("glob");
const path = require("path");
const { sep } = path;

/** 
 * service loader
 * @param {Object} app Koa实例
 * 
 * 加载service, 可通过'app.service.${目录}.${文件}' 访问
 * 
    例子：
    app/service
      |
      | -- custom-module
              |
              |  -- custom-service.js


    => app.service.customModule.customService
 *
 */
module.exports = (app) => {
  // 读取 app/service/**/**.js 下的所有文件
  const elpisServicePath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}service`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisServicePath, `.${sep}**${sep}*.js`)
  );
  const businessServicePath = path.resolve(app.businessPath, "service");
  const businessFileList = glob.sync(
    path.resolve(businessServicePath, `.${sep}**${sep}*.js`)
  );
  const services = {};
  [...elpisFileList, ...businessFileList].forEach((file) => {
    // 提取文件名称
    // 截取路径
    // 把'-'统一为驼峰命名
    let name = path
      .resolve(file)
      .replace(elpisServicePath, "")
      .replace(businessServicePath, "")
      .replace(sep, "/")
      .replace(/^\//, "")
      .replace(/\.js$/, "");
    // 把'-'转换为驼峰命名
    name = name.replace(/[_-]([a-z])/gi, (_, letter) => letter.toUpperCase());
    let tempService = services;
    const names = name.split(sep);
    names.forEach((item, index) => {
      if (index === names.length - 1) {
        const ServiceModule = require(file)(app);
        tempService[item] = new ServiceModule();
      } else {
        tempService[item] = tempService[item] || {};
        tempService = tempService[item];
      }
    });
  });
  app.service = services;
};
