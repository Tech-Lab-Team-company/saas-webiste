<script setup lang="ts">
import { baseUrl } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";
import { getWebDomain } from "~/constant/webDomain";
import AppThemeToggle from "~/components/Global/AppThemeToggle.vue";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const requestUrl = useRequestURL();
const LazyMainDialog = defineAsyncComponent(
  () => import("./base/persention/Dialogs/MainDialogs/MainDialog.vue"),
);

const isCourseDetailsPage = computed(() =>
  /^\/course\/[^/]+\/?$/u.test(route.path),
);
const isCourseExamPage = computed(() =>
  /^\/course\/[^/]+\/(?!timer(?:\/|$))[^/]+\/?$/u.test(route.path),
);
const isHomeV2 = computed(() =>
  [
    "/",
    "/aboutus",
    "/about-teacher",
    "/books",
    "/blogs",
    "/course",
    "/app",
    "/fqs",
    "/privacy",
    "/terms",
  ].includes(route.path) ||
  route.path.startsWith("/books/") ||
  route.path.startsWith("/blogs/") ||
  route.path.startsWith("/blog-v2/") ||
  isCourseDetailsPage.value ||
  isCourseExamPage.value,
);
const { theme, isDark, toggleTheme } = useAppTheme();
const SettingStore = useSettingStore();
const SITE_IMAGE_KEYS = ["image", "cover"] as const;

const imageRespondsSuccessfully = async (url: string): Promise<boolean> => {
  if (!/^https?:\/\//iu.test(url)) return true;

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(2500),
    });

    return response.ok &&
      /^image\//iu.test(response.headers.get("content-type") || "");
  } catch {
    return false;
  }
};

const removeUnavailableSiteImages = async (
  settings: WebStatus,
): Promise<WebStatus> => {
  const checkedImages = await Promise.all(
    SITE_IMAGE_KEYS.map(async (key) => {
      const image = settings[key] as unknown as {
        img?: string;
        alt?: string;
      } | null;
      const source = String(image?.img || "").trim();

      return {
        key,
        available: !source || await imageRespondsSuccessfully(source),
      };
    }),
  );
  const unavailableKeys = checkedImages
    .filter(({ available }) => !available)
    .map(({ key }) => key);

  if (unavailableKeys.length === 0) return settings;

  return unavailableKeys.reduce<WebStatus>(
    (sanitizedSettings, key) => ({
      ...sanitizedSettings,
      [key]: { img: "", alt: "" },
    }),
    settings,
  );
};

const {
  data: webStatus,
  pending,
} = await useAsyncData<WebStatus | null>("webStatus", async () => {
  try {
    const response = await $fetch<{
      data: WebStatus;
      message: string;
      status: number;
    }>(`${baseUrl}/fetch_web_status`, {
      method: "GET",
      headers: {
        "web-domain": getWebDomain() || requestUrl.hostname,
      },
    });
    return response.data
      ? await removeUnavailableSiteImages(response.data)
      : null;
  } catch (requestError) {
    // Site settings enhance branding, but a temporary API failure must never
    // replace an indexable page with the global noindex error document.
    if (import.meta.dev) {
      console.warn("Unable to load web status; using SEO defaults.", requestError);
    }
    return null;
  }
}, {
  default: () => null,
  dedupe: "defer",
});

const normalizeThemeColor = (value: string | null | undefined, fallback: string) =>
  value && /^#[0-9a-f]{3,8}$/iu.test(value.trim()) ? value.trim() : fallback;

const primaryColor = computed(() =>
  normalizeThemeColor(webStatus.value?.primary_color, "#28366c"),
);
const secondaryColor = computed(() =>
  normalizeThemeColor(webStatus.value?.secondary_color, "#3a3e7e"),
);

