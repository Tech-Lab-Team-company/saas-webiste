<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeAboutTeacherViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  about: HomeSectionState<HomeAboutTeacherViewModel>;
}>();

const aboutSection = ref<HTMLElement | null>(null);
const aboutContent = ref<HTMLElement | null>(null);
const aboutHasEntered = ref(false);
let aboutAnimationContext: ReturnType<typeof gsap.context> | null = null;

const titleParts = computed(() => {
  const title = props.about.data.title;
  const match = title.match(/\d+/);

  if (!match || match.index === undefined) {
    return { before: title, value: null, after: "" };
  }

  return {
    before: title.slice(0, match.index),
    value: match[0],
    after: title.slice(match.index + match[0].length),
  };
});

const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateHighlights = async (delay = 0) => {
  await nextTick();

  const content = aboutContent.value;
  if (!content || !aboutHasEntered.value || shouldReduceMotion()) return;

  const items = Array.from(content.querySelectorAll("li"));
  gsap.killTweensOf(items);
  gsap.fromTo(
    items,
    { autoAlpha: 0, x: 38, y: 8 },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.56,
      delay,
      stagger: { amount: 0.38 },
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
    },
  );
};

const revealAboutSection = () => {
  const section = aboutSection.value;
  if (!section || aboutHasEntered.value) return;

  aboutHasEntered.value = true;
  if (shouldReduceMotion()) return;

  aboutAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from(".home-v2-about-teacher__quote", {
        autoAlpha: 0,
        clipPath: "inset(8% 8% 92% 8% round 16px)",
        scale: 0.96,
        duration: 0.88,
        ease: "power3.out",
      })
      .from(
        ".home-v2-about-teacher__corner",
        { scale: 0.25, rotation: -18, duration: 0.56, ease: "back.out(1.35)" },
        0.4,
      )
      .from(
        ".home-v2-about-teacher__quote-mark",
        { autoAlpha: 0, y: -20, scale: 0.7, duration: 0.5 },
        0.46,
      )
      .from(
        ".home-v2-about-teacher__quote > p",
        { autoAlpha: 0, y: 30, duration: 0.66 },
        0.53,
      )
      .from(
        ".home-v2-about-teacher__experience",
        { autoAlpha: 0, y: 22, duration: 0.56 },
        0.67,
      )
      .from(
        ".home-v2-about-teacher__content .section-tag",
        { autoAlpha: 0, x: 30, duration: 0.48 },
        0.22,
      )
      .from(
        ".home-v2-about-teacher__content h2",
        { autoAlpha: 0, y: 38, duration: 0.72, ease: "power3.out" },
        0.34,
      )
      .from(
        ".home-v2-about-teacher__content > p",
        { autoAlpha: 0, y: 22, duration: 0.54 },
        0.49,
      )
      .from(
        ".home-v2-about-teacher__content ul",
        {
          autoAlpha: 0,
          y: 24,
          scaleY: 0.92,
          transformOrigin: "top center",
          duration: 0.62,
          ease: "power3.out",
        },
        0.61,
      )
      .from(
        ".home-v2-about-teacher__content > a",
        { autoAlpha: 0, y: 16, duration: 0.48 },
        0.92,
      );
  }, section);

  void animateHighlights(0.72);
};

watch(
  () =>
    props.about.data.benefits
      .map(({ id, title, description }) => `${id}:${title}:${description}`)
      .join("\u0000"),
  () => void animateHighlights(),
  { flush: "post" },
);

useScrollTriggeredReveal(aboutSection, revealAboutSection, {
  threshold: 0.1,
});

onBeforeUnmount(() => {
  aboutAnimationContext?.revert();
  if (aboutSection.value) {
    gsap.killTweensOf(aboutSection.value.querySelectorAll("*"));
  }
});
</script>

