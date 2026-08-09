<script setup lang="ts">
import { gsap } from "gsap";
import "~/assets/css/home-v2.css";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapBlogsPage,
  mapHeroSection,
  mapHomeSite,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeHeroViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import { HeroSectionTypeEnum } from "~/features/HomePageFeature/types/homePage.types";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

definePageMeta({ layout: "home-v2" });

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const webDomain = getWebDomain();
const api = new HomePageApi(webDomain);
const { data: blogHero } = await useAsyncData<HomeHeroViewModel | null>(
  `blogs-hero:${webDomain}:${HeroSectionTypeEnum.BLOGS_API_WEBSITE}`,
  async () => mapHeroSection(
    await api.fetchHeroSections(HeroSectionTypeEnum.BLOGS_API_WEBSITE),
    HeroSectionTypeEnum.BLOGS_API_WEBSITE,
  ),
  {
    default: () => null,
    dedupe: "defer",
  },
);
const {
  data: blogs,
  pending,
  error,
  refresh,
} = await useAsyncData(
  `blogs-page:${webDomain}`,
  async () => mapBlogsPage(await api.fetchBlogs()),
  { default: () => [] },
);
const heroTitle = computed(
  () => blogHero.value?.title?.trim() || "",
);
const heroEyebrow = computed(
  () => blogHero.value?.subtitle?.trim() || "",
);
const heroDescription = computed(
  () => blogHero.value?.description?.trim() || "",
);
const heroDesktopImage = computed(() => blogHero.value?.image?.src || null);
const heroMobileImage = computed(() => blogHero.value?.mobileImage?.src || null);
const heroImageAlt = computed(
  () => blogHero.value?.image?.alt || blogHero.value?.mobileImage?.alt || "",
);
const hasHeroContent = computed(() =>
  Boolean(
    heroTitle.value ||
      heroEyebrow.value ||
      heroDescription.value ||
      heroDesktopImage.value ||
      heroMobileImage.value,
  ),
);
const tones = ["navy", "blue", "coral"] as const;

const formatDate = (date: string | null) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

const blogPageRef = ref<HTMLElement | null>(null);
let blogAnimationContext: ReturnType<typeof gsap.context> | null = null;
let blogSectionObserver: IntersectionObserver | null = null;

const animateBlogCards = (section: HTMLElement) => {
  const headingItems = section.querySelectorAll<HTMLElement>(
    ".blog-listing__section-heading > *",
  );
  const cards = section.querySelectorAll<HTMLElement>(".blog-listing__card");
  const markers = section.querySelectorAll<HTMLElement>(
    ".blog-listing__visual > strong",
  );
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  timeline
    .fromTo(
      headingItems,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        stagger: 0.1,
        clearProps: "opacity,visibility,transform",
      },
    )
    .fromTo(
      cards,
      { autoAlpha: 0, y: 56, scale: 0.96, rotationX: -7 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.82,
        stagger: 0.12,
        clearProps: "opacity,visibility,transform",
      },
      0.25,
    )
    .fromTo(
      markers,
      { autoAlpha: 0, scale: 0.72, rotation: -8 },
      {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: 0.68,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "opacity,visibility,transform",
      },
      0.52,
    );
};

