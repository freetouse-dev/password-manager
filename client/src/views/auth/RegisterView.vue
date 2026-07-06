<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ username: '', email: '', fullName: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const passwordStrength = computed(() => {
  const pwd = form.value.password
  if (!pwd) return { level: 0, color: '', text: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^a-zA-Z0-9]/.test(pwd)) score++

  if (score <= 2) return { level: 1, color: 'error', text: 'Weak' }
  if (score <= 4) return { level: 2, color: 'warning', text: 'Medium' }
  return { level: 3, color: 'success', text: 'Strong' }
})

async function handleRegister() {
  error.value = ''
  if (Object.values(form.value).some(v => !v)) {
    error.value = 'Please fill in all fields'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  if (passwordStrength.value.level < 2) {
    error.value = 'Please choose a stronger password'
    return
  }

  loading.value = true
  try {
    await auth.register({
      username: form.value.username,
      email: form.value.email,
      fullName: form.value.fullName,
      password: form.value.password,
    })
    router.push('/login')
  } catch (err) {
    const msg = err.response?.data?.message
    if (err.response?.data?.errors) {
      error.value = err.response.data.errors.map(e => e.message).join(', ')
    } else {
      error.value = msg || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid class="fill-height auth-page pa-0">
    <v-row align="center" justify="center" class="ma-0 fill-height">
      <v-col cols="12" sm="10" md="6" lg="5">
        <v-card class="pa-8">
          <div class="text-center mb-6">
            <v-avatar color="primary" size="56" class="mb-3" style="border-radius: 14px">
              <v-icon color="white" size="28">mdi-lock</v-icon>
            </v-avatar>
            <h1 class="text-h5 font-weight-bold mb-1">Create Account</h1>
            <p class="text-body-2 text-medium-emphasis">Join SecurePass to manage your passwords</p>
          </div>

          <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" density="compact" @click:close="error = ''">
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="handleRegister">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.username" label="Username" prepend-inner-icon="mdi-account" autocomplete="username" :disabled="loading" class="mb-3" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.fullName" label="Full Name" prepend-inner-icon="mdi-account-badge" autocomplete="name" :disabled="loading" class="mb-3" />
              </v-col>
            </v-row>

            <v-text-field v-model="form.email" label="Email" prepend-inner-icon="mdi-email" type="email" autocomplete="email" :disabled="loading" class="mb-3" />

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.password" label="Password" prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" :disabled="loading" @click:append-inner="showPassword = !showPassword" class="mb-3" />
                <v-progress-linear v-if="form.password" :model-value="passwordStrength.level * 33" :color="passwordStrength.color" height="4" rounded class="mt-n2 mb-1" />
                <div v-if="form.password" class="text-caption text-right" :class="`text-${passwordStrength.color}`">
                  {{ passwordStrength.text }}
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.confirmPassword" label="Confirm Password" prepend-inner-icon="mdi-lock" :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'" :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" :disabled="loading" @click:append-inner="showConfirm = !showConfirm" class="mb-3" />
              </v-col>
            </v-row>

            <v-btn type="submit" color="primary" size="large" block :loading="loading" class="mb-4 mt-2">
              Create Account
            </v-btn>
          </v-form>

          <div class="text-center text-body-2 text-medium-emphasis">
            Already have an account?
            <router-link to="/login" class="text-primary font-weight-bold text-decoration-none">Sign in</router-link>
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
</style>
