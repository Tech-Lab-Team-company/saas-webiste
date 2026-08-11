<script setup lang="ts">
import ProfileAvailableCourses from "~/components/Profile/ProfileAvailableCourses.vue";

definePageMeta({ middleware: ["verified-student"] });
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <ProfileAvailableCourses />
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>
