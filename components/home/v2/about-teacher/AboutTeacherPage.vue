<script setup lang="ts">
import { gsap } from "gsap";
import { storeToRefs } from "pinia";
import "./about-teacher.css";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapHomeSite,
  mapHeroSection,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeHeroViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import { HeroSectionTypeEnum } from "~/features/HomePageFeature/types/homePage.types";
import AboutTeacherContactSection from "./sections/AboutTeacherContactSection.vue";
import AboutTeacherCtaSection from "./sections/AboutTeacherCtaSection.vue";
import AboutTeacherExperienceSection from "./sections/AboutTeacherExperienceSection.vue";
import AboutTeacherHeroSection from "./sections/AboutTeacherHeroSection.vue";
import AboutTeacherMethodSection from "./sections/AboutTeacherMethodSection.vue";

const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);

const webDomain = getWebDomain();
const api = new HomePageApi(webDomain);
const { data: aboutHero } = await useAsyncData<HomeHeroViewModel | null>(
  `about-v2-hero:${webDomain}:${HeroSectionTypeEnum.ABOUT_API_WEBSITE}`,
  async () => mapHeroSection(
    await api.fetchHeroSections(HeroSectionTypeEnum.ABOUT_API_WEBSITE),
    HeroSectionTypeEnum.ABOUT_API_WEBSITE,
  ),
  {
    default: () => null,
    dedupe: "defer",
  },
);

const site = computed(() => mapHomeSite(setting.value));
const teacherName = computed(() => site.value.brandName || "مدرسك");
const teacherRole = computed(
  () =>
    site.value.description ||
    "مدرس متخصص يساعد طلاب المرحلة الثانوية على الفهم والتطبيق بثقة",
);
const teacherImage = computed(
  () =>
    aboutHero.value?.image?.src ||
    aboutHero.value?.mobileImage?.src ||
    site.value.cover?.src ||
    site.value.logo?.src ||
    "/images/logo.png",
);

const whatsappUrl = computed(() => {
  const value = site.value.socials.whatsapp;
  if (!value || value.startsWith("http")) return value;

  const phone = value.replace(/\D/g, "").replace(/^0/, "20");
  return phone ? `https://wa.me/${phone}` : null;
});

const contactDescription = computed(
  () =>
    site.value.address ||
    "تقدر تتواصل مع المنصة للاستفسار عن الكورسات والاشتراك.",
);

useSeoMeta({
  title: () => aboutHero.value?.title || `عن ${teacherName.value}`,
  description: () => aboutHero.value?.description || teacherRole.value,
  ogTitle: () => aboutHero.value?.title || `عن ${teacherName.value}`,
  ogDescription: () => aboutHero.value?.description || teacherRole.value,
  ogImage: () => teacherImage.value,
});

useHead({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
  },
});

const aboutPage = ref<HTMLElement | null>(null);
let revealObserver: IntersectionObserver | null = null;
let motionContext: ReturnType<typeof gsap.context> | null = null;
const motionCleanups: Array<() => void> = [];

const cappedStagger = (count: number, gap = 0.11, maximumSpan = 0.56) =>
  count > 1 ? Math.min(gap, maximumSpan / (count - 1)) : 0;

