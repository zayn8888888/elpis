module.exports = ({ routes, siderRouters }) => {
  routes.push({
    path: "/view/dashboard/todo",
    component: () => import("./todo/todo.vue"),
  });
  siderRouters.push({
    path: "/view/dashboard/todo",
    component: () => import("./todo/todo.vue"),
  });
};
