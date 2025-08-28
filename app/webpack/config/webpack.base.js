const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const glob = require("glob");
const merge = require("webpack-merge");
const fs = require("fs");
const pageEntries = {};
const HtmlWebpackPluginList = [];
const elpisCwd = path.resolve(__dirname, "..", "..", "..");
// 引入JSConfig插件
const WebpackAliasTojsconfigPlugin = require("../libs/WebpackAliasTojsconfigPlugin");
const elpisEntryList = path.resolve(elpisCwd, "./app/pages/**/entry.*.js");
const elpiEntrysFileList = glob.sync(elpisEntryList);

const businessEntryList = path.resolve(
  process.cwd(),
  "./app/pages/**/entry.*.js"
);
const businessEntrysFileList = glob.sync(businessEntryList);

[...elpiEntrysFileList, ...businessEntrysFileList].forEach((item) => {
  const pageName = path.basename(item, path.extname(item));
  pageEntries[pageName] = item;
  HtmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        `${pageName}.tpl`
      ),
      template: path.resolve(elpisCwd, "./app/view/entry.tpl"),
      chunks: [pageName],
    })
  );
});

let buinessWebpackConfig = {};
try {
  buinessWebpackConfig = require(`${process.cwd()}/app/webpack.config.js`);
} catch (error) {}
/**
 * webpack基础配置
 */
