module.exports = (app, router) => {
  const { auth: authController } = app.controller;
  router.post("/api/auth/login", authController.post.bind(authController));
  router.get("/api/auth/logout", authController.logout.bind(authController));
};
