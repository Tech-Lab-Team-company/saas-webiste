<script setup lang="ts">
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapHomeSite,
  mapHomeTeacher,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeTeacherViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

definePageMeta({ layout: "home-v2" });

const route = useRoute();
const teacherId = Number(route.params.id);

if (!Number.isInteger(teacherId) || teacherId <= 0) {
  throw createError({ statusCode: 404, statusMessage: "Teacher not found" });
}

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));

if (!site.value.hasTeacherDirectory) {
  await navigateTo("/about-teacher", { redirectCode: 302 });
}

const api = new HomePageApi(getWebDomain());
const {
  data: teacher,
  pending,
  error,
  refresh,
} = await useAsyncData<HomeTeacherViewModel | null>(
  `teacher-details:${getWebDomain()}:${teacherId}`,
  async () => mapHomeTeacher(await api.fetchTeacherDetails(teacherId)),
  {
    default: () => null,
    dedupe: "defer",
  },
);

const imageFailed = ref(false);
const teacherImage = computed(() =>
  imageFailed.value ? null : teacher.value?.image?.src || null,
);
const teacherDescription = computed(() =>
  teacher.value?.description ||
  teacher.value?.shortDescription ||
  teacher.value?.intro ||
  `مدرس على ${site.value.brandName || "المنصة"}.`,
);
const teacherInitials = computed(() =>
  (teacher.value?.name || "T")
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase(),
);
const phoneHref = computed(() => {
  const phone = teacher.value?.phone?.replace(/[^\d+]/gu, "");
  return phone ? `tel:${phone}` : null;
});

const pageTitle = computed(() =>
  teacher.value?.name
    ? `${teacher.value.name} | ${site.value.brandName || "المنصة"}`
    : `تفاصيل المدرس | ${site.value.brandName || "المنصة"}`,
);
const pageDescription = computed(() =>
  teacherDescription.value.replace(/\s+/gu, " ").trim().slice(0, 160),
);

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  robots: "index, follow, max-image-preview:large",
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogImage: () => teacher.value?.image?.src || site.value.cover?.src || undefined,
  ogType: "profile",
  twitterCard: "summary_large_image",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <main class="teacher-details-page">
    <div v-if="pending" class="teacher-details-page__state" role="status">
      <span aria-hidden="true" />
      <strong>جاري تحميل ملف المدرس...</strong>
    </div>

    <div v-else-if="error" class="teacher-details-page__state" role="alert">
      <strong>تعذر تحميل بيانات المدرس</strong>
      <p>حاول مرة أخرى بعد التأكد من الاتصال بالخدمة.</p>
      <button type="button" @click="refresh()">إعادة المحاولة</button>
      <NuxtLink to="/teachers">العودة إلى المدرسين</NuxtLink>
    </div>

    <div v-else-if="!teacher" class="teacher-details-page__state" role="status">
      <strong>المدرس غير متاح</strong>
      <p>لم نتمكن من العثور على ملف المدرس المطلوب.</p>
      <NuxtLink to="/teachers">عرض كل المدرسين</NuxtLink>
    </div>

    <template v-else>
      <section class="teacher-details-page__hero">
        <div class="teacher-details-page__mark" aria-hidden="true">PROFILE</div>
        <div class="container teacher-details-page__hero-grid">
          <div class="teacher-details-page__portrait">
            <img
              v-if="teacherImage"
              :src="teacherImage"
              :alt="teacher.image?.alt || `صورة المدرس ${teacher.name}`"
              width="620"
              height="720"
              loading="eager"
              @error="imageFailed = true"
            />
            <span v-else aria-hidden="true">{{ teacherInitials }}</span>
          </div>

          <div class="teacher-details-page__intro">
            <NuxtLink to="/teachers">المدرسون <span aria-hidden="true">←</span></NuxtLink>
            <span>مدرس على {{ site.brandName || "المنصة" }}</span>
            <h1>{{ teacher.name }}</h1>
            <p v-if="teacher.intro || teacher.shortDescription">
              {{ teacher.intro || teacher.shortDescription }}
            </p>

            <dl>
              <div>
                <dt>{{ teacher.coursesCount }}</dt>
                <dd>كورس متاح</dd>
              </div>
              <div>
                <dt>{{ teacher.revisionsCount }}</dt>
                <dd>مراجعة</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section class="container teacher-details-page__content">
        <article>
          <span>عن المدرس</span>
          <h2>الخبرة التي تقود رحلتك التعليمية</h2>
          <p>{{ teacherDescription }}</p>
        </article>

        <aside>
          <span>تواصل مع المدرس</span>
          <h2>ابدأ خطوتك التالية</h2>
          <p v-if="teacher.address">⌖ {{ teacher.address }}</p>
          <a v-if="teacher.email" :href="`mailto:${teacher.email}`">
            {{ teacher.email }}
          </a>
          <a v-if="phoneHref" :href="phoneHref">{{ teacher.phone }}</a>
          <NuxtLink
            :to="{ path: '/course', query: { teacher_id: String(teacher.id) } }"
          >
            استعرض كورسات المدرس <span aria-hidden="true">←</span>
          </NuxtLink>
        </aside>
      </section>
    </template>
  </main>
</template>

