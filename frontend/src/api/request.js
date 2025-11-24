import axios from 'axios'

// 使用环境变量配置 API 地址
// 开发环境：.env.development 中的 VITE_API_BASE_URL
// 生产环境：.env.production 中的 VITE_API_BASE_URL 或 Netlify 环境变量
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000',
  timeout: 5000
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status
    const msg = err?.response?.data?.msg || ''
    if (status === 401 || /Subject\s+must\s+be\s+a\s+string/i.test(msg)) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined') window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export default instance
