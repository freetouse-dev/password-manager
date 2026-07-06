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
  <v-container fluid class="pa-6">
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">My Passwords</h1>
        <p class="text-body-2 text-medium-emphasis">{{ passwordStore.totalPasswords }} passwords stored securely</p>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="showAddModal = true">Add Password</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field v-model="search" label="Search passwords..." prepend-inner-icon="mdi-magnify" hide-details density="compact" @input="onSearch" />
      </v-col>
    </v-row>

    <div class="d-flex flex-wrap ga-2 mb-4">
      <v-chip v-for="cat in allCategories" :key="cat" :color="selectedCategory === cat ? 'primary' : ''" :variant="selectedCategory === cat ? 'flat' : 'outlined'" size="small" filter @click="selectCategory(cat)">
        {{ cat }}
      </v-chip>
      <v-chip v-if="selectedCategory" variant="tonal" color="error" size="small" @click="selectCategory('')">
        Clear
      </v-chip>
    </div>

    <v-row v-if="passwordStore.loading">
      <v-col cols="12" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-else-if="filteredPasswords.length === 0">
      <v-col cols="12" class="text-center pa-10">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-lock</v-icon>
        <h3 class="text-h6 text-medium-emphasis mb-2">No passwords found</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">Add your first password to get started</p>
        <v-btn color="primary" @click="showAddModal = true">Add Password</v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="item in filteredPasswords" :key="item.id" cols="12" sm="6" md="4" lg="3">
        <v-card hover @click="goToDetail(item.id)">
          <v-card-item>
            <template #prepend>
              <v-avatar color="primary" size="44" rounded="lg">
                <span class="text-white font-weight-bold text-h6">{{ item.site_name?.charAt(0)?.toUpperCase() || '?' }}</span>
              </v-avatar>
            </template>
            <template #append>
              <v-btn icon variant="text" size="x-small" color="grey" @click.stop="confirmDelete(item)">
                <v-icon size="small">mdi-delete</v-icon>
              </v-btn>
            </template>
            <v-card-title class="text-body-1 font-weight-bold pa-0">{{ item.site_name }}</v-card-title>
            <v-card-subtitle class="text-caption pa-0">{{ item.site_username }}</v-card-subtitle>
          </v-card-item>
          <v-card-text class="pt-0">
            <v-chip size="x-small" color="primary" variant="tonal">{{ item.category || 'General' }}</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="passwordStore.pagination.totalPages > 1" class="d-flex align-center justify-center ga-4 mt-6">
      <v-btn icon variant="tonal" size="small" :disabled="currentPage <= 1" @click="prevPage">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span class="text-body-2 text-medium-emphasis">Page {{ currentPage }} of {{ passwordStore.pagination.totalPages }}</span>
      <v-btn icon variant="tonal" size="small" :disabled="currentPage >= passwordStore.pagination.totalPages" @click="nextPage">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="showAddModal" max-width="520" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <span class="text-h6">Add New Password</span>
          <v-btn icon variant="text" size="small" @click="showAddModal = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-form @submit.prevent="handleAdd">
            <v-text-field v-model="addForm.siteName" label="Site Name *" prepend-inner-icon="mdi-web" required class="mb-3" />
            <v-text-field v-model="addForm.siteUrl" label="Site URL" prepend-inner-icon="mdi-link" class="mb-3" />
            <v-text-field v-model="addForm.username" label="Username *" prepend-inner-icon="mdi-account" required class="mb-3" />
            <v-text-field v-model="addForm.password" label="Password *" prepend-inner-icon="mdi-key" required class="mb-3" />
            <div class="mb-3">
              <template v-if="!showNewCat">
                <v-select v-model="addForm.category" :items="['General', ...allCategories.filter(c => c !== 'General'), { title: '+ Add new category', value: '__new__' }]" label="Category" prepend-inner-icon="mdi-tag" clearable class="mb-3" />
              </template>
              <div v-else class="d-flex ga-2 align-center">
                <v-text-field v-model="newCatName" label="New category name" hide-details density="compact" @keyup.enter="confirmNewCategory" />
                <v-btn color="primary" size="small" @click="confirmNewCategory">Add</v-btn>
                <v-btn variant="tonal" size="small" @click="showNewCat = false; newCatName = ''">Cancel</v-btn>
              </div>
            </div>
            <v-textarea v-model="addForm.notes" label="Notes" prepend-inner-icon="mdi-note-text" rows="3" />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" @click="showAddModal = false">Cancel</v-btn>
          <v-btn color="primary" :loading="submitting" @click="handleAdd">Save Password</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteModal" max-width="400">
      <v-card>
        <v-card-title class="text-h6 pa-4">Delete Password</v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <p class="text-body-2 text-medium-emphasis mb-2">
            Are you sure you want to delete <strong>{{ deleteTarget?.site_name }}</strong>? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" @click="showDeleteModal = false">Cancel</v-btn>
          <v-btn color="error" @click="handleDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
