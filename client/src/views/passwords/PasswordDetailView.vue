<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePasswordStore } from '../../stores/passwords'

const route = useRoute()
const router = useRouter()
const passwordStore = usePasswordStore()

const editing = ref(false)
const editForm = ref({ siteName: '', siteUrl: '', username: '', password: '', category: '', notes: '' })
const saving = ref(false)
const showPassword = ref(false)
const copied = ref(false)
const showNewCat = ref(false)
const newCatName = ref('')
const showDeleteConfirm = ref(false)

onMounted(async () => {
  try {
    const [data] = await Promise.all([
      passwordStore.fetchById(route.params.id),
      passwordStore.fetchCategories(),
    ])
    editForm.value = {
      siteName: data.site_name || '',
      siteUrl: data.site_url || '',
      username: data.site_username || '',
      password: data.decrypted_password || '',
      category: data.category || 'General',
      notes: data.notes || '',
    }
  } catch {
    router.push('/passwords')
  }
})

function confirmNewCategory() {
  const name = newCatName.value.trim()
  if (name) {
    editForm.value.category = name
    showNewCat.value = false
    newCatName.value = ''
  }
}

watch(() => editForm.value.category, (val) => {
  if (val === '__new__') {
    showNewCat.value = true
    editForm.value.category = ''
  }
})

