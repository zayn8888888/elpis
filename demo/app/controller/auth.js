const { Controller } = require("@zaynhzm/elpis");
module.exports = (app) => {
  const jwt = require("jsonwebtoken");
  const BaseController = Controller.Base(app);
  return class BusinessController extends BaseController {
    async post(ctx) {
      const { username, password } = ctx.request.body;
      const { auth: authService } = app.service;
      const user = await authService.getByUserAndPassword({
        username,
        password,
      });
      if (!user) {
        return this.fail(ctx, "用户名或密码错误", 50000);
      }
      const payload = { userId: user.user_id };
      const { jwtSecretKey } = app.config;
      const token = jwt.sign(payload, jwtSecretKey, {
        expiresIn: 60 * 60 * 24,
      });
      const expires = new Date();
      expires.setTime(expires.getTime() + 60 * 60 * 24 * 1000);
      ctx.cookies.set("token", token, {
        httpOnly: true,
        expires,
      });
      this.success(ctx, {
        nickname: user.username,
      });
      // 利用jwt 生成一个token 挂载到cookie
    }
    async logout(ctx) {
      console.log("logout");
      ctx.cookies.set("token", "", {
        expires: new Date(0),
      });
      ctx.status = 302;

      ctx.redirect("/view/auth");
    }
  };
};
