<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useTheme } from './composables/useTheme'
import AppNavbar from './components/common/Navbar.vue'

const auth = useAuthStore()
const { initialize } = useTheme()

onMounted(() => {
  initialize()
  if (auth.isAuthenticated) {
    auth.fetchMe().catch(() => auth.clearAuth())
  }
})
</script>

<template>
  <div class="app-layout">
    <AppNavbar v-if="auth.isAuthenticated" />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>
