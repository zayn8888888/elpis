const md5 = require("md5");

/**
 * API 签名处理
 */
module.exports = (app) => {
  return async (ctx, next) => {
    if(app.config?.apiSignVerify.whiteList?.includes(ctx.path)){
      return await next();
    }
    if (!ctx.path.includes("/api")) {
      return await next();
    }
    const { headers } = ctx.request;
    const { s_sign: sSign, s_t: st } = headers;
    const signKey = app.config?.signKey || "hudwhuhndappw32u188s7dwhh2uj3hu2";

    const signature = md5(`${signKey}_${st}`);
    app.logger.info(`st:${st},signature:${signature},sSign:${sSign}`);
    if (
      !sSign ||
      !st ||
      signature !== sSign.toLowerCase() ||
      Date.now() - st > 600000
    ) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 445,
        message: "signature not correct or api timeout!!",
      };
      return;
    }
    await next();
  };
};
