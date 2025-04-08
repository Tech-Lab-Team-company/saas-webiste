// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/image', 'nuxt-swiper','@primevue/nuxt-module'],
  primevue: {
    /* Options */
    options: {
        theme: {
            preset: Aura
        }
    },
    usePrimeVue: true,
    components: {
      include: ['Button', 'InputText', 'Tag', 'Terminal'] // List all components you need
    }
  },
  css: [
    "@/assets/style/main.min.css",
    // "@/assets/style/main.css",

  ],
})