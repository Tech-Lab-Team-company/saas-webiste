<script setup lang="ts">
import CoursesParams from "~/features/FetchCourses/Core/Params/courses_params";
import type CoursesModel from "~/features/FetchCourses/Data/models/courses_model";
import CoursesController from "~/features/FetchCourses/presentation/controllers/courses_controller";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const categoryId = String(userStore.user?.category_id || "2");
const coursesController = CoursesController.getInstance();
const state = await coursesController.FetchCourses(new CoursesParams(categoryId));

const courses = computed<CoursesModel[]>(() => state.value.data ?? []);
const educationLabel = computed(() => {
  const info = userStore.user?.userInfo;
  return info?.year_title || info?.stage_title || info?.university_title || "المستوى الدراسي";
});

const courseStage = (course: CoursesModel) =>
  course.subject?.title || educationLabel.value || "المستوى الدراسي";

const courseDescription = (course: CoursesModel) =>
  course.description || course.subtitle || `تابع محتوى ${course.title} ودروس الكورس من مكان واحد.`;

const courseImage = (course: CoursesModel) => {
  const image = course.image as CoursesModel["image"] | string | undefined;
  return typeof image === "string" ? image : image?.img;
};

const courseMeta = (course: CoursesModel) => {
  const items = [
    `${course.course_videos} فيديو`,
    `${course.course_docs} ملف`,
    `${course.course_records} تسجيل صوتي`,
    course.teacher?.name || null,
  ];
  return items.filter(Boolean).join(" · ");
};

const courseRoute = (course: CoursesModel) => ({
  name: "course-id",
  params: { id: course.id },
});
</script>

<template>
  <GlobalDataStatues :status="state">
    <template #initial>
      <div class="library-grid library-loading" aria-label="جارٍ تحميل الكورسات">
        <article v-for="item in 2" :key="item" class="library-course"><span /><div><i /><i /><i /></div></article>
      </div>
    </template>

    <template #loader>
      <div class="library-grid library-loading" aria-label="جارٍ تحميل الكورسات">
        <article v-for="item in 2" :key="item" class="library-course"><span /><div><i /><i /><i /></div></article>
      </div>
    </template>

    <template #empty>
      <div class="library-empty">
        <span class="pi pi-book" />
        <h2>لا توجد كورسات مسجلة</h2>
        <p>عند الاشتراك في كورس سيظهر هنا ويمكنك متابعة تقدّمك.</p>
        <NuxtLink :to="{ name: 'course' }">استكشف الكورسات ←</NuxtLink>
      </div>
    </template>

    <template #failed>
      <div class="library-empty library-error">
        <span class="pi pi-exclamation-circle" />
        <h2>تعذر تحميل الكورسات</h2>
        <p>يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>
      </div>
    </template>

    <template #success>
      <div class="library-grid">
        <article
          v-for="(course, index) in courses"
          :key="course.id"
          class="library-course"
          :style="{ '--order': index }"
        >
          <div class="library-cover" :class="`tone-${index % 3}`">
            <img
              v-if="courseImage(course)"
              :src="courseImage(course)"
              :alt="course.image?.alt || course.title"
            />
            <span v-else>{{ course.title?.charAt(0) || "ك" }}</span>

            <div class="cover-caption">
              <small>{{ courseStage(course) }}</small>
              <div v-if="Number(course.progress)" class="cover-progress">
                <i :style="{ width: `${Math.min(100, Number(course.progress) || 0)}%` }" />
              </div>
            </div>
          </div>

          <div class="library-body">
            <span class="course-stage">{{ courseStage(course) }}</span>
            <h2>{{ course.title }}</h2>
            <p>{{ courseDescription(course) }}</p>

            <div class="library-footer">
              <small>{{ courseMeta(course) }}</small>
              <NuxtLink :to="courseRoute(course)">عرض محتوى الكورس <span>←</span></NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </template>
  </GlobalDataStatues>
</template>

<style scoped>
.library-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
}

.library-course {
  --order: 0;
  display: grid;
  min-width: 0;
  grid-template-columns: 190px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--profile-border);
  border-radius: 0;
  background: var(--profile-surface);
  box-shadow: none;
  animation: library-course-in 0.58s cubic-bezier(.2,.8,.2,1) both;
  animation-delay: calc(var(--order) * 70ms);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.library-course:hover {
  border-color: color-mix(in srgb, var(--profile-secondary) 35%, var(--profile-border));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--profile-primary) 8%, transparent);
  transform: translateY(-3px);
}

.library-cover {
  position: relative;
  display: grid;
  min-height: 240px;
  place-items: center;
  overflow: hidden;
  color: var(--profile-ink);
  background: color-mix(in srgb, var(--profile-secondary) 20%, var(--profile-surface));
}

