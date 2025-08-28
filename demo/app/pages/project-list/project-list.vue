<template>
  <HeaderContainer title="项目列表">
    <template #main-content>
      <div v-loading="loading" class="project-container">
        <div
          v-for="item in modelList"
          :key="item.model?.key"
          class="model-section"
        >
          <!-- 模型标题面板优化 -->
          <div class="model-panel">
            <div class="model-header">
              <div class="model-icon">📊</div>
              <div class="model-info">
                <div class="model-name">{{ item.model?.name }}</div>
                <div class="model-count">
                  {{ Object.keys(item.project || {}).length }} 个项目
                </div>
              </div>
            </div>
          </div>

          <!-- 项目列表网格布局 -->
          <div class="project-grid">
            <div
              v-for="projItem in item.project"
              :key="projItem.key"
              class="project-card"
              @click="handleEnter(projItem)"
            >
              <div class="card-header">
                <div class="project-avatar">
                  {{ projItem.name?.charAt(0) || "P" }}
                </div>
                <div class="card-actions">
                  <el-button
                    type="primary"
                    size="small"
                    circle
                    @click.stop="handleEnter(projItem)"
                  >
                    <i class="el-icon-right"></i>
                  </el-button>
                </div>
              </div>

              <div class="card-content">
                <h3 class="project-title">{{ projItem.name }}</h3>
                <p class="project-desc">{{ projItem.desc || "暂无描述" }}</p>
              </div>

              <div class="card-footer">
                <div class="project-meta">
                  <span class="meta-item">
                    <i class="el-icon-time"></i>
                    最近更新
                  </span>
                </div>
                <div class="enter-btn">
                  <el-button
                    type="primary"
                    size="mini"
                    @click.stop="handleEnter(projItem)"
                  >
                    进入项目
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!modelList.length && !loading" class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-text">暂无项目</div>
          <div class="empty-desc">请联系管理员添加项目</div>
        </div>
      </div>
    </template>
  </HeaderContainer>
</template>

<script setup>
import HeaderContainer from "$elpisWidgets/header-container/header-container.vue";
import $curl from "$elpisCommon/curl.js";
import { ref, onMounted } from "vue";

// 响应式数据
const modelList = ref([]);
const loading = ref(false);

// 获取模型列表
async function getModelList() {
  loading.value = true;
  try {
    const res = await $curl({
      url: "/api/project/model_list",
      method: "get",
      errorMessages: "获取项目列表失败",
    });

    if (res && res.success) {
      modelList.value = res.data;
      console.log(modelList.value);
    }
  } catch (error) {
    console.error("获取项目列表失败:", error);
  } finally {
    loading.value = false;
  }
}

// 进入项目处理
const handleEnter = (item) => {
  const { origin } = window.location;
  window.open(`${origin}/view/dashboard${item.homePage}`);
};

// 组件挂载时获取数据
onMounted(() => {
  getModelList();
});
</script>

<style lang="less" scoped>
// 主容器样式
.project-container {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 120px);
}

// 模型区域样式
.model-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

// 模型面板优化
.model-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
}

.model-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.model-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.model-info {
  flex: 1;
}

.model-name {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.model-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

// 项目网格布局
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

// 项目卡片样式
.project-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

    &::before {
      transform: scaleY(1);
    }

    .project-avatar {
      transform: scale(1.1);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .card-actions {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

// 卡片头部
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.card-actions {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;

  .el-button {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }
  }
}

// 卡片内容
.card-content {
  margin-bottom: 20px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-desc {
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

// 卡片底部
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #a0aec0;

  i {
    font-size: 14px;
  }
}

.enter-btn {
  .el-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
    }
  }
}

// 空状态样式
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #718096;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #4a5568;
}

.empty-desc {
  font-size: 14px;
  color: #a0aec0;
}

// 加载状态优化
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

// 响应式设计
@media (max-width: 1200px) {
  .project-container {
    padding: 20px;
  }

  .project-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .project-container {
    padding: 16px;
  }

  .model-panel {
    padding: 16px 20px;
    margin-bottom: 16px;
  }

  .model-name {
    font-size: 20px;
  }

  .project-card {
    padding: 20px;
  }

  .card-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;

    .enter-btn {
      width: 100%;

      .el-button {
        width: 100%;
      }
    }
  }
}

@media (max-width: 480px) {
  .model-header {
    gap: 12px;
  }

  .model-icon {
    font-size: 24px;
  }

  .model-name {
    font-size: 18px;
  }

  .project-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