const themeVariables = computed<Record<string, string>>(() => ({
  "--primary-color": primaryColor.value,
  "--secondary-color": secondaryColor.value,
  "--app-brand-primary": primaryColor.value,
  "--app-brand-secondary": secondaryColor.value,
  "--app-accent": isDark.value
    ? `color-mix(in srgb, ${primaryColor.value} 58%, #9fc2ff)`
    : primaryColor.value,
  "--app-accent-secondary": isDark.value
    ? `color-mix(in srgb, ${secondaryColor.value} 65%, #7183b7)`
    : secondaryColor.value,
  "--app-bg": isDark.value
    ? `color-mix(in srgb, ${primaryColor.value} 6%, #080b12)`
    : "#fbfcff",
  "--app-bg-muted": isDark.value
    ? `color-mix(in srgb, ${secondaryColor.value} 8%, #0d111b)`
    : "#f2f6fc",
  "--app-surface": isDark.value
    ? `color-mix(in srgb, ${primaryColor.value} 10%, #131824)`
    : "#ffffff",
  "--app-surface-raised": isDark.value
    ? `color-mix(in srgb, ${primaryColor.value} 13%, #19202e)`
    : "#ffffff",
  "--app-text": isDark.value ? "#f3f6fc" : "#081b3a",
  "--app-muted": isDark.value ? "#aab6ca" : "#4f617c",
  "--app-line": isDark.value
    ? "rgb(205 220 245 / 16%)"
    : "rgb(8 27 58 / 14%)",
  "--app-shadow": isDark.value
    ? "rgb(0 0 0 / 72%)"
    : "rgb(6 17 71 / 40%)",
  "--app-footer-bg": isDark.value
    ? `color-mix(in srgb, ${secondaryColor.value} 24%, #070a11)`
    : `color-mix(in srgb, ${secondaryColor.value} 82%, #071020)`,
}));

const themeInlineStyle = computed(() =>
  Object.entries(themeVariables.value)
    .map(([property, value]) => `${property}:${value}`)
    .join(";"),
);

watchEffect(() => {
  const activeTheme = theme.value;
  const activeVariables = themeVariables.value;

  if (!import.meta.client) return;

  const documentRoot = document.documentElement;
  documentRoot.dataset.theme = activeTheme;
  Object.entries(activeVariables).forEach(([property, value]) => {
    documentRoot.style.setProperty(property, value);
  });
});

watch(webStatus, (value) => {
  if (value) SettingStore.setSetting(value);
}, {
  immediate: true,
});

const siteOrigin = computed(() => {
  const configuredUrl = String(runtimeConfig.public.siteUrl || "").trim();

  if (configuredUrl) {
    try {
      return new URL(
        configuredUrl.includes("://") ? configuredUrl : `https://${configuredUrl}`,
      ).origin;
    } catch {
      // Fall back to the active request host for multi-tenant deployments.
    }
  }

  return requestUrl.origin;
});

const googleAnalyticsId = computed(() => {
  const value = String(runtimeConfig.public.googleAnalyticsId || "").trim();
  return /^G-[A-Z0-9]+$/u.test(value) ? value : "";
});

const canonicalUrl = computed(() => {
  const normalizedPath = route.path === "/"
    ? "/"
    : route.path.replace(/\/+$/u, "");
  return new URL(normalizedPath, siteOrigin.value).toString();
});

const privateRoutePrefixes = [
  "/auth",
  "/login",
  "/profile",
  "/student-dashboard",
  "/questions",
  "/exams",
  "/passwordupdate",
  "/paymentverify",
];
const isPrivateRoute = computed(() => {
  const path = route.path.toLowerCase();
  return privateRoutePrefixes.some((prefix) => path.startsWith(prefix));
});

const siteTitle = computed(() =>
  webStatus.value?.meta_title || webStatus.value?.name || "منصة تعليمية",
);
const siteDescription = computed(() =>
  webStatus.value?.meta_description ||
  webStatus.value?.description ||
  "منصة تعليمية للكورسات والكتب والمحتوى الدراسي.",
);
const siteImage = computed(() =>
  webStatus.value?.cover?.img || webStatus.value?.image?.img || undefined,
);
const socialProfiles = computed(() => [
  webStatus.value?.facebook,
  webStatus.value?.instagram,
  webStatus.value?.twitter,
  webStatus.value?.linkedin,
  webStatus.value?.youtube,
  webStatus.value?.tikTok,
].filter((url): url is string => Boolean(url && /^https?:\/\//iu.test(url))));
const siteSchema = computed(() => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteOrigin.value}/#organization`,
      name: webStatus.value?.name || siteTitle.value,
      url: `${siteOrigin.value}/`,
      ...(webStatus.value?.image?.img
        ? { logo: webStatus.value.image.img }
        : {}),
      ...(siteDescription.value ? { description: siteDescription.value } : {}),
      ...(socialProfiles.value.length ? { sameAs: socialProfiles.value } : {}),
      ...(webStatus.value?.phone || webStatus.value?.email
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              ...(webStatus.value?.phone
                ? { telephone: webStatus.value.phone }
                : {}),
              ...(webStatus.value?.email
                ? { email: webStatus.value.email }
                : {}),
              contactType: "customer support",
              availableLanguage: ["Arabic"],
            },
          }
        : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin.value}/#website`,
      url: `${siteOrigin.value}/`,
      name: siteTitle.value,
      description: siteDescription.value,
      inLanguage: "ar",
      publisher: { "@id": `${siteOrigin.value}/#organization` },
    },
  ],
}));

