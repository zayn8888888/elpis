const surperAgent = require("superagent");
module.exports = (app) =>
  class BaseService {
    /**
     * service 基类
     * 统一收拢
     */
    constructor() {
      this.app = app;
      this.config = app.config;
      this.curl = surperAgent;
    }
  };
