<script setup lang="ts">
import type {
  HomeSiteViewModel,
  HomeTeacherViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = withDefaults(
  defineProps<{
    teachers: HomeSectionState<HomeTeacherViewModel[]>;
    site: HomeSiteViewModel;
    catalog?: boolean;
    pending?: boolean;
    onRetry?: () => void | Promise<void>;
  }>(),
  {
    catalog: false,
    pending: false,
    onRetry: undefined,
  },
);

const failedImages = ref(new Set<number>());
const visibleTeachers = computed(() =>
  props.catalog ? props.teachers.data : props.teachers.data.slice(0, 3),
);

const teacherSummary = (teacher: HomeTeacherViewModel) =>
  teacher.shortDescription ||
  teacher.intro ||
  teacher.description ||
  `مدرس على ${props.site.brandName || "المنصة"}`;

const teacherInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const phoneHref = (phone: string | null) =>
  phone ? `tel:${phone.replace(/[^\d+]/gu, "")}` : null;

const markImageAsFailed = (teacherId: number) => {
  failedImages.value = new Set(failedImages.value).add(teacherId);
};
</script>

<template>
  <section
    v-if="site.hasTeacherDirectory"
    id="teachers"
    class="home-teachers"
    :class="{ 'home-teachers--catalog': catalog }"
    aria-labelledby="home-teachers-title"
  >
    <div class="home-teachers__glow" aria-hidden="true" />
    <div class="container">
      <header class="home-teachers__header">
        <div>
          <span>خبرات متعددة، في مكان واحد</span>
          <h2 id="home-teachers-title">
            تعرّف على <em>مدرّسي المنصة</em>
          </h2>
        </div>
        <p>
          اختر المدرس الأقرب لهدفك، وتعرّف على خبرته والمحتوى الذي يقدمه على
          {{ site.brandName || "المنصة" }}.
        </p>
      </header>

      <div v-if="pending" class="home-teachers__state" role="status">
        <span class="home-teachers__loader" aria-hidden="true" />
        <strong>جاري تجهيز دليل المدرسين</strong>
        <p>لحظات ونظهر لك كل الخبرات المتاحة على المنصة.</p>
      </div>

      <div
        v-else-if="teachers.status === 'error'"
        class="home-teachers__state home-teachers__state--error"
        role="alert"
      >
        <span aria-hidden="true">!</span>
        <strong>تعذر تحميل المدرسين الآن</strong>
        <p>{{ teachers.error?.message }}</p>
        <button v-if="onRetry" type="button" @click="onRetry">حاول مرة أخرى</button>
      </div>

      <div
        v-else-if="teachers.status === 'empty'"
        class="home-teachers__state"
        role="status"
      >
        <span aria-hidden="true">+</span>
        <strong>دليل المدرسين قيد التجهيز</strong>
        <p>سيظهر المدرسون هنا فور إضافتهم إلى المنصة.</p>
      </div>

      <div v-else class="home-teachers__grid">
        <article
          v-for="(teacher, index) in visibleTeachers"
          :key="teacher.id"
          class="home-teacher-card"
        >
          <div class="home-teacher-card__visual">
            <span class="home-teacher-card__index" aria-hidden="true">
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <img
              v-if="teacher.image && !failedImages.has(teacher.id)"
              :src="teacher.image.src"
              :alt="teacher.image.alt || `صورة المدرس ${teacher.name}`"
              width="560"
              height="620"
              loading="lazy"
              @error="markImageAsFailed(teacher.id)"
            />
            <span v-else class="home-teacher-card__initials" aria-hidden="true">
              {{ teacherInitials(teacher.name) }}
            </span>
            <div class="home-teacher-card__badge">
              <i aria-hidden="true" /> مدرس على المنصة
            </div>
          </div>

          <div class="home-teacher-card__body">
            <span>مدرس معتمد</span>
            <h3>{{ teacher.name }}</h3>
            <p>{{ teacherSummary(teacher) }}</p>

            <dl v-if="teacher.coursesCount || teacher.revisionsCount">
              <div v-if="teacher.coursesCount">
                <dt>{{ teacher.coursesCount }}</dt>
                <dd>كورس</dd>
              </div>
              <div v-if="teacher.revisionsCount">
                <dt>{{ teacher.revisionsCount }}</dt>
                <dd>مراجعة</dd>
              </div>
            </dl>

            <div v-if="catalog" class="home-teacher-card__meta">
              <span v-if="teacher.address">⌖ {{ teacher.address }}</span>
              <a v-if="teacher.email" :href="`mailto:${teacher.email}`">راسل المدرس</a>
              <a v-else-if="phoneHref(teacher.phone)" :href="phoneHref(teacher.phone)!">
                تواصل مع المدرس
              </a>
            </div>
          </div>
        </article>
      </div>

      <footer v-if="!catalog && teachers.status === 'success'" class="home-teachers__footer">
        <p>اكتشف كل المدرسين والخبرات المتاحة على المنصة.</p>
        <NuxtLink to="/teachers" prefetch-on="interaction">
          كل المدرسين <span aria-hidden="true">←</span>
        </NuxtLink>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.home-teachers {
  position: relative;
  overflow: hidden;
  padding: clamp(76px, 9vw, 132px) 0;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--home-v2-blue) 6%, #fff), #fff 55%),
    #fff;
}

