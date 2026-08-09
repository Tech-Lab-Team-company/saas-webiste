<script setup lang="ts">
import ProfileSidebar from "~/components/Profile/ProfileSidebar.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

definePageMeta({ middleware: ["verified-student"] });

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));

useSeoMeta({
  title: () => `بنك الأسئلة${site.value.brandName ? ` | ${site.value.brandName}` : ""}`,
  description: "تدرّب على أسئلة المواد، تابع تقدمك وراجع إجاباتك من مكان واحد.",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <div class="prfile-home profile-dashboard">
      <ProfileSidebar class="profile-dashboard-sidebar" />

      <div class="profile-dashboard-workspace">
        <header class="profile-dashboard-topbar">
          <div class="profile-topbar-copy">
            <strong>مساحة الطالب</strong>
            <span>تدريبك ونتائجك في مكان واحد</span>
          </div>

          <div class="profile-topbar-status" aria-label="حالة بنك الأسئلة">
            <span />
            بنك الأسئلة
          </div>
        </header>

        <main class="profile-dashboard-main questions-dashboard-main">
          <header class="profile-page-heading">
            <span>مساحتك التدريبية</span>
            <h1>بنك الأسئلة</h1>
            <p>ابدأ تدريبك أو كمّل من حيث توقفت، وراجع تقدمك وإجاباتك.</p>
          </header>

          <ExamContainer embedded />
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>
