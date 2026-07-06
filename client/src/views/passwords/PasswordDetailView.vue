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
</script>

<template>
  <div class="pa-6" style="max-width: 800px; margin: 0 auto">
    <div v-if="passwordStore.loading && !passwordStore.currentPassword" class="text-center pa-10">
      <div class="spinner" style="margin:0 auto"></div>
    </div>

    <template v-else-if="passwordStore.currentPassword">
      <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div class="flex items-center gap-2 text-body">
          <router-link to="/passwords" class="text-primary">Passwords</router-link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="text-secondary">{{ passwordStore.currentPassword.site_name }}</span>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm" :class="editing ? 'btn-outline' : 'btn-primary'" @click="editing = !editing">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            {{ editing ? 'Cancel' : 'Edit' }}
          </button>
          <button class="btn btn-sm" style="background:var(--error-light);color:var(--error);border:1px solid rgba(239,68,68,0.2)" @click="showDeleteConfirm = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
        </div>
      </div>

      <div class="card pa-6">
        <template v-if="!editing">
          <div class="flex items-center gap-4 pb-4 mb-4" style="border-bottom:1px solid var(--border)">
            <div class="avatar avatar-xl avatar-primary" style="border-radius:12px">
              <span class="text-h4">{{ passwordStore.currentPassword.site_name?.charAt(0)?.toUpperCase() || '?' }}</span>
            </div>
            <div>
              <h1 class="text-h5 font-bold">{{ passwordStore.currentPassword.site_name }}</h1>
              <a v-if="passwordStore.currentPassword.site_url" :href="passwordStore.currentPassword.site_url" target="_blank" class="text-primary text-body">{{ passwordStore.currentPassword.site_url }}</a>
            </div>
          </div>

          <div class="detail-fields">
            <div class="field">
              <label class="form-label">Username</label>
              <div class="text-body font-medium">{{ passwordStore.currentPassword.site_username }}</div>
            </div>
            <div class="field">
              <label class="form-label">Password</label>
              <div class="flex items-center justify-between">
                <span class="font-medium" :class="{ 'pwd-masked': !showPassword }">
                  {{ showPassword ? editForm.password : '••••••••••••••••' }}
                </span>
                <div class="flex gap-1">
                  <button class="btn-icon btn-ghost" @click="showPassword = !showPassword">
                    <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button class="btn-icon btn-ghost" @click="copyPassword">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  <span v-if="copied" class="chip chip-success">Copied!</span>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="form-label">Category</label>
              <span class="chip chip-primary">{{ passwordStore.currentPassword.category || 'General' }}</span>
            </div>
            <div v-if="passwordStore.currentPassword.notes" class="field">
              <label class="form-label">Notes</label>
              <div class="text-body text-secondary" style="white-space: pre-wrap">{{ passwordStore.currentPassword.notes }}</div>
            </div>
            <div class="field">
              <label class="form-label">Created</label>
              <div class="text-body text-secondary">{{ new Date(passwordStore.currentPassword.created_at).toLocaleDateString() }}</div>
            </div>
          </div>
        </template>

        <template v-else>
          <h2 class="text-h6 font-bold mb-4">Edit Password</h2>
          <form @submit.prevent="handleUpdate">
            <div class="form-group">
              <label class="form-label">Site Name</label>
              <input v-model="editForm.siteName" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Site URL</label>
              <input v-model="editForm.siteUrl" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Username</label>
              <input v-model="editForm.username" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="flex gap-2 items-center">
                <input v-model="editForm.password" class="form-input" style="flex:1" />
                <button type="button" class="btn btn-outline btn-sm" @click="generatePassword">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Generate
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <template v-if="!showNewCat">
                <select v-model="editForm.category" class="form-input">
                  <option value="General">General</option>
                  <option v-for="c in (passwordStore.categories || []).filter(c => c !== 'General')" :key="c" :value="c">{{ c }}</option>
                  <option value="__new__">+ Add new category</option>
                </select>
              </template>
              <div v-else class="flex gap-2 items-center">
                <input v-model="newCatName" class="form-input" placeholder="New category name" @keyup.enter="confirmNewCategory" style="flex:1" />
                <button type="button" class="btn btn-primary btn-sm" @click="confirmNewCategory">Add</button>
                <button type="button" class="btn btn-outline btn-sm" @click="showNewCat = false; newCatName = ''">Cancel</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Notes</label>
              <textarea v-model="editForm.notes" class="form-input" rows="4"></textarea>
            </div>
            <div class="flex gap-3">
              <button type="button" class="btn btn-outline" style="flex:1" @click="editing = false">Cancel</button>
              <button type="submit" class="btn btn-primary" style="flex:1" :disabled="saving">
                <span v-if="saving" class="spinner" style="width:16px;height:16px;border-width:2px"></span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </template>
      </div>
    </template>

    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal-card" style="max-width:400px">
        <div class="modal-header">
          <h3>Delete Password</h3>
          <button class="btn-icon btn-ghost" @click="showDeleteConfirm = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="text-body text-secondary">
            Are you sure you want to delete <strong style="color:var(--text)">{{ passwordStore.currentPassword?.site_name }}</strong>? This action cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showDeleteConfirm = false">Cancel</button>
          <button class="btn" style="background:var(--error);color:#fff" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
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
.pwd-masked {
  font-family: monospace;
  letter-spacing: 2px;
}
</style>
