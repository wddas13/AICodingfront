<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchTaskList, createTask, deleteTask } from '../api/tasks'
import { ElNotification, ElMessageBox } from 'element-plus'

const tasks = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const newTask = ref({
  title: '',
  description: ''
})

// 计算任务统计
const taskStats = computed(() => {
  return {
    total: tasks.value.length,
    pending: tasks.value.filter(t => t.status === 'pending').length,
    completed: tasks.value.filter(t => t.status === 'completed').length
  }
})

// 获取任务列表
async function fetchList() {
  loading.value = true
  try {
    const res = await fetchTaskList()
    tasks.value = res?.data?.data || []
  } catch (e) {
    ElNotification({ 
      title: 'Error', 
      message: e?.response?.data?.msg || '获取任务列表失败', 
      type: 'error' 
    })
  } finally {
    loading.value = false
  }
}

// 添加任务
async function handleAddTask() {
  if (!newTask.value.title.trim()) {
    ElNotification({ 
      title: 'Warning', 
      message: '任务标题不能为空', 
      type: 'warning' 
    })
    return
  }
  
  loading.value = true
  try {
    const res = await createTask(newTask.value)
    ElNotification({ 
      title: 'Success', 
      message: '任务创建成功', 
      type: 'success' 
    })
    dialogVisible.value = false
    newTask.value = { title: '', description: '' }
    fetchList()
  } catch (e) {
    ElNotification({ 
      title: 'Error', 
      message: e?.response?.data?.msg || '创建任务失败', 
      type: 'error' 
    })
  } finally {
    loading.value = false
  }
}

// 删除任务
async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    loading.value = true
    await deleteTask(id)
    ElNotification({ 
      title: 'Success', 
      message: '任务删除成功', 
      type: 'success' 
    })
    fetchList()
  } catch (e) {
    if (e !== 'cancel') {
      ElNotification({ 
        title: 'Error', 
        message: e?.response?.data?.msg || '删除任务失败', 
        type: 'error' 
      })
    }
  } finally {
    loading.value = false
  }
}

// 格式化时间
function formatTime(timeStr) {
  if (!timeStr) return '-'
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 获取状态类型
function getStatusType(status) {
  return status === 'completed' ? 'success' : 'warning'
}

// 获取状态文本
function getStatusText(status) {
  return status === 'completed' ? '已完成' : '待完成'
}

onMounted(fetchList)
</script>

<template>
  <div class="task-list-container fade-in">
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    
    <el-card class="task-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <i class="el-icon-tickets"></i>
            <span class="header-title">待办事项</span>
          </div>
          <el-button type="primary" @click="dialogVisible = true" class="add-btn">
            <i class="el-icon-plus"></i>
            <span>新建任务</span>
          </el-button>
        </div>
      </template>

      <!-- 统计信息 -->
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-value">{{ taskStats.total }}</div>
          <div class="stat-label">全部任务</div>
        </div>
        <div class="stat-item">
          <div class="stat-value pending">{{ taskStats.pending }}</div>
          <div class="stat-label">待完成</div>
        </div>
        <div class="stat-item">
          <div class="stat-value completed">{{ taskStats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="tasks-wrapper" v-loading="loading">
        <div v-if="tasks.length === 0" class="empty-state">
          <el-empty description="暂无任务">
            <el-button type="primary" @click="dialogVisible = true">创建第一个任务</el-button>
          </el-empty>
        </div>
        
        <div v-else class="task-list">
          <div v-for="task in tasks" :key="task.id" class="task-item">
            <div class="task-content">
              <div class="task-header">
                <h3 class="task-title">
                  <i class="el-icon-document"></i>
                  {{ task.title }}
                </h3>
                <el-tag :type="getStatusType(task.status)" size="small">
                  {{ getStatusText(task.status) }}
                </el-tag>
              </div>
              <p v-if="task.description" class="task-description">
                {{ task.description }}
              </p>
              <div class="task-footer">
                <div class="task-time">
                  <i class="el-icon-time"></i>
                  <span>{{ formatTime(task.create_time) }}</span>
                </div>
                <el-button 
                  type="danger" 
                  size="small" 
                  text 
                  @click="handleDelete(task.id)"
                  class="delete-btn"
                >
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 新建任务对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="新建任务" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="newTask" label-position="top">
        <el-form-item label="任务标题" required>
          <el-input 
            v-model="newTask.title" 
            placeholder="请输入任务标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input 
            v-model="newTask.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入任务描述（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddTask" :loading="loading">
          创建任务
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.task-list-container {
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

.task-card {
  width: 100%;
  max-width: 900px;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left i {
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 20px;
  padding: 10px 24px;
}

/* 统计信息 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-value.pending {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 任务列表 */
.tasks-wrapper {
  min-height: 200px;
}

.empty-state {
  padding: 40px 0;
}

.task-list {
  display: grid;
  gap: 16px;
}

.task-item {
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  background: white;
}

.task-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.task-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.task-title i {
  color: #667eea;
  font-size: 20px;
}

.task-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  padding-left: 28px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 28px;
}

.task-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
}

.task-time i {
  font-size: 14px;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-list-container {
    padding: 10px;
  }
  
  .task-card {
    max-width: 100%;
  }
  
  .header-title {
    font-size: 20px;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .task-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .add-btn span {
    display: none;
  }
}
</style>

