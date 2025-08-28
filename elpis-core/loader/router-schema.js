const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * router-schema loader
 * @param {object} app Koa实例
 *
 * 通过 ’json-schema & ajx‘ 对API 规则进行约束，配合 api-params-verify 中间件使用
 *
 * app/router-schema/**.js
   输出：
   app.routerSchema = {
        `${API1}`:${jsonSchema}
   }
 *
 */
module.exports = (app) => {
  const elpisRouterSchemaPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}router-schema`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisRouterSchemaPath, `.${sep}**${sep}*.js`)
  );
  const businessRouterSchemaPath = path.resolve(
    app.businessPath,
    "router-schema"
  );
  const businessFileList = glob.sync(
    path.resolve(businessRouterSchemaPath, `.${sep}**${sep}*.js`)
  );
  let routerSchema = {};
  [...elpisFileList, ...businessFileList].forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(file),
    };
  });
  app.routerSchema = routerSchema;
};
