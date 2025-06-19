<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "~/stores/user";
import { useRouter } from "vue-router";
import { useSettingStore } from "~/stores/setting";

const isLoggedIn = ref(false);
const userStore = useUserStore()
const router = useRouter();
const { locale } = useI18n()



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

const handleLogout = () => {
  localStorage.removeItem("auth");          
  // localStorage.removeItem("profileImage");
  localStorage.removeItem("user");          
  userStore.logout();                     
  isLoggedIn.value = false; 
  router.push(`/`); // Redirect to the home page after logout

};

const settingStore = useSettingStore();
const droplist = ref(false);



</script>
<template>
  <header class="header">
    <div class="header-nav">
      <p class="header-title">👋 هل تريد معرفة المزيد عنا ! .. دعني اوضح لك</p>
    </div>

    <nav class="header-container">

    <div class="side-menu">

      <IconsBars class="bars-icon" @click="droplist = !droplist" />

      <div v-if="droplist" class="droplist-menu">
        <ul class="list">
          <NuxtLink to="/login" ><li>تسجيل الدخول</li></NuxtLink>
          <hr class="hr" />
          <NuxtLink to="/Auth/register" ><li>إنشاء حساب</li></NuxtLink>
          <hr class="hr" />
          <NuxtLink to="/"><li>الرئيسية</li></NuxtLink>
          <hr class="hr" />
          <NuxtLink to="/aboutus" ><li>نبذة عنا</li></NuxtLink>
          <hr class="hr" />
          <NuxtLink to="/course" ><li>الكورسات</li></NuxtLink>
          <hr class="hr" />
          <NuxtLink to="/blogs" ><li>المدونة</li></NuxtLink>
          
        </ul>
      </div>
    </div>

      <div class="buttons" v-if="!userStore.user">
        <NuxtLink to="/Auth/register">
          <button class="btn btn-primary btn-create">انشاء حساب</button>
        </NuxtLink>
        <NuxtLink to="/login">
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
      <NuxtLink to="/" class="logo">
        <!-- <Logo /> -->
        <!-- setting?.image?.img-->
               <!-- <pre>Image path: {{ settingStore.setting?.image?.img }}</pre> -->

      <NuxtImg
        v-if="settingStore.setting?.image?.img"
        :src="settingStore.setting.image.img"
        :alt="settingStore.setting.image.alt || ''"
        width="75"
        format="webp"
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
    color: #1f41bb;
  }
}

.btn-secondary-create {
  padding: 10px;

  &:hover{
    color: white;
  }
}

.header {
  gap: 0;
  padding: 0;
  margin: 0;
}

li {
  font-family: "bold";
  font-weight: 800;
  font-size: 22px;
}

li:hover {
  color: #ffb949;
  cursor: pointer;
}

.active {
  color: #032855;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 15px;
  text-decoration: none;

  .user-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-name {
    color: #032855;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
