const { Service } = require("@zaynhzm/elpis");
module.exports = (app) => {
  const BaseService = Service.Base(app);
  return class AuthService extends BaseService {
    async getByUserAndPassword({ username, password }) {
      const { database } = app;
      const res = await database("login_user")
        .select("*")
        .where({
          username,
          password,
          status: app.status.NORMAL,
        })
        .limit(1);
      return res[0];
    }
  };
};
