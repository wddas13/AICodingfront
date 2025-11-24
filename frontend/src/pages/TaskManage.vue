<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchTaskList, deleteTask, updateTaskStatus } from '../api/tasks'
import { ElNotification, ElMessageBox } from 'element-plus'

const tasks = ref([])
const loading = ref(false)
const filterStatus = ref('all') // all, pending, completed

// 过滤后的任务列表
const filteredTasks = computed(() => {
  if (filterStatus.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(task => task.status === filterStatus.value)
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

// 切换任务状态
async function toggleTaskStatus(task) {
  const newStatus = task.status === 'pending' ? 'completed' : 'pending'
  const actionText = newStatus === 'completed' ? '完成' : '重新激活'
  
  try {
    await ElMessageBox.confirm(
      `确定要${actionText}这个任务吗？`, 
      '确认操作', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    loading.value = true
    await updateTaskStatus(task.id, newStatus)
    ElNotification({ 
      title: 'Success', 
      message: `任务已${actionText}`, 
      type: 'success' 
    })
    fetchList()
  } catch (e) {
    if (e !== 'cancel') {
      ElNotification({ 
        title: 'Error', 
        message: e?.response?.data?.msg || '操作失败', 
        type: 'error' 
      })
    }
  } finally {
    loading.value = false
  }
}

// 删除任务
async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？删除后无法恢复！', '确认删除', {
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
  <div class="task-manage-container fade-in">
    <el-card class="manage-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <i class="el-icon-tickets"></i>
            <span class="header-title">任务管理</span>
          </div>
          <div class="header-right">
            <el-radio-group v-model="filterStatus" size="small">
              <el-radio-button label="all">全部 ({{ taskStats.total }})</el-radio-button>
              <el-radio-button label="pending">待完成 ({{ taskStats.pending }})</el-radio-button>
              <el-radio-button label="completed">已完成 ({{ taskStats.completed }})</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">
            <i class="el-icon-tickets"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ taskStats.total }}</div>
            <div class="stat-label">全部任务</div>
          </div>
        </div>
        <div class="stat-card pending">
          <div class="stat-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ taskStats.pending }}</div>
            <div class="stat-label">待完成</div>
          </div>
        </div>
        <div class="stat-card completed">
          <div class="stat-icon">
            <i class="el-icon-circle-check"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ taskStats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </div>

      <!-- 任务表格 -->
      <el-table 
        :data="filteredTasks" 
        v-loading="loading" 
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="primary">{{ row.id }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="title" label="任务标题" min-width="200">
          <template #default="{ row }">
            <div class="title-cell">
              <i class="el-icon-document"></i>
              <span class="title-text">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="任务描述" min-width="250">
          <template #default="{ row }">
            <span class="description-text">{{ row.description || '无描述' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="plain">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template #default="{ row }">
            <div class="time-cell">
              <i class="el-icon-time"></i>
              <span>{{ formatTime(row.create_time) }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                :type="row.status === 'pending' ? 'success' : 'info'" 
                size="small"
                text
                @click="toggleTaskStatus(row)"
              >
                <i :class="row.status === 'pending' ? 'el-icon-circle-check' : 'el-icon-refresh-left'"></i>
                {{ row.status === 'pending' ? '完成' : '重启' }}
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                text
                @click="handleDelete(row.id)"
              >
                <i class="el-icon-delete"></i>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
        
        <template #empty>
          <el-empty description="暂无任务数据" />
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.task-manage-container {
  padding: 20px;
  min-height: 100vh;
}

.manage-card {
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  flex-wrap: wrap;
  gap: 16px;
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

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card.total {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.stat-card.pending {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.stat-card.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.pending .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}

.stat-card.completed .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 表格单元格样式 */
.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-cell i {
  color: #667eea;
  font-size: 16px;
  flex-shrink: 0;
}

.title-text {
  font-weight: 500;
  color: #333;
}

.description-text {
  color: #666;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.time-cell i {
  color: #667eea;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 表格行悬停效果 */
:deep(.el-table__row) {
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: rgba(102, 126, 234, 0.05) !important;
}

/* 表格单元格样式 */
:deep(.el-table td.el-table__cell) {
  padding: 16px 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .task-manage-container {
    padding: 10px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-title {
    font-size: 20px;
  }
  
  .header-right {
    width: 100%;
  }
  
  .header-right .el-radio-group {
    width: 100%;
  }
  
  :deep(.el-radio-button__inner) {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style>

