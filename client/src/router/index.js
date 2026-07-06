import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/LandingView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'UserDashboard',
    component: () => import('../views/user/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/passwords',
    name: 'Passwords',
    component: () => import('../views/passwords/PasswordListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/passwords/:id',
    name: 'PasswordDetail',
    component: () => import('../views/passwords/PasswordDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/DashboardView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.name === 'Landing' && auth.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && auth.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.role && auth.user?.role !== to.meta.role) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
