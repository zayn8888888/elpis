const jwt = require("jsonwebtoken");

module.exports = (app) => {
  const whiteList = ["/view/auth", "/api/auth/login", "/api/auth/logout"];
  return async (ctx, next) => {
    if (whiteList.includes(ctx.path)) {
      await next();
      return;
    }
    let isLogin = true;
    ctx.token = ctx.cookies.get("token");
    if (!ctx.token) {
      isLogin = false;
    } else {
      // 验证是否有效
      try {
        const { jwtSecretKey } = app.config;
        const decoded = jwt.verify(ctx.token, jwtSecretKey);
        ctx.userId = decoded.userId;
      } catch (e) {
        console.log(e);
        isLogin = false;
      }
    }
    if (!isLogin) {
      ctx.cookies.set("token", "", {
        expires: new Date(0),
      });
      if (ctx.url.indexOf("/api") != -1) {
        ctx.status = 200;
        ctx.body = {
          success: false,
          code: 50000,
          message: "请重新登录",
        };
      } else {
        ctx.status = 302;
        ctx.redirect(`/view/auth?callback=${ctx.url}`);
      }
      return;
    }
    await next();
  };
};
