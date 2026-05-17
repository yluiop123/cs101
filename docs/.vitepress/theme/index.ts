import { h, watch } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import { createVuetify, useTheme } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default {
  extends: DefaultTheme,

  Layout: () => {
    const { isDark } = useData()
    const vuetifyTheme = useTheme()
    watch(isDark, (val) => {
      vuetifyTheme.global.name.value = val ? 'dark' : 'light'
    }, { immediate: true })
    return h(DefaultTheme.Layout)
  },

  enhanceApp({ app }: { app: App }) {
    const vuetify = createVuetify({
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              background: '#ffffff',
              surface: '#ffffff',
              'surface-variant': '#f4f6f8',
              primary: '#2563eb',
              'on-surface': '#1e293b',
            },
          },
          dark: {
            dark: true,
            colors: {
              background: '#1e1e20',
              surface: '#27272a',
              'surface-variant': '#2a2a2e',
              primary: '#60a5fa',
              'on-surface': '#e4e4e7',
            },
          },
        },
      },
    })
    app.use(vuetify)
  },
}