<template>
  <section
    id="about"
    ref="aboutSection"
    class="section home-v2-about-teacher"
    aria-labelledby="home-v2-about-teacher-title"
  >
    <div class="container home-v2-about-teacher__grid">
      <div class="home-v2-about-teacher__quote">
        <span class="home-v2-about-teacher__quote-mark" aria-hidden="true">“</span>
        <p>{{ about.data.description }}</p>
        <!-- <pre>
          {{ about.data }}
        </pre> -->
        <div class="home-v2-about-teacher__experience">
          <strong dir="ltr">+{{ about.data.experience.value }}</strong>
          <small>{{ about.data.experience.prefix }}</small>
        </div>
        <span class="home-v2-about-teacher__corner" aria-hidden="true"></span>
      </div>

      <div ref="aboutContent" class="home-v2-about-teacher__content">
        <span class="section-tag">{{ about.data.linkLabel }}</span>
        <h2 id="home-v2-about-teacher-title">
          {{ titleParts.before }}<em v-if="titleParts.value">{{ titleParts.value }}</em>{{ titleParts.after }}
        </h2>
        <p>{{ about.data.subTitle }}</p>
        <ul>
          <li v-for="benefit in about.data.benefits" :key="benefit.id">
            {{ benefit.title }}
          </li>
        </ul>
        <NuxtLink :to="about.data.link">
          {{ about.data.linkLabel }}
          <span aria-hidden="true">←</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-about-teacher {
  overflow: hidden;
  padding: 52px 0 90px;
  background: #f3f6fc;
}

.home-v2-about-teacher__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: clamp(72px, 6.15vw, 100px);
}

.home-v2-about-teacher__quote {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 614px;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 86px clamp(48px, 4vw, 64px) 100px;
  background: color-mix(in srgb, var(--home-v2-blue-light) 82%, #dceaff);
  box-shadow: 0 28px 70px -54px color-mix(in srgb, var(--home-v2-deep) 42%, transparent);
  transition: box-shadow 0.55s ease, transform 0.55s ease;
}

.home-v2-about-teacher__quote:hover {
  box-shadow: 0 38px 86px -48px color-mix(in srgb, var(--home-v2-blue) 55%, transparent);
  transform: translateY(-4px);
}

.home-v2-about-teacher__quote-mark {
  position: absolute;
  z-index: 2;
  top: 35px;
  inset-inline-start: 50px;
  color: color-mix(in srgb, var(--home-v2-deep) 55%, transparent);
  font: 900 76px/1 Georgia, serif;
  transition: color 0.55s ease, opacity 0.55s ease;
}

.home-v2-about-teacher__quote > p {
  position: relative;
  z-index: 1;
  max-width: 460px;
  margin: auto 0;
  color: var(--home-v2-deep);
  font: 900 clamp(34px, 3vw, 48px) / 1.48 var(--home-v2-heading);
  transition: color 0.55s ease;
}

.home-v2-about-teacher__experience {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: end;
  gap: 14px;
}

.home-v2-about-teacher__experience strong {
  color: var(--home-v2-blue);
  font: 900 clamp(40px, 3.4vw, 52px) / 0.85 var(--home-v2-heading);
  transition: color 0.55s ease;
}

.home-v2-about-teacher__experience small {
  color: var(--home-v2-muted);
  max-width: 120px;
  font-size: 12px;
  line-height: 1.45;
  transition: color 0.55s ease;
}

.home-v2-about-teacher__corner {
  position: absolute;
  z-index: 0;
  inset-inline-end: -26px;
  bottom: -27px;
  width: 120px;
  height: 120px;
  border: 12px solid var(--home-v2-blue);
  background: transparent;
  pointer-events: none;
  transform-origin: bottom left;
  transition: width 0.78s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.78s cubic-bezier(0.22, 1, 0.36, 1),
    border-width 0.5s ease,
    background-color 0.5s ease;
}

.home-v2-about-teacher__quote:hover .home-v2-about-teacher__corner {
  width: calc(100% + 52px);
  height: calc(100% + 54px);
  border-width: 0;
  background: var(--home-v2-blue);
}

.home-v2-about-teacher__quote:hover .home-v2-about-teacher__quote-mark {
  color: #fff;
  opacity: 0.34;
}

.home-v2-about-teacher__quote:hover > p,
.home-v2-about-teacher__quote:hover .home-v2-about-teacher__experience strong {
  color: #fff;
}

.home-v2-about-teacher__quote:hover .home-v2-about-teacher__experience small {
  color: #ffffffc7;
}

.home-v2-about-teacher__content {
  max-width: 540px;
}

.home-v2-about-teacher__content .section-tag {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--home-v2-deep);
}

