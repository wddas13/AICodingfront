import request from './request'

export function submitFeedback(data) {
  return request.post('/api/feedback/add', data)
}

export function adminLogin(data) {
  return request.post('/admin/login', data)
}

export function fetchFeedbackList(params) {
  return request.get('/admin/feedback/list', { params })
}