useHead(() => ({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
    "data-theme": theme.value,
    style: themeInlineStyle.value,
  },
  link: [
    { rel: "canonical", href: canonicalUrl.value },
    { rel: "preconnect", href: "https://dev.saas.techlabeg.com", crossorigin: "anonymous" },
    { rel: "dns-prefetch", href: "https://dev.saas.techlabeg.com" },
  ],
  script: [
    {
      key: "site-schema",
      type: "application/ld+json",
      innerHTML: JSON.stringify(siteSchema.value).replace(/</gu, "\\u003c"),
    },
    ...(googleAnalyticsId.value
      ? [
          {
            key: "google-analytics-loader",
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId.value}`,
            async: true,
            tagPosition: "bodyClose" as const,
          },
          {
            key: "google-analytics-config",
            innerHTML: [
              "window.dataLayer=window.dataLayer||[];",
              "function gtag(){dataLayer.push(arguments);}",
              "gtag('js',new Date());",
              `gtag('config','${googleAnalyticsId.value}',{anonymize_ip:true});`,
            ].join(""),
            tagPosition: "bodyClose" as const,
          },
        ]
      : []),
  ],
}));

useSeoMeta({
  title: () => siteTitle.value,
  description: () => siteDescription.value,
  keywords: () => webStatus.value?.meta_keywords || undefined,
  robots: () => isPrivateRoute.value
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-image-preview:large",
  ogTitle: () => siteTitle.value,
  ogDescription: () => siteDescription.value,
  ogImage: () => siteImage.value,
  ogUrl: () => canonicalUrl.value,
  ogType: "website",
  ogLocale: "ar_EG",
  twitterCard: "summary_large_image",
  twitterTitle: () => siteTitle.value,
  twitterDescription: () => siteDescription.value,
  twitterImage: () => siteImage.value,
});

const PaymentStore = usePaymentStore();
const fetchPaymentMethod = async () => {
  const [paramsModule, controllerModule] = await Promise.all([
    import("./features/fetch_payment_methods/Core/Params/fetch_payment_methods_params"),
    import("./features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller"),
  ]);
  const FetchPaymentMethodsParams = paramsModule.default;
  const FetchPaymentMethodController = controllerModule.default;
  const paymentMethod = new FetchPaymentMethodsParams(1);
  const fetchPaymentMethodController =
    FetchPaymentMethodController.getInstance();
  const state = await fetchPaymentMethodController.FetchPaymentMthod(
    paymentMethod
  );
  if (state.value.data) {
    PaymentStore.setPayment(state.value.data);
  }
};

onMounted(() => {
  if (!isHomeV2.value) void fetchPaymentMethod();
});
</script>

<template>
  <div>
    <NuxtLayout>
      <LazyMobileNav v-if="!isHomeV2" />
      <LazyChatBotButton v-if="!isHomeV2" class="chat-bot-button" />
      <LazySpeedDialToast v-if="!isHomeV2" class="social-icons" />
      <LazyToast v-if="!isHomeV2" />
      <NuxtPage />
      <LazyMainDialog v-if="!pending && !isHomeV2" />
    </NuxtLayout>
  </div>
  <AppThemeToggle :is-dark="isDark" @toggle="toggleTheme" />
</template>

<style scoped lang="scss">
.chat-bot-button {
  position: absolute;

  @media (max-width: 768px) {
    display: none;
  }
}

.social-icons {
  top: 94%;
  left: 4%;
  z-index: 1000;
  position: fixed;
  cursor: pointer;
}


</style>
