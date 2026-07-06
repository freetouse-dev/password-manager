import { ref } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function initialize() {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      isDark.value = true
    } else if (stored === 'light') {
      isDark.value = false
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true
    }
    applyTheme()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return {
    isDark,
    initialize,
    toggle,
  }
}
