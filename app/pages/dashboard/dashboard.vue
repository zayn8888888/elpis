<template>
  <el-config-provider :locale="zhCn">
    <header-view :projName="projName" @menu-select="onMenuSelect">
      <template #main-content>
        <router-view></router-view>
      </template>
    </header-view>
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import HeaderView from "./complex-view/header-view/header-view.vue";
import $curl from "$elpisCommon/curl";
import { useMenuStore } from "$elpisStore/menu";
import { useProjectStore } from "$elpisStore/project";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();
const projectStore = useProjectStore();
onMounted(() => {
  getProjectList();
  getProjectConfig();
});
const projName = ref("");
//请求 /api/project/list 接口，并缓存到project-store中
async function getProjectList() {
  const res = await $curl({
    url: "/api/project/list",
    method: "get",
    query: {
      //TODO: 动态获取当前项目key,暂时先写死pdd
      proj_key: route.query.proj_key,
    },
  });
  if (!res || !res.data || !res.success) return;
  projectStore.setProjectList(res.data);
}

//请求 /api/project 接口，并缓存到menu-store中
async function getProjectConfig() {
  const res = await $curl({
    method: "get",
    url: "/api/project",
    query: {
      //TODO: 动态获取当前项目key,暂时先写死pdd
      proj_key: route.query.proj_key,
    },
  });
  if (!res || !res.data || !res.success) return;
  const { name, menu } = res.data;
  projName.value = name;
  menuStore.setMenuList(menu);
}
//点击菜单回调方法
const onMenuSelect = function (menuItem) {
  const { moduleType, customConfig, key } = menuItem;
  //如果是当前页面，不处理
  if (key === route.query.key) {
    return;
  }
  const pathMap = {
    sider: "/sider",
    iframe: "/iframe",
    schema: "/schema",
    custom: customConfig?.path,
  };
  router.push({
    path: `/view/dashboard${pathMap[moduleType]}`,
    query: {
      key,
      proj_key: route.query.proj_key,
    },
  });
};
</script>
<style lang="less" scoped>
:deep(.el-main) {
  padding: 0;
}
</style>