.home-teachers--catalog {
  min-height: 72vh;
  padding-top: clamp(72px, 8vw, 118px);
}

.home-teachers__glow {
  position: absolute;
  top: -220px;
  inset-inline-end: -180px;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, transparent);
  filter: blur(8px);
  pointer-events: none;
}

.home-teachers__header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  align-items: end;
  gap: 36px;
  margin-bottom: 48px;
}

.home-teachers__header span,
.home-teacher-card__body > span {
  color: var(--home-v2-blue);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.home-teachers__header h2 {
  max-width: 720px;
  margin: 12px 0 0;
  color: var(--home-v2-deep);
  font-size: clamp(38px, 5vw, 72px);
  line-height: 1.06;
  letter-spacing: -0.04em;
}

.home-teachers__header h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-teachers__header p,
.home-teachers__footer p {
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 16px;
  line-height: 1.9;
}

.home-teachers__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.home-teacher-card {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 13%, #dfe5ee);
  border-radius: 28px;
  background: var(--app-surface, #fff);
  box-shadow: 0 24px 60px rgb(17 32 66 / 9%);
  transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
}

.home-teacher-card:hover {
  transform: translateY(-7px);
  border-color: color-mix(in srgb, var(--home-v2-blue) 42%, #dfe5ee);
  box-shadow: 0 32px 74px color-mix(in srgb, var(--home-v2-blue) 16%, transparent);
}

.home-teacher-card__visual {
  position: relative;
  display: grid;
  min-height: 310px;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 75% 20%, rgb(255 255 255 / 45%), transparent 28%),
    linear-gradient(145deg, var(--home-v2-blue), var(--home-v2-deep));
}

.home-teacher-card__visual img {
  width: 100%;
  height: 310px;
  object-fit: cover;
  object-position: center top;
  transition: transform 500ms ease;
}

.home-teacher-card:hover .home-teacher-card__visual img {
  transform: scale(1.035);
}

.home-teacher-card__initials {
  color: rgb(255 255 255 / 94%);
  font-size: 72px;
  font-weight: 950;
  letter-spacing: -0.06em;
  text-shadow: 0 12px 32px rgb(0 0 0 / 22%);
}

.home-teacher-card__index {
  position: absolute;
  z-index: 2;
  top: 18px;
  inset-inline-start: 20px;
  color: rgb(255 255 255 / 72%);
  font-size: 12px;
  font-weight: 900;
}

.home-teacher-card__badge {
  position: absolute;
  z-index: 2;
  inset-inline: 18px;
  bottom: 18px;
  display: flex;
  width: max-content;
  max-width: calc(100% - 36px);
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 999px;
  background: rgb(8 24 52 / 66%);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  backdrop-filter: blur(14px);
}

.home-teacher-card__badge i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #65e6a6;
  box-shadow: 0 0 0 5px rgb(101 230 166 / 16%);
}

.home-teacher-card__body {
  padding: 26px;
}

.home-teacher-card__body h3 {
  margin: 8px 0 10px;
  color: var(--app-text, #081b3a);
  font-size: 24px;
  line-height: 1.3;
}

.home-teacher-card__body > p {
  display: -webkit-box;
  min-height: 78px;
  margin: 0;
  overflow: hidden;
  color: var(--app-muted, #53627a);
  font-size: 14px;
  line-height: 1.85;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.home-teacher-card dl {
  display: flex;
  gap: 24px;
  margin: 22px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--app-line, #e1e7f0);
}

.home-teacher-card dl div {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.home-teacher-card dt {
  color: var(--home-v2-blue);
  font-size: 19px;
  font-weight: 950;
}

.home-teacher-card dd {
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 12px;
}

.home-teacher-card__meta {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--app-line, #e1e7f0);
  color: var(--app-muted, #53627a);
  font-size: 12px;
}

.home-teacher-card__meta span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-teacher-card__meta a,
.home-teachers__footer a,
.home-teachers__state button {
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  background: var(--home-v2-blue);
  color: #fff;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.home-teacher-card__meta a {
  padding: 9px 13px;
  font-size: 11px;
}

.home-teachers__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 34px;
  padding: 22px 26px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 12%, #e0e6ef);
  border-radius: 22px;
  background: color-mix(in srgb, var(--home-v2-blue) 4%, #fff);
}

.home-teachers__footer a {
  padding: 13px 19px;
}

.home-teachers__state {
  display: grid;
  min-height: 300px;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 40px;
  border: 1px dashed color-mix(in srgb, var(--home-v2-blue) 26%, #dfe5ee);
  border-radius: 28px;
  background: color-mix(in srgb, var(--home-v2-blue) 3%, #fff);
  text-align: center;
}

.home-teachers__state > span:not(.home-teachers__loader) {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 16px;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, #fff);
  color: var(--home-v2-blue);
  font-size: 22px;
  font-weight: 950;
}

.home-teachers__state strong {
  color: var(--app-text, #081b3a);
  font-size: 20px;
}

.home-teachers__state p {
  margin: 0;
  color: var(--app-muted, #53627a);
}

.home-teachers__state button {
  margin-top: 8px;
  padding: 11px 18px;
}

.home-teachers__loader {
  width: 42px;
  height: 42px;
  border: 3px solid color-mix(in srgb, var(--home-v2-blue) 15%, #fff);
  border-top-color: var(--home-v2-blue);
  border-radius: 50%;
  animation: home-teachers-spin 800ms linear infinite;
}

@keyframes home-teachers-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 960px) {
  .home-teachers__header { grid-template-columns: 1fr; align-items: start; }
  .home-teachers__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .home-teachers { padding: 68px 0; }
  .home-teachers__header { gap: 20px; margin-bottom: 30px; }
  .home-teachers__header h2 { font-size: 39px; }
  .home-teachers__grid { grid-template-columns: 1fr; }
  .home-teacher-card__visual,
  .home-teacher-card__visual img { min-height: 280px; height: 280px; }
  .home-teachers__footer { align-items: stretch; flex-direction: column; }
  .home-teachers__footer a { text-align: center; }
}

@media (prefers-reduced-motion: reduce) {
  .home-teacher-card,
  .home-teacher-card__visual img { transition: none; }
  .home-teachers__loader { animation: none; }
}
</style>
