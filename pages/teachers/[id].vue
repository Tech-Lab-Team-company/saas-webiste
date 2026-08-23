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
  (
    teacher.value?.description ||
    teacher.value?.shortDescription ||
    teacher.value?.intro ||
    `مدرس على ${site.value.brandName || "المنصة"}.`
  ).replace(/\r\n?/gu, "\n"),
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
const whatsappHref = computed(() => {
  const digits = teacher.value?.phone?.replace(/\D/gu, "");
  if (!digits) return null;

  const internationalNumber = digits.startsWith("0")
    ? `20${digits.slice(1)}`
    : digits;
  return `https://wa.me/${internationalNumber}`;
});
const shareStatus = ref<"idle" | "copied">("idle");

const shareTeacher = async () => {
  if (!import.meta.client || !teacher.value) return;

  const shareData = {
    title: teacher.value.name,
    text: `تعرّف على ${teacher.value.name} على ${site.value.brandName || "المنصة"}`,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
    }
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(shareData.url);
    shareStatus.value = "copied";
    window.setTimeout(() => {
      shareStatus.value = "idle";
    }, 1800);
  }
};

onMounted(() => {
  if (!teacher.value?.image?.src) return;

  const image = new Image();
  image.onerror = () => {
    imageFailed.value = true;
  };
  image.src = teacher.value.image.src;
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

    <section v-else class="container teacher-profile">
      <div class="teacher-profile__cover">
        <div class="teacher-profile__rings" aria-hidden="true" />
        <NuxtLink class="teacher-profile__back" to="/teachers">
          <span aria-hidden="true">→</span> الرجوع
        </NuxtLink>
        <button class="teacher-profile__share" type="button" @click="shareTeacher">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4" />
          </svg>
          <span>{{ shareStatus === "copied" ? "تم نسخ الرابط" : "مشاركة" }}</span>
        </button>
      </div>

      <article class="teacher-profile__panel">
        <div class="teacher-profile__portrait">
          <img
            v-if="teacherImage"
            :src="teacherImage"
            :alt="teacher.image?.alt || `صورة المدرس ${teacher.name}`"
            width="360"
            height="360"
            loading="eager"
            @error="imageFailed = true"
          />
          <span v-else aria-hidden="true">{{ teacherInitials }}</span>
        </div>

        <div class="teacher-profile__identity">
          <span class="teacher-profile__available"><i aria-hidden="true" /> متاح</span>
          <h1>{{ teacher.name }}</h1>
          <p v-if="teacher.address">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {{ teacher.address }}
          </p>
          <p v-else>مدرس على {{ site.brandName || "المنصة" }}</p>
        </div>

        <nav class="teacher-profile__contacts" aria-label="طرق التواصل مع المدرس">
          <a
            v-if="whatsappHref"
            :href="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z" />
              <path d="M8.2 7.8c.4 3 2 5 5.3 6.4l1.5-1.5 2.1 1c.2 1-.3 2-1.3 2.4-4.6.3-8.1-3.4-9-7.1.1-.8.6-1.3 1.4-1.2Z" />
            </svg>
            واتساب
          </a>
          <a v-if="phoneHref" :href="phoneHref">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5.2 4.5 8.5 4l1.6 4-2.2 1.7a14.8 14.8 0 0 0 6.4 6.4l1.7-2.2 4 1.6-.5 3.3c-.1.7-.7 1.2-1.4 1.2A14.1 14.1 0 0 1 4 5.9c0-.7.5-1.3 1.2-1.4Z" />
            </svg>
            اتصال
          </a>
          <a v-if="teacher.email" :href="`mailto:${teacher.email}`">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            بريد إلكتروني
          </a>
          <NuxtLink
            :to="{ path: '/course', query: { teacher_id: String(teacher.id) } }"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z" />
              <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v17a3 3 0 0 1 3-3h3Z" />
            </svg>
            الكورسات
          </NuxtLink>
        </nav>

        <div class="teacher-profile__body">
          <section class="teacher-profile__section">
            <header>
              <span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                </svg>
              </span>
              <h2>نبذة عن المدرس</h2>
            </header>
            <p>{{ teacherDescription }}</p>
          </section>

          <dl class="teacher-profile__stats">
            <div>
              <dt>{{ teacher.coursesCount }}</dt>
              <dd>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z" />
                  <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v17a3 3 0 0 1 3-3h3Z" />
                </svg>
                الكورسات
              </dd>
            </div>
            <div>
              <dt>{{ teacher.revisionsCount }}</dt>
              <dd>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
                </svg>
                المراجعات
              </dd>
            </div>
            <div>
              <dt>متاح</dt>
              <dd>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 7 9.5 17.5 4 12" />
                </svg>
                للحجز والتواصل
              </dd>
            </div>
          </dl>

          <section class="teacher-profile__section teacher-profile__courses-section">
            <header>
              <span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z" />
                  <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v17a3 3 0 0 1 3-3h3Z" />
                </svg>
              </span>
              <h2>كورسات المدرس</h2>
            </header>
            <p>استعرض المحتوى الذي يقدمه {{ teacher.name }} واختر الكورس المناسب لك.</p>
            <NuxtLink
              :to="{ path: '/course', query: { teacher_id: String(teacher.id) } }"
            >
              عرض كل الكورسات <span aria-hidden="true">←</span>
            </NuxtLink>
          </section>

          <section v-if="teacher.address" class="teacher-profile__section teacher-profile__location">
            <header>
              <span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <h2>الموقع</h2>
            </header>
            <p>{{ teacher.address }}</p>
          </section>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.teacher-details-page {
  min-height: 100vh;
  padding: 118px 0 clamp(72px, 8vw, 110px);
  background: var(--app-bg, #fbfcff);
}

.teacher-profile {
  max-width: 940px;
}

.teacher-profile__cover {
  position: relative;
  min-height: 228px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 30%, transparent);
  border-radius: 28px 28px 0 0;
  background:
    radial-gradient(circle at 17% 92%, color-mix(in srgb, var(--home-v2-blue) 68%, transparent), transparent 28%),
    linear-gradient(135deg, var(--home-v2-deep), color-mix(in srgb, var(--home-v2-blue) 62%, #061629));
  box-shadow: 0 24px 70px color-mix(in srgb, var(--home-v2-deep) 20%, transparent);
}

.teacher-profile__cover::before {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(255 255 255 / 22%) 1px, transparent 1px);
  background-size: 18px 18px;
  content: "";
  mask-image: linear-gradient(90deg, black, transparent 42%);
  opacity: 0.4;
}

.teacher-profile__rings {
  position: absolute;
  top: -200px;
  inset-inline-start: -100px;
  width: 480px;
  height: 480px;
  border: 1px solid rgb(255 255 255 / 13%);
  border-radius: 50%;
  box-shadow:
    0 0 0 34px rgb(255 255 255 / 4%),
    0 0 0 70px rgb(255 255 255 / 4%),
    0 0 0 108px rgb(255 255 255 / 3%);
}

.teacher-profile__back,
.teacher-profile__share {
  position: absolute;
  z-index: 2;
  top: 22px;
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 999px;
  background: rgb(3 16 35 / 28%);
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  backdrop-filter: blur(14px);
}

.teacher-profile__back {
  inset-inline-start: 22px;
  padding: 0 15px;
}

.teacher-profile__share {
  inset-inline-end: 22px;
  padding: 0 14px;
  cursor: pointer;
}

.teacher-profile__share svg {
  width: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.7;
}

.teacher-profile__panel {
  position: relative;
  padding: 92px clamp(22px, 5vw, 56px) 0;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 12%, var(--app-line, #e1e7f0));
  border-top: 0;
  border-radius: 0 0 28px 28px;
  background: var(--app-surface, #fff);
  box-shadow: 0 28px 76px rgb(17 32 66 / 9%);
}

.teacher-profile__portrait {
  position: absolute;
  top: -102px;
  left: 50%;
  display: grid;
  width: 178px;
  height: 178px;
  place-items: center;
  overflow: hidden;
  border: 6px solid var(--app-surface, #fff);
  border-radius: 50%;
  background: linear-gradient(145deg, color-mix(in srgb, var(--home-v2-blue) 26%, #fff), color-mix(in srgb, var(--home-v2-deep) 24%, #fff));
  box-shadow: 0 20px 42px rgb(8 27 58 / 20%);
  transform: translateX(-50%);
}

.teacher-profile__portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.teacher-profile__portrait > span {
  color: var(--home-v2-deep);
  font-size: 48px;
  font-weight: 950;
}

.teacher-profile__identity {
  text-align: center;
}

.teacher-profile__available {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 5px 10px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 22%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--home-v2-blue) 9%, var(--app-surface, #fff));
  color: var(--home-v2-blue);
  font-size: 10px;
  font-weight: 900;
}

.teacher-profile__available i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.teacher-profile__identity h1 {
  margin: 0;
  color: var(--app-text, #081b3a);
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.35;
  letter-spacing: -0.025em;
}

.teacher-profile__identity p {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 7px 0 0;
  color: var(--app-muted, #53627a);
  font-size: 13px;
}

.teacher-profile__identity svg {
  width: 15px;
  fill: none;
  stroke: var(--home-v2-blue);
  stroke-width: 1.7;
}

.teacher-profile__contacts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 28px 0 0;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--app-line, #e1e7f0);
}

.teacher-profile__contacts a {
  display: flex;
  min-width: 128px;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 15px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 13%, var(--app-line, #e1e7f0));
  border-radius: 13px;
  background: color-mix(in srgb, var(--home-v2-blue) 2.5%, var(--app-surface, #fff));
  color: var(--app-text, #081b3a);
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  transition: border-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.teacher-profile__contacts a:hover {
  transform: translateY(-2px);
  border-color: var(--home-v2-blue);
  color: var(--home-v2-blue);
}

.teacher-profile__contacts svg,
.teacher-profile__section header svg,
.teacher-profile__stats svg {
  width: 18px;
  fill: none;
  stroke: var(--home-v2-blue);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.teacher-profile__body {
  padding: 30px 0 36px;
}

.teacher-profile__section + .teacher-profile__section,
.teacher-profile__stats + .teacher-profile__section {
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--app-line, #e1e7f0);
}

.teacher-profile__section header {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
}

.teacher-profile__section header > span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--home-v2-blue) 9%, var(--app-surface, #fff));
}

.teacher-profile__section header svg {
  width: 17px;
}

.teacher-profile__section h2 {
  margin: 0;
  color: var(--app-text, #081b3a);
  font-size: 18px;
}

.teacher-profile__section > p {
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 14px;
  line-height: 2;
  white-space: pre-line;
}

.teacher-profile__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 30px 0 0;
}

.teacher-profile__stats > div {
  display: grid;
  min-height: 92px;
  place-items: center;
  align-content: center;
  gap: 7px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 12%, var(--app-line, #e1e7f0));
  border-radius: 15px;
  background: color-mix(in srgb, var(--home-v2-blue) 3%, var(--app-surface, #fff));
}

.teacher-profile__stats dt {
  color: var(--app-text, #081b3a);
  font-size: 20px;
  font-weight: 950;
}

.teacher-profile__stats dd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 10px;
}

.teacher-profile__stats svg {
  width: 15px;
}

.teacher-profile__courses-section {
  position: relative;
}

.teacher-profile__courses-section > p {
  padding-inline-end: min(210px, 28%);
}

.teacher-profile__courses-section > a {
  position: absolute;
  top: 28px;
  inset-inline-end: 0;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 11px;
  padding: 0 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--home-v2-blue), var(--home-v2-deep));
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  text-decoration: none;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--home-v2-blue) 18%, transparent);
}

.teacher-profile__location > p {
  padding-inline-start: 45px;
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
  .teacher-details-page { padding: 144px 0 64px; }
  .teacher-profile__cover { min-height: 190px; border-radius: 20px 20px 0 0; }
  .teacher-profile__back,
  .teacher-profile__share { top: 15px; }
  .teacher-profile__back { inset-inline-start: 15px; }
  .teacher-profile__share { inset-inline-end: 15px; }
  .teacher-profile__share > span { display: none; }
  .teacher-profile__share { width: 40px; padding: 0; }
  .teacher-profile__panel { padding: 78px 16px 0; border-radius: 0 0 20px 20px; }
  .teacher-profile__portrait { top: -82px; width: 144px; height: 144px; }
  .teacher-profile__identity h1 { font-size: 27px; }
  .teacher-profile__contacts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 22px; }
  .teacher-profile__contacts a { min-width: 0; padding: 0 10px; }
  .teacher-profile__body { padding: 24px 0 28px; }
  .teacher-profile__stats { grid-template-columns: 1fr; gap: 8px; }
  .teacher-profile__stats > div { display: flex; min-height: 66px; align-items: center; justify-content: space-between; padding: 0 16px; }
  .teacher-profile__stats dt { order: 2; font-size: 17px; }
  .teacher-profile__courses-section > p { padding-inline-end: 0; }
  .teacher-profile__courses-section > a { position: static; justify-content: center; margin-top: 16px; }
  .teacher-profile__location > p { padding-inline-start: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .teacher-details-page__state > span { animation: none; }
  .teacher-profile__contacts a { transition: none; }
}
</style>