const animateHero = (section: HTMLElement) => {
  const copy = section.querySelector(".about-teacher-hero__copy");
  const copyItems = section.querySelectorAll(
    ".about-teacher-eyebrow, .about-teacher-hero h1, .about-teacher-hero__copy > p, .about-teacher-hero__actions > *",
  );
  const portrait = section.querySelector(".about-teacher-portrait");
  const portraitImage = section.querySelector(".about-teacher-portrait img");
  const captionItems = section.querySelectorAll(
    ".about-teacher-portrait figcaption > *",
  );
  const ambientShapes = section.querySelectorAll(
    ".about-teacher-hero__ambient > span",
  );
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (copy) {
    timeline.fromTo(
      copy,
      { autoAlpha: 0, y: 34 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.82,
        clearProps: "opacity,visibility,transform",
      },
      0,
    );
  }

  if (copyItems.length) {
    timeline.fromTo(
      copyItems,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.76,
        stagger: 0.1,
        clearProps: "opacity,visibility,transform",
      },
      0.12,
    );
  }

  if (portrait) {
    timeline.fromTo(
      portrait,
      {
        autoAlpha: 0,
        x: -44,
        y: 28,
        scale: 0.94,
        clipPath: "inset(44% 10% 44% 10% round 72px)",
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        duration: 1.18,
        ease: "power3.inOut",
        clearProps: "opacity,visibility,transform,clip-path",
      },
      0.1,
    );

    gsap.to(portrait, {
      y: -8,
      duration: 5.2,
      delay: 1.7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  if (portraitImage) {
    timeline.fromTo(
      portraitImage,
      { scale: 1.08 },
      {
        scale: 1,
        duration: 1.45,
        ease: "power2.out",
        clearProps: "transform",
      },
      0.2,
    );
  }

  if (captionItems.length) {
    timeline.fromTo(
      captionItems,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.09,
        clearProps: "opacity,visibility,transform",
      },
      0.82,
    );
  }

  if (ambientShapes.length) {
    timeline.fromTo(
      ambientShapes,
      { autoAlpha: 0, scale: 0.72 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.3,
        stagger: 0.14,
        clearProps: "opacity,visibility,transform",
      },
      0.08,
    );

    const firstShape = ambientShapes.item(0);
    if (firstShape) {
      gsap.to(firstShape, {
        x: 34,
        y: -24,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    const secondShape = ambientShapes.item(1);
    if (secondShape) {
      gsap.to(secondShape, {
        x: -28,
        y: 32,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }
};

const animateSectionHeading = (
  section: HTMLElement,
  timeline: gsap.core.Timeline,
) => {
  const heading = section.querySelector(".about-teacher-section__head");
  if (!heading) return;

  const label = heading.querySelector("span");
  const title = heading.querySelector("h2");
  const description = heading.querySelector(":scope > p");

  timeline.fromTo(
    heading,
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.72,
      clearProps: "opacity,visibility,transform",
    },
    0,
  );

  if (label) {
    timeline.fromTo(
      label,
      { autoAlpha: 0, x: 24 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.64,
        clearProps: "opacity,visibility,transform",
      },
      0.08,
    );
  }

  if (title) {
    timeline.fromTo(
      title,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        clearProps: "opacity,visibility,transform",
      },
      0.16,
    );
  }

  if (description) {
    timeline.fromTo(
      description,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.74,
        clearProps: "opacity,visibility,transform",
      },
      0.3,
    );
  }
};

const animateMethod = (section: HTMLElement) => {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  const grid = section.querySelector<HTMLElement>(".about-teacher-principles");
  const cards = Array.from(
    section.querySelectorAll<HTMLElement>(".about-teacher-principles article"),
  );

  animateSectionHeading(section, timeline);

  if (cards.length) {
    if (grid) {
      gsap.set(grid, { perspective: 900 });
    }

    const cardNumbers = cards
      .map((card) => card.querySelector<HTMLElement>(":scope > span"))
      .filter((target): target is HTMLElement => Boolean(target));
    const cardContent = cards.flatMap((card) =>
      Array.from(card.querySelectorAll<HTMLElement>("h3, p")),
    );

    timeline
      .fromTo(
        cards,
        {
          autoAlpha: 0,
          x: (index) => (index % 2 === 0 ? 42 : -42),
          y: 56,
          scale: 0.92,
          rotation: (index) => (index % 2 === 0 ? 3.5 : -3.5),
          rotationX: -8,
          transformOrigin: "50% 100%",
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          rotationX: 0,
          duration: 0.95,
          stagger: cappedStagger(cards.length, 0.14, 0.7),
          ease: "back.out(1.2)",
          clearProps: "opacity,visibility,transform",
        },
        0.4,
      )
      .fromTo(
        cardNumbers,
        { autoAlpha: 0, scale: 0.55, rotate: -24 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.68,
          stagger: cappedStagger(cards.length, 0.12, 0.58),
          ease: "back.out(2)",
          clearProps: "opacity,visibility,transform",
        },
        0.66,
      )
      .fromTo(
        cardContent,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          stagger: cappedStagger(cardContent.length, 0.055, 0.64),
          clearProps: "opacity,visibility,transform",
        },
        0.76,
      );
  }
};

const animateExperience = (section: HTMLElement) => {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  const card = section.querySelector(".about-teacher-stage-card");
  const chips = section.querySelectorAll(".about-teacher-stage-card__chips span");
  const content = section.querySelectorAll(
    ".about-teacher-stage-card__content > *",
  );

  animateSectionHeading(section, timeline);

  if (card) {
    timeline.fromTo(
      card,
      { autoAlpha: 0, y: 36, scale: 0.985 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        clearProps: "opacity,visibility,transform",
      },
      0.46,
    );
  }

  if (chips.length) {
    timeline.fromTo(
      chips,
      { autoAlpha: 0, y: 16, scale: 0.9 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.58,
        stagger: 0.1,
        clearProps: "opacity,visibility,transform",
      },
      0.68,
    );
  }

  if (content.length) {
    timeline.fromTo(
      content,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.68,
        stagger: 0.09,
        clearProps: "opacity,visibility,transform",
      },
      0.78,
    );
  }
};

const animateContact = (section: HTMLElement) => {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  const card = section.querySelector(".about-teacher-contact__card");
  const cardItems = section.querySelectorAll(
    ".about-teacher-contact__card > *",
  );

  animateSectionHeading(section, timeline);

  if (card) {
    timeline.fromTo(
      card,
      { autoAlpha: 0, y: 34, scale: 0.985 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.86,
        clearProps: "opacity,visibility,transform",
      },
      0.44,
    );
  }

  if (cardItems.length) {
    timeline.fromTo(
      cardItems,
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.1,
        clearProps: "opacity,visibility,transform",
      },
      0.62,
    );
  }
};

const animateCta = (section: HTMLElement) => {
  const panel = section.querySelector(".about-teacher-cta__panel");
  const copyItems = section.querySelectorAll(
    ".about-teacher-cta__panel > div > *",
  );
  const action = section.querySelector(".about-teacher-cta__panel > a");
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (panel) {
    timeline.fromTo(
      panel,
      { autoAlpha: 0, y: 38, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.92,
        clearProps: "opacity,visibility,transform",
      },
    );
  }

  if (copyItems.length) {
    timeline.fromTo(
      copyItems,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.68,
        stagger: 0.1,
        clearProps: "opacity,visibility,transform",
      },
      0.22,
    );
  }

  if (action) {
    timeline.fromTo(
      action,
      { autoAlpha: 0, x: -22, scale: 0.96 },
      {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        duration: 0.72,
        clearProps: "opacity,visibility,transform",
      },
      0.38,
    );
  }
};

