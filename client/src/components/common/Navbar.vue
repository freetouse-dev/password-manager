<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useTheme } from '../../composables/useTheme'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { isDark, toggle } = useTheme()

const menuOpen = ref(false)

const navLinks = computed(() => {
  const links = [
    { title: 'Dashboard', to: '/dashboard' },
    { title: 'My Passwords', to: '/passwords' },
    { title: 'Profile', to: '/profile' },
  ]
  if (auth.isAdmin) {
    links.push({ title: 'Admin', to: '/admin' })
  }
  return links
})

async function handleLogout() {
  menuOpen.value = false
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/dashboard" class="navbar-brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>SecurePasscode</span>
      </router-link>

      <div class="navbar-right">
        <button class="btn-icon btn-ghost" @click="toggle">
          <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <div class="navbar-user" @click="menuOpen = !menuOpen">
          <div class="avatar avatar-sm" :class="auth.isAdmin ? 'avatar-admin' : 'avatar-primary'">
            {{ auth.user?.full_name?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
        </div>

        <div v-if="menuOpen" class="navbar-menu" @click.stop>
          <div class="menu-header">
            <div class="font-bold text-body">{{ auth.user?.full_name }}</div>
            <div class="text-caption text-secondary">{{ auth.user?.email }}</div>
          </div>
          <div class="menu-divider"></div>
          <router-link v-for="link in navLinks" :key="link.title" :to="link.to" class="menu-item" :class="{ active: route.path === link.to }" @click="menuOpen = false">
            {{ link.title }}
          </router-link>
          <div class="menu-divider"></div>
          <button class="menu-item menu-item-danger" @click="handleLogout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
  <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  text-decoration: none;
}
.navbar-brand svg { color: var(--primary); }
.navbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}
.navbar-user {
  cursor: pointer;
}
.avatar-primary { background: var(--primary); }
.avatar-admin { background: var(--secondary); }

.navbar-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 220px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 110;
}
.menu-header {
  padding: 12px 16px;
}
.menu-divider {
  height: 1px;
  background: var(--border);
}
.menu-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--text);
  text-decoration: none;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background var(--transition);
}
.menu-item:hover { background: rgba(0,0,0,0.04); }
html.dark .menu-item:hover { background: rgba(255,255,255,0.06); }
.menu-item.active {
  color: var(--primary);
  font-weight: 600;
}
.menu-item-danger { color: var(--error); }
.menu-item-danger:hover { background: var(--error-light) !important; }
.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 105;
}
</style>
