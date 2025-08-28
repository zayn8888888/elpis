const _ = require("lodash");
// 引入glob模块，用于文件路径匹配
const glob = require("glob");
// 引入path模块，用于处理文件路径
const path = require("path");
// 从path模块中获取路径分隔符
const { sep } = path;
const projectExtendModel = (model, project) => {
  return _.mergeWith({}, model, project, (modelValue, projValue) => {
    //处理数组合并的特殊情况
    if (Array.isArray(modelValue) && Array.isArray(projValue)) {
      let result = [];
      //因为project继承model,所以需要处理修改和新增内容的情况
      //project有的键值，model也有=》修改(重载)
      //project有的键值，model没有=》新增
      //project没有的键值，model有=》保留(继承)
      //处理修改和保留
      for (let i = 0; i < modelValue.length; ++i) {
        let modelItem = modelValue[i];
        let projItem = projValue.find((item) => item.key === modelItem.key);
        //project有的键值，model也有，则递归调用projectExtendModel方法覆盖修改
        result.push(
          projItem ? projectExtendModel(modelItem, projItem) : modelItem
        );
      }
      //处理新增
      for (let i = 0; i < projValue.length; ++i) {
        let projItem = projValue[i];
        let modelItem = modelValue.find((item) => item.key === projItem.key);
        //project有的键值，model没有，则直接添加到result中
        if (!modelItem) {
          result.push(projItem);
        }
      }
      return result;
    }
  });
};
/**
 * 解析model配置，并返回组织且继承后的数据结构
 * [{
 *  model: model,
 * project:{
 * proj1:${proj1},
 * proj2:${proj2}
 * }
 * }]
 * @param {*} app
 * @returns
 */
module.exports = (app) => {
  const modelList = [];
  //遍历当前文件夹，构造模型数据结构，挂载到modelList上
  const modelPath = path.resolve(process.cwd(), `.${sep}model`);
  // 使用glob模块同步匹配当前文件夹下的所有.js文件
  const fileList = glob.sync(path.resolve(modelPath, `.${sep}**${sep}**.js`));
  fileList.forEach((file) => {
    // 如果文件名是index.js，则跳过

    if (file.indexOf("index.js") > -1) {
      return;
    }

    //区分配置类型（model/project）
    const fileMainPath = file.split(process.cwd().replace(/\\/g, "/"))[1];
    const type = fileMainPath.indexOf(`/project/`) > -1 ? "project" : "model";

    if (type === "project") {
      // 获取modelKey和projKey
      const modelKey = fileMainPath.match(/\/model\/(.*?)\/project/)?.[1];
      const projKey = fileMainPath.match(/\/project\/(.*?)\.js/)?.[1];
      // 在modelList中查找是否存在modelKey
      let modelItem = modelList.find((item) => item.model?.key === modelKey);
      // 如果不存在，则创建一个新的modelItem，并添加到modelList中
      if (!modelItem) {
        modelItem = {};
        modelList.push(modelItem);
      }
      // 如果modelItem中没有project属性，则创建一个新的project对象
      if (!modelItem.project) {
        modelItem.project = {};
      }
      // 将projKey和对应的配置文件添加到project对象中
      modelItem.project[projKey] = require(path.resolve(file));
      //注入projKey
      modelItem.project[projKey].key = projKey;
      //注入modelKey
      modelItem.project[projKey].modelKey = modelKey;
    }
    if (type === "model") {
      // 获取modelKey
      const modelKey = fileMainPath.match(/\/model\/(.*?)\/model\.js/)?.[1];
      // 在modelList中查找是否存在modelKey
      let modelItem = modelList.find((item) => item.model?.key === modelKey);
      // 如果不存在，则创建一个新的modelItem，并添加到modelList中
      if (!modelItem) {
        modelItem = {};
        modelList.push(modelItem);
      }
      // 将modelKey和对应的配置文件添加到model对象中
      modelItem.model = require(path.resolve(file));
      //注入modelKey
      modelItem.model.key = modelKey;
    }
  });
  //数据进一步整理：project=》继承model
  modelList.forEach((item) => {
    const { model, project } = item;
    for (const key in project) {
      project[key] = projectExtendModel(model, project[key]);
    }
  });
  // 返回组织后的modelList
  return modelList;
};
