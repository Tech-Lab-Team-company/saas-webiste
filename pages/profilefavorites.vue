<script setup lang="ts">
definePageMeta({
  name: "profilefavorites",
  middleware: ["verified-student"],
});

useHead({
  title: "المفضلة | مساحة الطالب",
  htmlAttrs: { lang: "ar", dir: "rtl" },
});
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <ProfileFavoriteLibrary />
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>
