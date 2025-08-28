/**
 * projectHandler相关项目处理内容
 * @param {*} app
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 只对业务API进行proj_key处理
    if (ctx.path.indexOf("/api/proj/") < 0) {
      return await next();
    }
    // 获取proj_key
    const { proj_key: projKey } = ctx.request.headers;
    if (!projKey) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: "proj_key not found",
        code: 446,
      };
      return;
    }
    ctx.projKey = projKey;
    await next();
  };
};
