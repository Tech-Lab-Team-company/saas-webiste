<script setup lang="ts">
definePageMeta({
  name: "profilecourse",
  middleware: ["verified-student"],
});

useHead({
  title: "مشترياتي | مساحة الطالب",
  htmlAttrs: { lang: "ar", dir: "rtl" },
});
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <ProfileMyCourseContainer />
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>
