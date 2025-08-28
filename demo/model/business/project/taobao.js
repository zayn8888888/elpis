module.exports = {
  name: "淘宝",
  desc: "淘宝电商系统",
  homePage: "/schema?proj_key=taobao&&key=product",
  menu: [
    {
      key: "order", //菜单项的唯一标识
      name: "订单管理", //菜单项的名称
      moduleType: "iframe",
      menuType: "module", //枚举值：group/module
      iframeConfig: {
        path: "https://www.taobao.com/",
      },
    },
    {
      key: "operating", //菜单项的唯一标识
      name: "运营活动", //菜单项的名称
      menuType: "module", //枚举值：group/module
      moduleType: "sider",
      //当menuType为group时可填
      siderConfig: {
        menu: [
          {
            key: "coupon", //菜单项的唯一标识
            name: "优惠券", //菜单项的名称
            menuType: "module", //枚举值：group/module
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "limited", //菜单项的唯一标识
            name: "限量购", //菜单项的名称
            menuType: "module", //枚举值：group/module
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "festival", //菜单项的唯一标识
            name: "节日活动", //菜单项的名称
            menuType: "module", //枚举值：group/module
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
        ],
      },
    },
  ],
};
