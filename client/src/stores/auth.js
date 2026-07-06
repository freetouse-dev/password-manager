import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(null)
  const refreshToken = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function initialize() {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        user.value = data.user
        accessToken.value = data.accessToken
        refreshToken.value = data.refreshToken
      } catch {
        localStorage.removeItem('auth')
      }
    }
  }

  function persist() {
    localStorage.setItem('auth', JSON.stringify({
      user: user.value,
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    }))
  }

  function setAuth(data) {
    user.value = data.user
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    persist()
  }

  function setTokens(newAccess, newRefresh) {
    accessToken.value = newAccess
    refreshToken.value = newRefresh
    persist()
  }

  function setUser(userData) {
    user.value = userData
    persist()
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('auth')
  }

  async function login(identifier, password) {
    const { data } = await authApi.login(identifier, password)
    setAuth(data.data)
    return data.data
  }

  async function register(userData) {
    const { data } = await authApi.register(userData)
    return data
  }

  async function logout() {
    try {
      await authApi.logout(refreshToken.value)
    } catch {
      // ignore
    }
    clearAuth()
  }

  async function logoutAll() {
    try {
      await authApi.logoutAll()
    } catch {
      // ignore
    }
    clearAuth()
  }

  async function fetchMe() {
    const { data } = await authApi.me()
    user.value = data.data
    persist()
    return data.data
  }

  initialize()

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isAdmin,
    setAuth,
    setTokens,
    setUser,
    clearAuth,
    login,
    register,
    logout,
    logoutAll,
    fetchMe,
    initialize,
  }
})
