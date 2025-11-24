import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import FeedbackForm from '../pages/FeedbackForm.vue'
import AdminLogin from '../pages/AdminLogin.vue'
import FeedbackList from '../pages/FeedbackList.vue'
import TaskList from '../pages/TaskList.vue'
import TaskManage from '../pages/TaskManage.vue'

const routes = [
  { path: '/', redirect: '/tasks' },
  { path: '/admin/login', component: AdminLogin },
  { path: '/feedback', component: FeedbackForm },
  { path: '/tasks', component: TaskList },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'feedback', component: FeedbackList },
      { path: 'tasks', component: TaskManage },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAdminRoute = to.path.startsWith('/admin')
  const raw = localStorage.getItem('token')
  const hasToken = !!(raw && raw !== 'null' && raw !== 'undefined')
  if (isAdminRoute && to.path !== '/admin/login' && !hasToken) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router
