// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  features: {
    // The public SSR pages have only a few small critical stylesheets. Inlining
    // them removes the document -> CSS request chain that otherwise delays FCP.
    inlineStyles: true,
  },
  experimental: {
    // Use the browser's snapshot-based page transitions when available.
    // Nuxt automatically respects prefers-reduced-motion for this value.
    viewTransition: true,
    defaults: {
      nuxtLink: {
        // Route code is fetched when a visitor shows intent instead of downloading
        // every visible destination during the homepage's critical loading window.
        prefetchOn: {
          visibility: false,
          interaction: true,
        },
      },
    },
  },
  hooks: {
    'build:manifest': (manifest) => {
      // Lazy sections and non-critical layouts stay discoverable by the runtime,
      // but do not compete with the hero through browser-level prefetch hints.
      for (const chunk of Object.values(manifest)) {
        chunk.prefetch = false

        // Nuxt 3.16 emits stylesheet links even when the same SSR styles have
        // already been inlined. Keep the CSS assets for client navigation, but
        // omit those duplicate links from the server dependency manifest.
        if (chunk.css?.length) chunk.css = []
      }
    },
  },
  // Public pages are rendered as HTML for fast first paint and reliable indexing.
  // Account-only screens remain client-rendered through the route rules below.
  ssr: true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ar',
        dir: 'rtl',
      },
    },
  },
  runtimeConfig: {
    public: {
      // Tenant identity sent only as the backend `web-domain` header.
      webLink: process.env.NUXT_PUBLIC_WEB_LINK || process.env.WEB_LINK || '',
      // Preferred public frontend origin for canonical and absolute URLs.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || '',
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
      baseUrl: process.env.BASE_URL || "https://dev.saas.techlabeg.com/api/website",
      dashboardBaseUrl: process.env.DASHBOARD_BASE_URL || "https://dev.saas.techlabeg.com/api/dashboard",
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
      },
    },
    '/': { swr: 300 },
    '/about-teacher': { swr: 3600 },
    '/books': { swr: 300 },
    '/books/**': { swr: 600 },
    '/blogs': { swr: 300 },
    '/blogs/**': { swr: 600 },
    '/blog-v2/**': { swr: 600 },
    '/app': { swr: 3600 },
    '/fqs': { swr: 3600 },
    '/privacy': { swr: 3600 },
    '/terms': { swr: 3600 },
    '/_nuxt/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    '/_ipx/**': {
      headers: {
        'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400',
      },
    },
    '/images/**': {
      headers: {
        'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400',
      },
    },
    '/lottie/**': {
      headers: {
        'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400',
      },
    },
    '/home-v2': {
      redirect: { to: '/', statusCode: 301 },
    },
    '/old-home': {
      redirect: { to: '/', statusCode: 301 },
    },
    '/aboutus': {
      redirect: { to: '/about-teacher', statusCode: 301 },
    },
    '/login': {
      redirect: { to: '/loginhome', statusCode: 302 },
    },
    '/login/loginhome': {
      redirect: { to: '/loginhome', statusCode: 302 },
    },
    '/loginhome': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/Auth/**': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/login/**': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/profile': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/profile/**': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/profilecourse': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/profileavailablecourses': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/profileexams': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/profilesubjectinfo': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/student-dashboard': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/questions': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/exams': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/passwordupdate': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/paymentverify/**': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/course/**': {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'Content-Security-Policy': "frame-ancestors 'none'",
        'Permissions-Policy': 'display-capture=(), picture-in-picture=()',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    },
  },
  modules: ['@nuxt/image', 'nuxt-swiper', '@primevue/nuxt-module', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/i18n'],
  swiper: {
    // Register only Swiper core globally; feature modules stay with the
    // legacy carousel components that actually use them.
    bundled: false,
  },
  // , '@pinia/nuxt',
  primevue: {
    // useToastService: true,
    /* Options */
    options: {
      theme: {
        preset: Aura,
          options: {
            prefix: 'p',
            darkModeSelector: '[data-theme="dark"]',
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
    bundle: {
      optimizeTranslationDirective: false,
    },
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
    "@/assets/css/app-theme.css",
    "@/assets/css/home-v2.css",
  ],
  image: {
    domains: [
      'dev.saas.techlabeg.com',
      'strategyeducation.techlabeg.com',
    ],
  }

})
