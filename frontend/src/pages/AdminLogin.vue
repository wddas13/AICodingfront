<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '../api/feedback'
import { useAuthStore } from '../store/auth'
import { ElNotification } from 'element-plus'

const username = ref('admin')
const password = ref('123456')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function onSubmit() {
  loading.value = true
  try {
    const res = await adminLogin({ username: username.value, password: password.value })
    const token = res?.data?.token || res?.data?.access_token || ''
    if (token) {
      auth.setToken(token)
      ElNotification({ title: 'Success', message: '登录成功', type: 'success' })
      router.push('/admin/feedback')
    } else {
      ElNotification({ title: 'Error', message: res?.data?.msg || '登录失败', type: 'error' })
    }
  } catch (e) {
    ElNotification({ title: 'Error', message: e?.response?.data?.msg || '登录失败', type: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-background">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>
    <el-card class="login-card fade-in">
      <div class="logo-section">
        <div class="logo-icon">
          <i class="el-icon-lock"></i>
        </div>
        <h2 class="login-title">管理员登录</h2>
        <p class="login-subtitle">欢迎回来，请登录您的账户</p>
      </div>
      <el-form @submit.prevent="onSubmit" label-position="top" class="login-form">
        <el-form-item label="用户名" required>
          <el-input 
            v-model="username" 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="el-icon-key"
            size="large"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item class="login-btn-item">
          <el-button 
            :loading="loading" 
            type="primary" 
            @click="onSubmit"
            size="large"
            class="login-btn"
          >
            <span v-if="!loading">立即登录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <el-divider>或</el-divider>
        <router-link to="/" class="back-link">
          <i class="el-icon-back"></i>
          返回用户反馈页面
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 45%;
  animation: wave 25s infinite linear;
}

.wave-1 {
  bottom: -150%;
  left: -50%;
  animation-duration: 25s;
}

.wave-2 {
  bottom: -160%;
  left: -60%;
  animation-duration: 30s;
  animation-delay: 2s;
}

.wave-3 {
  bottom: -170%;
  left: -70%;
  animation-duration: 35s;
  animation-delay: 5s;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.login-card {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #333;
}

.login-btn-item {
  margin-top: 30px;
  margin-bottom: 10px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 6px;
}

.back-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #764ba2;
  transform: translateX(-2px);
}

.back-link i {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    max-width: 100%;
    padding: 15px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .logo-icon {
    width: 70px;
    height: 70px;
    font-size: 35px;
  }
}
</style>