.home-v2-about-teacher__content .section-tag::after {
  width: 36px;
  height: 2px;
  background: var(--home-v2-blue);
  content: "";
}

.home-v2-about-teacher__content .section-tag::before {
  display: none;
}

.home-v2-about-teacher h2 {
  margin: 24px 0 20px;
  color: var(--home-v2-deep);
  font: 900 clamp(42px, 4vw, 60px) / 1.16 var(--home-v2-heading);
  letter-spacing: -0.035em;
}

.home-v2-about-teacher h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-about-teacher__content > p {
  max-width: 540px;
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 17px;
  line-height: 2.05;
}

.home-v2-about-teacher ul {
  position: relative;
  display: grid;
  margin: 38px 0 34px;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, var(--home-v2-muted) 22%, transparent);
  list-style: none;
  perspective: 700px;
}

.home-v2-about-teacher li {
  position: relative;
  padding: 17px 34px 17px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--home-v2-muted) 22%, transparent);
  background-image: linear-gradient(
    90deg,
    color-mix(in srgb, var(--home-v2-blue) 11%, transparent),
    color-mix(in srgb, var(--home-v2-blue) 4%, transparent)
  );
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 0% 100%;
  color: var(--home-v2-deep);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.65;
  transition: color 0.3s ease, padding-inline-start 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    background-size 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease;
}

.home-v2-about-teacher li:hover {
  padding-inline-start: 44px;
  border-color: color-mix(in srgb, var(--home-v2-blue) 28%, transparent);
  background-size: 100% 100%;
  color: var(--home-v2-blue);
}

.home-v2-about-teacher li::before {
  position: absolute;
  top: 17px;
  inset-inline-start: 4px;
  color: var(--home-v2-blue);
  content: "✓";
  font-size: 20px;
  font-weight: 900;
  transform-origin: center;
  transition: color 0.3s ease, transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.home-v2-about-teacher li:hover::before {
  color: var(--home-v2-deep);
  transform: translateX(-5px) rotate(-8deg) scale(1.18);
}

.home-v2-about-teacher a {
  display: inline-flex;
  gap: 12px;
  padding-bottom: 7px;
  border-bottom: 1px solid color-mix(in srgb, var(--home-v2-blue) 55%, transparent);
  color: var(--home-v2-blue);
  font-weight: 800;
  transition: gap 0.2s ease, border-color 0.2s ease;
}

.home-v2-about-teacher a:hover {
  gap: 14px;
  border-color: var(--home-v2-blue);
}

@media (max-width: 900px) {
  .home-v2-about-teacher {
    padding-block: 72px 96px;
  }

  .home-v2-about-teacher__grid {
    grid-template-columns: 1fr;
    gap: 70px;
  }

  .home-v2-about-teacher__quote {
    min-height: 540px;
  }

  .home-v2-about-teacher__content {
    max-width: none;
  }

  .home-v2-about-teacher__corner {
    inset-inline-end: -18px;
    bottom: -24px;
    width: 100px;
    height: 100px;
    border-width: 10px;
  }
}

@media (max-width: 560px) {
  .home-v2-about-teacher__quote {
    min-height: 500px;
    padding: 76px 28px 76px;
  }

  .home-v2-about-teacher__quote-mark {
    top: 28px;
    inset-inline-start: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-about-teacher a,
  .home-v2-about-teacher__quote,
  .home-v2-about-teacher__corner,
  .home-v2-about-teacher__quote-mark,
  .home-v2-about-teacher__quote > p,
  .home-v2-about-teacher__experience strong,
  .home-v2-about-teacher__experience small,
  .home-v2-about-teacher li,
  .home-v2-about-teacher li::before {
    transition: none;
  }

  .home-v2-about-teacher__quote:hover {
    transform: none;
  }
}
</style>
