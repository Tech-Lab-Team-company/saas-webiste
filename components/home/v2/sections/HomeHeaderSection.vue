<script setup lang="ts">
import type { HomeSiteViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import AppThemeToggle from "~/components/Global/AppThemeToggle.vue";
import { getDescriptiveImageAlt } from "~/utils/imageAlt";

const props = defineProps<{
  site: HomeSiteViewModel;
}>();

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { isDark, toggleTheme } = useAppTheme();
const isHydrated = ref(false);

const userImage = computed(
  () => userStore.image || userStore.user?.image || "/images/user.png",
);

const handleUserImageError = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement;
  if (!image.src.endsWith("/images/user.png")) {
    image.src = "/images/user.png";
  }
};

const handleLogout = async () => {
  if (import.meta.client) {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  }

  userStore.logout();
  await router.push("/");
};

const headerDescription = computed(() => {
  const description = (props.site.description || "")
    .replace(/\s+/g, " ")
    .trim();
  const limit = 64;

  return description.length > limit
    ? `${description.slice(0, limit).trimEnd()}…`
    : description;
});

const navItems = computed(() => [
  ...(route.path === "/" ? [] : [{ label: "الرئيسية", to: "/" }]),
  { label: "الكورسات", to: "/course" },
  ...(props.site.isGeneral ? [{ label: "المدرسون", to: "/teachers" }] : []),
  { label: "الكتب", to: "/books" },
  {
    label: props.site.isGeneral
      ? props.site.brandName
        ? `عن ${props.site.brandName}`
        : "عن المنصة"
      : props.site.brandName
        ? `عن ${props.site.brandName}`
        : "عن المدرس",
    to: "/about-teacher",
  },
  { label: "المدونة", to: "/blogs" },
  { label: "التطبيق", to: "/app" },
]);

const isScrolled = ref(false);
let headerFrame: number | null = null;

const updateHeaderState = () => {
  isScrolled.value = window.scrollY > 18;
};

const queueHeaderStateUpdate = () => {
  if (headerFrame !== null) return;

  headerFrame = window.requestAnimationFrame(() => {
    updateHeaderState();
    headerFrame = null;
  });
};

onMounted(() => {
  isHydrated.value = true;
  queueHeaderStateUpdate();
  window.addEventListener("scroll", queueHeaderStateUpdate, {
    passive: true,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", queueHeaderStateUpdate);

  if (headerFrame !== null) {
    window.cancelAnimationFrame(headerFrame);
  }
});
</script>

<template>
  <header
    :class="['home-v2-header', { 'home-v2-header--scrolled': isScrolled }]"
  >
    <div class="container home-v2-header__content">
      <NuxtLink
        to="/"
        prefetch-on="interaction"
        class="home-v2-header__brand"
        :aria-label="`العودة إلى صفحة ${site.brandName || 'المنصة'}`"
      >
        <span
          :class="[
            'home-v2-header__logo',
            { 'home-v2-header__logo--empty': !site.logo },
          ]"
        >
          <img
            v-if="site.logo"
            :src="site.logo.src"
            :alt="
              getDescriptiveImageAlt(
                site.logo?.alt,
                `شعار ${site.brandName || 'المنصة التعليمية'}`,
              )
            "
            width="163"
            height="52"
            loading="eager"
          />
          <span v-else aria-hidden="true">+</span>
        </span>
        <span>
          <b :class="{ 'home-v2-header__brand-empty': !site.brandName }">
            {{ site.brandName || "أضف اسم المنصة" }}
          </b>
          <small
            v-if="headerDescription"
            :title="site.description || undefined"
            >{{ headerDescription }}</small
          >
        </span>
      </NuxtLink>

      <nav
        id="home-v2-primary-navigation"
        class="home-v2-header__nav"
        aria-label="التنقل الرئيسي"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          prefetch-on="interaction"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div
        :class="[
          'home-v2-header__actions',
          { 'home-v2-header__actions--student': isHydrated && userStore.user },
        ]"
      >
        <AppThemeToggle
          :is-dark="isDark"
          inline
          icon-only
          @toggle="toggleTheme"
        />

        <template v-if="!isHydrated || !userStore.user">
          <NuxtLink
            to="/loginhome"
            prefetch-on="interaction"
            class="home-v2-header__login"
          >
            دخول الطالب
          </NuxtLink>
          <NuxtLink to="/Auth/register" prefetch-on="interaction" class="button"
            >إنشاء حساب <span aria-hidden="true">←</span></NuxtLink
          >
        </template>

        <template v-else>
          <NuxtLink
            to="/profile"
            prefetch-on="interaction"
            class="home-v2-header__student"
            aria-label="الذهاب إلى الملف الشخصي"
          >
            <img
              :src="userImage"
              width="38"
              height="38"
              :alt="
                userStore.user.name
                  ? `صورة الطالب ${userStore.user.name}`
                  : 'صورة الملف الشخصي للطالب'
              "
              @error="handleUserImageError"
            />
            <span>
              <small>مساحة الطالب</small>
              <b>{{ userStore.user.name }}</b>
            </span>
          </NuxtLink>
          <button
            type="button"
            class="home-v2-header__logout"
            @click="handleLogout"
          >
            تسجيل الخروج
          </button>
        </template>
      </div>
    </div>
    <nav
      class="home-v2-header__mobile-nav"
      aria-label="التنقل الرئيسي للموبايل"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="`mobile-${item.to}`"
        :to="item.to"
        prefetch-on="interaction"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
    <span class="home-v2-header__progress-track" aria-hidden="true">
      <span class="home-v2-header__progress-value" />
    </span>
  </header>
