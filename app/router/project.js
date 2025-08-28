module.exports = (app, router) => {
  const { project: projectController } = app.controller;
  router.get("/api/project", projectController.get.bind(projectController)); // 获取项目信息
  router.get(
    "/api/project/list",
    projectController.getList.bind(projectController)
  ); // 获取项目列表
  router.get(
    "/api/project/model_list",
    projectController.getModelList.bind(projectController)
  ); // 获取模型列表
};
