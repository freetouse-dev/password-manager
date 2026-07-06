<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useTheme } from '../../composables/useTheme'

const router = useRouter()
const auth = useAuthStore()
const { isDark, toggle } = useTheme()

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function handleLogin() {
  if (!identifier.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await auth.login(identifier.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid class="fill-height auth-page pa-0">
    <v-btn icon variant="text" size="small" class="theme-fab" @click="toggle">
      <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <v-row align="center" justify="center" class="ma-0 fill-height">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-8">
          <div class="text-center mb-6">
            <v-avatar color="primary" size="56" class="mb-3" style="border-radius: 14px">
              <v-icon color="white" size="28">mdi-lock</v-icon>
            </v-avatar>
            <h1 class="text-h5 font-weight-bold mb-1">Welcome Back</h1>
            <p class="text-body-2 text-medium-emphasis">Sign in to access your secure vault</p>
          </div>

          <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" density="compact" @click:close="error = ''">
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="handleLogin">
            <v-text-field v-model="identifier" label="Username or Email" prepend-inner-icon="mdi-account" autocomplete="username" :disabled="loading" class="mb-3" />
            <v-text-field v-model="password" label="Password" prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" :disabled="loading" @click:append-inner="showPassword = !showPassword" class="mb-4" />

            <v-btn type="submit" color="primary" size="large" block :loading="loading" class="mb-4">
              Sign In
            </v-btn>
          </v-form>

          <div class="text-center text-body-2 text-medium-emphasis">
            Don't have an account?
            <router-link to="/register" class="text-primary font-weight-bold text-decoration-none">Create one</router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.auth-page {
  background: rgb(var(--v-theme-background));
}
.theme-fab {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
}
</style>