</template>

<style scoped>
.home-v2-header {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 100;
  background: rgb(251 252 255 / 92%);
  border-bottom: 1px solid var(--home-v2-line);
  box-shadow: 0 4px 20px rgb(10 24 70 / 5%);
  backdrop-filter: blur(14px);
  color: var(--home-v2-ink);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.home-v2-header--scrolled {
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 12px 38px rgb(8 27 58 / 12%);
}

.home-v2-header__content,
.home-v2-header__brand,
.home-v2-header__nav,
.home-v2-header__actions {
  display: flex;
  align-items: center;
}

.home-v2-header__actions--student {
  gap: 10px;
}

.home-v2-header__student {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
  padding: 4px 7px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.home-v2-header__student:hover {
  background: var(--home-v2-blue-light);
}

.home-v2-header__student img {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #eef1f7;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--home-v2-blue) 20%, transparent);
  object-fit: cover;
}

.home-v2-header__student > span {
  display: grid;
  max-width: 105px;
  gap: 2px;
}

.home-v2-header__student small {
  color: var(--home-v2-muted);
  font-size: 9px;
  font-weight: 700;
}

.home-v2-header__student b {
  overflow: hidden;
  color: var(--home-v2-ink);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-v2-header__logout {
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--home-v2-blue);
  border-radius: 9px;
  background: #fff;
  color: var(--home-v2-blue);
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 900;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.home-v2-header__logout:hover {
  background: var(--home-v2-blue);
  color: #fff;
  transform: translateY(-1px);
}

.home-v2-header__content {
  position: relative;
  min-height: 86px;
  gap: clamp(16px, 2vw, 30px);
  transition: min-height 0.25s ease;
  justify-content: space-between;
}

.home-v2-header--scrolled .home-v2-header__content {
  min-height: 72px;
}

.home-v2-header__mobile-nav {
  display: none;
}

.home-v2-header__brand {
  min-width: 210px;
  gap: 12px;
}

.home-v2-header__logo {
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 22%, transparent);
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 6px 18px rgb(8 27 58 / 12%);
  transition: transform 0.2s ease;
}

.home-v2-header__brand:hover .home-v2-header__logo {
  transform: translateY(-1px);
}

.home-v2-header__logo :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.home-v2-header__logo--empty {
  border: 1px dashed color-mix(in srgb, var(--home-v2-blue) 48%, transparent);
  background: var(--home-v2-blue-light);
  box-shadow: none;
  color: var(--home-v2-blue);
  font: 300 27px/1 var(--home-v2-heading);
}

.home-v2-header__progress-track {
  display: none;
}

@supports (animation-timeline: scroll()) {
  .home-v2-header__progress-track {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    display: block;
    height: 6px;
    overflow: hidden;
    background: color-mix(in srgb, var(--home-v2-blue) 12%, transparent);
    pointer-events: none;
  }

  .home-v2-header__progress-value {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 999px 0 0 999px;
    animation: home-v2-header-reading-progress auto linear;
    animation-timeline: scroll(root block);
    background: var(--home-v2-blue);
    box-shadow: 0 0 12px
      color-mix(in srgb, var(--home-v2-blue) 55%, transparent);
    transform-origin: right center;
    will-change: transform;
  }
}

@keyframes home-v2-header-reading-progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

.home-v2-header__brand > span:last-child {
  display: grid;
  min-width: 0;
  max-width: 220px;
  gap: 5px;
}

.home-v2-header__brand b {
  overflow: hidden;
  color: var(--home-v2-ink);
  font: 900 17px/1.15 var(--home-v2-heading);
  letter-spacing: -0.015em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-v2-header__brand-empty {
  color: var(--home-v2-blue) !important;
  font-size: 13px !important;
}

.home-v2-header__brand small {
  display: -webkit-box;
  overflow: hidden;
  color: var(--home-v2-muted);
  font-size: 10.5px;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-v2-header__nav {
  gap: 3px;
  margin-inline: auto;
  padding: 5px;
  /* border: 1px solid color-mix(in srgb, var(--home-v2-blue) 9%, transparent); */
  /* border-radius: 999px; */
  /* background: color-mix(in srgb, var(--home-v2-blue) 4%, white); */
  font-size: 14px;
  font-weight: 700;
}

.home-v2-header__nav a,
.home-v2-header__nav .home-v2-nav-disabled {
  position: relative;
  padding: 8px 13px;
  border-radius: 999px;
  color: var(--home-v2-blue);
  line-height: 1.2;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.home-v2-header__nav a:hover,
.home-v2-header__login:hover {
  color: var(--home-v2-blue);
}

.home-v2-header__nav a:hover,
.home-v2-header__nav a.router-link-active {
  background: var(--home-v2-blue-light);
  color: var(--home-v2-blue);
  box-shadow: 0 3px 12px rgb(8 27 58 / 8%);
}

.home-v2-header__actions {
  gap: 14px;
  white-space: nowrap;
}

.home-v2-header__login {
  position: relative;
  padding: 8px 2px;
  font-size: 14px;
  font-weight: 800;
  transition: color 0.2s ease;
}

.home-v2-header__login::after {
  position: absolute;
  right: 0;
  bottom: 3px;
  left: 0;
  height: 2px;
  border-radius: 99px;
  background: var(--home-v2-blue);
  content: "";
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.home-v2-header__login:hover::after {
  transform: scaleX(1);
}

.home-v2-header .button {
  min-height: 46px;
  padding-inline: 20px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 78%, white);
  border-radius: 12px;
  box-shadow: 0 9px 22px
    color-mix(in srgb, var(--home-v2-blue) 22%, transparent);
}

.home-v2-header .button span {
  transition: transform 0.2s ease;
}

.home-v2-header .button:hover span {
  transform: translateX(-3px);
}

@media (max-width: 980px) {
  .home-v2-header__nav {
    display: none;
  }

  .home-v2-header__mobile-nav {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: stretch;
    gap: 3px;
    overflow: hidden;
    padding: 6px max(8px, calc((100vw - 1180px) / 2));
    border-top: 1px solid var(--home-v2-line);
    background: color-mix(in srgb, var(--home-v2-surface) 94%, transparent);
  }

  .home-v2-header__mobile-nav a {
    display: flex;
    min-height: 44px;
    min-width: 0;
    flex: 1 1 0;
    align-items: center;
    justify-content: center;
    padding: 5px 3px;
    border-radius: 999px;
    color: var(--home-v2-blue);
    font-size: clamp(11px, 2.9vw, 14px);
    font-weight: 800;
    line-height: 1.25;
    text-align: center;
  }

  .home-v2-header__mobile-nav a:hover,
  .home-v2-header__mobile-nav a.router-link-active {
    background: color-mix(
      in srgb,
      var(--home-v2-blue) 16%,
      var(--home-v2-surface)
    );
    color: var(--home-v2-blue);
  }
}

@media (max-width: 590px) {
  .home-v2-header__content {
    min-height: 68px;
    gap: 8px;
  }

  .home-v2-header__brand {
    min-width: 0;
  }

  .home-v2-header__logo {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
  }

  .home-v2-header__brand > span:last-child {
    max-width: 130px;
  }

  .home-v2-header__brand b {
    font-size: 15px;
  }

  .home-v2-header__brand small {
    display: none;
  }

  .home-v2-header__actions {
    gap: 5px;
    margin-inline-start: auto;
  }

  .home-v2-header__login {
    display: inline-flex;
    min-height: 34px;
    align-items: center;
    justify-content: center;
    padding-inline: 8px;
    border: 1px solid var(--home-v2-blue);
    border-radius: 8px;
    color: var(--home-v2-blue);
    font-size: 10px;
  }

  .home-v2-header__login::after {
    display: none;
  }

  .home-v2-header .button {
    min-height: 34px;
    padding-inline: 9px;
    border-radius: 8px;
    font-size: 10px;
  }

  .home-v2-header__actions--student {
    gap: 5px;
  }

  .home-v2-header__student > span {
    display: none;
  }

  .home-v2-header__logout {
    padding-inline: 9px;
    font-size: 10px;
  }
}

@media (max-width: 470px) {
  .home-v2-header__brand > span:last-child {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-header,
  .home-v2-header__content,
  .home-v2-header__logo,
  .home-v2-header__nav a,
  .home-v2-header__login::after,
  .home-v2-header .button span {
    transition: none;
  }

  .home-v2-header__student,
  .home-v2-header__logout {
    transition: none;
  }
}
</style>