async function handleUpdate() {
  saving.value = true
  try {
    const updateData = { ...editForm.value }
    if (!updateData.password) delete updateData.password
    await passwordStore.updatePassword(route.params.id, updateData)
    await passwordStore.fetchById(route.params.id)
    editing.value = false
  } catch (err) {
    alert(err.response?.data?.message || 'Update failed')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  try {
    await passwordStore.deletePassword(route.params.id)
    router.push('/passwords')
  } catch {
    alert('Delete failed')
  }
}

function copyPassword() {
  const pwd = editForm.value.password
  if (pwd) {
    navigator.clipboard.writeText(pwd)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
  let pwd = ''
  for (let i = 0; i < 20; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  editForm.value.password = pwd
}

const allCategories = () => passwordStore.categories || []
</script>

<template>
  <v-container fluid class="pa-6" style="max-width: 800px">
    <v-row v-if="passwordStore.loading && !passwordStore.currentPassword" justify="center" class="pa-10">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else-if="passwordStore.currentPassword">
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2">
        <div class="d-flex align-center ga-2 text-body-2">
          <router-link to="/passwords" class="text-primary text-decoration-none">Passwords</router-link>
          <v-icon size="small">mdi-chevron-right</v-icon>
          <span class="text-medium-emphasis">{{ passwordStore.currentPassword.site_name }}</span>
        </div>
        <div class="d-flex ga-2">
          <v-btn :color="editing ? '' : 'primary'" :variant="editing ? 'tonal' : 'flat'" size="small" :prepend-icon="editing ? 'mdi-close' : 'mdi-pencil'" @click="editing = !editing">
            {{ editing ? 'Cancel' : 'Edit' }}
          </v-btn>
          <v-btn color="error" variant="tonal" size="small" prepend-icon="mdi-delete" @click="showDeleteConfirm = true">Delete</v-btn>
        </div>
      </div>

      <v-card class="pa-6">
        <template v-if="!editing">
          <div class="d-flex align-center ga-4 pb-4 mb-4" style="border-bottom: 1px solid rgba(var(--v-border-color), 0.3)">
            <v-avatar color="primary" size="56" rounded="lg">
              <span class="text-white font-weight-bold text-h5">{{ passwordStore.currentPassword.site_name?.charAt(0)?.toUpperCase() || '?' }}</span>
            </v-avatar>
            <div>
              <h1 class="text-h5 font-weight-bold">{{ passwordStore.currentPassword.site_name }}</h1>
              <a v-if="passwordStore.currentPassword.site_url" :href="passwordStore.currentPassword.site_url" target="_blank" class="text-primary text-body-2 text-decoration-none">{{ passwordStore.currentPassword.site_url }}</a>
            </div>
          </div>

          <div class="detail-fields">
            <div class="field">
              <label class="text-caption text-medium-emphasis font-weight-bold text-uppercase">Username</label>
              <div class="text-body-1 font-weight-medium">{{ passwordStore.currentPassword.site_username }}</div>
            </div>
            <div class="field">
              <label class="text-caption text-medium-emphasis font-weight-bold text-uppercase">Password</label>
              <div class="d-flex align-center justify-space-between">
                <span :class="{ 'text-h6 font-family-monospace': !showPassword }" class="font-weight-medium">
                  {{ showPassword ? editForm.password : '••••••••••••••••' }}
                </span>
                <div class="d-flex ga-1">
                  <v-btn icon variant="text" size="x-small" @click="showPassword = !showPassword">
                    <v-icon size="small">{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" size="x-small" @click="copyPassword">
                    <v-icon size="small">mdi-content-copy</v-icon>
                  </v-btn>
                  <v-chip v-if="copied" size="x-small" color="success" variant="flat">Copied!</v-chip>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="text-caption text-medium-emphasis font-weight-bold text-uppercase">Category</label>
              <v-chip size="small" color="primary" variant="tonal">{{ passwordStore.currentPassword.category || 'General' }}</v-chip>
            </div>
            <div v-if="passwordStore.currentPassword.notes" class="field">
              <label class="text-caption text-medium-emphasis font-weight-bold text-uppercase">Notes</label>
              <div class="text-body-2 text-medium-emphasis" style="white-space: pre-wrap">{{ passwordStore.currentPassword.notes }}</div>
            </div>
            <div class="field">
              <label class="text-caption text-medium-emphasis font-weight-bold text-uppercase">Created</label>
              <div class="text-body-2 text-medium-emphasis">{{ new Date(passwordStore.currentPassword.created_at).toLocaleDateString() }}</div>
            </div>
          </div>
        </template>

        <template v-else>
          <h2 class="text-h6 font-weight-bold mb-4">Edit Password</h2>
          <v-form @submit.prevent="handleUpdate">
            <v-text-field v-model="editForm.siteName" label="Site Name" prepend-inner-icon="mdi-web" required class="mb-3" />
            <v-text-field v-model="editForm.siteUrl" label="Site URL" prepend-inner-icon="mdi-link" class="mb-3" />
            <v-text-field v-model="editForm.username" label="Username" prepend-inner-icon="mdi-account" required class="mb-3" />
            <div class="mb-3">
              <v-text-field v-model="editForm.password" label="Password" prepend-inner-icon="mdi-key" class="mb-2" />
              <v-btn size="small" variant="tonal" prepend-icon="mdi-auto-fix" @click="generatePassword">Generate</v-btn>
            </div>
            <div class="mb-3">
              <template v-if="!showNewCat">
                <v-select v-model="editForm.category" :items="['General', ...(passwordStore.categories || []).filter(c => c !== 'General'), { title: '+ Add new category', value: '__new__' }]" label="Category" prepend-inner-icon="mdi-tag" clearable />
              </template>
              <div v-else class="d-flex ga-2 align-center">
                <v-text-field v-model="newCatName" label="New category name" hide-details density="compact" @keyup.enter="confirmNewCategory" />
                <v-btn color="primary" size="small" @click="confirmNewCategory">Add</v-btn>
                <v-btn variant="tonal" size="small" @click="showNewCat = false; newCatName = ''">Cancel</v-btn>
              </div>
            </div>
            <v-textarea v-model="editForm.notes" label="Notes" prepend-inner-icon="mdi-note-text" rows="4" class="mb-4" />
            <div class="d-flex ga-3">
              <v-btn variant="tonal" @click="editing = false" block>Cancel</v-btn>
              <v-btn color="primary" :loading="saving" type="submit" block>Save Changes</v-btn>
            </div>
          </v-form>
        </template>
      </v-card>
    </template>

    <v-dialog v-model="showDeleteConfirm" max-width="400">
      <v-card>
        <v-card-title class="text-h6 pa-4">Delete Password</v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <p class="text-body-2 text-medium-emphasis">
            Are you sure you want to delete <strong>{{ passwordStore.currentPassword?.site_name }}</strong>? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" @click="showDeleteConfirm = false">Cancel</v-btn>
          <v-btn color="error" @click="handleDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.detail-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.font-family-monospace {
  font-family: monospace;
  letter-spacing: 2px;
}
</style>
