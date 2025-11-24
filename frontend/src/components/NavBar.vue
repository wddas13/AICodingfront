<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()
const hasToken = computed(() => !!auth.token)

function logout() {
  auth.clearToken()
  router.push('/admin/login')
}
</script>

<template>
  <nav style="display:flex; gap:12px; padding:12px; border-bottom:1px solid #eee;">
    <router-link to="/admin/feedback">反馈列表</router-link>
    <router-link to="/">提交反馈</router-link>
    <router-link v-if="!hasToken" to="/admin/login">管理员登录</router-link>
    <button v-else @click="logout">退出登录</button>
  </nav>
</template>
