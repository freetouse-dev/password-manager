import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1a56db',
          secondary: '#f97316',
          accent: '#eab308',
          error: '#ef4444',
          info: '#06b6d4',
          success: '#10b981',
          warning: '#f59e0b',
          surface: '#ffffff',
          background: '#f8fafc',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#3b82f6',
          secondary: '#fb923c',
          accent: '#facc15',
          error: '#ef4444',
          info: '#06b6d4',
          success: '#10b981',
          warning: '#f59e0b',
          surface: '#0f172a',
          background: '#1e293b',
        },
      },
    },
  },
  defaults: {
    VTextField: { variant: 'outlined', density: 'comfortable', hideDetails: 'auto' },
    VSelect: { variant: 'outlined', density: 'comfortable', hideDetails: 'auto' },
    VTextarea: { variant: 'outlined', density: 'comfortable', hideDetails: 'auto' },
    VBtn: { rounded: 'lg' },
    VCard: { rounded: 'lg', elevation: 0 },
    VDialog: { width: 520, persistent: false, scrollable: true },
    VAlert: { variant: 'tonal', density: 'comfortable' },
  },
})
