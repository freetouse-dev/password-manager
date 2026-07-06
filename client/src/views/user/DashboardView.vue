<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { usePasswordStore } from '../../stores/passwords'

const router = useRouter()
const auth = useAuthStore()
const passwordStore = usePasswordStore()

const showAddModal = ref(false)
const addForm = ref({ siteName: '', siteUrl: '', username: '', password: '', category: 'General', notes: '' })
const submitting = ref(false)
const showNewCat = ref(false)
const newCatName = ref('')

const totalPasswords = computed(() => passwordStore.stats?.totalPasswords || 0)
const categories = computed(() => passwordStore.stats?.categories || [])
const recentPasswords = computed(() => passwordStore.stats?.recentPasswords || [])
const categoryList = computed(() => passwordStore.categories || [])

onMounted(async () => {
  await Promise.all([passwordStore.fetchStats(), passwordStore.fetchCategories()])
})

function confirmNewCategory() {
  const name = newCatName.value.trim()
  if (name) {
    addForm.value.category = name
    showNewCat.value = false
    newCatName.value = ''
  }
}

watch(() => addForm.value.category, (val) => {
  if (val === '__new__') {
    showNewCat.value = true
    addForm.value.category = ''
  }
})

async function handleAdd() {
  submitting.value = true
  try {
    await passwordStore.createPassword(addForm.value)
    showAddModal.value = false
    addForm.value = { siteName: '', siteUrl: '', username: '', password: '', category: 'General', notes: '' }
    await Promise.all([passwordStore.fetchStats(), passwordStore.fetchCategories()])
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add password')
  } finally {
    submitting.value = false
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="pa-6" style="max-width:1200px;margin:0 auto">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 class="text-h4 font-bold">Welcome back, {{ auth.user?.full_name?.split(' ')[0] }}</h1>
        <p class="text-body text-secondary">Here's an overview of your secure vault</p>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Password
      </button>
    </div>

    <div class="grid grid-4 mb-6">
      <div class="card pa-4 flex items-center gap-4 stat-card">
        <div class="avatar avatar-lg avatar-primary" style="border-radius:12px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div>
          <div class="text-h4 font-bold">{{ totalPasswords }}</div>
          <div class="text-caption text-secondary">Total Passwords</div>
        </div>
      </div>
      <div class="card pa-4 flex items-center gap-4 stat-card">
        <div class="avatar avatar-lg" style="background:var(--secondary);border-radius:12px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
        </div>
        <div>
          <div class="text-h4 font-bold">{{ categories.length }}</div>
          <div class="text-caption text-secondary">Categories</div>
        </div>
      </div>
      <div class="card pa-4 flex items-center gap-4 stat-card">
        <div class="avatar avatar-lg" style="background:var(--accent);border-radius:12px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <div class="text-h4 font-bold">Secure</div>
          <div class="text-caption text-secondary">Encrypted Storage</div>
        </div>
      </div>
      <div class="card pa-4 flex items-center gap-4 stat-card">
        <div class="avatar avatar-lg" style="background:var(--success);border-radius:12px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div>
          <div class="text-h4 font-bold">Active</div>
          <div class="text-caption text-secondary">Account Status</div>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 7fr 5fr;gap:16px">
      <div class="card">
        <div class="flex items-center justify-between pa-4" style="border-bottom:1px solid var(--border)">
          <h3 class="text-h6">Recent Passwords</h3>
          <router-link to="/passwords" class="text-primary text-body">View All</router-link>
        </div>
        <div class="pa-2">
          <div v-if="recentPasswords.length">
            <div v-for="item in recentPasswords" :key="item.id" class="password-list-item" @click="router.push(`/passwords/${item.id}`)">
              <div class="avatar avatar-md avatar-primary" style="border-radius:12px">
                <span>{{ item.site_name?.charAt(0)?.toUpperCase() || '?' }}</span>
              </div>
              <div style="flex:1;min-width:0">
                <div class="text-body font-medium">{{ item.site_name }}</div>
                <div class="text-caption text-secondary">{{ item.site_url || 'No URL' }}</div>
              </div>
              <span class="chip chip-primary">{{ item.category }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h3>No passwords yet</h3>
            <p>Add your first password to get started</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-h6 pa-4" style="border-bottom:1px solid var(--border)">Categories</h3>
        <div class="pa-2">
          <div v-if="categories.length">
            <div v-for="cat in categories" :key="cat.category" class="flex items-center justify-between pa-3" style="border-bottom:1px solid var(--border)">
              <div class="flex items-center gap-2">
                <div style="width:10px;height:10px;border-radius:50%;background:var(--primary)"></div>
                <span class="text-body">{{ cat.category }}</span>
              </div>
              <span class="chip chip-primary">{{ cat.count }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
            <h3>No categories yet</h3>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Add New Password</h3>
          <button class="btn-icon btn-ghost" @click="showAddModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleAdd">
            <div class="form-group">
              <label class="form-label">Site Name *</label>
              <input v-model="addForm.siteName" class="form-input" placeholder="Site Name" required />
            </div>
            <div class="form-group">
              <label class="form-label">Site URL</label>
              <input v-model="addForm.siteUrl" class="form-input" placeholder="Site URL" />
            </div>
            <div class="form-group">
              <label class="form-label">Username *</label>
              <input v-model="addForm.username" class="form-input" placeholder="Username" required />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input v-model="addForm.password" class="form-input" placeholder="Password" required />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <template v-if="!showNewCat">
                <select v-model="addForm.category" class="form-input">
                  <option value="General">General</option>
                  <option v-for="c in categoryList.filter(c => c !== 'General')" :key="c" :value="c">{{ c }}</option>
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
              <textarea v-model="addForm.notes" class="form-input" placeholder="Notes" rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showAddModal = false">Cancel</button>
          <button class="btn btn-primary" :disabled="submitting" @click="handleAdd">
            <span v-if="submitting" class="spinner" style="width:16px;height:16px;border-width:2px"></span>
            <span v-else>Save Password</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card { transition: box-shadow var(--transition); }
.stat-card:hover { box-shadow: var(--shadow-md); }
.password-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background var(--transition);
}
.password-list-item:hover { background: rgba(0,0,0,0.03); }
html.dark .password-list-item:hover { background: rgba(255,255,255,0.04); }
</style>
