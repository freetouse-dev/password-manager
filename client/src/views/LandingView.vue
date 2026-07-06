<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const auth = useAuthStore()
const { isDark, toggle } = useTheme()

const scrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50
  })
})

const features = [
  { icon: 'mdi-lock', title: 'Military-Grade Encryption', desc: 'Your passwords are encrypted with AES-128-CBC before they ever leave your device. Even we cannot read them.' },
  { icon: 'mdi-key', title: 'Password Generator', desc: 'Generate strong, unique passwords for every site. Complex combinations that hackers cannot crack.' },
  { icon: 'mdi-sync', title: 'Cross-Device Sync', desc: 'Access your vault from any device. Your passwords stay synchronized and always available when you need them.' },
  { icon: 'mdi-shield-check', title: 'Zero-Knowledge Architecture', desc: 'We use a zero-knowledge model — your master password unlocks your data locally, never transmitted to our servers.' },
  { icon: 'mdi-share-variant', title: 'Secure Sharing', desc: 'Share passwords safely with trusted contacts. Full control over who sees what, with revocable access.' },
  { icon: 'mdi-chart-line', title: 'Activity Monitoring', desc: 'Track every login and password use. Get alerts for suspicious activity and password health reports.' },
]

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="landing">
    <header class="landing-bar" :class="{ scrolled }">
      <div class="container d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <div class="logo-icon">
            <v-icon color="white" size="18">mdi-lock</v-icon>
          </div>
          <span class="logo-text">SecurePass</span>
        </div>
        <nav class="d-flex align-center ga-3">
          <button class="nav-btn-text" @click="scrollToSection('features')">Features</button>
          <button class="nav-btn-text" @click="scrollToSection('cta')">Get Started</button>
          <button class="nav-btn-icon" @click="toggle">
            <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </button>
          <button class="nav-btn-outline" @click="router.push('/login')">Sign In</button>
          <button class="nav-btn-primary" @click="router.push('/register')">Get Started Free</button>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-bg">
          <div class="hero-shape shape-1"></div>
          <div class="hero-shape shape-2"></div>
          <div class="hero-shape shape-3"></div>
          <div class="hero-grid"></div>
        </div>
        <v-container class="hero-content">
          <v-row align="center">
            <v-col cols="12" md="6">
              <div class="hero-badge">
                Trusted by 10,000+ users worldwide
              </div>
              <h1 class="hero-title">
                Your Passwords, <span class="gradient-text">Secured</span><br />Your Way
              </h1>
              <p class="hero-subtitle">
                Stop reusing passwords and start protecting your digital life. SecurePass stores, generates, and manages your passwords with enterprise-grade encryption.
              </p>
              <div class="d-flex flex-wrap ga-3 mb-8">
                <v-btn color="primary" size="large" @click="router.push('/register')">
                  Start Free Trial
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
                <v-btn variant="outlined" size="large" @click="scrollToSection('features')">
                  <v-icon start>mdi-play</v-icon>
                  See How It Works
                </v-btn>
              </div>
              <div class="d-flex ga-8">
                <div>
                  <div class="text-h5 font-weight-bold">99.9%</div>
                  <div class="text-caption text-medium-emphasis">Uptime</div>
                </div>
                <div>
                  <div class="text-h5 font-weight-bold">256-bit</div>
                  <div class="text-caption text-medium-emphasis">Encryption</div>
                </div>
                <div>
                  <div class="text-h5 font-weight-bold">50K+</div>
                  <div class="text-caption text-medium-emphasis">Passwords Stored</div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="d-none d-md-flex justify-center">
              <div class="hero-card-mock">
                <div class="mock-header">
                  <div class="mock-dots"><span></span><span></span><span></span></div>
                  <div class="mock-lock"><v-icon>mdi-lock</v-icon></div>
                </div>
                <div class="mock-body">
                  <div class="mock-row"><span class="mock-label">GitHub</span><span class="mock-value">••••••••</span></div>
                  <div class="mock-row"><span class="mock-label">Gmail</span><span class="mock-value">••••••••</span></div>
                  <div class="mock-row"><span class="mock-label">AWS</span><span class="mock-value">••••••••</span></div>
                  <div class="mock-row"><span class="mock-label">Netflix</span><span class="mock-value">••••••••</span></div>
                </div>
                <div class="mock-footer">
                  <div class="mock-strength"><div class="mock-strength-bar" style="width: 80%"></div></div>
                  <span>Strong</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section id="features">
        <v-container class="py-16">
          <div class="text-center mb-10">
            <v-chip color="primary" variant="tonal" size="small" class="mb-4">Features</v-chip>
            <h2 class="text-h3 font-weight-bold mb-2">Everything You Need for <span class="gradient-text">Digital Security</span></h2>
            <p class="text-body-1 text-medium-emphasis">Powerful tools to keep your online accounts safe and organized</p>
          </div>
          <v-row>
            <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="4">
              <v-card hover class="pa-6 feature-card">
                <v-icon size="40" color="primary" class="mb-4">mdi-{{ feature.icon }}</v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
                <p class="text-body-2 text-medium-emphasis">{{ feature.desc }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <v-container class="py-10">
        <v-card class="pa-8 text-center d-flex align-center justify-space-around flex-wrap ga-6" variant="outlined" rounded="xl">
          <div>
            <div class="text-h4 font-weight-bold">10K+</div>
            <div class="text-caption text-medium-emphasis">Active Users</div>
          </div>
          <v-divider vertical class="d-none d-sm-block" />
          <div>
            <div class="text-h4 font-weight-bold">50K+</div>
            <div class="text-caption text-medium-emphasis">Passwords Secured</div>
          </div>
          <v-divider vertical class="d-none d-sm-block" />
          <div>
            <div class="text-h4 font-weight-bold">99.9%</div>
            <div class="text-caption text-medium-emphasis">Uptime Guarantee</div>
          </div>
          <v-divider vertical class="d-none d-sm-block" />
          <div>
            <div class="text-h4 font-weight-bold">4.9★</div>
            <div class="text-caption text-medium-emphasis">User Rating</div>
          </div>
        </v-card>
      </v-container>

      <section id="cta">
        <v-container class="py-16">
          <v-card color="primary" class="pa-10 d-flex align-center justify-space-between flex-wrap ga-6" rounded="xl">
            <div class="flex-grow-1" style="max-width: 600px">
              <h2 class="text-h3 font-weight-bold text-white mb-2">Ready to Secure Your Digital Life?</h2>
              <p class="text-body-1 text-white mb-6" style="opacity: 0.8">Join thousands of users who trust SecurePass to protect their passwords. Start your free account today.</p>
              <div class="d-flex flex-wrap ga-3">
                <v-btn color="white" size="large" @click="router.push('/register')">
                  Create Free Account
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
                <v-btn variant="outlined" color="white" size="large" @click="router.push('/login')">
                  Sign In
                </v-btn>
              </div>
            </div>
            <v-avatar size="120" rounded="circle" class="hidden-xs" style="background: rgba(255,255,255,0.1)">
              <v-icon size="60" color="white">mdi-shield-check</v-icon>
            </v-avatar>
          </v-card>
        </v-container>
      </section>

      <v-footer class="pa-6 mt-6" border>
        <v-container class="d-flex flex-column align-center ga-4">
          <div class="d-flex align-center ga-2">
            <v-avatar color="primary" size="28" rounded="lg" style="background: linear-gradient(135deg, #1a56db, #f97316)">
              <v-icon color="white" size="14">mdi-lock</v-icon>
            </v-avatar>
            <span class="font-weight-bold">SecurePass</span>
          </div>
          <p class="text-caption text-medium-emphasis">Your digital security is our mission. Protect what matters.</p>
          <div class="d-flex ga-4">
            <a href="#" class="text-caption text-medium-emphasis text-decoration-none">Privacy Policy</a>
            <a href="#" class="text-caption text-medium-emphasis text-decoration-none">Terms of Service</a>
            <a href="#" class="text-caption text-medium-emphasis text-decoration-none">Contact</a>
          </div>
          <v-divider />
          <p class="text-caption text-medium-emphasis">&copy; {{ new Date().getFullYear() }} SecurePass. All rights reserved.</p>
        </v-container>
      </v-footer>
    </main>
  </div>
</template>

<style scoped>
.landing {
  overflow-x: hidden;
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}
.landing-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  transition: background 0.3s ease, backdrop-filter 0.3s ease;
}
.landing-bar.scrolled {
  background: rgba(var(--v-theme-surface), 0.85) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.3);
}
.landing-bar .container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a56db, #f97316);
}
.logo-text {
  font-weight: 700;
  font-size: 18px;
}
.nav-btn-text {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.8);
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.nav-btn-text:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
}
.nav-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(var(--v-theme-on-surface), 0.8);
  transition: background 0.2s;
}
.nav-btn-icon:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
}
.nav-btn-outline {
  background: none;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.8);
  padding: 6px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}
