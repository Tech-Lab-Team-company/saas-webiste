<script setup lang="ts">
import ProfileSidebar from "~/components/Profile/ProfileSidebar.vue";

definePageMeta({
  name: "student-dashboard-course-id",
  layout: "student-dashboard",
  middleware: ["verified-student"],
});

const route = useRoute();
const courseId = computed(() => {
  const rawId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? String(id) : null;
});

const { data: course, pending, refresh } = await useCourseDetailsData(
  courseId,
  "dashboard-course-details",
);

watch(
  () => course.value?.title,
  (title) => {
    useHead({
      title: title ? `${title} | مساحة الطالب` : "تفاصيل الكورس | مساحة الطالب",
    });
  },
  { immediate: true },
);

const refreshCourseDetails = async () => {
  await refresh();
};
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <div class="prfile-home profile-dashboard">
      <ProfileSidebar class="profile-dashboard-sidebar" />

      <div class="profile-dashboard-workspace">
        <header class="profile-dashboard-topbar">
          <nav class="dashboard-course-breadcrumb" aria-label="مسار الصفحة">
            <NuxtLink :to="{ name: 'student-dashboard' }">
              <i class="pi pi-home" aria-hidden="true" />
              الرئيسية
            </NuxtLink>
            <i class="pi pi-chevron-left" aria-hidden="true" />
            <NuxtLink :to="{ name: 'profilecourse' }">مشترياتي</NuxtLink>
            <i class="pi pi-chevron-left" aria-hidden="true" />
            <strong>{{ course?.title || "تفاصيل الكورس" }}</strong>
          </nav>
        </header>

        <main class="profile-dashboard-main dashboard-course-main">
          <CourseDetailsCourseTabs
            dashboard-mode
            :course-data="course || null"
            :pending="pending"
            @refresh="refreshCourseDetails"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>

<style scoped>
.dashboard-course-breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--profile-muted);
  font-size: 11px;
}

.dashboard-course-breadcrumb > a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--profile-muted);
  text-decoration: none;
  transition: color 180ms ease;
}

.dashboard-course-breadcrumb > a:hover,
.dashboard-course-breadcrumb > a:focus-visible {
  color: var(--profile-secondary);
  outline: 0;
}

.dashboard-course-breadcrumb > i {
  font-size: 7px;
  opacity: 0.55;
}

.dashboard-course-breadcrumb > strong {
  overflow: hidden;
  max-width: 320px;
  color: var(--profile-ink);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-course-main {
  width: min(1240px, calc(100% - 48px));
  padding: 22px 0 64px;
}

@media (max-width: 820px) {
  .dashboard-course-main {
    width: min(100% - 28px, 1240px);
    padding-top: 16px;
  }

  .dashboard-course-breadcrumb > strong {
    max-width: 160px;
  }
}
</style>
