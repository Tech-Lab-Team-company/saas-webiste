<script setup lang="ts">
import { useBaseUrls } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";
import { getWebDomain } from "~/constant/webDomain";
import AppThemeToggle from "~/components/Global/AppThemeToggle.vue";
import AppRouteTransition from "~/components/Global/AppRouteTransition.vue";
import { resolveSiteOrigin } from "~/utils/siteUrl";
import { isProtectedLearningPath } from "~/utils/protectedLearningRoute";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const requestUrl = useRequestURL();
const { protectionNotice, protectionNoticeKey } = useAppContentProtection();
const LazyMainDialog = defineAsyncComponent(
  () => import("./base/persention/Dialogs/MainDialogs/MainDialog.vue"),
);

const isCourseDetailsPage = computed(() =>
  /^\/course\/[^/]+\/?$/u.test(route.path),
);
const isCourseExamPage = computed(() =>
  /^\/course\/[^/]+\/(?!timer(?:\/|$))[^/]+\/?$/u.test(route.path),
);
const isProtectedLearningPage = computed(() =>
  isProtectedLearningPath(route.path),
);
const { isProtectedContentBlocked: protectedRouteBlocked } =
  useProtectedLearningGuard(isProtectedLearningPage);
const isProtectedContentBlocked = computed(
  () => isProtectedLearningPage.value && protectedRouteBlocked.value,
);
const isHomeV2 = computed(
  () =>
    [
      "/",
      "/aboutus",
      "/about-teacher",
      "/teachers",
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
    route.path.startsWith("/teachers/") ||
    isCourseDetailsPage.value ||
    isCourseExamPage.value,
);
const hasNavbarThemeToggle = computed(
  () =>
    isHomeV2.value ||
    route.meta.layout === undefined ||
    route.meta.layout === "default",
);
const isAuthPage = computed(() => {
  const path = route.path.toLowerCase();
  return path.startsWith("/auth") || path.startsWith("/login");
});
const { theme, isDark, toggleTheme } = useAppTheme();
const SettingStore = useSettingStore();
const webDomain = getWebDomain();

const getSiteImageSource = (image: unknown): string => {
  if (typeof image === "string") return image.trim();
  if (!image || typeof image !== "object") return "";

  const imageRecord = image as Record<string, unknown>;
  return String(
    imageRecord.img ||
      imageRecord.image ||
      imageRecord.src ||
      imageRecord.url ||
      "",
  ).trim();
};

const { data: webStatus, pending } = await useAsyncData<WebStatus | null>(
  `web-status:${webDomain || "default"}`,
  async () => {
    try {
      const response = await $fetch<{
        data: WebStatus;
        message: string;
        status: boolean | number;
      }>(`${useBaseUrls().baseUrl}/fetch_web_status`, {
        method: "GET",
        headers: {
          "web-domain": webDomain,
        },
      });
      return response.data || null;
    } catch (requestError) {
      // Site settings enhance branding, but a temporary API failure must never
      // replace an indexable page with the global noindex error document.
      if (import.meta.dev) {
        console.warn(
          "Unable to load web status; using SEO defaults.",
          requestError,
        );
      }
      return null;
    }
  },
  {
    default: () => null,
    dedupe: "defer",
  },
);

if (webStatus.value) SettingStore.setSetting(webStatus.value);
else SettingStore.clearSetting();

const normalizeThemeColor = (
  value: string | null | undefined,
  fallback: string,
) =>
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
  "--app-line": isDark.value ? "rgb(205 220 245 / 16%)" : "rgb(8 27 58 / 14%)",
  "--app-shadow": isDark.value ? "rgb(0 0 0 / 72%)" : "rgb(6 17 71 / 40%)",
  "--app-footer-bg": isDark.value
    ? `color-mix(in srgb, ${primaryColor.value} 24%, #070a11)`
    : `color-mix(in srgb, ${primaryColor.value} 82%, #071020)`,
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

const siteOrigin = computed(() =>
  resolveSiteOrigin(
    String(runtimeConfig.public.siteUrl || ""),
    requestUrl.origin,
  ),
);

const faviconHref = computed(() => {
  const source = [
    webStatus.value?.favicon,
    webStatus.value?.image,
    webStatus.value?.cover,
    webStatus.value?.app_image,
  ]
    .map(getSiteImageSource)
    .find(Boolean);

  if (!source) return "/favicon.ico";

  try {
    const resolvedUrl = new URL(source, siteOrigin.value);
    return ["http:", "https:"].includes(resolvedUrl.protocol)
      ? resolvedUrl.toString()
      : "/favicon.ico";
  } catch {
    return "/favicon.ico";
  }
});

const googleAnalyticsId = computed(() => {
  const value = String(runtimeConfig.public.googleAnalyticsId || "").trim();
  return /^G-[A-Z0-9]+$/u.test(value) ? value : "";
});

const canonicalUrl = computed(() => {
  const normalizedPath =
    route.path === "/" ? "/" : route.path.replace(/\/+$/u, "");
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

const normalizeSeoValue = (value: string | null | undefined) =>
  String(value || "")
    .replace(/\s+/gu, " ")
    .trim();

const siteTitle = computed(() => {
  const dashboardTitle = normalizeSeoValue(webStatus.value?.meta_title);
  if (dashboardTitle) return dashboardTitle;

  const fallbackTitle = [
    normalizeSeoValue(webStatus.value?.name),
    normalizeSeoValue(webStatus.value?.description),
  ]
    .filter(Boolean)
    .join(" | ");

  return fallbackTitle || "منصة تعليمية";
});
const siteDescription = computed(
  () =>
    normalizeSeoValue(webStatus.value?.meta_description) ||
    normalizeSeoValue(webStatus.value?.description) ||
    "منصة تعليمية للكورسات والكتب والمحتوى الدراسي.",
);
const siteImage = computed(
  () => webStatus.value?.cover?.img || webStatus.value?.image?.img || undefined,
);
const socialProfiles = computed(() =>
  [
    webStatus.value?.facebook,
    webStatus.value?.instagram,
    webStatus.value?.twitter,
    webStatus.value?.linkedin,
    webStatus.value?.youtube,
    webStatus.value?.tikTok,
  ].filter((url): url is string => Boolean(url && /^https?:\/\//iu.test(url))),
);
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
    { key: "site-favicon", rel: "icon", href: faviconHref.value },
    { key: "canonical", rel: "canonical", href: canonicalUrl.value },
    {
      rel: "preconnect",
      href: "https://dev.saas.techlabeg.com",
      crossorigin: "anonymous",
    },
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
  keywords: () =>
    normalizeSeoValue(webStatus.value?.meta_keywords) || undefined,
  robots: () =>
    isPrivateRoute.value
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
    import(
      "./features/fetch_payment_methods/Core/Params/fetch_payment_methods_params"
    ),
    import(
      "./features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller"
    ),
  ]);
  const FetchPaymentMethodsParams = paramsModule.default;
  const FetchPaymentMethodController = controllerModule.default;
  const paymentMethod = new FetchPaymentMethodsParams(1);
  const fetchPaymentMethodController =
    FetchPaymentMethodController.getInstance();
  const state = await fetchPaymentMethodController.FetchPaymentMthod(
    paymentMethod,
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
    <Transition name="app-protection-notice">
      <div
        v-if="protectionNotice"
        :key="protectionNoticeKey"
        class="app-protection-notice"
        role="status"
        aria-live="polite"
      >
        <span class="app-protection-notice__icon" aria-hidden="true">
          <svg
            class="app-protection-notice__shield"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 3.25 26 7v7.4c0 6.36-3.88 11.45-10 14.35C9.88 25.85 6 20.76 6 14.4V7l10-3.75Z"
              fill="currentColor"
              fill-opacity=".16"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <rect
              x="11.25"
              y="14.25"
              width="9.5"
              height="7.5"
              rx="2.2"
              fill="currentColor"
            />
            <path
              d="M13.4 14.2v-1.45a2.6 2.6 0 1 1 5.2 0v1.45"
              stroke="#12244f"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <circle cx="16" cy="18" r="1.15" fill="#12244f" />
          </svg>
          <span class="app-protection-notice__status-dot" />
        </span>
        <span class="app-protection-notice__content">
          <strong>تنبيه الحماية</strong>
          <span>{{ protectionNotice }}</span>
        </span>
      </div>
    </Transition>
    <AppRouteTransition />
    <NuxtLayout>
      <LazyMobileNav v-if="!isHomeV2" />
      <!-- <LazyChatBotButton v-if="!isHomeV2" class="chat-bot-button" /> -->
      <!-- <LazySpeedDialToast v-if="!isHomeV2" class="social-icons" /> -->
      <LazyToast v-if="!isHomeV2" />
      <div
        class="app-route-view"
        :class="{ 'app-route-view--protected': isProtectedLearningPage }"
      >
        <GlobalDeveloperToolsBlocker v-if="isProtectedContentBlocked" />
        <NuxtPage v-else />
      </div>
      <LazyMainDialog v-if="!pending && !isProtectedContentBlocked" />
    </NuxtLayout>
  </div>
  <AppThemeToggle
    v-if="!hasNavbarThemeToggle"
    :class="{ 'auth-route-theme-toggle': isAuthPage }"
    :is-dark="isDark"
    :icon-only="isAuthPage"
    @toggle="toggleTheme"
  />
</template>

<style scoped lang="scss">
@media print {
  .app-route-view--protected {
    display: none !important;
  }
}

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

.auth-route-theme-toggle {
  top: max(20px, env(safe-area-inset-top));
  bottom: auto;
}

@media (min-width: 821px) {
  .auth-route-theme-toggle {
    left: calc(23.6vw - 140px);
  }
}

.app-protection-notice {
  position: fixed;
  z-index: 10000;
  top: 94px;
  left: 50%;
  display: flex;
  width: max-content;
  min-width: min(390px, calc(100vw - 32px));
  max-width: min(520px, calc(100vw - 32px));
  align-items: center;
  gap: 14px;
  overflow: hidden;
  padding: 15px 20px;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 18px;
  background: radial-gradient(
      circle at 10% 20%,
      rgb(72 117 255 / 25%),
      transparent 34%
    ),
    rgb(9 15 29 / 96%);
  box-shadow: 0 24px 65px rgb(0 0 0 / 34%), 0 0 0 1px rgb(7 17 38 / 20%);
  color: #fff;
  text-align: start;
  backdrop-filter: blur(16px);
  transform: translateX(-50%);
}

.app-protection-notice::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #55a7ff, #7c65ff);
  content: "";
  transform-origin: right center;
  animation: app-protection-progress 2.6s linear forwards;
}

.app-protection-notice__icon {
  position: relative;
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    rgb(70 126 255 / 38%),
    rgb(111 79 255 / 18%)
  );
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 16%);
  color: #a9ceff;
  font-size: 21px;
  animation: app-protection-shield 0.65s 0.15s ease-out;
}

.app-protection-notice__icon::before {
  position: absolute;
  inset: 7px;
  border: 1px solid rgb(156 207 255 / 38%);
  border-radius: 10px;
  content: "";
  animation: app-protection-pulse 1.7s ease-out infinite;
}

.app-protection-notice__shield {
  position: relative;
  z-index: 1;
  width: 30px;
  height: 30px;
  filter: drop-shadow(0 5px 9px rgb(34 108 255 / 38%));
}

.app-protection-notice__status-dot {
  position: absolute;
  z-index: 2;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  border: 3px solid #0d1830;
  border-radius: 50%;
  background: #69e6b1;
  box-shadow: 0 0 12px rgb(105 230 177 / 72%);
}

.app-protection-notice__content {
  display: grid;
  gap: 3px;
  line-height: 1.45;
}

.app-protection-notice__content strong {
  font-size: 15px;
  font-weight: 800;
}

.app-protection-notice__content > span {
  color: rgb(255 255 255 / 72%);
  font-size: 13px;
  font-weight: 600;
}

.app-protection-notice-enter-active,
.app-protection-notice-leave-active {
  transition: opacity 0.24s ease, transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.app-protection-notice-enter-from,
.app-protection-notice-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.94);
}

@keyframes app-protection-progress {
  to {
    transform: scaleX(0);
  }
}

@keyframes app-protection-shield {
  0%,
  100% {
    transform: scale(1) rotate(0);
  }

  45% {
    transform: scale(1.14) rotate(-7deg);
  }

  70% {
    transform: scale(1.06) rotate(5deg);
  }
}

@keyframes app-protection-pulse {
  0% {
    opacity: 0.8;
    transform: scale(0.78);
  }

  75%,
  100% {
    opacity: 0;
    transform: scale(1.42);
  }
}

@media (max-width: 640px) {
  .app-protection-notice {
    top: 76px;
    width: calc(100vw - 28px);
    min-width: 0;
    max-width: 430px;
    gap: 12px;
    padding: 13px 15px;
  }

  .app-protection-notice__icon {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-protection-notice,
  .app-protection-notice::after,
  .app-protection-notice__icon,
  .app-protection-notice__icon::before {
    animation: none;
    transition: none;
  }
}
</style>
