const Koa = require("koa");
const path = require("path");
const { sep } = path; // 兼容不用操作系统的斜杠
const env = require("./env");
const loader = require("./loader");
const { findAvailablePort } = require("./utils");

module.exports = {
  /**
   * 启动项目
   * @param {Object} options 项目配置
   */
  async start(options = {}) {
    const app = new Koa();

    // 应用配置
    app.options = options;

    // 基础路径
    app.basePath = process.cwd();

    // 业务路径
    app.businessPath = path.resolve(app.basePath, `.${sep}app`);

    // 环境
    app.env = env(app);

    console.log(`-- [start] env: ${app.env.get()} --`);

    // 加载器
    loader(app);

    // 启动服务
    try {
      const configPort = app.config.port || 8080;
      const host = app.config.host || "0.0.0.0";

      // 查找可用端口
      const availablePort = await findAvailablePort(configPort, host);

      if (availablePort !== configPort) {
        console.log(
          `Port ${configPort} is occupied, automatically switched to port ${availablePort}`
        );
      }

      app.listen(availablePort, host);
      console.log(`Serve running on port : ${availablePort}`);
    } catch (error) {
      console.error(error);
    }
    return app;
  },
};
