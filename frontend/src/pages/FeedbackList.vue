<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchFeedbackList } from '../api/feedback'
import { ElNotification } from 'element-plus'

const list = ref([])
const loading = ref(false)
const pagination = ref({ page: 1, size: 10, total: 0 })

async function fetchList() {
  loading.value = true
  try {
    const res = await fetchFeedbackList({ page: pagination.value.page, size: pagination.value.size })
    list.value = res?.data?.items || []
    pagination.value.total = res?.data?.total || 0
  } catch (e) {
    ElNotification({ title: 'Error', message: e?.response?.data?.msg || '获取失败', type: 'error' })
  } finally {
    loading.value = false
  }
}

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

watch(() => pagination.value.page, fetchList)
onMounted(fetchList)
</script>

<template>
  <div class="feedback-list-container fade-in">
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <i class="el-icon-document"></i>
            <span class="header-title">反馈列表</span>
          </div>
          <div class="header-right">
            <el-tag type="info" effect="plain">
              共 {{ pagination.total }} 条反馈
            </el-tag>
          </div>
        </div>
      </template>
      <el-table 
        :data="list" 
        v-loading="loading" 
        style="width: 100%"
        :header-cell-style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="primary">{{ row.id }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="200">
          <template #default="{ row }">
            <div class="content-cell">
              <i class="el-icon-chat-dot-round content-icon"></i>
              <span>{{ row.content }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系方式" width="180">
          <template #default="{ row }">
            <div class="contact-cell">
              <i class="el-icon-message"></i>
              <span>{{ row.contact || '未填写' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP 地址" width="150" align="center">
          <template #default="{ row }">
            <el-tag type="warning" size="small" effect="plain">
              {{ row.ip }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="提交时间" width="200">
          <template #default="{ row }">
            <div class="time-cell">
              <i class="el-icon-time"></i>
              <span>{{ formatTime(row.create_time) }}</span>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无反馈数据" />
        </template>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :total="pagination.total"
          :page-size="pagination.size"
          v-model:current-page="pagination.page"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.feedback-list-container {
  padding: 20px;
  min-height: 100vh;
}

.list-card {
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
  gap: 10px;
  align-items: center;
}

.content-cell,
.contact-cell,
.time-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-cell i,
.contact-cell i,
.time-cell i {
  color: #667eea;
  font-size: 16px;
}

.content-icon {
  flex-shrink: 0;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

/* 表格行悬停效果 */
:deep(.el-table__row) {
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: rgba(102, 126, 234, 0.05) !important;
  transform: translateX(2px);
}

/* 表格单元格样式 */
:deep(.el-table td.el-table__cell) {
  padding: 16px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feedback-list-container {
    padding: 10px;
  }
  
  .header-title {
    font-size: 20px;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>