onMounted(() => {
  const root = blogPageRef.value;
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  blogAnimationContext = gsap.context(() => {
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    const heroCopy = root.querySelectorAll<HTMLElement>(
      ".blog-listing__eyebrow, .blog-listing__hero-copy h1, .blog-listing__hero-copy > p, .blog-listing__hero-meta > span",
    );
    const method = root.querySelector<HTMLElement>(
      ".blog-listing__hero-empty, .blog-listing__hero-visual",
    );
    const methodContent = root.querySelectorAll<HTMLElement>(
      ".blog-listing__hero-visual img",
    );
    const articleHeadingItems = root.querySelectorAll<HTMLElement>(
      ".blog-listing__section-heading > *",
    );
    const articleCards = root.querySelectorAll<HTMLElement>(
      ".blog-listing__card",
    );
    const articleMarkers = root.querySelectorAll<HTMLElement>(
      ".blog-listing__visual > strong",
    );

    // Keep the article reveal ready until the reader actually reaches it.
    gsap.set(articleHeadingItems, { autoAlpha: 0, y: 30 });
    gsap.set(articleCards, {
      autoAlpha: 0,
      y: 56,
      scale: 0.96,
      rotationX: -7,
    });
    gsap.set(articleMarkers, {
      autoAlpha: 0,
      scale: 0.72,
      rotation: -8,
    });

    heroTimeline
      .fromTo(
        heroCopy,
        { autoAlpha: 0, x: 38, y: 18 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.76,
          stagger: 0.1,
          clearProps: "opacity,visibility,transform",
        },
      )
      .fromTo(
        method,
        { autoAlpha: 0, x: -52, y: 30, scale: 0.92, rotation: -2.5 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.95,
          ease: "back.out(1.25)",
          clearProps: "opacity,visibility,transform",
        },
        0.16,
      )
      .fromTo(
        methodContent,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.08,
          clearProps: "opacity,visibility,transform",
        },
        0.48,
      );

    if (method) {
      gsap.to(method, {
        y: -7,
        duration: 3.2,
        delay: 1.55,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, root);

  const articleSection = root.querySelector<HTMLElement>(".blog-listing__main");
  const articleTrigger = root.querySelector<HTMLElement>(
    ".blog-listing__section-heading",
  );
  if (!articleSection || !articleTrigger) return;

  const revealArticles = () => {
    blogAnimationContext?.add(() => animateBlogCards(articleSection));
  };

  if (!("IntersectionObserver" in window)) {
    revealArticles();
    return;
  }

  blogSectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      revealArticles();
      blogSectionObserver?.disconnect();
    },
    { threshold: 0.2, rootMargin: "0px 0px -40% 0px" },
  );
  blogSectionObserver.observe(articleTrigger);
});

onBeforeUnmount(() => {
  blogSectionObserver?.disconnect();
  blogAnimationContext?.revert();
  blogSectionObserver = null;
  blogAnimationContext = null;
});

useSeoMeta({
  title: () => blogHero.value?.title
    ? `${blogHero.value.title}${site.value.brandName ? ` | ${site.value.brandName}` : ""}`
    : `المدونة${site.value.brandName ? ` | ${site.value.brandName}` : ""}`,
  description: () => blogHero.value?.description || undefined,
  ogImage: () => heroDesktopImage.value || heroMobileImage.value || undefined,
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div
    ref="blogPageRef"
    class="home-v2 blog-listing"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${
        site.colors.primary || '#28366c'
      } 14%, white)`,
    }"
  >
    <main class="blog-listing__page">
      <header class="blog-listing__hero">
        <div v-if="!hasHeroContent" class="container blog-listing__hero-empty">
          <HomeSectionEmptyState
            tone="dark"
            label="واجهة المدونة"
            title="أضف محتوى واجهة المدونة"
            description="أضف العنوان والوصف والصورة من لوحة التحكم ليظهر قسم المدونة هنا."
          />
        </div>

        <div v-else class="container blog-listing__hero-grid">
          <div class="blog-listing__hero-copy">
            <span v-if="heroEyebrow" class="blog-listing__eyebrow">{{ heroEyebrow }}</span>
            <h1 v-if="heroTitle">{{ heroTitle }}</h1>
            <p v-if="heroDescription">{{ heroDescription }}</p>
            <div class="blog-listing__hero-meta" aria-label="معلومات المدونة">
              <span><b>{{ blogs.length }}</b> مقالات عملية</span>
              <span><b>100%</b> قراءة مجانية</span>
            </div>
          </div>

          <figure
            v-if="heroDesktopImage || heroMobileImage"
            class="blog-listing__hero-visual"
          >
            <picture>
              <source
                v-if="heroMobileImage"
                media="(max-width: 700px)"
                :srcset="heroMobileImage"
              />
              <NuxtImg
                :src="heroDesktopImage || heroMobileImage || ''"
                :alt="heroImageAlt"
                width="760"
                height="760"
                sizes="(max-width: 940px) 100vw, 38vw"
                loading="eager"
              />
            </picture>
          </figure>

          <HomeSectionEmptyState
            v-else
            compact
            tone="dark"
            label="صورة المدونة"
            title="أضف صورة الواجهة"
            description="أضف صورة قسم المدونة من لوحة التحكم."
          />
        </div>
      </header>

      <section class="blog-listing__main" aria-labelledby="blog-listing-title">
        <div class="container">
          <header class="blog-listing__section-heading">
            <div>
              <span>ابدأ بالمشكلة اللي بتقابلك</span>
              <h2 id="blog-listing-title">
                مقالات قصيرة، وخطوات قابلة للتطبيق.
              </h2>
            </div>
            <p>كل مقال مستقل؛ اختار الموضوع المناسب لك وابدأ منه مباشرة.</p>
          </header>

          <div class="blog-listing__grid">
            <article
              v-for="(blog, index) in blogs"
              :key="blog.id"
              :class="[
                'blog-listing__card',
                `blog-listing__card--${tones[index % tones.length]}`,
                { 'blog-listing__card--featured': index === 0 },
              ]"
            >
              <NuxtLink :to="blog.route" class="blog-listing__card-link">
                <div class="blog-listing__visual" aria-hidden="true">
                  <span v-if="blog.subtitle">{{ blog.subtitle }}</span>
                  <strong>{{ String(index + 1).padStart(2, "0") }}</strong>
                  <small>{{ String(index + 1).padStart(2, "0") }}</small>
                </div>
                <div class="blog-listing__card-body">
                  <div class="blog-listing__card-meta">
                    <span v-if="blog.subtitle">{{ blog.subtitle }}</span>
                    <time v-if="blog.date" :datetime="blog.date">{{
                      formatDate(blog.date)
                    }}</time>
                  </div>
                  <h2>{{ blog.title }}</h2>
                  <p v-if="blog.description">{{ blog.description }}</p>
                  <span class="blog-listing__read"
                    >اقرأ المقال <i aria-hidden="true">←</i></span
                  >
                </div>
              </NuxtLink>
            </article>
          </div>
          <div v-if="pending" class="blog-listing__state" role="status">
            جاري تحميل المقالات…
          </div>
          <div v-else-if="error" class="blog-listing__state" role="alert">
            <p>تعذر تحميل المقالات في الوقت الحالي.</p>
            <button type="button" @click="refresh">إعادة المحاولة</button>
          </div>
          <div v-else-if="!blogs.length" class="blog-listing__state">
            لا توجد مقالات متاحة حاليًا.
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.blog-listing__page {
  min-height: 100dvh;
  padding-top: 86px;
  overflow: clip;
  background: var(--home-v2-paper);
  color: var(--home-v2-ink);
}

.blog-listing__state {
  margin-top: 28px;
  padding: 30px;
  border: 1px solid var(--home-v2-line);
  border-radius: 12px;
  background: var(--home-v2-surface);
  color: var(--home-v2-muted);
  text-align: center;
}

.blog-listing__state p {
  margin: 0 0 12px;
}
.blog-listing__state button {
  padding: 9px 15px;
  border: 1px solid var(--home-v2-blue);
  border-radius: 7px;
  background: transparent;
  color: var(--home-v2-blue);
  cursor: pointer;
  font-family: inherit;
  font-weight: 900;
}

.blog-listing__hero {
  position: relative;
  overflow: hidden;
  background: var(--home-v2-deep);
  color: #fff;
}

.blog-listing__hero-empty {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: 540px;
  align-items: center;
  padding-block: 54px;
}

.blog-listing__hero::before,
.blog-listing__hero::after {
  position: absolute;
  border: 1px solid #ffffff1a;
  border-radius: 50%;
  content: "";
}

.blog-listing__hero::before {
  top: -330px;
  left: -320px;
  width: 560px;
  height: 560px;
}

.blog-listing__hero::after {
  right: -150px;
  bottom: -165px;
  width: 250px;
  height: 250px;
  border: 56px solid color-mix(in srgb, var(--home-v2-blue) 26%, transparent);
}

.blog-listing__hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: 540px;
  grid-template-columns: minmax(0, 1.1fr) minmax(310px, 0.7fr);
  align-items: center;
  gap: clamp(50px, 8vw, 110px);
  padding-block: 72px;
}

.blog-listing__eyebrow,
.blog-listing__section-heading span {
  color: var(--home-v2-coral);
  font-size: 13px;
  font-weight: 900;
}

.blog-listing__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.blog-listing__eyebrow::before {
  width: 34px;
  height: 2px;
  background: var(--home-v2-coral);
  content: "";
}

.blog-listing__hero-copy h1 {
  max-width: 720px;
  margin: 16px 0 18px;
  font: 900 clamp(48px, 5.3vw, 74px) / 1.16 var(--home-v2-heading);
  letter-spacing: -0.04em;
}

.blog-listing__hero-copy h1 em {
  color: var(--home-v2-coral);
  font-style: normal;
}

.blog-listing__hero-copy > p {
  max-width: 650px;
  margin: 0;
  color: #ffffffbd;
  font-size: 17px;
  line-height: 1.9;
}

.blog-listing__hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 28px;
}

.blog-listing__hero-meta span {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 7px;
  color: #ffffffb3;
  font-size: 13px;
}

.blog-listing__hero-meta b {
  color: #fff;
  font: 900 19px var(--home-v2-heading);
}

.blog-listing__hero-visual {
  position: relative;
  min-height: 390px;
  margin: 0;
  overflow: hidden;
  border: 1px solid #ffffff2e;
  background: #ffffff12;
  box-shadow: 24px 24px color-mix(in srgb, var(--home-v2-blue) 32%, transparent);
}

.blog-listing__hero-visual::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(145deg, transparent 52%, color-mix(in srgb, var(--home-v2-deep) 42%, transparent));
  content: "";
  pointer-events: none;
}

.blog-listing__hero-visual picture,
.blog-listing__hero-visual img {
  display: block;
  width: 100%;
  height: 100%;
}

.blog-listing__hero-visual img {
  position: absolute;
  inset: 0;
  object-fit: cover;
}

.blog-listing__main {
  padding: 86px 0 100px;
}

.blog-listing__section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.52fr);
  align-items: end;
  gap: 65px;
  margin-bottom: 34px;
}

.blog-listing__section-heading h2 {
  margin: 7px 0 0;
  font: 900 clamp(30px, 3.4vw, 46px) / 1.35 var(--home-v2-heading);
  letter-spacing: -0.03em;
}

.blog-listing__section-heading > p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 15px;
  line-height: 1.85;
}

.blog-listing__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.blog-listing__card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 12px;
  background: var(--home-v2-surface);
  box-shadow: 0 24px 60px -48px #0611478c;
  transition: transform 0.2s, box-shadow 0.2s;
}

.blog-listing__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 34px 70px -48px #061147a6;
}

.blog-listing__card--featured {
  grid-column: 1 / -1;
}

.blog-listing__card-link {
  display: grid;
  min-height: 100%;
  grid-template-rows: 225px 1fr;
  color: inherit;
}

.blog-listing__card--featured .blog-listing__card-link {
  grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1.22fr);
  grid-template-rows: minmax(300px, auto);
}

.blog-listing__visual {
  position: relative;
  overflow: hidden;
  padding: 24px;
  background: var(--home-v2-deep);
  color: #fff;
}

.blog-listing__visual::before,
.blog-listing__visual::after {
  position: absolute;
  border: 1px solid;
  border-radius: 50%;
  opacity: 0.15;
  content: "";
}

.blog-listing__visual::before {
  bottom: -120px;
  left: -95px;
  width: 220px;
  height: 220px;
}

.blog-listing__visual::after {
  bottom: -52px;
  left: -32px;
  width: 105px;
  height: 105px;
}

.blog-listing__visual > span {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 900;
}

.blog-listing__visual > strong {
  position: absolute;
  z-index: 1;
  right: 24px;
  bottom: 20px;
  font: 900 clamp(58px, 8vw, 110px) / 1 var(--home-v2-heading);
  letter-spacing: -0.08em;
}

.blog-listing__visual > small {
  position: absolute;
  top: 21px;
  left: 23px;
  font: 900 13px var(--home-v2-heading);
}

.blog-listing__card--blue .blog-listing__visual {
  background: var(--home-v2-blue);
}

.blog-listing__card--coral .blog-listing__visual {
  background: var(--home-v2-coral);
  color: #081b3a;
}

.blog-listing__card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
}

.blog-listing__card--featured .blog-listing__card-body {
  justify-content: center;
  padding: clamp(32px, 5vw, 58px);
}

.blog-listing__card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 17px;
  color: var(--home-v2-muted);
  font-size: 12px;
  font-weight: 800;
}

.blog-listing__card-meta span:first-child {
  color: var(--home-v2-blue);
}

.blog-listing__card-body h2 {
  margin: 13px 0 9px;
  color: var(--home-v2-ink);
  font: 900 clamp(21px, 2.2vw, 31px) / 1.45 var(--home-v2-heading);
  letter-spacing: -0.02em;
}

.blog-listing__card-body p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 15px;
  line-height: 1.85;
}

.blog-listing__read {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 18px;
  margin-top: auto;
  padding-top: 20px;
  color: var(--home-v2-blue);
  font-size: 14px;
  font-weight: 900;
}

.blog-listing__read i {
  color: var(--home-v2-coral);
  font-size: 18px;
  font-style: normal;
}

@media (max-width: 940px) {
  .blog-listing__hero-grid {
    grid-template-columns: 1fr;
    gap: 38px;
    padding-block: 64px;
  }

  .blog-listing__hero-visual {
    width: min(620px, 100%);
  }

  .blog-listing__section-heading {
    grid-template-columns: 1fr;
    gap: 13px;
  }
}

@media (max-width: 720px) {
  .blog-listing__hero-visual {
    min-height: 320px;
    box-shadow: 12px 12px color-mix(in srgb, var(--home-v2-blue) 32%, transparent);
  }

  .blog-listing__grid {
    grid-template-columns: 1fr;
  }

  .blog-listing__card--featured {
    grid-column: auto;
  }

  .blog-listing__card--featured .blog-listing__card-link {
    grid-template-columns: 1fr;
    grid-template-rows: 225px 1fr;
  }
}

@media (max-width: 560px) {
  .blog-listing__page {
    padding-top: 76px;
  }

  .blog-listing__hero-grid {
    min-height: 0;
    padding-block: 52px;
  }

  .blog-listing__hero-copy h1 {
    font-size: 42px;
  }

  .blog-listing__hero-copy > p {
    font-size: 15px;
  }

  .blog-listing__main {
    padding-block: 66px 76px;
  }

  .blog-listing__card-body,
  .blog-listing__card--featured .blog-listing__card-body {
    padding: 24px;
  }

  .blog-listing__card-body h2 {
    font-size: 23px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-listing__card {
    transition: none;
  }
}
</style>
