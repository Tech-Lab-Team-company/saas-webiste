// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  // app:{
  //   head:{
  //     link:[
  //       { rel: 'icon', type: 'image/x-icon', href: `${useSettingStore().setting?.image?.img}` },
  //     ]
  //   }
  // },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/image', 'nuxt-swiper', '@primevue/nuxt-module', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt' ,'@twicpics/components/nuxt3' ,'@nuxtjs/i18n' ],
  // , '@pinia/nuxt',
  primevue: {
    // useToastService: true,
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
      include: ['Button', 'InputText', 'Tag', 'Terminal' ,'Toast']
    },
  },
  i18n: {
    strategy: 'no_prefix',
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
      // redirectOn: 'root',
      redirectOn: false, // disables root redirect
      fallbackLocale: 'ar',
      alwaysRedirect: false,
    },
  },
  css: [
    'primeicons/primeicons.css',
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



