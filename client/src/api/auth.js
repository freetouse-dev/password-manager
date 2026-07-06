import api from './axios'

export const authApi = {
  login(identifier, password) {
    return api.post('/auth/login', { identifier, password })
  },
  register(data) {
    return api.post('/auth/register', data)
  },
  refreshToken(refreshToken) {
    return api.post('/auth/refresh-token', { refreshToken })
  },
  logout(refreshToken) {
    return api.post('/auth/logout', { refreshToken })
  },
  logoutAll() {
    return api.post('/auth/logout-all')
  },
  me() {
    return api.get('/auth/me')
  },
}
