module.exports = (app) => {
  app.use(app.middlewares.authVerify);
};
