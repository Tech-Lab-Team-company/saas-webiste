<script setup lang="ts">
import type {
  HomeHeroViewModel,
  HomeSiteViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";
import { getDescriptiveImageAlt } from "~/utils/imageAlt";

const HomeSectionEmptyState = defineAsyncComponent(() =>
  import("~/components/home/v2/ui/HomeSectionEmptyState.vue"),
);

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

const handleHeroImageError = (failedSource: string | undefined) => {
  if (failedSource && !failedImageSources.value.includes(failedSource)) {
    failedImageSources.value = [...failedImageSources.value, failedSource];
  }
};

const HERO_TITLE_LIMIT = 100;
const TYPEWRITER_PHRASE_LIMIT = 80;

const HERO_DESCRIPTION_LIMIT = 120;

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const splitGraphemes = (value: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("ar", { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), ({ segment }) => segment);
  }

  return Array.from(value);
};

const truncateText = (value: string, limit: number) => {
  const normalizedValue = normalizeText(value);
  const graphemes = splitGraphemes(normalizedValue);

  if (graphemes.length <= limit) return normalizedValue;

  const limitedValue = graphemes.slice(0, limit).join("").trimEnd();
  const lastSpaceIndex = limitedValue.lastIndexOf(" ");
  const wordBoundary = Math.floor(limitedValue.length * 0.65);
  const safeValue =
    lastSpaceIndex >= wordBoundary
      ? limitedValue.slice(0, lastSpaceIndex).trimEnd()
      : limitedValue;

  return `${safeValue}…`;
};

const rawHeroSubtitle = computed(() =>
  normalizeText(heroData.value?.subtitle || ""),
);
const heroTitleUsesSiteFallback = computed(
  () =>
    props.hero.status !== "error" &&
    !normalizeText(heroData.value?.title || "") &&
    Boolean(normalizeText(props.site.brandName || "")),
);
const heroDescriptionUsesSiteFallback = computed(
  () =>
    props.hero.status !== "error" &&
    !normalizeText(heroData.value?.description || "") &&
    Boolean(normalizeText(props.site.description || "")),
);
const hasOversizedSubtitle = computed(
  () => splitGraphemes(rawHeroSubtitle.value).length > TYPEWRITER_PHRASE_LIMIT,
);

const heroContent = computed(() => ({
  title: truncateText(
    heroData.value?.title ||
      (heroTitleUsesSiteFallback.value ? props.site.brandName || "" : ""),
    HERO_TITLE_LIMIT,
  ),
  subtitle: truncateText(rawHeroSubtitle.value, TYPEWRITER_PHRASE_LIMIT),
  text: truncateText(
    heroData.value?.description ||
      (heroDescriptionUsesSiteFallback.value
        ? props.site.description || ""
        : ""),
    HERO_DESCRIPTION_LIMIT,
  ),
  link: heroData.value?.link || "",
}));

const heroHeading = computed(() =>
  [heroContent.value.title, heroContent.value.subtitle]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+([.!،؛؟])/gu, "$1"),
);

const heroLead = computed(() => {
  const heading = heroHeading.value;
  const body = heroContent.value.text;

  if (!heading) return body;
  if (!body) return heading;
  if (normalizeText(body).includes(normalizeText(heading))) return body;

  return `${heading} — ${body}`;
});

const heroImageAlt = computed(() => {
  const brandName = normalizeText(props.site.brandName || "");
  const fallback = heroUsesSettingsLogo.value
    ? `شعار ${brandName || "المنصة التعليمية"}`
    : heroHeading.value
      ? `صورة توضيحية: ${heroHeading.value}`
      : `صورة الواجهة الرئيسية لـ${brandName || "المنصة التعليمية"}`;

  return getDescriptiveImageAlt(heroImage.value?.alt, fallback);
});

const heroKicker = computed(() =>
  heroTitleUsesSiteFallback.value
    ? ""
    : truncateText(props.site.brandName || "", 42),
);

