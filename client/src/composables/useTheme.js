import { computed } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'

export function useTheme() {
  const vuetifyTheme = useVuetifyTheme()

  const isDark = computed(() => vuetifyTheme.global.current.value.dark)

  function initialize() {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      vuetifyTheme.global.name.value = 'dark'
    } else if (stored === 'light') {
      vuetifyTheme.global.name.value = 'light'
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      vuetifyTheme.global.name.value = 'dark'
    }
  }

  function toggle() {
    const newTheme = vuetifyTheme.global.name.value === 'dark' ? 'light' : 'dark'
    vuetifyTheme.global.name.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  return {
    isDark,
    initialize,
    toggle,
  }
}
