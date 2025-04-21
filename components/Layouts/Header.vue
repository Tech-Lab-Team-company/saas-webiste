<script lang="ts" setup>
import Logo from "~/public/icons/Logo.vue";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
const route = useRoute();
const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = localStorage.getItem("auth") === "true";
});

const handleLogin = () => {
  localStorage.setItem("auth", "true");
  isLoggedIn.value = true;
};

const handleLogout = () => {
  localStorage.removeItem("auth");
  isLoggedIn.value = false;
};
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
          <button
            class="btn btn-secondary btn-secondary-create"
            @click="handleLogin"
          >
            تسجيل الدخول
          </button>
        </NuxtLink>
      </div>
      <div class="buttons" v-else>
        <button
          class="btn btn-secondary btn-secondary-create"
          @click="handleLogout"
        >
          تسجيل الخروج
        </button>
      </div>

      <ul class="nav-links">
        <NuxtLink to="/blogs" exactActiveClass="active" class="nav-link">
          <li>المدونه</li>
        </NuxtLink>
        <NuxtLink to="/questions" exactActiveClass="active" class="nav-link">
          <li>بنك الاسئله</li>
        </NuxtLink>
        <NuxtLink to="/course" exactActiveClass="active" class="nav-link">
          <li>الكورسات</li>
        </NuxtLink>
        <NuxtLink to="/aboutus" exactActiveClass="active" class="nav-link">
          <li>نبذه عنا</li>
        </NuxtLink>
        <NuxtLink to="/" exactActiveClass="active" class="nav-link">
          <li>الرئيسيه</li>
        </NuxtLink>
      </ul>

      <NuxtLink to="/" class="logo">
        <Logo />
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
</style>