const hasHeroContent = computed(() =>
  Boolean(
    props.hero.status !== "error" &&
      (heroContent.value.title ||
        heroContent.value.subtitle ||
        heroContent.value.text ||
        heroContent.value.link ||
        heroData.value?.image ||
        heroData.value?.mobileImage),
  ),
);

const emptyStateTitle = computed(() =>
  props.hero.status === "error"
    ? "تعذر تحميل الواجهة الرئيسية"
    : "أضف محتوى الواجهة الرئيسية",
);

const emptyStateDescription = computed(() =>
  props.hero.status === "error"
    ? "تعذر جلب بيانات القسم في الوقت الحالي. حاول مرة أخرى بعد التأكد من الخدمة."
    : "أضف العنوان والوصف والصورة من لوحة التحكم ليظهر القسم الرئيسي هنا.",
);

const prefersReducedMotion = ref(false);
const typedText = computed(() => heroContent.value.subtitle);

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
});
</script>

<template>
  <section
    id="top"
    class="home-v2-hero"
    :aria-labelledby="hasHeroContent && heroContent.title ? 'home-v2-hero-title' : undefined"
  >
    <div class="home-v2-hero__ambient" aria-hidden="true">
      <span class="home-v2-hero__ambient-grid" />
      <span class="home-v2-hero__ambient-orb home-v2-hero__ambient-orb--one" />
      <span class="home-v2-hero__ambient-orb home-v2-hero__ambient-orb--two" />
    </div>
    <div v-if="!hasHeroContent" class="container home-v2-hero__empty">
      <HomeSectionEmptyState
        tone="dark"
        label="قسم الواجهة الرئيسية"
        :title="emptyStateTitle"
        :description="emptyStateDescription"
      />
    </div>

    <div v-else class="container home-v2-hero__layout">
      <div class="home-v2-hero__copy">
        <p
          v-if="heroKicker"
          class="home-v2-hero__kicker"
          :title="site.brandName || undefined"
        >
          {{ heroKicker }}
        </p>
        <h1 v-if="heroContent.title || heroContent.subtitle" id="home-v2-hero-title">
          <span v-if="heroContent.title" class="home-v2-hero__title-line">
            {{ heroContent.title }}
          </span>
          <em
            v-if="heroContent.subtitle"
            :class="[
              'home-v2-hero__title-line home-v2-hero__typewriter',
              {
                'home-v2-hero__typewriter--static':
                  hasOversizedSubtitle || prefersReducedMotion,
              },
            ]"
          >
            <span>{{ typedText }}</span>
            <span
              v-if="!hasOversizedSubtitle"
              aria-hidden="true"
              class="home-v2-hero__typewriter-cursor"
            />
            <span
              class="home-v2-hero__typewriter-underline"
              aria-hidden="true"
            />
          </em>
        </h1>
        <p v-if="heroLead">{{ heroLead }}</p>
        <div v-if="heroContent.link" class="home-v2-hero__actions">
          <a class="button" :href="heroContent.link"
            >استكشف الكورسات <span aria-hidden="true">←</span></a
          >
          <NuxtLink
            class="home-v2-hero__secondary"
            to="/about-teacher"
            prefetch-on="interaction"
            >تعرّف على المنصة <span aria-hidden="true">↗</span></NuxtLink
          >
        </div>
      </div>

      <figure
        class="home-v2-hero__visual"
        :aria-label="heroImageAlt"
      >
        <picture v-if="heroImage">
          <source
            v-if="mobileHeroImage?.src && !heroUsesSettingsLogo"
            media="(max-width: 780px)"
            :srcset="mobileHeroImage.src"
          />
          <img
            :class="[
              'home-v2-hero__image',
              { 'home-v2-hero__image--logo': heroUsesSettingsLogo },
            ]"
            :src="heroImage.src"
            :alt="heroImageAlt"
            width="1086"
            height="1448"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            @error="handleHeroImageError(heroImage?.src)"
          />
        </picture>
        <HomeSectionEmptyState
          v-else
          compact
          label="صورة القسم"
          title="أضف صورة الواجهة"
          description="أضف الصورة من لوحة التحكم لتظهر هنا."
        />
        <span v-if="!heroImage" class="home-v2-hero__visual-note">مورد مؤقت</span>
        <span v-if="settingsLogo" class="home-v2-hero__brand-logo">
          <NuxtImg
            :src="settingsLogo.src"
            :alt="getDescriptiveImageAlt(settingsLogo.alt, `شعار ${site.brandName || 'المنصة التعليمية'}`)"
            width="160"
            height="160"
            format="webp"
            quality="78"
            loading="lazy"
            decoding="async"
            @error="handleHeroImageError(settingsLogo?.src)"
          />
        </span>
        <span class="home-v2-hero__visual-shine" aria-hidden="true" />
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
  perspective: 1200px;
}

