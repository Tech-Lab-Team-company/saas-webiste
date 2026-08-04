<script setup lang="ts">
import "~/assets/css/home-v2.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

definePageMeta({ layout: "home-v2" });

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));

const cleanLink = (value: string | null) => {
  const link = value?.trim();
  return link && link !== "-" ? link : null;
};

const androidUrl = computed(() => cleanLink(site.value.app.androidUrl));
const iosUrl = computed(() => cleanLink(site.value.app.iosUrl));

useSeoMeta({
  title: () => `التطبيق | ${site.value.brandName || "EduHub"}`,
  description: () =>
    `حمّل تطبيق ${site.value.brandName || "المنصة"} على Android أو iPhone وتابع المحتوى من موبايلك.`,
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div
    class="home-v2 app-page"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />

    <main class="app-page__main">
      <div class="app-page__wrap">
        <header class="app-page__intro">
          <span>{{ site.brandName || "EduHub" }} على الموبايل</span>
          <h1>التطبيق على Android وiPhone</h1>
          <p>
            حمّل تطبيق {{ site.brandName || "المنصة" }} على موبايلك، أو تابع
            تجربة المنصة مباشرة من الويب.
          </p>
        </header>

        <section class="app-page__card" aria-labelledby="app-options-title">
          <div class="app-page__phone">
            <NuxtImg
              src="/images/eslam-salama-app-screen.webp"
              :alt="`واجهة تطبيق ${site.brandName || 'المنصة'}`"
              width="380"
              height="675"
              loading="eager"
            />
          </div>

          <div class="app-page__content">
            <span class="app-page__kind">التطبيق والويب</span>
            <h2 id="app-options-title">اختار الطريقة المناسبة لك</h2>
            <p>
              استعرض الكورسات والمذكرات على الموقع، أو حمّل التطبيق من
              الرابط المناسب لنظام موبايلك.
            </p>

            <ol class="app-page__steps">
              <li><span>1</span><div>استعرض الكورسات وحدد الصف الدراسي المناسب.</div></li>
              <li><span>2</span><div>افتح مساحة الطالب وتابع المحتوى من الويب.</div></li>
              <li><span>3</span><div>حمّل التطبيق على Android أو iPhone وكمّل مذاكرتك.</div></li>
            </ol>
          </div>
        </section>

        <nav class="app-page__links" aria-label="روابط التطبيق والمنصة">
          <a v-if="androidUrl" class="app-page__store-button" :href="androidUrl" target="_blank" rel="noreferrer">
            <span class="app-page__store-icon" aria-hidden="true">▶</span>
            <span><small>حمّل الآن من</small><b>Google Play</b></span>
          </a>
          <span v-else class="app-page__link-disabled">رابط Android غير متاح</span>
          <a v-if="iosUrl" class="app-page__store-button" :href="iosUrl" target="_blank" rel="noreferrer">
            <span class="app-page__store-icon app-page__store-icon--apple" aria-hidden="true">●</span>
            <span><small>حمّل الآن من</small><b>App Store</b></span>
          </a>
          <span v-else class="app-page__link-disabled">رابط iPhone غير متاح</span>
          <NuxtLink to="/course">تصفّح الكورسات</NuxtLink>
          <NuxtLink to="/books">افتح المذكرات</NuxtLink>
          <NuxtLink to="/profile">افتح مساحة الطالب</NuxtLink>
          <NuxtLink to="/home-v2">العودة للرئيسية</NuxtLink>
        </nav>
        <p class="app-page__hint">اختار نظام موبايلك وابدأ من الرابط المناسب.</p>
      </div>
    </main>

    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.app-page__main {
  min-height: 680px;
  padding: 156px 0 90px;
  background:
    radial-gradient(circle at 15% 17%, color-mix(in srgb, var(--home-v2-blue) 22%, transparent), transparent 30%),
    linear-gradient(135deg, color-mix(in srgb, var(--home-v2-blue) 8%, #f8f6ee) 0%, #f7f8f4 48%, color-mix(in srgb, var(--home-v2-blue) 10%, #eef4f1) 100%);
  overflow: hidden;
}

.app-page__wrap { width: min(900px, calc(100% - 48px)); margin: 0 auto; }
.app-page__intro { max-width: 650px; margin: 0 auto 32px; text-align: center; animation: app-fade-up .7s ease both; }
.app-page__intro > span { color: var(--home-v2-blue); font-size: 14px; font-weight: 900; }
.app-page__intro h1 { margin: 10px 0; color: var(--home-v2-ink); font: 900 clamp(34px, 5vw, 54px)/1.3 var(--home-v2-heading); letter-spacing: -.035em; }
.app-page__intro p, .app-page__content > p { margin: 0; color: var(--home-v2-muted); line-height: 1.9; }
.app-page__intro p { font-size: 16px; }

.app-page__card { display: grid; grid-template-columns: 190px minmax(0, 1fr); min-height: 362px; overflow: hidden; border: 1px solid var(--home-v2-line); background: #fff; box-shadow: 0 30px 75px -48px color-mix(in srgb, var(--home-v2-deep) 55%, transparent); animation: app-card-in .8s .12s cubic-bezier(.2,.8,.2,1) both; }
.app-page__phone { position: relative; display: flex; min-height: 362px; justify-content: center; align-items: center; overflow: hidden; background: linear-gradient(160deg, var(--home-v2-deep), color-mix(in srgb, var(--home-v2-blue) 65%, #06112f)); }
.app-page__phone::before, .app-page__phone::after { position: absolute; width: 140px; height: 140px; border-radius: 50%; background: rgb(255 255 255 / 13%); content: ""; }
.app-page__phone::before { top: -82px; right: -25px; }
.app-page__phone::after { bottom: -85px; left: -48px; }
.app-page__phone :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.app-page__content { padding: 36px 40px; }
.app-page__kind { display: inline-flex; padding: 6px 9px; color: var(--home-v2-blue); background: var(--home-v2-blue-light); font-size: 13px; font-weight: 900; }
.app-page__content h2 { margin: 12px 0 8px; color: var(--home-v2-ink); font: 900 25px/1.45 var(--home-v2-heading); }
.app-page__content > p { font-size: 15px; }
.app-page__steps { display: grid; gap: 10px; margin: 24px 0 0; padding: 22px 0 0; border-top: 1px solid var(--home-v2-line); list-style: none; }
.app-page__steps li { display: grid; grid-template-columns: 25px 1fr; align-items: start; gap: 9px; color: var(--home-v2-muted); font-size: 14px; line-height: 1.8; animation: app-fade-up .5s both; }
.app-page__steps li:nth-child(1) { animation-delay: .42s; }
.app-page__steps li:nth-child(2) { animation-delay: .52s; }
.app-page__steps li:nth-child(3) { animation-delay: .62s; }
.app-page__steps span { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 50%; color: var(--home-v2-blue); background: var(--home-v2-blue-light); font-weight: 900; }

.app-page__links { display: flex; flex-wrap: wrap; justify-content: center; align-items: stretch; gap: 10px; margin-top: 18px; animation: app-fade-up .65s .55s both; }
.app-page__links a, .app-page__link-disabled { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; padding: 11px 17px; border: 1px solid color-mix(in srgb, var(--home-v2-blue) 30%, #ccd8d4); background: #fff; color: var(--home-v2-ink); font-size: 14px; font-weight: 900; box-shadow: 0 8px 22px rgb(12 35 68 / 6%); transition: transform .22s ease, color .22s ease, background .22s ease, border-color .22s ease, box-shadow .22s ease; }
.app-page__links a:hover { border-color: var(--home-v2-blue); background: var(--home-v2-blue); color: #fff; box-shadow: 0 13px 28px color-mix(in srgb, var(--home-v2-blue) 28%, transparent); transform: translateY(-3px); }
.app-page__links .app-page__store-button { min-width: 176px; justify-content: flex-start; gap: 11px; border-color: var(--home-v2-blue); background: linear-gradient(135deg, var(--home-v2-blue), var(--home-v2-deep)); color: #fff; }
.app-page__store-button > span:last-child { display: grid; text-align: right; line-height: 1.1; }
.app-page__store-button small { color: rgb(255 255 255 / 72%); font-size: 10px; font-weight: 700; }
.app-page__store-button b { margin-top: 3px; font: 900 16px/1 var(--home-v2-heading); }
.app-page__store-icon { display: grid; width: 27px; height: 27px; flex: 0 0 27px; place-items: center; border-radius: 50%; background: rgb(255 255 255 / 16%); font-size: 12px; }
.app-page__store-icon--apple { font-size: 17px; }
.app-page__link-disabled { cursor: not-allowed; opacity: .52; }
.app-page__hint { max-width: 660px; margin: 22px auto 0; color: var(--home-v2-muted); text-align: center; font-size: 13px; line-height: 1.8; }

@keyframes app-fade-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes app-card-in { from { opacity: 0; transform: translateY(28px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

@media (max-width: 650px) {
  .app-page__main { padding: 126px 0 70px; }
  .app-page__wrap { width: min(900px, calc(100% - 28px)); }
  .app-page__card { grid-template-columns: 1fr; }
  .app-page__phone { min-height: 190px; max-height: 240px; }
  .app-page__phone :deep(img) { width: 135px; height: auto; align-self: flex-start; object-fit: cover; object-position: top; }
  .app-page__content { padding: 27px 21px; }
  .app-page__links a, .app-page__link-disabled { flex: 1 1 calc(50% - 10px); }
  .app-page__links .app-page__store-button { flex-basis: calc(50% - 10px); min-width: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .app-page__intro, .app-page__card, .app-page__links, .app-page__steps li { animation: none; }
  .app-page__links a { transition: none; }
}
</style>
