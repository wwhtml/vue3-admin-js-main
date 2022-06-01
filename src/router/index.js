import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Account/Login.vue')
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('../views/Account/Forget.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Account/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
