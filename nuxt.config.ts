import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
   devtools: { enabled: false },
  alias: {
    '@': resolve(__dirname, './'),
    '@core': resolve(__dirname, './@core'),
    '@configured-variables': fileURLToPath(new URL('./@core/scss/template/_variables.scss', import.meta.url)),
    '@layouts': fileURLToPath(new URL('./@layouts', import.meta.url)),
    '@images': fileURLToPath(new URL('./assets/images/', import.meta.url)),
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css',
    '@/assets/styles/styles.scss',
    '@/assets/styles/checkout-theme.scss',
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    plugins: [vuetify()]
  },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ]
})