const revealMotionSection = (section: HTMLElement) => {
  if (section.dataset.motionRevealed === "true") return;
  section.dataset.motionRevealed = "true";

  motionContext?.add(() => {
    if (section.classList.contains("about-teacher-hero")) animateHero(section);
    else if (section.classList.contains("about-teacher-method")) animateMethod(section);
    else if (section.classList.contains("about-teacher-experience")) animateExperience(section);
    else if (section.classList.contains("about-teacher-contact")) animateContact(section);
    else if (section.classList.contains("about-teacher-cta")) animateCta(section);
  });
};

const setupPortraitPointerMotion = (root: HTMLElement) => {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const hero = root.querySelector<HTMLElement>(".about-teacher-hero");
  const portrait = root.querySelector<HTMLElement>(".about-teacher-portrait");
  const image = root.querySelector<HTMLElement>(".about-teacher-portrait img");
  if (!hero || !portrait) return;

  const moveX = gsap.quickTo(portrait, "x", {
    duration: 0.6,
    ease: "power3.out",
  });
  const rotateX = gsap.quickTo(portrait, "rotationX", {
    duration: 0.6,
    ease: "power3.out",
  });
  const rotateY = gsap.quickTo(portrait, "rotationY", {
    duration: 0.6,
    ease: "power3.out",
  });
  const imageX = image
    ? gsap.quickTo(image, "x", { duration: 0.75, ease: "power3.out" })
    : null;

  const handlePointerMove = (event: PointerEvent) => {
    const bounds = hero.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    moveX(horizontal * 16);
    rotateX(vertical * -3.2);
    rotateY(horizontal * 4);
    imageX?.(horizontal * 9);
  };
  const resetPointer = () => {
    moveX(0);
    rotateX(0);
    rotateY(0);
    imageX?.(0);
  };

  hero.addEventListener("pointermove", handlePointerMove);
  hero.addEventListener("pointerleave", resetPointer);
  motionCleanups.push(() => {
    hero.removeEventListener("pointermove", handlePointerMove);
    hero.removeEventListener("pointerleave", resetPointer);
  });
};

onMounted(() => {
  const root = aboutPage.value;
  if (!root) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const sections = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".about-teacher-hero, .about-teacher-method, .about-teacher-experience, .about-teacher-contact, .about-teacher-cta",
    ),
  );

  motionContext = gsap.context(() => {
    sections.forEach((section) => {
      gsap.set(section.querySelectorAll<HTMLElement>("[data-about-reveal]"), {
        autoAlpha: 0,
        y: 28,
      });
    });
    gsap.set(root.querySelectorAll(".about-teacher-hero__ambient > span"), {
      autoAlpha: 0,
    });
  }, root);

  setupPortraitPointerMotion(root);

  if (!("IntersectionObserver" in window)) {
    sections.forEach(revealMotionSection);
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        revealMotionSection(entry.target as HTMLElement);
        revealObserver?.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
  );

  sections.forEach((section) => revealObserver?.observe(section));
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
  motionCleanups.forEach((cleanup) => cleanup());
  motionCleanups.length = 0;
  motionContext?.revert();

  if (aboutPage.value) {
    gsap.killTweensOf(aboutPage.value.querySelectorAll("*"));
  }
});
</script>

<template>
  <div
    ref="aboutPage"
    class="home-v2 about-teacher-page"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <main class="about-teacher-main">
      <AboutTeacherHeroSection
        :hero="aboutHero"
        :teacher-name="teacherName"
        :teacher-role="teacherRole"
        :teacher-image="teacherImage"
      />
      <AboutTeacherMethodSection />
      <AboutTeacherExperienceSection :teacher-role="teacherRole" />
      <AboutTeacherContactSection
        :site="site"
        :teacher-name="teacherName"
        :whatsapp-url="whatsappUrl"
        :description="contactDescription"
      />
      <AboutTeacherCtaSection />
    </main>

  </div>
</template>
