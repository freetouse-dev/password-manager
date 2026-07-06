<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useTheme } from '../../composables/useTheme'

const auth = useAuthStore()
const router = useRouter()
const { isDark, toggle } = useTheme()

const navLinks = computed(() => {
  const links = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
    { title: 'My Passwords', icon: 'mdi-lock', to: '/passwords' },
    { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  ]
  if (auth.isAdmin) {
    links.push({ title: 'Admin', icon: 'mdi-shield-crown', to: '/admin' })
  }
  return links
})

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <v-app-bar elevation="0" border density="compact">
    <v-app-bar-title class="font-weight-bold">
      <router-link to="/dashboard" class="text-decoration-none text-primary d-flex align-center ga-2">
        <v-icon color="primary">mdi-lock</v-icon>
        <span>SecurePass</span>
      </router-link>
    </v-app-bar-title>
    <template #append>
      <v-btn variant="text" icon size="small" @click="toggle" class="mr-2">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      <v-menu min-width="220" :close-on-content-click="true">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="small" class="mr-2">
            <v-avatar :color="auth.isAdmin ? 'secondary' : 'primary'" size="34">
              <span class="text-white text-body-2 font-weight-bold">
                {{ auth.user?.full_name?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list density="compact" nav>
          <v-list-item density="compact">
            <template #title>
              <div class="text-body-2 font-weight-bold">{{ auth.user?.full_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ auth.user?.email }}</div>
            </template>
          </v-list-item>
          <v-divider />
          <v-list-item v-for="link in navLinks" :key="link.title" :to="link.to" :prepend-icon="link.icon" :title="link.title" density="compact" color="primary" />
          <v-divider />
          <v-list-item prepend-icon="mdi-logout" title="Logout" density="compact" color="error" @click="handleLogout" />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>
