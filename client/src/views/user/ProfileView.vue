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
  <div class="pa-6" style="max-width: 900px; margin: 0 auto">
    <div class="mb-6">
      <h1 class="text-h4 font-bold">Profile Settings</h1>
      <p class="text-body text-secondary">Manage your account details and security</p>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <div class="card pa-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="avatar avatar-md avatar-primary" style="border-radius:12px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h3 class="text-h6 font-bold">Personal Information</h3>
        </div>
        <p class="text-body text-secondary mb-4" style="padding-left: 52px">Update your personal details</p>

        <div v-if="message" class="alert mb-4" :class="message.includes('success') ? 'alert-success' : 'alert-error'">
          <span style="flex:1">{{ message }}</span>
          <button class="alert-close" @click="message = ''">&times;</button>
        </div>

        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input :value="auth.user?.username" class="form-input" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input v-model="profile.fullName" class="form-input" placeholder="Full Name" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="profile.email" class="form-input" type="email" placeholder="Email" />
          </div>
          <div class="form-group">
            <label class="form-label">Role</label>
            <input :value="auth.user?.role" class="form-input" disabled />
          </div>
          <button type="submit" class="btn btn-primary btn-block" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:18px;height:18px;border-width:2px"></span>
            <span v-else>Save Changes</span>
          </button>
        </form>
      </div>

      <div class="card pa-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="avatar avatar-md" style="background:var(--secondary);border-radius:12px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3 class="text-h6 font-bold">Change Password</h3>
        </div>
        <p class="text-body text-secondary mb-4" style="padding-left: 52px">Secure your account with a strong password</p>

        <div v-if="pwdMessage" class="alert mb-4" :class="pwdMessage.includes('success') ? 'alert-success' : 'alert-error'">
          <span style="flex:1">{{ pwdMessage }}</span>
          <button class="alert-close" @click="pwdMessage = ''">&times;</button>
        </div>

        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <div class="input-icon-wrap">
              <input v-model="passwordForm.currentPassword" :type="showCurrentPwd ? 'text' : 'password'" class="form-input" placeholder="Current Password" />
              <button type="button" class="input-suffix" @click="showCurrentPwd = !showCurrentPwd" tabindex="-1">
                <svg v-if="showCurrentPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <div class="input-icon-wrap">
              <input v-model="passwordForm.newPassword" :type="showNewPwd ? 'text' : 'password'" class="form-input" placeholder="New Password" />
              <button type="button" class="input-suffix" @click="showNewPwd = !showNewPwd" tabindex="-1">
                <svg v-if="showNewPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <div class="input-icon-wrap">
              <input v-model="passwordForm.confirmPassword" :type="showConfirmPwd ? 'text' : 'password'" class="form-input" placeholder="Confirm New Password" />
              <button type="button" class="input-suffix" @click="showConfirmPwd = !showConfirmPwd" tabindex="-1">
                <svg v-if="showConfirmPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <button type="submit" class="btn btn-secondary btn-block" :disabled="changing">
            <span v-if="changing" class="spinner" style="width:18px;height:18px;border-width:2px"></span>
            <span v-else>Change Password</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-icon-wrap {
  position: relative;
}
.input-icon-wrap .form-input {
  padding-right: 38px;
}
.input-suffix {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}
.input-suffix:hover { color: var(--text-secondary); }
</style>
