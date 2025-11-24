import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
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