<style scoped>
.teacher-details-page {
  min-height: 100vh;
  background: var(--app-bg, #fbfcff);
}

.teacher-details-page__hero {
  position: relative;
  overflow: hidden;
  padding: clamp(120px, 13vw, 176px) 0 clamp(70px, 9vw, 120px);
  background:
    radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--home-v2-blue) 45%, transparent), transparent 30%),
    linear-gradient(135deg, var(--home-v2-deep), color-mix(in srgb, var(--home-v2-blue) 72%, #061127));
  color: #fff;
}

.teacher-details-page__mark {
  position: absolute;
  inset-inline-end: -24px;
  bottom: -0.15em;
  color: rgb(255 255 255 / 4%);
  font-size: clamp(110px, 20vw, 310px);
  font-weight: 950;
  line-height: 0.75;
  letter-spacing: -0.07em;
  pointer-events: none;
}

.teacher-details-page__hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(260px, 390px) minmax(0, 1fr);
  align-items: center;
  gap: clamp(38px, 7vw, 96px);
}

.teacher-details-page__portrait {
  display: grid;
  min-height: 460px;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 34px;
  background: linear-gradient(145deg, var(--home-v2-blue), var(--home-v2-deep));
  box-shadow: 0 36px 80px rgb(0 0 0 / 28%);
}

.teacher-details-page__portrait img {
  width: 100%;
  height: 520px;
  object-fit: cover;
  object-position: center top;
}

.teacher-details-page__portrait > span {
  font-size: 90px;
  font-weight: 950;
}

.teacher-details-page__intro > a {
  display: inline-flex;
  gap: 8px;
  margin-bottom: 42px;
  color: rgb(255 255 255 / 76%);
  font-weight: 800;
  text-decoration: none;
}

.teacher-details-page__intro > span,
.teacher-details-page__content article > span,
.teacher-details-page__content aside > span {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.teacher-details-page__intro h1 {
  max-width: 850px;
  margin: 14px 0 18px;
  font-size: clamp(48px, 7vw, 96px);
  line-height: 1;
  letter-spacing: -0.055em;
}

.teacher-details-page__intro > p {
  max-width: 700px;
  margin: 0;
  color: rgb(255 255 255 / 76%);
  font-size: 17px;
  line-height: 1.9;
}

.teacher-details-page__intro dl {
  display: flex;
  gap: 42px;
  margin: 34px 0 0;
}

.teacher-details-page__intro dl div {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.teacher-details-page__intro dt { font-size: 30px; font-weight: 950; }
.teacher-details-page__intro dd { margin: 0; color: rgb(255 255 255 / 68%); }

.teacher-details-page__content {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.55fr);
  gap: clamp(28px, 5vw, 70px);
  padding-top: clamp(68px, 8vw, 116px);
  padding-bottom: clamp(72px, 9vw, 128px);
}

.teacher-details-page__content article,
.teacher-details-page__content aside {
  padding: clamp(28px, 4vw, 48px);
  border: 1px solid var(--app-line, #e1e7f0);
  border-radius: 30px;
  background: var(--app-surface, #fff);
  box-shadow: 0 24px 60px rgb(17 32 66 / 8%);
}

.teacher-details-page__content article > span,
.teacher-details-page__content aside > span { color: var(--home-v2-blue); }
.teacher-details-page__content h2 { margin: 12px 0 20px; color: var(--app-text, #081b3a); font-size: clamp(26px, 3vw, 40px); }
.teacher-details-page__content p { margin: 0; color: var(--app-muted, #53627a); line-height: 2; white-space: pre-line; }
.teacher-details-page__content aside { align-self: start; }
.teacher-details-page__content aside > a,
.teacher-details-page__content aside > :deep(a) { display: block; margin-top: 12px; overflow-wrap: anywhere; color: var(--home-v2-blue); font-weight: 800; text-decoration: none; }
.teacher-details-page__content aside > :deep(a:last-child) { margin-top: 26px; padding: 14px 18px; border-radius: 999px; background: var(--home-v2-blue); color: #fff; text-align: center; }

.teacher-details-page__state {
  display: grid;
  min-height: 72vh;
  place-items: center;
  align-content: center;
  gap: 14px;
  padding: 140px 24px 80px;
  color: var(--app-text, #081b3a);
  text-align: center;
}

.teacher-details-page__state > span {
  width: 44px;
  height: 44px;
  border: 3px solid color-mix(in srgb, var(--home-v2-blue) 15%, #fff);
  border-top-color: var(--home-v2-blue);
  border-radius: 50%;
  animation: teacher-details-spin 800ms linear infinite;
}

.teacher-details-page__state strong { font-size: 24px; }
.teacher-details-page__state p { margin: 0; color: var(--app-muted, #53627a); }
.teacher-details-page__state button,
.teacher-details-page__state a { padding: 12px 18px; border: 0; border-radius: 999px; background: var(--home-v2-blue); color: #fff; font-weight: 900; text-decoration: none; cursor: pointer; }

@keyframes teacher-details-spin { to { transform: rotate(360deg); } }

@media (max-width: 820px) {
  .teacher-details-page__hero-grid,
  .teacher-details-page__content { grid-template-columns: 1fr; }
  .teacher-details-page__portrait { min-height: 380px; }
  .teacher-details-page__portrait img { height: 430px; }
  .teacher-details-page__intro h1 { font-size: 54px; }
}

@media (prefers-reduced-motion: reduce) {
  .teacher-details-page__state > span { animation: none; }
}
</style>
