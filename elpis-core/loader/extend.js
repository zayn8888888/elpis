const glob = require("glob");
const path = require("path");
const { sep } = path;

/** 
 * extend loader
 * @param {Object} app Koa实例
 * 
 * 加载extend, 可通过'app.extend.${文件}' 访问
 * 
    例子：
    app/extend
      |
      |  -- custom-extend.js
    => app.extend.customExtend
 *
 */
module.exports = (app) => {
  // 读取 app/extend/**/**.js 下的所有文件
  const elpisExtendPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}extend`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisExtendPath, `.${sep}**${sep}*.js`)
  );
  const businessExtendPath = path.resolve(app.businessPath, "extend");
  const businessFileList = glob.sync(
    path.resolve(businessExtendPath, `.${sep}**${sep}*.js`)
  );
  [...elpisFileList, ...businessFileList].forEach((file) => {
    // 提取文件名称
    // 截取路径
    // 把'-'统一为驼峰命名
    let name = path
      .resolve(file)
      .replace(elpisExtendPath, "")
      .replace(businessExtendPath, "")
      .replace(sep, "/")
      .replace(/^\//, "")
      .replace(/\.js$/, "");
    // 把'-'转换为驼峰命名
    name = name.replace(/[_-]([a-z])/gi, (_, letter) => letter.toUpperCase());

    // 过滤 app 已存在的key
    if (app[name]) {
      console.warn(`[extend load error] name:${name} is already in app`);
      return;
    }
    app[name] = require(file)(app);
  });
};
