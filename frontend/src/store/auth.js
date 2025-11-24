import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    setToken(token) {
      const normalized = String(token || '')
        .replace(/^Bearer\s+/i, '')
        .trim()
      this.token = normalized
      localStorage.setItem('token', normalized)
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
