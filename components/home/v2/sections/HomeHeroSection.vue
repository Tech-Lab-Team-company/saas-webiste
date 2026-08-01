<script setup lang="ts">
import type {
  HomeHeroViewModel,
  HomeSiteViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  hero: HomeSectionState<HomeHeroViewModel | null>;
  site: HomeSiteViewModel;
}>();

const heroData = computed(() => props.hero.data);
const failedImageSources = ref<string[]>([]);
const imageIsAvailable = (src: string | undefined): boolean =>
  Boolean(src && !failedImageSources.value.includes(src));

const desktopHeroImage = computed(() =>
  imageIsAvailable(heroData.value?.image?.src) ? heroData.value?.image : null,
);
const mobileHeroImage = computed(() =>
  imageIsAvailable(heroData.value?.mobileImage?.src)
    ? heroData.value?.mobileImage
    : null,
);
const settingsLogo = computed(() =>
  imageIsAvailable(props.site.logo?.src) ? props.site.logo : null,
);
const settingsCover = computed(() =>
  imageIsAvailable(props.site.cover?.src) ? props.site.cover : null,
);
const heroImage = computed(
  () =>
    desktopHeroImage.value ||
    mobileHeroImage.value ||
    settingsCover.value ||
    settingsLogo.value,
);
const heroUsesSettingsLogo = computed(() =>
  Boolean(
    heroImage.value?.src && heroImage.value.src === settingsLogo.value?.src,
  ),
);

const handleHeroImageError = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement;
  const failedSource = image.currentSrc || image.src;

  if (failedSource && !failedImageSources.value.includes(failedSource)) {
    failedImageSources.value = [...failedImageSources.value, failedSource];
  }
};

const truncateText = (value: string, limit: number) => {
  const normalizedValue = value.replace(/\s+/g, " ").trim();

  return normalizedValue.length > limit
    ? `${normalizedValue.slice(0, limit).trimEnd()}…`
    : normalizedValue;
};

const heroContent = computed(() => ({
  title: heroData.value?.title || "تعلّم بخطوات مرتبة،",
  subtitle: heroData.value?.subtitle || "وكمّل بثقة.",
  text: truncateText(
    heroData.value?.description ||
      "تعلّم من محتوى منظم ومصمم لمساعدتك على التقدم بثقة.",
    120,
  ),
  link: heroData.value?.link || "#courses",
}));

const heroKicker = computed(() =>
  truncateText(props.site.brandName || "EduHub", 42),
);
</script>

<template>
  <section id="top" class="home-v2-hero" aria-labelledby="home-v2-hero-title">
    <div class="container home-v2-hero__layout">
      <div class="home-v2-hero__copy">
        <p class="home-v2-hero__kicker" :title="site.brandName || undefined">
          {{ heroKicker }}
        </p>
        <h1 id="home-v2-hero-title">
          {{ heroContent.title }}<br />
          <em>{{ heroContent.subtitle }}</em>
        </h1>
        <p>{{ heroContent.text }}</p>
        <div class="home-v2-hero__actions">
          <a class="button" :href="heroContent.link"
            >استكشف الكورسات <span aria-hidden="true">←</span></a
          >
          <NuxtLink class="home-v2-hero__secondary" to="/aboutus"
            >تعرّف على المنصة <span aria-hidden="true">↗</span></NuxtLink
          >
        </div>
      </div>

      <figure
        :class="[
          'home-v2-hero__visual',
          { 'home-v2-temporary-asset': !heroImage },
        ]"
        :aria-label="heroImage?.alt || 'صورة المنصة'"
      >
        <picture v-if="heroImage">
          <source
            v-if="mobileHeroImage && !heroUsesSettingsLogo"
            media="(max-width: 780px)"
            :srcset="mobileHeroImage.src"
          />
          <img
            :class="[
              'home-v2-hero__image',
              { 'home-v2-hero__image--logo': heroUsesSettingsLogo },
            ]"
            :src="heroImage.src"
            :alt="heroImage.alt"
            @error="handleHeroImageError"
          />
        </picture>
        <div v-else class="home-v2-hero__placeholder">
          <span aria-hidden="true">EDU</span>
          <strong>صورة المدرّس</strong>
          <small>سيتم استبدالها بالأصل المعتمد</small>
        </div>
        <span
          v-if="settingsLogo"
          class="home-v2-hero__brand-logo"
        >
          <img
            :src="settingsLogo.src"
            :alt="settingsLogo.alt || site.brandName || 'شعار المنصة'"
            @error="handleHeroImageError"
          />
        </span>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.home-v2-hero {
  position: relative;
  overflow: hidden;
  padding-top: 86px;
  background: var(--home-v2-blue);
  color: #fff;
}

