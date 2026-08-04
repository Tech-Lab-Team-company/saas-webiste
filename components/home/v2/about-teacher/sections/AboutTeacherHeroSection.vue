<script setup lang="ts">
import type { HomeHeroViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

const props = defineProps<{
  hero: HomeHeroViewModel | null;
  teacherName: string;
  teacherRole: string;
  teacherImage: string;
}>();

const eyebrow = computed(() => props.hero?.subtitle || "عن المدرس");
const title = computed(
  () => props.hero?.title || "الفيزياء أوضح لما تفهم معنى القانون.",
);
const description = computed(
  () =>
    props.hero?.description ||
    `${props.teacherName} — ${props.teacherRole}. نقدّم محتوى تعليميًا منظمًا يبدأ من فهم الفكرة وينتهي بإتقان تطبيقها في المسألة.`,
);
const desktopImage = computed(() => props.hero?.image?.src || props.teacherImage);
const mobileImage = computed(() => props.hero?.mobileImage?.src || null);
const imageAlt = computed(
  () => props.hero?.image?.alt || `${props.teacherName} — ${props.teacherRole}`,
);
</script>

<template>
  <section class="about-teacher-hero" aria-labelledby="about-teacher-title">
    <div class="container about-teacher-hero__grid">
      <div class="about-teacher-hero__copy" data-about-reveal>
        <span class="about-teacher-eyebrow">{{ eyebrow }}</span>
        <h1 id="about-teacher-title">{{ title }}</h1>
        <p>{{ description }}</p>
        <div class="about-teacher-hero__actions">
          <a v-if="hero?.link" :href="hero.link">
            اعرف أكثر <span aria-hidden="true">←</span>
          </a>
          <NuxtLink v-else to="/course">اختار صفك <span aria-hidden="true">←</span></NuxtLink>
          <a href="#study-method">اعرف نظام الدراسة</a>
        </div>
      </div>

      <figure class="about-teacher-portrait" data-about-reveal>
        <picture>
          <source v-if="mobileImage" media="(max-width: 700px)" :srcset="mobileImage" />
          <NuxtImg
            :src="desktopImage"
            :alt="imageAlt"
            width="1086"
            height="1448"
            sizes="(max-width: 900px) 100vw, 36vw"
            loading="eager"
          />
        </picture>
        <figcaption>
          <span>{{ teacherName }}</span>
          <small>{{ teacherRole }}</small>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
