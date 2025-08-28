/**
 * 运行时异常错误处理,兜底所有异常
 * @param {*} app
 */
module.exports = (app) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const { message } = err;
      if (message && message.includes("not found")) {
        ctx.status = 302;
        ctx.redirect(`${app.options?.homePage}`);
        return;
      }

      app.logger.info(JSON.stringify(err));
      app.logger.error(err);
      const resBody = {
        success: false,
        code: 500,
        message: "网络异常，请稍后重试",
        detail: err.message,
      };
      ctx.status = 200;
      ctx.body = resBody;
    }
  };
};
