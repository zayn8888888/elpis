module.exports = (app) => {
  const modelList = require("../../model/index.js")(app);
  const BaseService = require("./base")(app);
  return class ProjectService extends BaseService {
    get(projKey) {
      let projConfig;
      modelList.forEach((modelItem) => {
        const { project } = modelItem;
        if (project[projKey]) {
          projConfig = project[projKey];
        }
      });
      return projConfig;
    }
    /**
     * 获取统一模型下的项目列表（如果无projKey,取全量）
     * @param {*} param0
     */
    getList({ projKey }) {
      return modelList.reduce((preList, modelItem) => {
        const { project } = modelItem;
        //如果有传projKey则只去当前同模型下的项目，不传的情况下则取全量
        if (projKey && !project[projKey]) {
          return preList;
        }
        for (const pKey in project) {
          preList.push(project[pKey]);
        }
        return preList;
      }, []);
      // const projectList = [];
      // modelList.forEach((modelItem) => {
      //   const { project } = modelItem;
      //   //如果有传projKey则只去当前同模型下的项目，不传的情况下则取全量
      //   if (projKey && !project[projKey]) {
      //     return;
      //   }
      //   for (const pKey in project) {
      //     projectList.push(project[pKey]);
      //   }
      // });
      // return projectList;
    }
    /**
     * 获取所有模型项目的结构化数据
     * @returns
     */
    async getModelList() {
      return modelList;
    }
  };
};
