import { createApp } from "vue";
import ElementUI from "element-plus";
import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import pinia from "$elpisStore";
import "./asserts/custom.css";
import { createRouter, createWebHistory } from "vue-router";
/**
 * vue页面主入口，用于启动vue
 * @param {VueComponent} pageComponent vue 入口组件
 * @param {Array} routes 路由配置
 * @param libs 页面依赖的第三方包
 */
export default (pageComponent, { routes, libs } = {}) => {
  const app = createApp(pageComponent);
  //应用element-plus
  app.use(ElementUI);
  //应用pinia
  app.use(pinia);
  // 应用第三方包
  if (libs && libs.length) {
    for (let i = 0; i < libs.length; ++i) {
      app.use(libs[i]);
    }
  }
  //页面路由
  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHistory(), //采用History模式
      routes,
    });
    app.use(router);
    router.isReady().then(() => {
      app.mount("#root");
    });
  } else {
    app.mount("#root");
  }
};
