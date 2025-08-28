<template>
  <div>
    <img src="../../asserts/avatar.png" class="avatar" />
    <el-dropdown @command="handleUserCommand">
      <div class="username">
        {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <template #dropdown>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref } from "vue";
const userName = ref(localStorage.getItem("nickname") || "用户");
const handleUserCommand = (command) => {
  if (command === "logout") {
    console.log(location.origin + "/api/auth/logout");
    window.location = location.origin + "/api/auth/logout";
  }
};
</script>

<style lang="less" scoped>
.avatar {
  margin-right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.username {
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  outline: none;
}
</style>
