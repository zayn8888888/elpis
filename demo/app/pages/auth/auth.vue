<template>
  <div class="auth-container">
    <div class="login-box">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label>用户名</label>
          <input
            type="text"
            v-model="loginForm.username"
            placeholder="请输入用户名"
          />
        </div>
        <div class="form-item">
          <label>密码</label>
          <input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          />
        </div>
        <div class="form-item">
          <button type="submit" :loading="loading">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import $curl from "$elpisCurl";
const loginForm = ref({
  username: "testuser",
  password: "123456",
});

const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  const res = await $curl({
    url: "/api/auth/login",
    method: "POST",
    data: loginForm.value,
  });
  loading.value = false;
  if (!res || !res.success) return;
  localStorage.setItem("nickname", res?.data?.nickname || "用户");
  let path = "/vie/project-list";
  if (location.search) {
    const { search } = location;
    path = search.split("?callback=")?.[1] || path;
  }
  window.location = location.origin + path;
};
</script>

<style scoped lang="less">
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  width: 400px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-item {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #66b1ff;
}
</style>
