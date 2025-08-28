// 引入 elpis-core
const ElpisCore = require("./elpis-core");
// 引入 前端工程化构建方法
const FEBuildDev = require("./app/webpack/dev.js");
// 引入 前端工程化构建方法
const FEBuildProd = require("./app/webpack/prod.js");

module.exports = {
  /**
   * 启动服务
   * @param {*} options 启动参数
   */
  serverStart: (options) => {
    const app = ElpisCore.start(options);
    return app;
  },
  /**
   * 前端工程化构建
   * @param {*} dev 构建环境
   */
  frontendBuild(dev) {
    if (dev === "local") {
      FEBuildDev();
    } else if (dev === "prod") {
      FEBuildProd();
    }
  },
  /**
   * 服务端基础控制器类
   */
  Controller: {
    Base: require("./app/controller/base.js"),
  },
  /**
   * 服务端基础服务类
   */
  Service: {
    Base: require("./app/service/base.js"),
  },
};
