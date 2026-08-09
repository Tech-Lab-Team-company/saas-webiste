<script setup lang="ts">
import { gsap } from "gsap";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion-v";
import type {
  HomeHeroViewModel,
  HomeSiteViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

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

const heroSection = ref<HTMLElement | null>(null);
const heroVisual = ref<HTMLElement | null>(null);
let heroAnimationContext: ReturnType<typeof gsap.context> | null = null;
let removeHeroPointerEffects: (() => void) | null = null;

const typewriterPhrases = computed(() =>
  Array.from(
    new Set(
      [heroContent.value.subtitle].filter(Boolean),
    ),
  ),
);
const typewriterPhraseGraphemes = computed(() =>
  typewriterPhrases.value.map(splitGraphemes),
);
const prefersReducedMotion = useReducedMotion();
const typedText = ref(heroContent.value.subtitle);
const phraseIndex = ref(0);
const visibleCharacters = useMotionValue(
  splitGraphemes(heroContent.value.subtitle).length,
);
let typewriterAnimation: ReturnType<typeof animate> | null = null;
let typewriterTimer: ReturnType<typeof setTimeout> | null = null;

const stopTypewriter = () => {
  typewriterAnimation?.stop();
  typewriterAnimation = null;

  if (typewriterTimer) {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }
};

useMotionValueEvent(visibleCharacters, "change", (latest) => {
  const graphemes = typewriterPhraseGraphemes.value[phraseIndex.value] || [];
  typedText.value = graphemes.slice(0, Math.round(latest)).join("");
});

const typeCurrentPhrase = () => {
  stopTypewriter();

  const phrase = typewriterPhrases.value[phraseIndex.value] || "";
  const phraseLength =
    typewriterPhraseGraphemes.value[phraseIndex.value]?.length || 0;
  if (!phrase) return;

  if (prefersReducedMotion.value || typewriterPhrases.value.length === 1) {
    visibleCharacters.set(phraseLength);
    typedText.value = phrase;
    return;
  }

  typewriterAnimation = animate(visibleCharacters, phraseLength, {
    duration: Math.min(3.2, Math.max(0.75, phraseLength * 0.075)),
    ease: "linear",
    onComplete: () => {
      typewriterTimer = setTimeout(() => {
        typewriterAnimation = animate(visibleCharacters, 0, {
          duration: Math.min(1.4, Math.max(0.35, phraseLength * 0.035)),
          ease: "linear",
          onComplete: () => {
            phraseIndex.value =
              (phraseIndex.value + 1) % typewriterPhrases.value.length;
            typeCurrentPhrase();
          },
        });
      }, 1500);
    },
  });
};

const restartTypewriter = () => {
  stopTypewriter();
  phraseIndex.value = 0;
  visibleCharacters.set(0);
  typedText.value = "";
  typeCurrentPhrase();
};

const setupHeroAnimation = () => {
  const section = heroSection.value;
  const visual = heroVisual.value;
  if (!section || !visual) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  heroAnimationContext = gsap.context(() => {
    const intro = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    intro
      .from(".home-v2-hero__ambient", {
        autoAlpha: 0,
        duration: 1,
      })
      .from(
        ".home-v2-hero__kicker",
        { autoAlpha: 0, x: 36, duration: 0.58 },
        0.08,
      )
      .from(
        ".home-v2-hero__title-line",
        {
          autoAlpha: 0,
          yPercent: 115,
          rotate: 2,
          duration: 0.88,
          stagger: 0.1,
          ease: "expo.out",
        },
        0.18,
      )
      .fromTo(
        ".home-v2-hero__typewriter-underline",
        { scaleX: 0, autoAlpha: 0 },
        {
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.72,
          ease: "expo.out",
        },
        0.72,
      )
      .from(
        ".home-v2-hero__copy > p:not(.home-v2-hero__kicker)",
        { autoAlpha: 0, y: 24, duration: 0.58 },
        0.58,
      )
      .from(
        ".home-v2-hero__actions > *",
        { autoAlpha: 0, y: 18, duration: 0.48, stagger: 0.08 },
        0.72,
      )
      .from(
        visual,
        {
          autoAlpha: 0,
          clipPath: "inset(48% 12% 48% 12% round 80px)",
          scale: 0.86,
          rotate: -3,
          duration: 1.08,
          ease: "power3.out",
        },
        0.08,
      )
      .from(
        ".home-v2-hero__brand-logo",
        {
          autoAlpha: 0,
          scale: 0.35,
          rotate: -25,
          duration: 0.6,
          ease: "back.out(1.35)",
        },
        0.88,
      )
      .fromTo(
        ".home-v2-hero__visual-shine",
        { xPercent: 170, autoAlpha: 0 },
        {
          xPercent: -240,
          autoAlpha: 1,
          duration: 0.95,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(".home-v2-hero__visual-shine", {
              autoAlpha: 0,
              display: "none",
            });
          },
        },
        0.76,
      );

    gsap.to(".home-v2-hero__ambient-orb--one", {
      x: 34,
      y: -26,
      scale: 1.08,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".home-v2-hero__ambient-orb--two", {
      x: -28,
      y: 34,
      scale: 0.92,
      duration: 10.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(visual, {
      y: -9,
      duration: 2.4,
      delay: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    if (window.matchMedia("(pointer: fine)").matches) {
      const moveX = gsap.quickTo(visual, "x", {
        duration: 0.58,
        ease: "power3.out",
      });
      const rotateX = gsap.quickTo(visual, "rotationX", {
        duration: 0.58,
        ease: "power3.out",
      });
      const rotateY = gsap.quickTo(visual, "rotationY", {
        duration: 0.58,
        ease: "power3.out",
      });

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = section.getBoundingClientRect();
        const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
        const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

        moveX(horizontal * 18);
        rotateX(vertical * -3.5);
        rotateY(horizontal * 4.5);
      };
      const resetPointerEffect = () => {
        moveX(0);
        rotateX(0);
        rotateY(0);
      };

      section.addEventListener("pointermove", handlePointerMove);
      section.addEventListener("pointerleave", resetPointerEffect);
      removeHeroPointerEffects = () => {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", resetPointerEffect);
      };
    }
  }, section);
};

onMounted(() => {
  restartTypewriter();
  setupHeroAnimation();
});

watch(
  () => typewriterPhrases.value.join("\u0000"),
  () => {
    if (import.meta.client) restartTypewriter();
  },
);

watch(prefersReducedMotion, restartTypewriter);
onBeforeUnmount(() => {
  stopTypewriter();
  removeHeroPointerEffects?.();
  heroAnimationContext?.revert();
});
</script>

<template>
  <section
    id="top"
    ref="heroSection"
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
            :aria-label="heroContent.subtitle"
          >
            <span aria-hidden="true">{{ typedText }}</span>
            <motion.span
              v-if="!prefersReducedMotion && !hasOversizedSubtitle"
              aria-hidden="true"
              class="home-v2-hero__typewriter-cursor"
              :animate="{ opacity: [1, 0, 1] }"
              :transition="{ duration: 0.85, repeat: Infinity, ease: 'linear' }"
            />
            <span
              class="home-v2-hero__typewriter-underline"
              aria-hidden="true"
            />
          </em>
        </h1>
        <p v-if="heroContent.text">{{ heroContent.text }}</p>
        <div v-if="heroContent.link" class="home-v2-hero__actions">
          <a class="button" :href="heroContent.link"
            >استكشف الكورسات <span aria-hidden="true">←</span></a
          >
          <NuxtLink class="home-v2-hero__secondary" to="/aboutus"
            >تعرّف على المنصة <span aria-hidden="true">↗</span></NuxtLink
          >
        </div>
      </div>

      <figure
        ref="heroVisual"
        class="home-v2-hero__visual"
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
        <HomeSectionEmptyState
          v-else
          compact
          label="صورة القسم"
          title="أضف صورة الواجهة"
          description="أضف الصورة من لوحة التحكم لتظهر هنا."
        />
        <span class="home-v2-hero__visual-note">مورد مؤقت</span>
        <span v-if="settingsLogo" class="home-v2-hero__brand-logo">
          <img
            :src="settingsLogo.src"
            :alt="settingsLogo.alt || site.brandName || 'شعار المنصة'"
            @error="handleHeroImageError"
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
  transform-style: preserve-3d;
  will-change: transform, clip-path;
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
