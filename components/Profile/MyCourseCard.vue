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
      <div class="library-empty library-empty--courses">
        <div class="library-empty-art" aria-hidden="true">
          <span class="library-empty-art__glow" />
          <span class="library-empty-art__book library-empty-art__book--back" />
          <span class="library-empty-art__book library-empty-art__book--front">
            <i class="pi pi-play" />
          </span>
          <span class="library-empty-art__spark pi pi-star-fill" />
        </div>

        <div class="library-empty-content">
          <span class="library-empty-eyebrow">
            <i class="pi pi-sparkles" aria-hidden="true" />
            مكتبتك جاهزة للبداية
          </span>
          <h2>ابدأ أول كورس في رحلتك التعليمية</h2>
          <p>
            لم تشترك في أي كورس حتى الآن. اختر الكورس المناسب لمرحلتك، وسيظهر هنا
            مع الدروس ونسبة التقدم وكل ما تحتاجه للمتابعة.
          </p>

          <ul aria-label="مميزات مكتبة الطالب">
            <li><i class="pi pi-check" /> متابعة التقدم</li>
            <li><i class="pi pi-check" /> وصول سريع للدروس</li>
            <li><i class="pi pi-check" /> محتوى مناسب لمرحلتك</li>
          </ul>

          <NuxtLink class="library-empty-action" :to="{ name: 'course' }">
            تصفّح الكورسات
            <span aria-hidden="true">←</span>
          </NuxtLink>
        </div>
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

.library-empty--courses {
  position: relative;
  display: grid;
  width: min(100%, 900px);
  min-height: 380px;
  grid-template-columns: minmax(260px, .75fr) minmax(340px, 1.25fr);
  gap: clamp(30px, 5vw, 72px);
  margin: 8px auto 0;
  padding: clamp(34px, 5vw, 64px);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--profile-secondary) 18%, var(--profile-border));
  border-radius: 28px;
  background:
    radial-gradient(circle at 12% 22%, color-mix(in srgb, var(--profile-secondary) 12%, transparent), transparent 35%),
    linear-gradient(135deg, var(--profile-surface) 0%, var(--profile-surface-raised) 100%);
  box-shadow: 0 24px 64px color-mix(in srgb, var(--profile-primary) 8%, transparent);
  text-align: right;
}
/*
.library-empty--courses::before {
  position: absolute;
  inset: 18px;
  border: 1px dashed color-mix(in srgb, var(--profile-secondary) 12%, transparent);
  border-radius: 20px;
  content: "";
  pointer-events: none;
} */

.library-empty-art {
  position: relative;
  display: grid;
  min-height: 230px;
  place-items: center;
}

.library-empty-art__glow {
  position: absolute;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--profile-secondary) 12%, transparent);
  box-shadow: 0 0 0 24px color-mix(in srgb, var(--profile-secondary) 5%, transparent);
}

.library-empty-art__book {
  position: absolute;
  width: 132px;
  height: 166px;
  border-radius: 12px 22px 22px 12px;
  box-shadow: 0 20px 42px color-mix(in srgb, var(--profile-primary) 22%, transparent);
}

.library-empty-art__book--back {
  border: 1px solid color-mix(in srgb, var(--profile-secondary) 28%, transparent);
  background: color-mix(in srgb, var(--profile-secondary) 18%, var(--profile-surface));
  transform: translate(-28px, -12px) rotate(-9deg);
}

.library-empty-art__book--front {
  display: grid;
  place-items: center;
  border-right: 8px solid color-mix(in srgb, var(--profile-primary) 38%, transparent);
  background: linear-gradient(145deg, var(--profile-secondary), color-mix(in srgb, var(--profile-primary) 72%, var(--profile-secondary)));
  color: #fff;
  transform: translate(18px, 9px) rotate(5deg);
}

.library-empty-art__book--front::after {
  position: absolute;
  right: 18px;
  bottom: 25px;
  left: 18px;
  height: 4px;
  border-radius: 4px;
  background: rgb(255 255 255 / 30%);
  content: "";
}

.library-empty-art__book--front i {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 50%;
  background: rgb(255 255 255 / 16%);
  font-size: 18px;
}

.library-empty-art__spark {
  position: absolute;
  top: 22px;
  right: 22px;
  color: #f6b91a;
  filter: drop-shadow(0 5px 9px rgb(246 185 26 / 30%));
  font-size: 22px;
  animation: library-spark 2.2s ease-in-out infinite;
}

.library-empty-content {
  position: relative;
  z-index: 1;
  align-self: center;
}

.library-empty-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--profile-secondary-soft);
  color: var(--profile-secondary);
  font-size: 11px;
  font-weight: 900;
}

.library-empty--courses h2 {
  max-width: 470px;
  margin: 17px 0 9px;
  font-size: clamp(23px, 2.4vw, 34px);
  line-height: 1.45;
}

.library-empty--courses .library-empty-content > p {
  max-width: 560px;
  color: var(--profile-muted);
  font-size: 13px;
  line-height: 1.95;
}

.library-empty-content ul {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin: 20px 0 24px;
  padding: 0;
  color: var(--profile-ink);
  font-size: 11px;
  font-weight: 800;
  list-style: none;
}

.library-empty-content li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.library-empty-content li i {
  display: grid;
  width: 19px;
  height: 19px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, #1b9c67 12%, var(--profile-surface));
  color: #168457;
  font-size: 9px;
}

.library-empty--courses .library-empty-action {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0;
  padding: 12px 22px;
  border-radius: 12px;
  background: var(--profile-secondary);
  box-shadow: 0 12px 26px color-mix(in srgb, var(--profile-secondary) 24%, transparent);
  color: #fff;
  font-size: 12px;
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.library-empty--courses .library-empty-action:hover {
  box-shadow: 0 16px 32px color-mix(in srgb, var(--profile-secondary) 32%, transparent);
  transform: translateY(-2px);
}

.library-empty-action span { font-size: 18px; transition: transform 180ms ease; }
.library-empty-action:hover span { transform: translateX(-4px); }

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
@keyframes library-spark { 50% { opacity: .55; transform: translateY(-5px) rotate(8deg); } }

@media (max-width: 1180px) {
  .library-grid { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .library-course { grid-template-columns: 145px minmax(0,1fr); }
  .library-cover { min-height: 220px; }
  .library-body { padding: 19px; }
  .library-footer { align-items: flex-start; flex-direction: column; }
  .library-empty--courses { grid-template-columns: 1fr; gap: 12px; padding: 32px 26px; text-align: center; }
  .library-empty-art { min-height: 180px; }
  .library-empty-art__glow { width: 155px; height: 155px; }
  .library-empty-art__book { width: 98px; height: 126px; }
  .library-empty-content ul { justify-content: center; }
  .library-empty--courses .library-empty-action { width: 100%; }
}

@media (max-width: 480px) {
  .library-course { grid-template-columns: 1fr; }
  .library-cover { min-height: 190px; }
  .library-cover > span { font-size: 115px; }
  .library-footer { flex-direction: row; align-items: center; }
}

@media (prefers-reduced-motion: reduce) {
  .library-course, .library-empty-art__spark { animation: none; transition: none; }
}
</style>
