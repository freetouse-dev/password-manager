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
  <v-container fluid class="pa-6">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Admin Dashboard</h1>
      <p class="text-body-2 text-medium-emphasis">System overview and user management</p>
    </div>

    <v-row v-if="loading" justify="center" class="pa-10">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 d-flex align-center ga-4" hover>
            <v-avatar color="primary" size="48" rounded="lg">
              <v-icon color="white">mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats?.totalUsers || 0 }}</div>
              <div class="text-caption text-medium-emphasis">Total Users</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 d-flex align-center ga-4" hover>
            <v-avatar color="secondary" size="48" rounded="lg">
              <v-icon color="white">mdi-lock</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats?.totalPasswords || 0 }}</div>
              <div class="text-caption text-medium-emphasis">Total Passwords</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 d-flex align-center ga-4" hover>
            <v-avatar color="accent" size="48" rounded="lg">
              <v-icon color="white">mdi-account-clock</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats?.activeToday || 0 }}</div>
              <div class="text-caption text-medium-emphasis">Active Today</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 d-flex align-center ga-4" hover>
            <v-avatar color="success" size="48" rounded="lg">
              <v-icon color="white">mdi-shuffle-variant</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats?.categoryDistribution?.length || 0 }}</div>
              <div class="text-caption text-medium-emphasis">Categories</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" lg="8">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6">User Management</span>
              <v-chip size="small" variant="tonal">{{ users.length }} users</v-chip>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table density="compact">
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
                      <div class="d-flex align-center ga-2">
                        <v-avatar :color="user.role === 'admin' ? 'secondary' : 'primary'" size="32">
                          <span class="text-white font-weight-bold text-body-2">{{ user.full_name?.charAt(0)?.toUpperCase() || '?' }}</span>
                        </v-avatar>
                        <div>
                          <div class="text-body-2 font-weight-bold">{{ user.full_name }}</div>
                          <div class="text-caption text-medium-emphasis">@{{ user.username }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-medium-emphasis">{{ user.email }}</td>
                    <td>
                      <v-chip :color="user.role === 'admin' ? 'secondary' : 'primary'" size="x-small" variant="tonal">{{ user.role }}</v-chip>
                    </td>
                    <td>
                      <v-chip :color="user.is_active ? 'success' : 'error'" size="x-small" variant="tonal">
                        {{ user.is_active ? 'Active' : 'Disabled' }}
                      </v-chip>
                    </td>
                    <td>
                      <v-btn :color="user.is_active ? 'error' : 'success'" size="x-small" variant="tonal" @click="toggleStatus(user.id)">
                        {{ user.is_active ? 'Disable' : 'Enable' }}
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4">
          <v-card>
            <v-card-title class="text-h6">Category Distribution</v-card-title>
            <v-card-text>
              <div v-if="stats?.categoryDistribution?.length" class="d-flex flex-column ga-4">
                <div v-for="cat in stats.categoryDistribution" :key="cat.category">
                  <div class="d-flex justify-space-between text-body-2 mb-1">
                    <span>{{ cat.category }}</span>
                    <span class="text-medium-emphasis font-weight-bold">{{ cat.count }}</span>
                  </div>
                  <v-progress-linear :model-value="(cat.count / maxCategoryCount()) * 100" color="primary" height="8" rounded />
                </div>
              </div>
              <v-empty-state v-else icon="mdi-shuffle-variant" title="No password data yet" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
