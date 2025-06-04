// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/image', 'nuxt-swiper', '@primevue/nuxt-module', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt' ,'@twicpics/components/nuxt3' ],
  // , '@pinia/nuxt',
  primevue: {
    /* Options */
    options: {
      theme: {
        preset: Aura,
          options: {
            prefix: 'p',
            darkModeSelector: false,
            cssLayer: false
        }
      }
    },
    usePrimeVue: true,
    components: {
      include: ['Button', 'InputText', 'Tag', 'Terminal']
    }
  },
  css: [
    "@/assets/style/main.min.css",
    '@twicpics/components/style.css',
    
    // "@/assets/style/main.css",

  ],
  twicpics: {
    domain: 'https://your-subdomain.twic.pics',
    anticipation: 0.5,
    step: 100,
  }


})



