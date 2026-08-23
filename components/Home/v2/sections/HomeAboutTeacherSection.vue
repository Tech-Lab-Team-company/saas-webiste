<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeAboutTeacherViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

const props = defineProps<{
  about: HomeSectionState<HomeAboutTeacherViewModel>;
}>();

const aboutSection = ref<HTMLElement | null>(null);
const aboutContent = ref<HTMLElement | null>(null);
const aboutHasEntered = ref(false);
let aboutAnimationContext: ReturnType<typeof gsap.context> | null = null;

const hasAboutContent = computed(() => props.about.status === "success");
const emptyStateTitle = computed(() =>
  props.about.status === "error"
    ? "تعذر تحميل قسم المدرس"
    : "أضف محتوى قسم المدرس",
);
const emptyStateDescription = computed(() =>
  props.about.status === "error"
    ? "تعذر جلب بيانات القسم في الوقت الحالي. حاول مرة أخرى بعد التأكد من الخدمة."
    : "أضف نبذة المدرس والخبرة والمميزات من لوحة التحكم ليظهر القسم هنا.",
);

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
  const icons = Array.from(
    content.querySelectorAll(".home-v2-about-teacher__benefit-icon"),
  );
  gsap.killTweensOf([...items, ...icons]);
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
  gsap.fromTo(
    icons,
    { autoAlpha: 0, scale: 0.2, rotation: -35 },
    {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      duration: 0.48,
      delay: delay + 0.12,
      stagger: { amount: 0.38 },
      ease: "back.out(1.9)",
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
    v-if="hasAboutContent"
    id="about"
    ref="aboutSection"
    class="section home-v2-about-teacher"
    aria-labelledby="home-v2-about-teacher-title"
  >
    <!-- Backup empty state: uncomment if the empty teacher section should be visible again.
    <div v-if="!hasAboutContent" class="container home-v2-about-teacher__empty">
      <HomeSectionEmptyState
        label="قسم عن المدرس"
        :title="emptyStateTitle"
        :description="emptyStateDescription"
      />
    </div>
    -->

    <div class="container home-v2-about-teacher__grid">
      <div
        v-if="
          about.data.description ||
          about.data.experience.value ||
          about.data.experience.prefix
        "
        class="home-v2-about-teacher__quote"
      >
        <span class="home-v2-about-teacher__quote-mark" aria-hidden="true"
          >“</span
        >
        <p v-if="about.data.description">{{ about.data.description }}</p>
        <div
          v-if="about.data.experience.value || about.data.experience.prefix"
          class="home-v2-about-teacher__experience"
        >
          <strong v-if="about.data.experience.value" dir="ltr">
            +{{ about.data.experience.value }}
          </strong>
          <small v-if="about.data.experience.prefix">
            {{ about.data.experience.prefix }}
          </small>
        </div>
        <span class="home-v2-about-teacher__corner" aria-hidden="true"></span>
      </div>
      <HomeSectionEmptyState
        v-else
        compact
        label="نبذة المدرس"
        title="أضف النبذة والخبرة"
        description="أضف وصف المدرس وسنوات الخبرة من لوحة التحكم."
      />

      <div ref="aboutContent" class="home-v2-about-teacher__content">
        <span v-if="about.data.linkLabel" class="section-tag">
          {{ about.data.linkLabel }}
        </span>
        <h2 v-if="about.data.title" id="home-v2-about-teacher-title">
          {{ titleParts.before
          }}<em v-if="titleParts.value">{{ titleParts.value }}</em
          >{{ titleParts.after }}
        </h2>
        <p v-if="about.data.subTitle">{{ about.data.subTitle }}</p>
        <ul
          v-if="about.data.benefits.length"
          class="home-v2-about-teacher__benefits"
          aria-label="مميزات الدراسة مع المدرس"
        >
          <li v-for="benefit in about.data.benefits" :key="benefit.id">
            <span
              class="home-v2-about-teacher__benefit-icon"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="m7 12.5 3.1 3L17.5 8"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>
              <strong>{{ benefit.title }}</strong>
              <small v-if="benefit.description">{{
                benefit.description
              }}</small>
            </span>
          </li>
        </ul>
        <NuxtLink v-if="about.data.link" :to="about.data.link">
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

.home-v2-about-teacher__empty {
  display: grid;
  min-height: 540px;
  align-items: center;
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
    height 0.78s cubic-bezier(0.22, 1, 0.36, 1), border-width 0.5s ease,
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
  margin: 34px 0 32px;
  padding: 0;
  border-top: 1px solid
    color-mix(in srgb, var(--home-v2-muted) 24%, transparent);
  list-style: none;
  perspective: 700px;
}

.home-v2-about-teacher li {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 65px;
  align-items: center;
  gap: 10px;
  padding: 14px 7px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--home-v2-muted) 24%, transparent);
  color: var(--home-v2-deep);
  transition: color 0.3s ease, border-color 0.3s ease,
    padding 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-v2-about-teacher li::after {
  position: absolute;
  z-index: -1;
  inset: 4px 0;
  border-radius: 9px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--home-v2-blue) 2%, transparent),
    color-mix(in srgb, var(--home-v2-blue) 10%, transparent)
  );
  content: "";
  opacity: 0;
  transform: scaleX(0.25);
  transform-origin: right center;
  transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-v2-about-teacher li:hover {
  padding-inline-start: 14px;
  border-color: color-mix(in srgb, var(--home-v2-blue) 35%, transparent);
  color: var(--home-v2-blue);
  transform: translateX(-5px);
}

.home-v2-about-teacher li:hover::after {
  opacity: 1;
  transform: scaleX(1);
}

.home-v2-about-teacher__benefit-icon {
  display: grid;
  width: 23px;
  height: 23px;
  flex: 0 0 23px;
  place-items: center;
  border-radius: 50%;
  color: var(--home-v2-blue);
  transition: color 0.3s ease, background-color 0.3s ease,
    transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.home-v2-about-teacher__benefit-icon svg {
  width: 17px;
  height: 17px;
}

.home-v2-about-teacher li:hover .home-v2-about-teacher__benefit-icon {
  background: var(--home-v2-blue);
  color: #fff;
  transform: rotate(-9deg) scale(1.14);
}

.home-v2-about-teacher li > span:last-child {
  display: grid;
  gap: 3px;
}

.home-v2-about-teacher li strong {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.65;
}

.home-v2-about-teacher li small {
  color: var(--home-v2-muted);
  font-size: 12px;
  line-height: 1.5;
}

.home-v2-about-teacher a {
  display: inline-flex;
  gap: 12px;
  padding-bottom: 7px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--home-v2-blue) 55%, transparent);
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
  .home-v2-about-teacher li::after,
  .home-v2-about-teacher__benefit-icon {
    transition: none;
  }

  .home-v2-about-teacher__quote:hover {
    transform: none;
  }
}
</style>
