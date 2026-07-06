import api from './axios'

export const passwordApi = {
  getAll(params = {}) {
    return api.get('/passwords', { params })
  },
  getById(id) {
    return api.get(`/passwords/${id}`)
  },
  create(data) {
    return api.post('/passwords', data)
  },
  update(id, data) {
    return api.put(`/passwords/${id}`, data)
  },
  delete(id) {
    return api.delete(`/passwords/${id}`)
  },
  getCategories() {
    return api.get('/passwords/categories')
  },
  getDashboardStats() {
    return api.get('/passwords/dashboard/stats')
  },
  getAdminStats() {
    return api.get('/passwords/admin/stats')
  },
}