.library-cover.tone-1 {
  color: var(--profile-ink);
  background: color-mix(in srgb, var(--profile-primary) 17%, var(--profile-surface));
}

.library-cover.tone-2 {
  color: var(--profile-ink);
  background: color-mix(in srgb, var(--profile-secondary) 15%, var(--profile-surface-raised));
}

.library-cover::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 58%, color-mix(in srgb, var(--profile-primary) 12%, transparent));
  content: "";
  pointer-events: none;
}

.library-cover > span {
  font-size: 142px;
  font-weight: 900;
  line-height: 1;
  opacity: .13;
  transition: opacity 260ms ease, transform 350ms ease;
}

.library-cover > img {
  width: 100%;
  height: 100%;
  min-height: 240px;
  object-fit: cover;
  transition: transform 350ms ease;
}

.library-course:hover .library-cover > img { transform: scale(1.035); }

.library-course:hover .library-cover > span { opacity: .19; transform: scale(1.06) rotate(-2deg); }

.cover-caption {
  position: absolute;
  z-index: 2;
  right: 15px;
  bottom: 15px;
  left: 15px;
  display: grid;
  gap: 7px;
  color: var(--profile-ink);
}

.cover-caption small {
  overflow: hidden;
  font-size: 10px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cover-progress {
  height: 4px;
  overflow: hidden;
  border-radius: 4px;
  background: color-mix(in srgb, var(--profile-primary) 16%, transparent);
}

.cover-progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--profile-secondary);
}

.library-body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 24px;
}

.course-stage {
  align-self: stretch;
  width: 100%;
  overflow: hidden;
  color: var(--profile-secondary);
  padding: 7px 10px;
  background: color-mix(in srgb, var(--profile-secondary) 9%, var(--profile-surface));
  font-size: 9px;
  font-weight: 900;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.library-body h2 {
  display: -webkit-box;
  overflow: hidden;
  margin: 6px 0 8px;
  color: var(--profile-ink);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.library-body > p {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--profile-muted);
  font-size: 11px;
  line-height: 1.8;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.library-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--profile-border);
}

.library-footer small {
  display: -webkit-box;
  overflow: hidden;
  color: var(--profile-muted);
  font-size: 9px;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.library-footer a {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  color: var(--profile-secondary);
  font-size: 10px;
  font-weight: 900;
  text-decoration: none;
}

.library-footer a span { transition: transform 180ms ease; }
.library-footer a:hover span { transform: translateX(-3px); }

.library-empty {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
}

.library-empty > span {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 16px;
  color: var(--profile-secondary);
  background: var(--profile-secondary-soft);
  font-size: 24px;
}

.library-empty h2 { margin: 15px 0 3px; color: var(--profile-ink); font-size: 19px; }
.library-empty p { margin: 0; color: var(--profile-muted); font-size: 11px; }
.library-empty a { margin-top: 16px; color: var(--profile-secondary); font-size: 11px; font-weight: 900; text-decoration: none; }
.library-error > span { color: #ff8f83; background: color-mix(in srgb, #b42318 18%, var(--profile-surface)); }

.library-loading .library-course { min-height: 240px; animation: none; }
.library-loading article > span { background: linear-gradient(100deg,var(--profile-surface),var(--profile-surface-raised),var(--profile-surface)); background-size: 200%; animation: library-loading 1.2s infinite; }
.library-loading article > div { display: flex; flex-direction: column; justify-content: center; gap: 14px; padding: 24px; }
.library-loading i { height: 13px; border-radius: 5px; background: linear-gradient(100deg,var(--profile-surface),var(--profile-surface-raised),var(--profile-surface)); background-size: 200%; animation: library-loading 1.2s infinite; }
.library-loading i:nth-child(1) { width: 35%; }.library-loading i:nth-child(2) { width: 85%; height: 28px; }.library-loading i:nth-child(3) { width: 65%; }

@keyframes library-course-in { from { opacity: 0; transform: translateY(24px) scale(.985); } }
@keyframes library-loading { to { background-position: -200% 0; } }

@media (max-width: 1180px) {
  .library-grid { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .library-course { grid-template-columns: 145px minmax(0,1fr); }
  .library-cover { min-height: 220px; }
  .library-body { padding: 19px; }
  .library-footer { align-items: flex-start; flex-direction: column; }
}

@media (max-width: 480px) {
  .library-course { grid-template-columns: 1fr; }
  .library-cover { min-height: 190px; }
  .library-cover > span { font-size: 115px; }
  .library-footer { flex-direction: row; align-items: center; }
}

@media (prefers-reduced-motion: reduce) {
  .library-course { animation: none; transition: none; }
}
</style>
