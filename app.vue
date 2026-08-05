<script setup lang="ts">
import { baseUrl } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";
import MainDialog from "./base/persention/Dialogs/MainDialogs/MainDialog.vue";
import FetchPaymentMethodsParams from "./features/fetch_payment_methods/Core/Params/fetch_payment_methods_params";
import FetchPaymentMethodController from "./features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller";
// import LoaderDialog from "./base/persention/Dialogs/LoaderDialogs/LoaderDialog.vue";
import { getWebDomain } from "~/constant/webDomain";
import Error from "./error.vue";
import LoaderDialog from "./base/persention/Dialogs/LoaderDialogs/LoaderDialog.vue";
import AppThemeToggle from "~/components/Global/AppThemeToggle.vue";

const router = useRouter();
const route = useRoute();
const isHomeV2 = computed(() =>
  ["/home-v2", "/aboutus", "/about-teacher", "/books", "/blogs", "/course", "/app"].includes(route.path) ||
  route.path.startsWith("/books/") ||
  route.path.startsWith("/blog-v2/"),
);
const UserStore = useUserStore();
const { theme, isDark, toggleTheme } = useAppTheme();
const {
  data: webStatus,
  pending,
  error,
} = await useAsyncData("webStatus", async () => {
  const response = await $fetch<{
    data: WebStatus;
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_web_status`, {
    method: "GET",
    headers: {
      "web-domain": getWebDomain(),
    },
  });
  // console.log(error.value, "error");

  // console.log("WebStatus:", getWebDomain());

  return response.data;
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

useHead(() => ({
  htmlAttrs: {
    "data-theme": theme.value,
    style: themeInlineStyle.value,
  },
}));

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


const SettingStore = useSettingStore();
const changeFavicon = (iconPath) => {
  useHead({
    link: [{ rel: "icon", type: "image/x-icon", href: iconPath }],
  });
};
changeFavicon(`${webStatus.value?.image?.img || ''}`);

useSeoMeta({
  title: webStatus.value?.meta_title || webStatus.value?.name,
  description: webStatus.value?.meta_description || webStatus.value?.description,
  keywords: webStatus.value?.meta_keywords || undefined,
  ogTitle: webStatus.value?.meta_title || webStatus.value?.name,
  ogDescription: webStatus.value?.meta_description || webStatus.value?.description,
  ogImage: webStatus.value?.cover?.img || webStatus.value?.image?.img,
});

const PaymentStore = usePaymentStore();
const FetchPaymentMethod = async () => {
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
  // if (UserStore?.user) {

  FetchPaymentMethod();
  // }
});

const UserSettingStore = useSettingStore();
UserSettingStore.setSetting(webStatus.value!);
</script>

<template>
  <div class="coming-soon" v-if="isEduhubDomain">
    <!-- Animated background -->
    <div class="bg-circles">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <!-- Main content -->
    <div class="container">
      <img
        src="https://strategyeducation.techlabeg.com/storage/uploads/eduhub/logo.png"
        alt="EduHUB Logo"
        class="logo"
      />
      <h1>Coming Soon</h1>
      <p>The Future of E-Learning is Here</p>
    </div>
    <a href="tel:+201119342223" class="whatsapp">
      <img
        src="https://strategyeducation.techlabeg.com/storage/uploads/eduhub/whatsapp.png"
        alt="whatsapp"
      />
    </a>
  </div>

  <div v-else>
    <NuxtLayout>
      <MobileNav v-if="!isHomeV2" />
      <ChatBotButton v-if="!isHomeV2" class="chat-bot-button" />
      <SpeedDialToast v-if="!isHomeV2" class="social-icons" />
      <Toast />
      <NuxtPage v-if="!error" />
      <Error v-if="error" />
      <MainDialog v-if="!pending && !isHomeV2" />
      <!-- <LoaderDialog v-if="!pending" /> -->
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
