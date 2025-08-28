const config = require("./config");
const controller = require("./controller");
const extend = require("./extend");
const middleware = require("./middleware");
const router = require("./router");
const routerSchema = require("./router-schema");
const service = require("./service");
const path = require("path");
const sep = path.sep;
const fs = require("fs");
module.exports = (app) => {
  // 加载middleware
  middleware(app);
  console.log(`-- [start] middleware done --`);
  // 加载routerSchema
  routerSchema(app);
  console.log(`-- [start] routerSchema done --`);
  // 加载controller
  controller(app);
  console.log(`-- [start] controller done --`);
  // 加载service
  service(app);
  console.log(`-- [start] service done --`);
  // 加载config
  config(app);
  console.log(`-- [start] config done --`);
  // 加载extend
  extend(app);
  console.log(`-- [start] extend done --`);

  // 注册全局中间件
  try {
    require(path.resolve(__dirname, `..${sep}..${sep}app${sep}middleware.js`))(
      app
    );
    console.log(`-- [start] load global middleware done --`);
  } catch (error) {
    console.log(`[exception] require global middleware file error. ${error}`);
  }

  // 如果没有该文件就跳过
  const businessMiddlewarePath = `${app.businessPath}${sep}middleware.js`;
  if (fs.existsSync(businessMiddlewarePath)) {
    try {
      require(businessMiddlewarePath)(app);
      console.log(`-- [start] load business middleware done --`);
    } catch (e) {
      console.log("[exception] business middleware file not error. ", e);
    }
  }

  // 加载router
  router(app);
  console.log(`-- [start] router done --`);
};
