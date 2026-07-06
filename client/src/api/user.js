import api from './axios'

export const userApi = {
  getProfile() {
    return api.get('/users/profile')
  },
  updateProfile(data) {
    return api.put('/users/profile', data)
  },
  changePassword(data) {
    return api.put('/users/change-password', data)
  },
  getAdminUsers(page = 1, limit = 10) {
    return api.get('/users/admin/users', { params: { page, limit } })
  },
  toggleUserStatus(id) {
    return api.patch(`/users/admin/users/${id}/toggle-status`)
  },
}