.nav-btn-outline:hover {
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
}
.nav-btn-primary {
  background: rgb(var(--v-theme-primary));
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  padding: 6px 16px;
  border-radius: 8px;
  transition: opacity 0.2s;
}
.nav-btn-primary:hover {
  opacity: 0.9;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
}
.shape-1 {
  width: 600px; height: 600px;
  background: #1a56db;
  top: -200px; right: -100px;
  animation: float 8s ease-in-out infinite;
}
.shape-2 {
  width: 400px; height: 400px;
  background: #f97316;
  bottom: -100px; left: -100px;
  animation: float 6s ease-in-out infinite reverse;
}
.shape-3 {
  width: 300px; height: 300px;
  background: #eab308;
  top: 40%; left: 10%;
  animation: float 10s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -40px) scale(1.1); }
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px);
  background-size: 40px 40px;
}
.hero-content { position: relative; z-index: 1; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgb(var(--v-theme-primary), 0.1);
  border: 1px solid rgb(var(--v-theme-primary), 0.3);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 24px;
}
.hero-title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -1px;
}
.gradient-text {
  background: linear-gradient(135deg, #1a56db, #f97316, #eab308);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 17px;
  line-height: 1.7;
  color: rgba(var(--v-theme-on-surface), 0.7);
  max-width: 520px;
  margin-bottom: 32px;
}
.hero-card-mock {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 1);
  border-radius: 24px;
  box-shadow: 0 20px 25px rgba(0,0,0,0.1);
  overflow: hidden;
  width: 340px;
  transform: perspective(800px) rotateY(-8deg) rotateX(4deg);
  transition: transform 0.25s ease;
}
.hero-card-mock:hover {
  transform: perspective(800px) rotateY(-4deg) rotateX(2deg);
}
.mock-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mock-dots { display: flex; gap: 6px; }
.mock-dots span { width: 10px; height: 10px; border-radius: 50%; background: #ef4444; }
.mock-dots span:nth-child(2) { background: #f59e0b; }
.mock-dots span:nth-child(3) { background: #10b981; }
.mock-lock {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(26, 86, 219, 0.1);
  border-radius: 8px;
  color: #1a56db;
}
.mock-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.mock-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 8px;
}
.mock-label { font-size: 13px; font-weight: 600; }
.mock-value { font-size: 13px; opacity: 0.5; letter-spacing: 2px; font-family: monospace; }
.mock-footer {
  padding: 12px 20px;
  border-top: 1px solid rgba(var(--v-border-color), 1);
  display: flex; align-items: center; gap: 12px;
  font-size: 12px; font-weight: 600;
  color: #10b981;
}
.mock-strength { flex: 1; height: 6px; background: rgba(var(--v-theme-surface-variant), 0.5); border-radius: 9999px; overflow: hidden; }
.mock-strength-bar { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 9999px; }

.feature-card { transition: all 0.25s ease; }
.feature-card:hover { transform: translateY(-4px); }

@media (max-width: 959px) {
  .hero-card-mock { display: none; }
}
</style>
