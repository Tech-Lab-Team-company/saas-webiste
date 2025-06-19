// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/image', 'nuxt-swiper', '@primevue/nuxt-module', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt' ,'@twicpics/components/nuxt3' ,'@nuxtjs/i18n' ],
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
  i18n: {
    locales: [
      {
        code: "ar",
        language: "ar-EG",
        iso: "ar-EG",
        dir: "rtl",
        file: "ar.json",
      },
    ],
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'ar',
      alwaysRedirect: true,
    },
  },
  css: [
    "@/assets/style/main.min.css",
    '@twicpics/components/style.css',
    'swiper/swiper-bundle.css'
  ],
  twicpics: {
    domain: 'https://your-subdomain.twic.pics',
    anticipation: 0.5,
    step: 100,
  }

})



