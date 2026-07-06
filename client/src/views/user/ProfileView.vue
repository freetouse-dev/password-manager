<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { userApi } from '../../api/user'

const auth = useAuthStore()

const profile = ref({ fullName: '', email: '' })
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const saving = ref(false)
const changing = ref(false)
const message = ref('')
const pwdMessage = ref('')
const showCurrentPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)

onMounted(() => {
  profile.value.fullName = auth.user?.full_name || ''
  profile.value.email = auth.user?.email || ''
})

async function updateProfile() {
  saving.value = true
  message.value = ''
  try {
    const { data } = await userApi.updateProfile(profile.value)
    auth.setUser(data.data)
    message.value = 'Profile updated successfully!'
  } catch (err) {
    message.value = err.response?.data?.message || 'Update failed'
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    pwdMessage.value = 'Passwords do not match'
    return
  }
  changing.value = true
  pwdMessage.value = ''
  try {
    await userApi.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })
    pwdMessage.value = 'Password changed successfully!'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err) {
    pwdMessage.value = err.response?.data?.message || 'Failed to change password'
  } finally {
    changing.value = false
  }
}
</script>

<template>
  <v-container fluid class="pa-6" style="max-width: 900px">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Profile Settings</h1>
      <p class="text-body-2 text-medium-emphasis">Manage your account details and security</p>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar color="primary" size="40" rounded="lg">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold">Personal Information</h3>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4" style="padding-left: 52px">Update your personal details</p>

          <v-alert v-if="message" :type="message.includes('success') ? 'success' : 'error'" variant="tonal" closable density="compact" class="mb-4" @click:close="message = ''">
            {{ message }}
          </v-alert>

          <v-form @submit.prevent="updateProfile">
            <v-text-field :model-value="auth.user?.username" label="Username" prepend-inner-icon="mdi-account" disabled class="mb-3" />
            <v-text-field v-model="profile.fullName" label="Full Name" prepend-inner-icon="mdi-account-badge" class="mb-3" />
            <v-text-field v-model="profile.email" label="Email" prepend-inner-icon="mdi-email" type="email" class="mb-3" />
            <v-text-field :model-value="auth.user?.role" label="Role" prepend-inner-icon="mdi-shield-account" disabled class="mb-4" />
            <v-btn type="submit" color="primary" block :loading="saving">Save Changes</v-btn>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar color="secondary" size="40" rounded="lg">
              <v-icon color="white">mdi-lock</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold">Change Password</h3>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4" style="padding-left: 52px">Secure your account with a strong password</p>

          <v-alert v-if="pwdMessage" :type="pwdMessage.includes('success') ? 'success' : 'error'" variant="tonal" closable density="compact" class="mb-4" @click:close="pwdMessage = ''">
            {{ pwdMessage }}
          </v-alert>

          <v-form @submit.prevent="changePassword">
            <v-text-field v-model="passwordForm.currentPassword" label="Current Password" prepend-inner-icon="mdi-lock" :append-inner-icon="showCurrentPwd ? 'mdi-eye-off' : 'mdi-eye'" :type="showCurrentPwd ? 'text' : 'password'" @click:append-inner="showCurrentPwd = !showCurrentPwd" class="mb-3" />
            <v-text-field v-model="passwordForm.newPassword" label="New Password" prepend-inner-icon="mdi-lock-plus" :append-inner-icon="showNewPwd ? 'mdi-eye-off' : 'mdi-eye'" :type="showNewPwd ? 'text' : 'password'" @click:append-inner="showNewPwd = !showNewPwd" class="mb-3" />
            <v-text-field v-model="passwordForm.confirmPassword" label="Confirm New Password" prepend-inner-icon="mdi-lock-check" :append-inner-icon="showConfirmPwd ? 'mdi-eye-off' : 'mdi-eye'" :type="showConfirmPwd ? 'text' : 'password'" @click:append-inner="showConfirmPwd = !showConfirmPwd" class="mb-4" />
            <v-btn type="submit" color="secondary" block :loading="changing">Change Password</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