module.exports = merge.smart(
  {
    // 入口文件
    entry: pageEntries,
    // 模块解析配置
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: require.resolve("vue-loader"),
        },
        {
          test: /\.js$/,
          // 只打包业务代码
          include: [
            // 处理elpis目录
            path.resolve(elpisCwd, "./app/pages"),
            // 处理业务目录
            path.resolve(process.cwd(), "./app/pages"),
          ],
          loader: require.resolve("babel-loader"),
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: {
            loader: require.resolve("url-loader"),
            options: {
              limit: 300,
              esModule: false,
            },
          },
        },
        {
          test: /\.css$/,
          use: [require.resolve("style-loader"), require.resolve("css-loader")],
        },
        {
          test: /\.less$/,
          use: [
            require.resolve("style-loader"),
            require.resolve("css-loader"),
            require.resolve("less-loader"),
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: require.resolve("file-loader"),
          },
        },
      ],
    },
    // 产物
    output: {},
    // 模块解析
    resolve: {
      extensions: [".js", ".vue", ".less", ".css"],
      alias: (() => {
        const aliasMap = {};
        const blankModulePath = path.resolve(__dirname, "../libs/blank.js");
        //dashboard路由扩展配置
        const businessDashboardRouterConfig = path.resolve(
          process.cwd(),
          "./app/pages/dashboard/router.js"
        );
        aliasMap["$businessDashboardRouterConfig"] = fs.existsSync(
          businessDashboardRouterConfig
        )
          ? businessDashboardRouterConfig
          : blankModulePath;
        //schema-view components扩展配置
        const businessComponentConfig = path.resolve(
          process.cwd(),
          "./app/pages/dashboard/complex-view/schema-view/components/component-config.js"
        );
        aliasMap["$businessComponentConfig"] = fs.existsSync(
          businessComponentConfig
        )
          ? businessComponentConfig
          : blankModulePath;
        //schema-form扩展
        const businessFormItemConfig = path.resolve(
          process.cwd(),
          "./app/pages/widgets/schema-form/form-item-config.js"
        );
        aliasMap["$businessFormItemConfig"] = fs.existsSync(
          businessFormItemConfig
        )
          ? businessFormItemConfig
          : blankModulePath;
        //schema-search-bar扩展
        const businessSearchItemConfig = path.resolve(
          process.cwd(),
          "./app/pages/widgets/schema-search-bar/search-item-config.js"
        );
        aliasMap["$businessSearchItemConfig"] = fs.existsSync(
          businessSearchItemConfig
        )
          ? businessSearchItemConfig
          : blankModulePath;

        const businessHeaderConfigItemConfig = path.resolve(
          process.cwd(),
          "./app/pages/widgets/header-container/header-item-config.js"
        );
        aliasMap["$businessHeaderConfig"] = fs.existsSync(
          businessHeaderConfigItemConfig
        )
          ? businessHeaderConfigItemConfig
          : blankModulePath;

        return {
          ...aliasMap,
          vue: require.resolve("vue"),
          element: require.resolve("element-plus"),
          "@babel/runtime/helpers/asyncToGenerator": require.resolve(
            "@babel/runtime/helpers/asyncToGenerator"
          ),
          "@babel/runtime/helpers/defineProperty": require.resolve(
            "@babel/runtime/helpers/defineProperty"
          ),
          "@babel/runtime/regenerator": require.resolve(
            "@babel/runtime/regenerator"
          ),
          $elpisPages: path.resolve(elpisCwd, "./app/pages"),
          $elpisCommon: path.resolve(elpisCwd, "./app/pages/common"),
          $elpisCurl: path.resolve(elpisCwd, "./app/pages/common/curl.js"),
          $elpisUtils: path.resolve(elpisCwd, "./app/pages/common/utils.js"),
          $elpisHeaderContainer: path.resolve(
            elpisCwd,
            "./app/pages/widgets/header-container/header-container.vue"
          ),
          $elpisSchemaTable: path.resolve(
            elpisCwd,
            "./app/pages/widgets/schema-table/schema-table.vue"
          ),
          $elpisSchemaForm: path.resolve(
            elpisCwd,
            "./app/pages/widgets/schema-form/schema-form.vue"
          ),
          $elpisSchemaSearchBar: path.resolve(
            elpisCwd,
            "./app/pages/widgets/schema-search-bar/schema-search-bar.vue"
          ),
          $elpisBoot: path.resolve(elpisCwd, "./app/pages/boot.js"),
          $elpisWidgets: path.resolve(elpisCwd, "./app/pages/widgets"),
          $elpisStore: path.resolve(elpisCwd, "./app/pages/store"),
          $businessPwd: path.resolve(process.cwd()),
        };
      })(),
    },
    // webpack插件
    plugins: [
      // 处理.vue 文件，这个插件时必须的
      // 它的作用是将你定义过的其他规则复制并应用到.vue文件里
      // 例如，如果有一条匹配规则 /\.js$/ 的规则，那么它会应用到.vue文件中的<script></script>板块中
      new VueLoaderPlugin(),
      // 把第三方库暴露到window context下
      new webpack.ProvidePlugin({
        Vue: "vue",
      }),
      // 定义全局常量
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true, // 支持vue 解析optionsApi
        __VUE_PROD_DEVTOOLS__: false, // 禁用 Vue调试工具
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // 禁用生产环境显示’水合‘信息
      }),
      // 智能JSConfig生成插件
      new WebpackAliasTojsconfigPlugin({
        // 包含business
        configPath: path.resolve(__dirname, "../../../jsconfig.json"),
        excludeAliasReg: /business/,
      }),
      // 构建最终的html文件
      ...HtmlWebpackPluginList,
    ],
    //配置打包输出优化（配置代码分割，模块合并，缓存，TreeShaing,压缩等优化策略）
    optimization: {
      /**
       * 把js文件打包成3中类型
       * 1.vendor:第三方lib库，基本不会改动，除非依赖版本升级
       * 2.common:业务组件代码的公共部分抽取出来，改动较少
       * 3.entry.{page}:不用页面entry里的业务组件代码的差异部分，会经常改动
       * 目的：把改动和引用频率不一样的js区分出来，以达到更好利用浏览器缓存的效果
       */
      splitChunks: {
        chunks: "all", //对同步和异步模块都进行分割
        maxAsyncRequests: 10, //每次异步加载的最大的并行请求数
        maxInitialRequests: 10, //每次入口加载的最大的并行请求数
        cacheGroups: {
          vendor: {
            //第三方依赖库
            test: /[\\/]node_modules[\\/]/, //打包node_module中的文件
            name: "vendor", //模块名称
            priority: 20, //优先级，数字越大，优先级越高
            enforce: true, //强制执行
            reuseExistingChunk: true, //复用已有的公共chunk
          },
          common: {
            test: /[\\/]common|widgets[\\/]/,
            //公共模块
            name: "common", //模块名称
            minChunks: 2, //被多少模块共享
            minSize: 1,
            priority: 10, //优先级，数字越大，优先级越高
            reuseExistingChunk: true, //复用 已有的公共chunk
          },
        },
      },
      //将webpack运行时的代码打包到runtime.js
      runtimeChunk: true,
    },
  },
  buinessWebpackConfig
);
