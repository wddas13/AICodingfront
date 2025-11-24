<script setup>
import { ref } from 'vue'
import { submitFeedback } from '../api/feedback'
import { ElNotification } from 'element-plus'

const form = ref({
  content: '',
  contact: ''
})
const loading = ref(false)

async function onSubmit() {
  if (!form.value.content) {
    ElNotification({ title: 'Warning', message: '反馈内容不能为空', type: 'warning' })
    return
  }
  loading.value = true
  try {
    await submitFeedback(form.value)
    ElNotification({ title: 'Success', message: '提交成功', type: 'success' })
    form.value.content = ''
    form.value.contact = ''
  } catch (e) {
    ElNotification({ title: 'Error', message: e?.response?.data?.msg || '提交失败', type: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    <el-card class="form-card fade-in">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">
            <i class="el-icon-chat-dot-round"></i>
            用户反馈
          </h2>
          <p class="card-subtitle">我们重视您的每一条建议</p>
        </div>
      </template>
      <el-form @submit.prevent="onSubmit" label-position="top">
        <el-form-item label="反馈内容" required>
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="6" 
            placeholder="请详细描述您的问题或建议..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input 
            v-model="form.contact" 
            placeholder="邮箱/手机号（选填，便于我们与您联系）"
            prefix-icon="el-icon-message"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            :loading="loading" 
            type="primary" 
            @click="onSubmit" 
            size="large"
            class="submit-btn"
          >
            <span v-if="!loading">提交反馈</span>
            <span v-else>提交中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.form-card {
  width: 100%;
  max-width: 650px;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card-header {
  text-align: center;
  padding: 10px 0;
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.card-title i {
  font-size: 32px;
}

.card-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.el-form {
  padding: 10px 0;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #333;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }
  
  .card-title {
    font-size: 24px;
  }
}
</style>