.home-v2-hero__ambient {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* .home-v2-hero__ambient-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgb(255 255 255 / 4%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 32%,
    #000 75%,
    transparent
  );
  opacity: 0.55;
} */

.home-v2-hero__ambient-orb {
  position: absolute;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 50%;
  filter: blur(1px);
}

.home-v2-hero__ambient-orb::after {
  position: absolute;
  inset: 12%;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: inherit;
  content: "";
}

.home-v2-hero__ambient-orb--one {
  top: 8%;
  inset-inline-start: -8%;
  width: clamp(260px, 34vw, 520px);
  aspect-ratio: 1;
  background: radial-gradient(
    circle at 60% 45%,
    rgb(255 255 255 / 9%),
    transparent 67%
  );
}

.home-v2-hero__ambient-orb--two {
  right: 36%;
  bottom: -42%;
  width: clamp(320px, 42vw, 650px);
  aspect-ratio: 1;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--home-v2-blue-light) 18%, transparent),
    transparent 68%
  );
}

.home-v2-hero__layout {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(1280px, calc(100% - 48px));
  min-height: max(700px, calc(95svh - 86px));
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  align-items: center;
  gap: clamp(36px, 4vw, 64px);
}

.home-v2-hero__empty {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: max(650px, calc(92svh - 86px));
  align-items: center;
  padding-block: 72px;
}

.home-v2-hero__copy {
  max-width: 780px;
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

.home-v2-hero__title-line {
  display: block;
  width: fit-content;
  max-width: 100%;
  transform-origin: right center;
}

.home-v2-hero h1 em {
  color: var(--home-v2-coral);
  font-style: normal;
  text-shadow: 0 8px 28px
    color-mix(in srgb, var(--home-v2-coral) 10%, transparent);
}

.home-v2-hero__typewriter {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  min-height: 1.18em;
  align-items: baseline;
  padding-bottom: 0.11em;
}

.home-v2-hero__typewriter--static > span:first-child {
  display: block;
  overflow-wrap: anywhere;
}

.home-v2-hero__typewriter-underline {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.055em;
  min-height: 3px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--home-v2-coral) 65%, #ffd45c),
    var(--home-v2-coral)
  );
  box-shadow: 0 0 16px color-mix(in srgb, var(--home-v2-coral) 34%, transparent);
  transform-origin: right center;
}

.home-v2-hero__typewriter-cursor {
  display: inline-block;
  width: 0.055em;
  height: 0.82em;
  margin-inline-start: 0.1em;
  border-radius: 999px;
  background: currentcolor;
  animation: hero-cursor-blink 0.85s steps(1, end) infinite;
}

@keyframes hero-cursor-blink {
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-hero__typewriter-cursor { animation: none; }
}

.home-v2-hero__copy > p:not(.home-v2-hero__kicker) {
  display: -webkit-box;
  max-width: 620px;
  overflow: hidden;
  color: #ffffffe0;
  font-size: 17px;
  line-height: 1.95;
  margin-top: 36px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-v2-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 14px;
  margin-top: 34px;
}

.home-v2-hero__secondary {
  display: inline-flex;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 24px;
  border: 1px solid #ffffff4f;
  border-radius: 5px;
  background: color-mix(in srgb, var(--home-v2-deep) 34%, transparent);
  color: #fff;
  font-weight: 800;
  transition: background-color 0.22s ease, border-color 0.22s ease,
    color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
}

