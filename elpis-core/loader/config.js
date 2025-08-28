const path = require("path");
const { sep } = path;

/**
 * config loader
 * @param {Object} app Koa实例
 *
 * 配置区分
 * 1. 本地环境
 * 2. 测试环境
 * 3. 生产环境
 * 通过env环境读取不同env,config
 *
 * 目录下对应的config配置
 * 默认配置 config/config.default.js
 * 本地环境配置 config/config.local.js
 * 测试环境配置 config/config.beta.js
 * 生产环境配置 config/config.prod.js
 *
 */
module.exports = (app) => {
  // 找到 config 目录
  const elpisConfigPath = path.resolve(__dirname, `..${sep}..${sep}config`);
  const businessConfigPath = path.resolve(app.basePath, "config");

  let defaultConfig = {};

  try {
    defaultConfig = {
      ...require(path.resolve(elpisConfigPath, "config.default.js")),
      ...require(path.resolve(businessConfigPath, "config.default.js")),
    };
  } catch (error) {
    console.error(`[exception] require default.config.js file error ${error}`);
  }
  let envConfig = {};
  const env = app.env.get();
  try {
    envConfig = require(path.resolve(businessConfigPath, `config.${env}.js`));
  } catch (error) {
    console.error(`[exception] require ${env}.config.js file error ${error}`);
  }
  app.config = {
    ...defaultConfig,
    ...envConfig,
  };
};
