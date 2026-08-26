<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "~/stores/user";
import { useRouter } from "vue-router";
import { useSettingStore } from "~/stores/setting";
import AppThemeToggle from "~/components/Global/AppThemeToggle.vue";
import { markUserOffline } from "~/utils/onlineStatusTracking";

const isLoggedIn = ref(false);
const userStore = useUserStore()
const router = useRouter();
// const { locale } = useI18n()



onMounted(() => {
  isLoggedIn.value = localStorage.getItem("auth") === "true";
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    userStore.setUser(JSON.parse(storedUser));
  }
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    userStore.setImage(savedImage);
  }
});
const handleLogin = () => {
  localStorage.setItem("auth", "true");
  isLoggedIn.value = true;
};

const handleLogout = async () => {
  try {
    await markUserOffline();
  } finally {
    userStore.logout();
    isLoggedIn.value = false;
    await router.push(`/`);
  }
};

const settingStore = useSettingStore();
const { isDark, toggleTheme } = useAppTheme();
const droplist = ref(false);
const logoLoadFailed = ref(false);

const headerLogo = computed(() => {
  if (logoLoadFailed.value) return "/favicon.ico";
  return settingStore.setting?.image?.img?.trim() || "/favicon.ico";
});

watch(
  () => settingStore.setting?.image?.img,
  () => {
    logoLoadFailed.value = false;
  },
);



</script>
<template>
  <header class="header">
    <div class="header-nav">
      <a :href="`https://wa.me/${settingStore.setting?.whatsapp}`" class="header-title">👋 هل تريد معرفة المزيد عنا ! .. دعني اوضح لك</a>
    </div>

    <nav class="header-container">
      <AppThemeToggle
        class="header-theme-toggle"
        :is-dark="isDark"
        inline
        icon-only
        @toggle="toggleTheme"
      />
      
      <div class="buttons" v-if="!userStore.user">
        <NuxtLink to="/Auth/register">
          <button class="btn btn-primary btn-create">انشاء حساب</button>
        </NuxtLink>
        <NuxtLink to="/loginhome">
          <button class="btn btn-secondary btn-secondary-create" @click="handleLogin">
            تسجيل الدخول
          </button>
        </NuxtLink>
      </div>

      <!-- بعد تسجيل الدخول -->
      <div class="buttons" v-else>
        <NuxtLink to="/profile" class="user-info" v-if="userStore.user">
          <img v-if="userStore.image" :src="userStore.image || ''" alt="User Image" class="user-avatar" />
          <img v-else src="../../public/images/user.png" alt="User Image" class="user-avatar" />
          <span class="user-name">{{ userStore.user.name }}</span>
        </NuxtLink>

        <button class="btn btn-secondary btn-secondary-create" @click="handleLogout">
          تسجيل الخروج
        </button>
      </div>

      <!-- روابط التنقل -->
      <ul class="nav-links">

        <NuxtLink to="/blogs" exactActiveClass="active" class="nav-link"><li>المدونه</li></NuxtLink>
        <!-- <NuxtLink to="/questions" exactActiveClass="active" class="nav-link"><li>بنك الاسئله</li></NuxtLink> -->
        <NuxtLink to="/course" exactActiveClass="active" class="nav-link"><li>الكورسات</li></NuxtLink>
        <NuxtLink to="/aboutus" exactActiveClass="active" class="nav-link"><li>نبذه عنا</li></NuxtLink>
        <NuxtLink to="/" exactActiveClass="active" class="nav-link"><li>الرئيسيه</li></NuxtLink>
      </ul>
      <NuxtLink to="/" class="logo" aria-label="الصفحة الرئيسية">
        <img
          :src="headerLogo"
          :alt="settingStore.setting?.image?.alt || settingStore.setting?.name || 'شعار الموقع'"
          class="header-logo-image"
          width="163"
          height="52"
          @error="logoLoadFailed = true"
        />
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.btn-create {
  padding: 10px;
  color: white;
  &:hover{
    color: var(--primary-color);
  }
}

.btn-secondary-create {
  padding: 10px;

  &:hover{
    color: white;
  }
  @media (max-width:768px) {
      // display: none !important;
  }
}

.header {
  gap: 0;
  padding: 0;
  margin: 0;
}

.header-theme-toggle {
  flex: 0 0 42px;
}

.logo {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 75px;
  min-height: 52px;
}

.header-logo-image {
  display: block;
  width: auto;
  max-width: 163px;
  height: 52px;
  object-fit: contain;
}

li {
  font-family: "bold",serif;
  font-weight: 800;
  font-size: 22px;
}

li:hover {
  color: var(--primary-color);
  cursor: pointer;
}

.active {
  color: var(--primary-color);
}

.user-info {
  display: flex;
  // flex-wrap: wrap;
  
  align-items: center;
  gap: 10px;
  margin-left: 15px;
  text-decoration: none;
  @media (max-width:768px) {
      flex-direction: column;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-name {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
