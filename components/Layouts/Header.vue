<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useUserStore } from "~/stores/user";
import { useRouter } from "vue-router";
import Logo from "~/public/icons/Logo.vue"
const isLoggedIn = ref(false);
const userStore = useUserStore()
const router = useRouter();

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
  router.push("/");

};



const settingStore = useSettingStore();
const setting = computed(() => settingStore.setting);

</script>
<template>
  <header class="header">
    <div class="header-nav">
      <p class="header-title">👋 هل تريد معرفة المزيد عنا ! .. دعني اوضح لك</p>
    </div>

    <nav class="header-container">
      <div class="buttons" v-if="!isLoggedIn">
        <button class="btn btn-primary btn-create">انشاء حساب</button>
        <NuxtLink to="/login">
          <button class="btn btn-secondary btn-secondary-create" @click="handleLogin">
            تسجيل الدخول
          </button>
        </NuxtLink>
      </div>

      <!-- بعد تسجيل الدخول -->
      <div class="buttons" v-else>
        <NuxtLink to="/profile" class="user-info" v-if="userStore.user">
          <img :src="userStore.image || ''" alt="User Image" class="user-avatar" />
          <span class="user-name">{{ userStore.user.name }}</span>
        </NuxtLink>

        <button class="btn btn-secondary btn-secondary-create" @click="handleLogout">
          تسجيل الخروج
        </button>
      </div>

      <!-- روابط التنقل -->
      <ul class="nav-links">
        <NuxtLink to="/blogs" exactActiveClass="active" class="nav-link"><li>المدونه</li></NuxtLink>
        <NuxtLink to="/questions" exactActiveClass="active" class="nav-link"><li>بنك الاسئله</li></NuxtLink>
        <NuxtLink to="/course" exactActiveClass="active" class="nav-link"><li>الكورسات</li></NuxtLink>
        <NuxtLink to="/aboutus" exactActiveClass="active" class="nav-link"><li>نبذه عنا</li></NuxtLink>
        <NuxtLink to="/" exactActiveClass="active" class="nav-link"><li>الرئيسيه</li></NuxtLink>
      </ul>

      <NuxtLink to="/" class="logo">
        <!-- <Logo /> -->
         <!-- {{ console.log(setting , "setting") }}-->
        <!-- setting?.image?.img-->
        <NuxtImg src="https://saas.crazyidea.online/uploads/teachers/299811749565472.jpeg" :alt="setting?.image?.alt" width="75" format="webp" />
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.btn-create {
  padding: 10px;
  color: white;
}

.btn-secondary-create {
  padding: 10px;
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
