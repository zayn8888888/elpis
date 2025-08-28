const fs = require("fs");
const path = require("path");

/**
 * 智能JSConfig生成插件
 * 自动将webpack别名同步到jsconfig.json，保护用户自定义配置
 */
class WebpackAliasTojsconfigPlugin {
  /**
   * 转换webpack别名为jsconfig paths格式
   * @param {Object} webpackAlias webpack别名配置
   * @returns {Object} jsconfig paths格式
   */
  constructor(options = {}) {
    this.options = {
      // jsconfig.json文件路径
      configPath: path.resolve(process.cwd(), "jsconfig.json"),
      // 自定义baseUrl
      baseUrl: options.baseUrl || ".",
      // 排除的别名（不需要同步到jsconfig的别名）
      excludeAlias: options.excludeAlias || [],
      excludeAliasReg: options.excludeAliasReg || null,
      needExtend: false,
      ...options,
    };
  }

  apply(compiler) {
    // 在webpack初始化完成后执行
    compiler.hooks.afterEnvironment.tap("WebpackJSConfigPlugin", () => {
      this.generateJSConfig(compiler.options.resolve.alias);
    });
  }

  /**
   * 生成或更新jsconfig.json
   * @param {Object} webpackAlias webpack别名配置
   */
  generateJSConfig(webpackAlias) {
    try {
      // 读取现有jsconfig.json（如果存在）
      let existingConfig = {};
      if (fs.existsSync(this.options.configPath)) {
        const configContent = fs.readFileSync(this.options.configPath, "utf8");
        existingConfig = JSON.parse(configContent);
      }

      // 转换webpack别名为jsconfig paths格式
      const jsconfigPaths =
        this.convertWebpackAliasToJSConfigPaths(webpackAlias);

      // 智能合并配置
      const mergedConfig = this.mergeConfigs(existingConfig, {
        compilerOptions: {
          baseUrl: this.options.baseUrl,
          paths: jsconfigPaths,
        },
      });

      // 写入更新后的配置
      fs.writeFileSync(
        this.options.configPath,
        JSON.stringify(mergedConfig, null, 2),
        "utf8"
      );

      console.log(
        `[WebpackAliasTojsconfigPlugin] : 📁 配置文件: ${this.options.configPath}`
      );
      console.log(
        `[WebpackAliasTojsconfigPlugin] : 🔗 同步的别名数量: ${
          Object.keys(jsconfigPaths).length
        }`
      );
      if (this.options.needExtend) {
        // 生成jsconfig-extend.json
        const packageName = require(path.resolve(
          this.options.configPath,
          "../package.json"
        )).name;
        let clone_mergedConfig = JSON.parse(JSON.stringify(mergedConfig));
        for (const item in clone_mergedConfig.compilerOptions.paths) {
          const itemVal = clone_mergedConfig.compilerOptions.paths[item];
          if (
            itemVal[0].startsWith("./") &&
            !itemVal[0].startsWith("./node_modules")
          ) {
            clone_mergedConfig.compilerOptions.paths[item] = [
              itemVal[0].replace("./", `node_modules/${packageName}/`),
            ];
          }
        }
        fs.writeFileSync(
          path.resolve(this.options.configPath, "../jsconfig-extend.json"),
          JSON.stringify(clone_mergedConfig, null, 2),
          "utf8"
        );
        console.log(
          `[WebpackAliasTojsconfigPlugin] : 📁 extend 配置文件"jsconfig-extend.json" 已生成
          )}`
        );
      }
    } catch (error) {
      console.error("❌ JSConfig生成失败:", error.message);
    }
  }

  /**
   * 将webpack别名转换为jsconfig paths格式
   * @param {Object} webpackAlias webpack别名对象
   * @returns {Object} jsconfig paths对象
   */
  convertWebpackAliasToJSConfigPaths(webpackAlias) {
    const paths = {};

    Object.entries(webpackAlias).forEach(([alias, aliasPath]) => {
      // 跳过排除的别名 和node_modules
      if (
        this.options.excludeAlias.includes(alias) ||
        (this.options.excludeAliasReg &&
          this.options.excludeAliasReg.test(alias))
      ) {
        return;
      }

      // 处理路径
      let relativePath;
      if (path.isAbsolute(aliasPath)) {
        // 转换绝对路径为相对路径
        console.log(aliasPath);
        relativePath = path.relative(process.cwd(), aliasPath);
      } else {
        relativePath = aliasPath;
      }

      // 标准化路径分隔符（Windows兼容）
      relativePath = relativePath.replace(/\\/g, "/");

      // 确保路径以./开头
      if (!relativePath.startsWith("./") && !relativePath.startsWith("../")) {
        relativePath = "./" + relativePath;
      }
      relativePath = relativePath;
      // jsconfig需要通配符匹配
      paths[alias] = [relativePath];
      paths[alias + "/*"] = [(relativePath + "/*").replace(/\\/g, "/")];
    });

    return paths;
  }

  /**
   * 智能合并配置，保护用户自定义设置
   * @param {Object} existingConfig 现有配置
   * @param {Object} newConfig 新配置
   * @returns {Object} 合并后的配置
   */
  mergeConfigs(existingConfig, newConfig) {
    const merged = { ...existingConfig };

    // 确保compilerOptions存在
    if (!merged.compilerOptions) {
      merged.compilerOptions = {};
    }

    // 合并compilerOptions，保护用户自定义配置
    Object.entries(newConfig.compilerOptions).forEach(([key, value]) => {
      if (key === "paths") {
        // paths需要特殊处理：保留用户自定义paths，添加webpack别名paths
        merged.compilerOptions.paths = {
          ...merged.compilerOptions.paths,
          ...value,
        };
      } else if (key === "baseUrl") {
        // 只有在用户没有设置baseUrl时才使用默认值
        if (!merged.compilerOptions.baseUrl) {
          merged.compilerOptions.baseUrl = value;
        }
      } else {
        // 其他配置项：用户配置优先
        if (merged.compilerOptions[key] === undefined) {
          merged.compilerOptions[key] = value;
        }
      }
    });

    return merged;
  }
}

module.exports = WebpackAliasTojsconfigPlugin;
