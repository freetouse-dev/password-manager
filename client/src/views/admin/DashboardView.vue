<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { userApi } from '../../api/user'
import { passwordApi } from '../../api/password'

const auth = useAuthStore()
const stats = ref(null)
const users = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [statsRes, usersRes] = await Promise.all([
      passwordApi.getAdminStats(),
      userApi.getAdminUsers(1, 50),
    ])
    stats.value = statsRes.data.data
    users.value = usersRes.data.data
  } catch (err) {
    console.error('Failed to load admin data', err)
  } finally {
    loading.value = false
  }
})

async function toggleStatus(userId) {
  try {
    const { data } = await userApi.toggleUserStatus(userId)
    const user = users.value.find((u) => u.id === userId)
    if (user) user.is_active = data.data.is_active
  } catch (err) {
    alert('Failed to toggle user status')
  }
}

function maxCategoryCount() {
  if (!stats.value?.categoryDistribution?.length) return 1
  return Math.max(...stats.value.categoryDistribution.map(c => c.count))
}
</script>

<template>
  <div class="pa-6" style="max-width:1200px;margin:0 auto">
    <div class="mb-6">
      <h1 class="text-h4 font-bold">Admin Dashboard</h1>
      <p class="text-body text-secondary">System overview and user management</p>
    </div>

    <div v-if="loading" class="text-center pa-10">
      <div class="spinner" style="margin:0 auto"></div>
    </div>

    <template v-else>
      <div class="grid grid-4 mb-6">
        <div class="card pa-4 flex items-center gap-4 stat-card">
          <div class="avatar avatar-lg avatar-primary" style="border-radius:12px">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <div class="text-h4 font-bold">{{ stats?.totalUsers || 0 }}</div>
            <div class="text-caption text-secondary">Total Users</div>
          </div>
        </div>
        <div class="card pa-4 flex items-center gap-4 stat-card">
          <div class="avatar avatar-lg" style="background:var(--secondary);border-radius:12px">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <div class="text-h4 font-bold">{{ stats?.totalPasswords || 0 }}</div>
            <div class="text-caption text-secondary">Total Passwords</div>
          </div>
        </div>
        <div class="card pa-4 flex items-center gap-4 stat-card">
          <div class="avatar avatar-lg" style="background:var(--accent);border-radius:12px">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div class="text-h4 font-bold">{{ stats?.activeToday || 0 }}</div>
            <div class="text-caption text-secondary">Active Today</div>
          </div>
        </div>
        <div class="card pa-4 flex items-center gap-4 stat-card">
          <div class="avatar avatar-lg" style="background:var(--success);border-radius:12px">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
          </div>
          <div>
            <div class="text-h4 font-bold">{{ stats?.categoryDistribution?.length || 0 }}</div>
            <div class="text-caption text-secondary">Categories</div>
          </div>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: 7fr 5fr; gap: 16px">
        <div class="card">
          <div class="flex items-center justify-between pa-4" style="border-bottom:1px solid var(--border)">
            <h3 class="text-h6">User Management</h3>
            <span class="chip chip-primary">{{ users.length }} users</span>
          </div>
          <div style="overflow-x:auto">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="avatar avatar-sm" :class="user.role === 'admin' ? '' : 'avatar-primary'" :style="user.role === 'admin' ? {background:'var(--secondary)'} : {}">
                        {{ user.full_name?.charAt(0)?.toUpperCase() || '?' }}
                      </div>
                      <div>
                        <div class="text-body font-bold">{{ user.full_name }}</div>
                        <div class="text-caption text-secondary">@{{ user.username }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-secondary">{{ user.email }}</td>
                  <td>
                    <span class="chip" :class="user.role === 'admin' ? 'chip-secondary' : 'chip-primary'">{{ user.role }}</span>
                  </td>
                  <td>
                    <span class="chip" :class="user.is_active ? 'chip-success' : 'chip-error'">{{ user.is_active ? 'Active' : 'Disabled' }}</span>
                  </td>
                  <td>
                    <button class="btn btn-xs" :style="{background: user.is_active ? 'var(--error-light)' : 'var(--success-light)', color: user.is_active ? 'var(--error)' : 'var(--success)', border: '1px solid ' + (user.is_active ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)')}" @click="toggleStatus(user.id)">
                      {{ user.is_active ? 'Disable' : 'Enable' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3 class="text-h6 pa-4" style="border-bottom:1px solid var(--border)">Category Distribution</h3>
          <div class="pa-4">
            <div v-if="stats?.categoryDistribution?.length" class="flex flex-col gap-4">
              <div v-for="cat in stats.categoryDistribution" :key="cat.category">
                <div class="flex justify-between text-body mb-1">
                  <span>{{ cat.category }}</span>
                  <span class="text-secondary font-bold">{{ cat.count }}</span>
                </div>
                <div class="category-bar-bg">
                  <div class="category-bar-fill" :style="{ width: (cat.count / maxCategoryCount()) * 100 + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
              <h3>No password data yet</h3>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stat-card { transition: box-shadow var(--transition); }
.stat-card:hover { box-shadow: var(--shadow-md); }
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.admin-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.admin-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.category-bar-bg {
  height: 8px;
  background: var(--border);
  border-radius: 9999px;
  overflow: hidden;
}
.category-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 9999px;
  transition: width 0.3s ease;
}
</style>
