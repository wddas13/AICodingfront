import request from './request'

// 获取任务列表
export function fetchTaskList() {
  return request.get('/api/tasks')
}

// 创建新任务
export function createTask(data) {
  return request.post('/api/tasks', data)
}

// 删除任务
export function deleteTask(id) {
  return request.delete(`/api/tasks/${id}`)
}

// 更新任务状态
export function updateTaskStatus(id, status) {
  return request.put(`/api/tasks/${id}/status`, { status })
}

