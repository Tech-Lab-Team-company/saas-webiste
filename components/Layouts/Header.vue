<script lang="ts" setup>
import Logo from "~/public/icons/Logo.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <header class="header">
    <div class="header-nav">
      <p class="header-title">👋 هل تريد معرفة المزيد عنا ! .. دعني اوضح لك</p>
    </div>

    <nav class="header-container">
      <div class="buttons">
        <button class="btn btn-primary btn-create">انشاء حساب</button>
        <button class="btn btn-secondary btn-secondary-create">
          تسجيل الدخول
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
          <li >الكورسات</li>
        </NuxtLink>
        <NuxtLink to="/aboutus" exactActiveClass="active" class="nav-link">
          <li >نبذه عنا</li>
        </NuxtLink>
        <NuxtLink to="/" exactActiveClass="active" class="nav-link">
          <li >الرئيسيه</li>
        </NuxtLink>
      </ul>

      <NuxtLink to="/"  class="logo">
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
