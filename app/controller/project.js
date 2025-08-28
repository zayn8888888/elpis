module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    /**
     * 根据proj_key获取项目配置
     * @param {*} ctx
     */
    get(ctx) {
      const { proj_key: projKey } = ctx.request.query;
      const { project: projectService } = app.service;
      const projectConfig = projectService.get(projKey);

      if (!projectConfig) {
        this.fail(ctx, "获取项目异常", 50000);
        return;
      }
      this.success(ctx, projectConfig);
    }
    /**
     * 获取当前projectKey对应模型下的项目列表（如果无projectKey,全量获取）
     */
    getList(ctx) {
      const { proj_key: projKey } = ctx.request.query;
      const { project: projectService } = app.service;
      const projectList = projectService.getList({ projKey });
      const dtoProjectList = projectList.map((item) => {
        const { key, name, desc, homePage, modelKey } = item;
        const dtoProject = { key, name, desc, homePage, modelKey };
        return dtoProject;
      });
      // for (let i = 0; i < projectLi st.length; ++i) {
      //   const { key, name, desc, homePage, modelKey } = projectList[i];
      //   const dtoProject = { key, name, desc, homePage, modelKey };
      //   dtoProjectList.push(dtoProject);
      // }
      this.success(ctx, dtoProjectList);
    }
    /**
     * 获取所有模型项目的结构化数据
     * @param {*} ctx
     */
    async getModelList(ctx) {
      const { project: projectService } = app.service;
      const modelList = await projectService.getModelList();
      //构造model关键数据
      const dtoModelList = modelList.reduce((preList, item) => {
        const { model, project } = item;
        //构造model关键数据
        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };
        //构造project关键数据
        const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
          const { key, name, desc, homePage } = project[projKey];
          preObj[projKey] = { key, name, desc, homePage };
          return preObj;
        }, {});
        // const dtoProject={}
        // for (const projKey in project) {
        //   const { key,name, desc,homePage } = project[projKey];
        //   dtoProject[projKey] = {  key,name, desc,homePage};
        // }
        //整合返回结构
        preList.push({
          model: dtoModel,
          project: dtoProject,
        });
        return preList;
      }, []);

      this.success(ctx, dtoModelList);
    }
  };
};