.home-v2-hero__secondary span {
  color: #ffd45c;
  font-size: 17px;
  transition: color 0.22s ease, transform 0.22s ease;
}

.home-v2-hero__secondary:hover {
  border-color: #fff;
  background: #fff;
  color: var(--home-v2-deep);
  box-shadow: 0 12px 28px rgb(1 9 40 / 22%);
  transform: translateY(-3px);
}

.home-v2-hero__secondary:hover span {
  color: var(--home-v2-coral);
  transform: translateX(-3px);
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
  min-height: 54px;
  padding-inline: 24px;
  border: 1px solid color-mix(in srgb, #1682ff 82%, white);
  border-radius: 5px;
  background: color-mix(in srgb, var(--home-v2-blue) 28%, #1682ff);
  box-shadow: 0 12px 30px color-mix(in srgb, #1682ff 25%, transparent);
  color: #fff;
  transition: background-color 0.22s ease, border-color 0.22s ease,
    transform 0.22s ease, box-shadow 0.22s ease;
}

.home-v2-hero .button span {
  font-size: 17px;
  transition: transform 0.22s ease;
}

.home-v2-hero .button:hover {
  border-color: #fff;
  background: color-mix(in srgb, var(--home-v2-blue) 18%, #2990ff);
  box-shadow: 0 16px 34px color-mix(in srgb, #1682ff 34%, transparent);
  transform: translateY(-3px);
}

.home-v2-hero .button:hover span {
  transform: translateX(-3px);
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
  z-index: 5;
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

.home-v2-hero__visual-note {
  position: absolute;
  z-index: 6;
  inset-inline-end: 18px;
  bottom: 20px;
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  padding-inline: 15px;
  border: 1px solid rgb(255 255 255 / 58%);
  border-radius: 999px;
  background: rgb(6 17 71 / 74%);
  box-shadow: 0 12px 30px rgb(6 17 71 / 24%);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.01em;
  backdrop-filter: blur(10px);
}

.home-v2-hero__visual-shine {
  position: absolute;
  z-index: 4;
  top: -20%;
  bottom: -20%;
  left: 42%;
  width: 22%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 42%),
    transparent
  );
  filter: blur(10px);
  pointer-events: none;
  transform: skewX(-14deg) translateX(170%);
}

.home-v2-hero__brand-logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: contain;
}

@media (max-width: 780px) {
  .home-v2-hero h1 {
    font-size: clamp(34px, 10.5vw, 46px);
    line-height: 1.25;
  }

  .home-v2-hero__typewriter {
    font-size: 0.86em;
    line-height: 1.3;
  }

  .home-v2-hero__layout {
    width: calc(100% - 24px);
    min-height: 0;
    grid-template-columns: 1fr;
    padding-top: 25px;
  }

  .home-v2-hero__empty {
    min-height: 560px;
    padding-block: 52px;
  }

  .home-v2-hero__copy {
    padding-bottom: 20px;
  }

  .home-v2-hero__visual {
    width: min(84%, 350px);
    margin-bottom: 48px;
  }

  .home-v2-hero__visual-note {
    inset-inline-end: 14px;
    bottom: 14px;
    min-height: 34px;
    padding-inline: 13px;
    font-size: 11px;
  }

  .home-v2-hero__actions {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .home-v2-hero__actions > * {
    width: 100%;
    min-width: 0;
    min-height: 52px;
    gap: 8px;
    padding-inline: 12px;
    font-size: 13px;
    white-space: nowrap;
  }

  .home-v2-hero__actions > * span {
    flex: 0 0 auto;
    font-size: 14px;
  }

  .home-v2-hero__ambient-grid {
    background-size: 38px 38px;
    opacity: 0.35;
  }
}

@media (max-width: 360px) {
  .home-v2-hero__actions {
    gap: 7px;
  }

  .home-v2-hero__actions > * {
    gap: 5px;
    padding-inline: 8px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-hero__visual {
    will-change: auto;
  }

  .home-v2-hero__visual-shine {
    display: none;
  }
}
</style>
