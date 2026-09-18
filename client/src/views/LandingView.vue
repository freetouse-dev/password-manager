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
  { icon: 'lock', title: 'Military-Grade Encryption', desc: 'Your passwords are encrypted with AES-128-CBC before they ever leave your device. Even we cannot read them.' },
  { icon: 'key', title: 'Password Generator', desc: 'Generate strong, unique passwords for every site. Complex combinations that hackers cannot crack.' },
  { icon: 'sync', title: 'Cross-Device Sync', desc: 'Access your vault from any device. Your passwords stay synchronized and always available when you need them.' },
  { icon: 'shield', title: 'Zero-Knowledge Architecture', desc: 'We use a zero-knowledge model — your master password unlocks your data locally, never transmitted to our servers.' },
  { icon: 'share', title: 'Secure Sharing', desc: 'Share passwords safely with trusted contacts. Full control over who sees what, with revocable access.' },
  { icon: 'activity', title: 'Activity Monitoring', desc: 'Track every login and password use. Get alerts for suspicious activity and password health reports.' },
]

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="landing">
    <header class="landing-bar" :class="{ scrolled }">
      <div class="container">
        <div class="landing-bar-left">
          <div class="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <span class="logo-text">SecurePasscode</span>
        </div>
        <nav class="landing-nav">
          <button class="nav-btn-text" @click="scrollToSection('features')">Features</button>
          <button class="nav-btn-text" @click="scrollToSection('cta')">Get Started</button>
          <button class="nav-btn-icon" @click="toggle">
            <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
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
        <div class="container hero-content">
          <div class="hero-grid-layout">
            <div class="hero-text-col">
              <div class="hero-badge">
                Trusted by 10,000+ users worldwide
              </div>
              <h1 class="text-h1 hero-title">
                Your Passwords, <span class="gradient-text">Secured</span><br />Your Way
              </h1>
              <p class="hero-subtitle">
                Stop reusing passwords and start protecting your digital life. SecurePasscode stores, generates, and manages your passwords with enterprise-grade encryption.
              </p>
              <div class="flex flex-wrap gap-3 mb-8">
                <button class="btn btn-primary btn-lg" @click="router.push('/register')">
                  Start Free Trial
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <button class="btn btn-outline btn-lg" @click="scrollToSection('features')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  See How It Works
                </button>
              </div>
              <div class="flex gap-8">
                <div>
                  <div class="text-h3 font-bold">99.9%</div>
                  <div class="text-caption text-secondary">Uptime</div>
                </div>
                <div>
                  <div class="text-h3 font-bold">256-bit</div>
                  <div class="text-caption text-secondary">Encryption</div>
                </div>
                <div>
                  <div class="text-h3 font-bold">50K+</div>
                  <div class="text-caption text-secondary">Passwords Stored</div>
                </div>
              </div>
            </div>
            <div class="hero-card-col hide-mobile">
              <div class="hero-card-mock">
                <div class="mock-header">
                  <div class="mock-dots"><span></span><span></span><span></span></div>
                  <div class="mock-lock">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
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
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div class="container py-16">
          <div class="text-center mb-10">
            <span class="chip chip-primary mb-4">Features</span>
            <h2 class="text-h2 mb-2">Everything You Need for <span class="gradient-text">Digital Security</span></h2>
            <p class="text-body text-secondary">Powerful tools to keep your online accounts safe and organized</p>
          </div>
          <div class="grid grid-3">
            <div v-for="feature in features" :key="feature.title" class="card pa-6 feature-card">
              <div class="feature-icon">
                <svg v-if="feature.icon === 'lock'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <svg v-else-if="feature.icon === 'key'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                <svg v-else-if="feature.icon === 'sync'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                <svg v-else-if="feature.icon === 'shield'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <svg v-else-if="feature.icon === 'share'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <svg v-else-if="feature.icon === 'activity'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <h3 class="text-h6 font-bold mb-2">{{ feature.title }}</h3>
              <p class="text-body text-secondary">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="container py-10">
        <div class="card pa-8 stats-bar">
          <div>
            <div class="text-h2 font-bold">10K+</div>
            <div class="text-caption text-secondary">Active Users</div>
          </div>
          <div class="stats-divider"></div>
          <div>
            <div class="text-h2 font-bold">50K+</div>
            <div class="text-caption text-secondary">Passwords Secured</div>
          </div>
          <div class="stats-divider"></div>
          <div>
            <div class="text-h2 font-bold">99.9%</div>
            <div class="text-caption text-secondary">Uptime Guarantee</div>
          </div>
          <div class="stats-divider"></div>
          <div>
            <div class="text-h2 font-bold">4.9★</div>
            <div class="text-caption text-secondary">User Rating</div>
          </div>
        </div>
      </div>

      <section id="cta">
        <div class="container py-16">
          <div class="cta-card">
            <div class="cta-content">
              <h2 class="text-h1 text-white mb-2" style="font-size: 28px">Ready to Secure Your Digital Life?</h2>
              <p class="cta-text">Join thousands of users who trust SecurePasscode to protect their passwords. Start your free account today.</p>
              <div class="flex flex-wrap gap-3">
                <button class="btn btn-lg" style="background:#fff;color:var(--primary);font-weight:700" @click="router.push('/register')">
                  Create Free Account
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <button class="btn btn-lg" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.4)" @click="router.push('/login')">
                  Sign In
                </button>
              </div>
            </div>
            <div class="cta-icon hide-mobile">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="container">
          <div class="footer-inner">
            <div class="flex items-center gap-2">
              <div class="logo-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <span class="font-bold">SecurePasscode</span>
            </div>
            <p class="text-caption text-secondary">Your digital security is our mission. Protect what matters.</p>
            <div class="flex gap-4">
              <a href="#" class="text-caption text-secondary">Privacy Policy</a>
              <a href="#" class="text-caption text-secondary">Terms of Service</a>
              <a href="#" class="text-caption text-secondary">Contact</a>
            </div>
            <div class="footer-divider"></div>
            <p class="text-caption text-muted">&copy; {{ new Date().getFullYear() }} SecurePasscode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.landing {
  overflow-x: hidden;
  min-height: 100vh;
  background: var(--bg);
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
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.landing-bar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.landing-bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
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
.landing-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.landing-nav .nav-btn-text {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.landing-nav .nav-btn-text:hover { background: rgba(0,0,0,0.06); }
html.dark .landing-nav .nav-btn-text:hover { background: rgba(255,255,255,0.08); }
.landing-nav .nav-btn-icon {
  background: none; border: none; cursor: pointer;
  padding: 6px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text); transition: background 0.2s;
}
.landing-nav .nav-btn-icon:hover { background: rgba(0,0,0,0.06); }
html.dark .landing-nav .nav-btn-icon:hover { background: rgba(255,255,255,0.08); }
.landing-nav .nav-btn-outline {
  background: none; border: 1px solid var(--border); cursor: pointer;
  font-size: 13px; font-weight: 500;
  color: var(--text); padding: 6px 16px; border-radius: 8px; transition: all 0.2s;
}
.landing-nav .nav-btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.landing-nav .nav-btn-primary {
  background: var(--primary); border: none; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #fff;
  padding: 6px 16px; border-radius: 8px; transition: opacity 0.2s;
}
.landing-nav .nav-btn-primary:hover { opacity: 0.9; }

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}
.hero-bg {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.hero-shape {
  position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.12;
}
.shape-1 {
  width: 600px; height: 600px; background: #1a56db;
  top: -200px; right: -100px;
  animation: float 8s ease-in-out infinite;
}
.shape-2 {
  width: 400px; height: 400px; background: #f97316;
  bottom: -100px; left: -100px;
  animation: float 6s ease-in-out infinite reverse;
}
.shape-3 {
  width: 300px; height: 300px; background: #eab308;
  top: 40%; left: 10%;
  animation: float 10s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -40px) scale(1.1); }
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px);
  background-size: 40px 40px;
}
.hero-content { position: relative; z-index: 1; }
.hero-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  min-height: calc(100vh - 64px);
}
.hero-text-col {
  padding: 40px 0;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: var(--primary-light);
  border: 1px solid rgba(26, 86, 219, 0.3);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  margin-bottom: 24px;
}
.hero-title {
  margin-bottom: 20px;
}
.hero-subtitle {
  font-size: 17px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 520px;
  margin-bottom: 32px;
}
.hero-card-mock {
  background: var(--bg-card);
  border: 1px solid var(--border);
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
  border-bottom: 1px solid var(--border);
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
}
.mock-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.mock-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0,0,0,0.03);
  border-radius: 8px;
}
html.dark .mock-row { background: rgba(255,255,255,0.05); }
.mock-label { font-size: 13px; font-weight: 600; }
.mock-value { font-size: 13px; opacity: 0.5; letter-spacing: 2px; font-family: monospace; }
.mock-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 12px;
  font-size: 12px; font-weight: 600;
  color: var(--success);
}
.mock-strength { flex: 1; height: 6px; background: rgba(0,0,0,0.06); border-radius: 9999px; overflow: hidden; }
html.dark .mock-strength { background: rgba(255,255,255,0.1); }
.mock-strength-bar { height: 100%; background: linear-gradient(90deg, var(--success), #34d399); border-radius: 9999px; }

.feature-card { transition: all 0.25s ease; cursor: default; }
.feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.feature-icon { margin-bottom: 16px; }

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 24px;
  text-align: center;
}
.stats-divider {
  width: 1px;
  height: 48px;
  background: var(--border);
}
@media (max-width: 640px) {
  .stats-divider { display: none; }
}

.cta-card {
  background: linear-gradient(135deg, var(--primary), #7c3aed);
  padding: 40px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}
.cta-content { flex: 1; min-width: 280px; }
.cta-text {
  font-size: 15px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 24px;
  max-width: 600px;
}
.cta-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.footer {
  padding: 24px;
  border-top: 1px solid var(--border);
  margin-top: 24px;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.footer-divider {
  width: 100%;
  height: 1px;
  background: var(--border);
}

@media (max-width: 959px) {
  .hero-grid-layout {
    grid-template-columns: 1fr;
  }
  .hero-card-col { display: none; }
}
</style>
