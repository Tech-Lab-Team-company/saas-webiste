<script setup lang="ts">
import type { HomeHeroViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import { getDescriptiveImageAlt } from "~/utils/imageAlt";

const props = defineProps<{
  hero: HomeHeroViewModel;
  teacherName: string;
  teacherRole: string;
}>();

const eyebrow = computed(() => props.hero.subtitle?.trim() || "");
const title = computed(() => props.hero.title?.trim() || "");
const description = computed(() => props.hero.description?.trim() || "");
const heroLink = computed(() => props.hero.link?.trim() || "");
const desktopImage = computed(
  () => props.hero.image?.src || props.hero.mobileImage?.src || "",
);
const mobileImage = computed(() => props.hero.mobileImage?.src || "");
const imageAlt = computed(() => getDescriptiveImageAlt(
  props.hero.image?.alt,
  props.teacherName
    ? `صورة ${props.teacherName}${props.teacherRole ? `، ${props.teacherRole}` : ""}`
    : `صورة توضيحية لقسم ${title.value || "عن المدرس"}`,
));
const hasHeroContent = computed(() =>
  Boolean(
    eyebrow.value ||
      title.value ||
      description.value ||
      heroLink.value ||
      desktopImage.value,
  ),
);
</script>

<template>
  <section
    class="about-teacher-hero"
    :aria-labelledby="
      hasHeroContent && title
        ? 'about-teacher-title'
        : !hasHeroContent
        ? 'about-teacher-empty-title'
        : undefined
    "
  >
    <div class="about-teacher-hero__ambient" aria-hidden="true">
      <span class="about-teacher-hero__orb about-teacher-hero__orb--one" />
      <span class="about-teacher-hero__orb about-teacher-hero__orb--two" />
    </div>
    <div
      v-if="!hasHeroContent"
      class="container about-teacher-hero__copy about-teacher-hero__empty"
      data-about-reveal
    >
      <span class="about-teacher-hero__empty-mark" aria-hidden="true">+</span>
      <span class="about-teacher-eyebrow">قسم عن المدرس</span>
      <h1 id="about-teacher-empty-title">أضف محتوى القسم</h1>
      <p>أضف العنوان والوصف والصورة من لوحة التحكم ليظهر قسم التعريف هنا.</p>
    </div>

    <div v-else class="container about-teacher-hero__grid">
      <div class="about-teacher-hero__copy" data-about-reveal>
        <span v-if="eyebrow" class="about-teacher-eyebrow">{{ eyebrow }}</span>
        <h1 v-if="title" id="about-teacher-title">{{ title }}</h1>
        <p v-if="description">{{ description }}</p>
        <div v-if="heroLink" class="about-teacher-hero__actions">
          <a :href="heroLink"> اعرف أكثر <span aria-hidden="true">←</span> </a>
          <a href="#study-method">اعرف نظام الدراسة</a>
        </div>
      </div>

      <figure
        v-if="desktopImage"
        class="about-teacher-portrait"
        data-about-reveal
      >
        <picture>
          <source
            v-if="mobileImage"
            media="(max-width: 700px)"
            :srcset="mobileImage"
          />
          <NuxtImg
            :src="desktopImage"
            :alt="imageAlt"
            width="1086"
            height="1448"
            sizes="(max-width: 900px) 100vw, 36vw"
            loading="eager"
          />
        </picture>
        <figcaption v-if="teacherName || teacherRole">
          <span v-if="teacherName">{{ teacherName }}</span>
          <small v-if="teacherRole">{{ teacherRole }}</small>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