.home-v2-hero__layout {
  display: grid;
  min-height: 630px;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  align-items: center;
  gap: clamp(42px, 6vw, 84px);
}

.home-v2-hero__copy {
  max-width: 680px;
  padding-block: 78px;
}

.home-v2-hero__kicker {
  display: block;
  width: fit-content;
  max-width: min(100%, 360px);
  margin: 0 0 18px;
  overflow: hidden;
  padding: 7px 12px;
  border: 1px solid #ffffff5c;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-v2-hero h1 {
  margin: 0;
  font: 900 clamp(46px, 5vw, 72px) / 1.18 var(--home-v2-heading);
  letter-spacing: -0.035em;
}

.home-v2-hero h1 em {
  color: color-mix(in srgb, var(--home-v2-blue-light) 80%, white);
  font-style: normal;
}

.home-v2-hero__copy > p:not(.home-v2-hero__kicker) {
  display: -webkit-box;
  max-width: 620px;
  overflow: hidden;
  color: #ffffffe0;
  font-size: 17px;
  line-height: 1.95;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-v2-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.home-v2-hero__secondary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  gap: 9px;
  border-bottom: 1px solid #ffffffb3;
  color: #fff;
  font-weight: 800;
}

.home-v2-hero__visual {
  position: relative;
  isolation: isolate;
  width: min(100%, 440px);
  aspect-ratio: 1086 / 1448;
  margin: 0;
  justify-self: center;
  overflow: hidden;
  border-radius: 20px 20px 120px 20px;
  background: #cfe0ff;
  box-shadow: 24px 28px 0
    color-mix(in srgb, var(--home-v2-blue) 10%, transparent);
}

.home-v2-hero .button {
  background: #fff;
  color: var(--home-v2-blue);
}

.home-v2-hero .button:hover {
  background: var(--home-v2-blue-light);
}

.home-v2-hero__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.home-v2-hero__image--logo {
  /* padding: clamp(36px, 8vw, 90px); */
  padding: 8px;
  background: #fff;
  object-fit: fill;
}

.home-v2-hero__visual picture {
  display: block;
  width: 100%;
  height: 100%;
}

.home-v2-hero__brand-logo {
  position: absolute;
  z-index: 2;
  top: 18px;
  inset-inline-start: 18px;
  display: grid;
  width: 74px;
  height: 74px;
  place-items: center;
  padding: 7px;
  border: 1px solid #ffffffa6;
  border-radius: 50%;
  background: #fffffff0;
  box-shadow: 0 10px 28px #06114738;
}

.home-v2-hero__brand-logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: contain;
}

.home-v2-hero__placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  place-content: center;
  gap: 8px;
  padding: 32px;
  text-align: center;
  background: radial-gradient(circle at 50% 30%, #fff 0 12%, transparent 12.5%),
    linear-gradient(155deg, #ddebff, #7fb6f7);
  color: var(--home-v2-deep);
}

.home-v2-hero__placeholder span {
  font: 900 clamp(65px, 11vw, 120px) / 0.8 var(--home-v2-heading);
  letter-spacing: -0.1em;
  opacity: 0.18;
}

.home-v2-hero__placeholder strong {
  font: 900 22px var(--home-v2-heading);
}

.home-v2-hero__placeholder small {
  font-size: 13px;
}

@media (max-width: 780px) {
  .home-v2-hero__layout {
    min-height: 0;
    grid-template-columns: 1fr;
    padding-top: 25px;
  }

  .home-v2-hero__copy {
    padding-bottom: 20px;
  }

  .home-v2-hero__visual {
    width: min(84%, 350px);
    margin-bottom: 48px;
  }
}
</style>
