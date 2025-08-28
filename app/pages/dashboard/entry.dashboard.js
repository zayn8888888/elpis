import boot from "$elpisPages/boot.js";
import dashboard from "./dashboard.vue";
import businessDashboardRouterConfig from "$businessDashboardRouterConfig";
const routes = [];
// 头部菜单路由
routes.push({
  path: "/view/dashboard/iframe",
  component: () => import("./complex-view/iframe-view/iframe-view.vue"),
});
routes.push({
  path: "/view/dashboard/schema",
  component: () => import("./complex-view/schema-view/schema-view.vue"),
});
const siderRouters = [
  {
    path: "/view/dashboard/sider/iframe",

    component: () => import("./complex-view/iframe-view/iframe-view.vue"),
  },
  {
    path: "/view/dashboard/sider/schema",
    component: () => import("./complex-view/schema-view/schema-view.vue"),
  },
];
// 侧边栏菜单路由
routes.push({
  path: "/view/dashboard/sider",
  component: () => import("./complex-view/sider-view/sider-view.vue"),
  children: siderRouters,
});

if (typeof businessDashboardRouterConfig === "function") {
  businessDashboardRouterConfig({ routes, siderRouters });
}

// 侧边栏兜底策略
routes.push({
  path: "/view/dashboard/sider/:chapters+",
  component: () => import("./complex-view/sider-view/sider-view.vue"),
});
boot(dashboard, { routes });
