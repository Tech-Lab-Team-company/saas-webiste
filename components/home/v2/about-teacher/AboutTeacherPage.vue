<script setup lang="ts">
import { storeToRefs } from "pinia";
import "./about-teacher.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";
import AboutTeacherContactSection from "./sections/AboutTeacherContactSection.vue";
import AboutTeacherCtaSection from "./sections/AboutTeacherCtaSection.vue";
import AboutTeacherExperienceSection from "./sections/AboutTeacherExperienceSection.vue";
import AboutTeacherHeroSection from "./sections/AboutTeacherHeroSection.vue";
import AboutTeacherMethodSection from "./sections/AboutTeacherMethodSection.vue";

const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);

const site = computed(() => mapHomeSite(setting.value));
const teacherName = computed(() => site.value.brandName || "مدرسك");
const teacherRole = computed(
  () =>
    site.value.description ||
    "مدرس متخصص يساعد طلاب المرحلة الثانوية على الفهم والتطبيق بثقة",
);
const teacherImage = computed(
  () => site.value.cover?.src || site.value.logo?.src || "/images/logo.png",
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
  title: () => `عن ${teacherName.value}`,
  description: () => teacherRole.value,
  ogTitle: () => `عن ${teacherName.value}`,
  ogDescription: () => teacherRole.value,
  ogImage: () => teacherImage.value,
});

useHead({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
  },
});

let revealObserver: IntersectionObserver | null = null;

onMounted(() => {
  const elements = document.querySelectorAll<HTMLElement>(
    ".about-teacher-page [data-about-reveal]",
  );

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        (entry.target as HTMLElement).classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  elements.forEach((element) => revealObserver?.observe(element));
});

onBeforeUnmount(() => revealObserver?.disconnect());
</script>

<template>
  <div
    class="home-v2 about-teacher-page"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />

    <main class="about-teacher-main">
      <AboutTeacherHeroSection
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

    <HomeFooterSection :site="site" />
  </div>
</template>
