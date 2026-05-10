import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    const vuetify = createVuetify({})
    app.use(vuetify)
  }
}
