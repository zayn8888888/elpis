const log4js = require("log4js");

/**
 * 日志配置
 * 1. 本地开发环境打印在控制台即可
 * 2. 生产环境把日志输出并落地到侧畔(日志落盘)
 */
module.exports = (app) => {
  let logger;
  if (app.env.isLocal()) {
    // 打印在控制台即可
    logger = console;
  } else {
    // 把日志输出并落地到侧畔(日志落盘)
    log4js.configure(
      app.config.log4js || {
        appenders: {
          console: {
            type: "console",
          },
          // 日志切分
          dateFile: {
            type: "dateFile",
            filename: "./logs/application.log",
            pattern: ".yyyy-MM-dd",
          },
        },
        categories: {
          default: {
            appenders: ["console", "dateFile"],
            level: "trace",
          },
        },
      }
    );
    logger = log4js.getLogger("default");
  }
  return logger;
};
