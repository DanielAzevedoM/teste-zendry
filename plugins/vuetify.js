import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
 const vuetify = createVuetify({
   components,
   directives,
    // Ao remover a configuração 'icons' daqui,
    // permitimos que o plugin do Vite/Nuxt a gerencie automaticamente.
 })
 nuxtApp.vueApp.use(vuetify)
})