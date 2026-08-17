<script setup lang="ts">
import HomeCourseCard from "~/components/home/v2/HomeCourseCard.vue";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapHomeCoursePage,
  mapHomeCourseSubjectIds,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeCourseViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

const userStore = useUserStore();
const userInfo = computed(() => userStore.user?.userInfo);
const stageId = computed(() => Number(userInfo.value?.stage_id));
const yearId = computed(() => Number(userInfo.value?.year_id));
const educationLabel = computed(() =>
  userInfo.value?.year_title ||
  userInfo.value?.stage_title ||
  "مرحلتك الدراسية",
);

const api = new HomePageApi(getWebDomain());
const requestKey =
  `profile-available-courses:${userStore.user?.id ?? "guest"}:${stageId.value}:${yearId.value}`;

const { data: courses, pending, error, refresh } = await useAsyncData<HomeCourseViewModel[]>(
  requestKey,
  async () => {
    if (!Number.isFinite(stageId.value) || !Number.isFinite(yearId.value)) {
      throw new Error("بيانات المرحلة الدراسية غير مكتملة");
    }

    const [coursesResponse, subjectsResponse] = await Promise.all([
      api.fetchCoursesByYear(stageId.value, yearId.value, 1, 100),
      api.fetchSubjectsByYear(yearId.value),
    ]);
    const subjectIds = mapHomeCourseSubjectIds(subjectsResponse);

    return mapHomeCoursePage(coursesResponse, 1, 100, subjectIds).courses;
  },
  { default: () => [] },
);
</script>

<template>
  <div class="prfile-home profile-dashboard">
    <ProfileSidebar class="profile-dashboard-sidebar" />

    <div class="profile-dashboard-workspace">
      <header class="profile-dashboard-topbar">
        <div class="profile-topbar-copy">
          <strong>مساحة الطالب</strong>
          <span>الكورسات المناسبة لبياناتك الدراسية</span>
        </div>
        <div class="profile-topbar-status"><span />الكورسات</div>
      </header>

      <main class="profile-dashboard-main">
        <header class="profile-page-heading available-heading">
          <div>
            <span>{{ educationLabel }}</span>
            <h1>كورسات {{ educationLabel }}</h1>
            <p>نعرض لك هنا الكورسات المرتبطة بمرحلتك وسنتك المسجلتين في بيانات حسابك.</p>
          </div>
          <NuxtLink to="/course" class="explore-stages">
            تفقّد كورسات المراحل الأخرى
            <span aria-hidden="true">←</span>
          </NuxtLink>
        </header>

        <section v-if="pending" class="available-state" aria-live="polite">
          <i class="pi pi-spin pi-spinner" />
          <strong>جاري تحميل كورسات مرحلتك...</strong>
        </section>

        <section v-else-if="error" class="available-state available-state--error">
          <i class="pi pi-exclamation-circle" />
          <strong>تعذر تحميل الكورسات</strong>
          <p>{{ error.message }}</p>
          <button type="button" @click="refresh()">حاول مرة أخرى</button>
        </section>

        <section v-else-if="!courses?.length" class="available-state">
          <i class="pi pi-book" />
          <strong>لا توجد كورسات متاحة لمرحلتك حاليًا</strong>
          <p>يمكنك استعراض كورسات باقي المراحل من صفحة الكورسات العامة.</p>
          <NuxtLink to="/course">تفقّد كورسات المراحل الأخرى</NuxtLink>
        </section>

        <section v-else class="available-course-grid">
          <HomeCourseCard
            v-for="(course, index) in courses"
            :key="course.id"
            :course="course"
            :index="index"
            :level-label="educationLabel"
            :interactive="false"
          />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.prfile-home { display:grid; width:100%; grid-template-columns:repeat(6,1fr); gap:10px; margin-top:50px; text-align:right; }
.profile-dashboard-workspace { min-width:0; }
.available-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:28px; }
.available-heading > div { min-width:0; }
.explore-stages { display:inline-flex; flex:0 0 auto; align-items:center; gap:10px; padding:13px 18px; border-radius:10px; background:var(--profile-secondary,var(--secondary-color)); color:var(--profile-on-action,#fff); font-weight:800; }
.available-course-grid { --home-v2-surface:var(--profile-surface); --home-v2-ink:var(--profile-ink); --home-v2-muted:var(--profile-muted); --home-v2-line:var(--profile-border); --home-v2-blue:var(--profile-secondary); --home-v2-deep:var(--profile-primary); --course-card-cover:color-mix(in srgb,var(--profile-secondary) 12%,var(--profile-surface-raised)); --course-card-cover-violet:color-mix(in srgb,var(--profile-primary) 14%,var(--profile-surface-raised)); --course-card-cover-sky:color-mix(in srgb,var(--profile-secondary) 18%,var(--profile-surface)); --course-card-pill:color-mix(in srgb,var(--profile-surface) 92%,transparent); display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; }
.available-state { display:grid; min-height:280px; place-items:center; align-content:center; gap:12px; padding:36px; border:1px dashed var(--profile-border,#d9dfe2); background:var(--profile-surface,#fff); color:var(--profile-ink,#17343c); text-align:center; }
.available-state i { color:var(--profile-secondary,var(--secondary-color)); font-size:36px; }
.available-state strong { font-size:21px; }
.available-state p { margin:0; color:var(--profile-muted,#6f777b); }
.available-state a,.available-state button { padding:10px 16px; border:0; background:var(--profile-secondary,var(--secondary-color)); color:var(--profile-on-action,#fff); cursor:pointer; font-weight:800; }
.available-state--error i { color:#b42318; }
@media (max-width:900px) { .available-heading { align-items:stretch; flex-direction:column; } .available-course-grid { grid-template-columns:1fr; } }
@media (max-width:768px) { .prfile-home { display:flex; margin:0; flex-direction:column-reverse; } }
</style>
