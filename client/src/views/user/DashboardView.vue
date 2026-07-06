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
  <v-container fluid class="pa-6">
    <v-row align="center" justify="space-between" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Welcome back, {{ auth.user?.full_name?.split(' ')[0] }}</h1>
        <p class="text-body-2 text-medium-emphasis">Here's an overview of your secure vault</p>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="showAddModal = true">Add Password</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 d-flex align-center ga-4" hover>
          <v-avatar color="primary" size="48" rounded="lg">
            <v-icon color="white" size="24">mdi-lock</v-icon>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-bold">{{ totalPasswords }}</div>
            <div class="text-caption text-medium-emphasis">Total Passwords</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 d-flex align-center ga-4" hover>
          <v-avatar color="secondary" size="48" rounded="lg">
            <v-icon color="white" size="24">mdi-shuffle-variant</v-icon>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-bold">{{ categories.length }}</div>
            <div class="text-caption text-medium-emphasis">Categories</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 d-flex align-center ga-4" hover>
          <v-avatar color="accent" size="48" rounded="lg">
            <v-icon color="white" size="24">mdi-shield-check</v-icon>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-bold">Secure</div>
            <div class="text-caption text-medium-emphasis">Encrypted Storage</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 d-flex align-center ga-4" hover>
          <v-avatar color="success" size="48" rounded="lg">
            <v-icon color="white" size="24">mdi-check-circle</v-icon>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-bold">Active</div>
            <div class="text-caption text-medium-emphasis">Account Status</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">Recent Passwords</span>
            <router-link to="/passwords" class="text-primary text-body-2 text-decoration-none">View All</router-link>
          </v-card-title>
          <v-card-text>
            <v-list v-if="recentPasswords.length" lines="one" density="compact">
              <v-list-item v-for="item in recentPasswords" :key="item.id" @click="router.push(`/passwords/${item.id}`)" rounded="lg" class="mb-1">
                <template #prepend>
                  <v-avatar :color="'primary'" size="40" rounded="lg">
                    <span class="text-white font-weight-bold">{{ item.site_name?.charAt(0)?.toUpperCase() || '?' }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ item.site_name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.site_url || 'No URL' }}</v-list-item-subtitle>
                <template #append>
                  <v-chip size="x-small" color="primary" variant="tonal">{{ item.category }}</v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-empty-state v-else icon="mdi-lock" title="No passwords yet" text="Add your first password to get started" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card>
          <v-card-title class="text-h6">Categories</v-card-title>
          <v-card-text>
            <v-list v-if="categories.length" lines="one" density="compact">
              <v-list-item v-for="cat in categories" :key="cat.category">
                <template #prepend>
                  <v-avatar :color="'primary'" size="12" rounded="circle" class="mr-2" />
                </template>
                <v-list-item-title>{{ cat.category }}</v-list-item-title>
                <template #append>
                  <v-chip size="x-small" variant="tonal">{{ cat.count }}</v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-empty-state v-else icon="mdi-shuffle-variant" title="No categories yet" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
                <v-select v-model="addForm.category" :items="['General', ...categoryList.filter(c => c !== 'General'), { title: '+ Add new category', value: '__new__' }]" label="Category" prepend-inner-icon="mdi-tag" clearable class="mb-3" />
              </template>
              <div v-else class="d-flex ga-2 align-center">
                <v-text-field v-model="newCatName" label="New category name" hide-details density="compact" @keyup.enter="confirmNewCategory" />
                <v-btn color="primary" size="small" @click="confirmNewCategory">Add</v-btn>
                <v-btn variant="tonal" size="small" @click="showNewCat = false; newCatName = ''">Cancel</v-btn>
              </div>
            </div>
            <v-textarea v-model="addForm.notes" label="Notes" prepend-inner-icon="mdi-note-text" rows="3" class="mb-3" />
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
  </v-container>
</template>
