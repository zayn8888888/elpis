module.exports = (app) =>
  class BaseController {
    /**
     * controller 基类
     * 统一收拢
     */
    constructor() {
      this.app = app;
      this.config = app.config;
    }

    /**
     * API处理成功统一返回结构
     * @param {Object} ctx Koa上下文
     * @param {Object} data 数据
     * @param {Object} metadata 元数据
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata,
      };
    }

    /**
     * API 处理失败时统一返回结构
     * @param {object} ctx 上下文
     * @param {string} message 错误消息
     * @param {number} code 错误码
     * */
    fail(ctx, message, code) {
      ctx.body = {
        success: false,
        message,
        code,
      };
    }
  };
