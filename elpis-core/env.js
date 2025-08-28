module.exports = (app) => {
  return {
    isLocal() {
      return process.env._ENV === "local";
    },
    isBeta() {
      return process.env._ENV === "beta";
    },
    isProduction() {
      return process.env._ENV === "prod";
    },
    // 获取当前环境
    get() {
      return process.env._ENV ?? "local";
    },
  };
};
