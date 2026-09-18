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
  if (!pwd) return { level: 0, color: '', text: '', width: 0 }
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^a-zA-Z0-9]/.test(pwd)) score++

  if (score <= 2) return { level: 1, color: 'var(--error)', text: 'Weak', width: 33 }
  if (score <= 4) return { level: 2, color: 'var(--warning)', text: 'Medium', width: 66 }
  return { level: 3, color: 'var(--success)', text: 'Strong', width: 100 }
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
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card pa-8">
        <div class="text-center mb-6">
          <div class="auth-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 class="text-h4 font-bold mb-1">Create Account</h1>
          <p class="text-body text-secondary">Join SecurePasscode to manage your passwords</p>
        </div>

        <div v-if="error" class="alert alert-error mb-4">
          <span style="flex:1">{{ error }}</span>
          <button class="alert-close" @click="error = ''">&times;</button>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <div class="input-icon-wrap">
                <span class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input id="username" v-model="form.username" type="text" class="form-input" placeholder="Username" autocomplete="username" :disabled="loading" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="fullName">Full Name</label>
              <div class="input-icon-wrap">
                <span class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input id="fullName" v-model="form.fullName" type="text" class="form-input" placeholder="Full Name" autocomplete="name" :disabled="loading" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <div class="input-icon-wrap">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input id="email" v-model="form.email" type="email" class="form-input" placeholder="Email" autocomplete="email" :disabled="loading" />
            </div>
          </div>

          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label" for="reg-password">Password</label>
              <div class="input-icon-wrap">
                <span class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input id="reg-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="Password" autocomplete="new-password" :disabled="loading" />
                <button type="button" class="input-suffix" @click="showPassword = !showPassword" tabindex="-1">
                  <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div v-if="form.password" class="strength-bar-wrap">
                <div class="strength-bar" :style="{ width: passwordStrength.width + '%', background: passwordStrength.color }"></div>
              </div>
              <div v-if="form.password" class="text-right text-caption" :style="{ color: passwordStrength.color }">
                {{ passwordStrength.text }}
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="confirmPassword">Confirm Password</label>
              <div class="input-icon-wrap">
                <span class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirm ? 'text' : 'password'" class="form-input" placeholder="Confirm Password" autocomplete="new-password" :disabled="loading" />
                <button type="button" class="input-suffix" @click="showConfirm = !showConfirm" tabindex="-1">
                  <svg v-if="showConfirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-block mb-4 mt-2" :disabled="loading">
            <span v-if="loading" class="spinner" style="width:18px;height:18px;border-width:2px"></span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <div class="text-center text-body text-secondary">
          Already have an account?
          <router-link to="/login" class="font-bold">Sign in</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 24px;
}
.auth-container {
  width: 100%;
  max-width: 600px;
}
.auth-card { width: 100%; }
.auth-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.input-icon-wrap {
  position: relative;
}
.input-icon-wrap .input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  display: flex;
}
.input-icon-wrap .form-input {
  padding-left: 38px;
  padding-right: 38px;
}
.input-suffix {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}
.input-suffix:hover { color: var(--text-secondary); }
.strength-bar-wrap {
  height: 4px;
  background: var(--border);
  border-radius: 9999px;
  margin-top: 6px;
  overflow: hidden;
}
.strength-bar {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}
</style>
