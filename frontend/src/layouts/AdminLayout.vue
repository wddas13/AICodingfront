<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()
const hasToken = computed(() => !!auth.token)

function logout() {
  auth.clearToken()
  router.push('/admin/login')
}
</script>

<template>
  <el-container class="admin-layout">
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <i class="el-icon-document-copy"></i>
          </div>
          <span class="logo-text">Feedback Admin</span>
        </div>
        <div class="nav">
          <el-menu 
            mode="horizontal" 
            :router="true" 
            :ellipsis="false" 
            :default-active="$route.path"
            class="custom-menu"
          >
            <el-menu-item index="/tasks">
              <i class="el-icon-tickets"></i>
              <span>待办事项</span>
            </el-menu-item>
            <el-menu-item index="/admin/tasks">
              <i class="el-icon-s-operation"></i>
              <span>任务管理</span>
            </el-menu-item>
            <el-menu-item index="/feedback">
              <i class="el-icon-edit"></i>
              <span>提交反馈</span>
            </el-menu-item>
            <el-menu-item index="/admin/feedback">
              <i class="el-icon-document"></i>
              <span>反馈列表</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="user-info">
          <el-dropdown v-if="hasToken" trigger="click" class="user-dropdown">
            <span class="user-dropdown-link">
              <el-avatar :size="36" class="user-avatar">
                <i class="el-icon-user-solid"></i>
              </el-avatar>
              <span class="username">Admin</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">
                  <i class="el-icon-switch-button"></i>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-else type="primary" @click="router.push('/admin/login')" class="login-btn">
            <i class="el-icon-lock"></i>
            登录
          </el-button>
        </div>
      </div>
    </el-header>
    <el-main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-image-slice: 1;
  padding: 0 40px;
  height: 70px !important;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo:hover .logo-icon {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.nav {
  flex: 1;
  margin: 0 40px;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.custom-menu {
  border: none;
  background: transparent;
}

:deep(.el-menu-item) {
  font-size: 15px;
  font-weight: 500;
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.el-menu-item i) {
  font-size: 18px;
}

:deep(.el-menu-item:hover) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  cursor: pointer;
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-dropdown-link:hover {
  background: rgba(102, 126, 234, 0.1);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.username {
  font-weight: 500;
  color: #333;
}

.login-btn {
  border-radius: 20px;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
}

:deep(.el-dropdown-menu__item i) {
  font-size: 16px;
  color: #667eea;
}

.main-content {
  padding: 0;
  background: transparent;
}

/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 20px;
  }
  
  .logo-text {
    display: none;
  }
  
  .nav {
    margin: 0 20px;
  }
  
  :deep(.el-menu-item span) {
    display: none;
  }
  
  .username {
    display: none;
  }
}
</style>
