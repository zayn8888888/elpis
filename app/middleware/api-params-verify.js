const Ajv = require("ajv");
const ajv = new Ajv();
/**
 * API参数校验
 * @param {*} app
 */
module.exports = (app) => {
  const $schema = "http://json-schema.org/draft-07/schema#";
  return async (ctx, next) => {
    // 只对API请求做签名校验
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }
    // 获取请求参数
    const { body, query, headers } = ctx.request;
    const { path, params, method } = ctx;
    app.logger.info(`[${method} ${path}] body:${JSON.stringify(body)}`);
    app.logger.info(`[${method} ${path}] query:${JSON.stringify(query)}`);
    app.logger.info(`[${method} ${path}] headers:${JSON.stringify(headers)}`);
    const schema = app.routerSchema[path]?.[method.toLowerCase()];
    app.logger.info(`[${method} ${path}] params:${JSON.stringify(params)}`);
    if (!schema) {
      return await next();
    }
    let valid = true;
    // ajv校验器
    let validate;
    // 校验headers
    if (valid && headers && schema.headers) {
      schema.headers.$schema = $schema;
      validate = ajv.compile(schema.headers);
      valid = validate(headers);
    }
    // 校验body
    if (valid && body && schema.body) {
      schema.body.$schema = $schema;
      validate = ajv.compile(schema.body);
      valid = validate(body);
    }
    // 校验query
    if (valid && query && schema.query) {
      schema.query.$schema = $schema;
      validate = ajv.compile(schema.query);
      valid = validate(query);
    }

    //校验params
    if (valid && params && schema.params) {
      schema.params.$schema = $schema;
      validate = ajv.compile(schema.params);
      valid = validate(params);
    }
    if (!valid) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 442,
        message: `request validate fail:${ajv.errorsText(validate.errors)}`,
      };
      return;
    }
    await next();
  };
};
