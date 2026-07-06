import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { passwordApi } from '../api/password'

export const usePasswordStore = defineStore('passwords', () => {
  const passwords = ref([])
  const currentPassword = ref(null)
  const categories = ref([])
  const stats = ref(null)
  const loading = ref(false)
  const pagination = ref({ total: 0, page: 1, limit: 20, totalPages: 0 })

  const totalPasswords = computed(() => pagination.value.total)

  async function fetchPasswords(params = {}) {
    loading.value = true
    try {
      const { data } = await passwordApi.getAll(params)
      passwords.value = data.data
      pagination.value = data.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      const { data } = await passwordApi.getById(id)
      currentPassword.value = data.data
      return data.data
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPassword(passwordData) {
    const { data } = await passwordApi.create(passwordData)
    return data.data
  }

  async function updatePassword(id, passwordData) {
    const { data } = await passwordApi.update(id, passwordData)
    return data.data
  }

  async function deletePassword(id) {
    await passwordApi.delete(id)
    passwords.value = passwords.value.filter((p) => p.id !== id)
  }

  async function fetchCategories() {
    try {
      const { data } = await passwordApi.getCategories()
      categories.value = data.data || []
    } catch {
      categories.value = []
    }
  }

  async function fetchStats() {
    try {
      const { data } = await passwordApi.getDashboardStats()
      stats.value = data.data
    } catch {
      stats.value = null
    }
  }

  return {
    passwords,
    currentPassword,
    categories,
    stats,
    loading,
    pagination,
    totalPasswords,
    fetchPasswords,
    fetchById,
    createPassword,
    updatePassword,
    deletePassword,
    fetchCategories,
    fetchStats,
  }
})
