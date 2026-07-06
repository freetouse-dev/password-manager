<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePasswordStore } from '../../stores/passwords'

const router = useRouter()
const passwordStore = usePasswordStore()

const search = ref('')
const selectedCategory = ref('')
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref(null)
const addForm = ref({ siteName: '', siteUrl: '', username: '', password: '', category: 'General', notes: '' })
const submitting = ref(false)
const showNewCat = ref(false)
const newCatName = ref('')
const currentPage = ref(1)

const allCategories = computed(() => passwordStore.categories || [])

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

const filteredPasswords = computed(() => {
  return passwordStore.passwords
})

async function loadPasswords() {
  const params = { page: currentPage.value, limit: 20 }
  if (selectedCategory.value) params.category = selectedCategory.value
  if (search.value) params.search = search.value
  await passwordStore.fetchPasswords(params)
}

onMounted(async () => {
  await Promise.all([passwordStore.fetchCategories(), loadPasswords()])
})

let searchTimeout
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadPasswords()
  }, 300)
}

function selectCategory(cat) {
  selectedCategory.value = selectedCategory.value === cat ? '' : cat
  currentPage.value = 1
  loadPasswords()
}

function goToDetail(id) {
  router.push(`/passwords/${id}`)
}

async function handleAdd() {
  submitting.value = true
  try {
    await passwordStore.createPassword(addForm.value)
    showAddModal.value = false
    addForm.value = { siteName: '', siteUrl: '', username: '', password: '', category: 'General', notes: '' }
    await Promise.all([loadPasswords(), passwordStore.fetchCategories()])
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add')
  } finally {
    submitting.value = false
  }
}

function confirmDelete(item) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  try {
    await passwordStore.deletePassword(deleteTarget.value.id)
    showDeleteModal.value = false
    deleteTarget.value = null
    await loadPasswords()
  } catch {
    alert('Failed to delete')
  }
}

function nextPage() {
  if (currentPage.value < passwordStore.pagination.totalPages) {
    currentPage.value++
    loadPasswords()
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadPasswords()
  }
}
</script>

<template>
  <div class="pa-6" style="max-width:1200px;margin:0 auto">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div>
        <h1 class="text-h4 font-bold">My Passwords</h1>
        <p class="text-body text-secondary">{{ passwordStore.totalPasswords }} passwords stored securely</p>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Password
      </button>
    </div>

    <div class="flex flex-wrap gap-3 items-center mb-4">
      <div style="flex:1;min-width:200px;max-width:360px">
        <div class="input-icon-wrap">
          <span class="input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input v-model="search" class="form-input" placeholder="Search passwords..." @input="onSearch" />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      <button v-for="cat in allCategories" :key="cat" class="chip" :class="selectedCategory === cat ? 'chip-primary' : 'chip-outline'" @click="selectCategory(cat)">
        {{ cat }}
      </button>
      <button v-if="selectedCategory" class="chip chip-error" @click="selectCategory('')">Clear</button>
    </div>

    <div v-if="passwordStore.loading" class="text-center pa-10">
      <div class="spinner" style="margin:0 auto"></div>
    </div>

    <div v-else-if="filteredPasswords.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <h3>No passwords found</h3>
      <p>Add your first password to get started</p>
      <button class="btn btn-primary" @click="showAddModal = true">Add Password</button>
    </div>

    <div v-else class="grid grid-4">
      <div v-for="item in filteredPasswords" :key="item.id" class="card password-card" @click="goToDetail(item.id)">
        <div class="flex items-center justify-between" style="padding:16px 16px 8px">
          <div class="flex items-center gap-3">
            <div class="avatar avatar-md avatar-primary" style="border-radius:12px">
              <span class="text-h6">{{ item.site_name?.charAt(0)?.toUpperCase() || '?' }}</span>
            </div>
            <div>
              <div class="text-body font-bold">{{ item.site_name }}</div>
              <div class="text-caption text-secondary">{{ item.site_username }}</div>
            </div>
          </div>
          <button class="btn-icon btn-ghost" style="color:var(--text-muted)" @click.stop="confirmDelete(item)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
        <div style="padding:8px 16px 16px">
          <span class="chip chip-primary">{{ item.category || 'General' }}</span>
        </div>
      </div>
    </div>

    <div v-if="passwordStore.pagination.totalPages > 1" class="flex items-center justify-center gap-4 mt-6">
      <button class="btn btn-outline btn-sm btn-icon" :disabled="currentPage <= 1" @click="prevPage">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="text-body text-secondary">Page {{ currentPage }} of {{ passwordStore.pagination.totalPages }}</span>
      <button class="btn btn-outline btn-sm btn-icon" :disabled="currentPage >= passwordStore.pagination.totalPages" @click="nextPage">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
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
                  <option v-for="c in allCategories.filter(c => c !== 'General')" :key="c" :value="c">{{ c }}</option>
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

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-card" style="max-width:400px">
        <div class="modal-header">
          <h3>Delete Password</h3>
          <button class="btn-icon btn-ghost" @click="showDeleteModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="text-body text-secondary">
            Are you sure you want to delete <strong style="color:var(--text)">{{ deleteTarget?.site_name }}</strong>? This action cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showDeleteModal = false">Cancel</button>
          <button class="btn" style="background:var(--error);color:#fff" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.password-card {
  cursor: pointer;
  transition: all var(--transition);
}
.password-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.input-icon-wrap {
  position: relative;
}
.input-icon-wrap .input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  display: flex;
}
.input-icon-wrap .form-input {
  padding-left: 38px;
}
</style>
