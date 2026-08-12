<script setup lang="ts">
import { storeToRefs } from "pinia";
import { FetchError } from "ofetch";
import { getWebDomain } from "~/constant/webDomain";
import CourseDetailsParams from "~/features/FetchCourseDetails/Core/Params/course_details_params";
import { fetchCourseDetails } from "~/features/FetchCourseDetails/Data/api_services/course_details_api_services";
import type CourseDetailsModel from "~/features/FetchCourseDetails/Data/models/course_details_model";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";
import { resolveCourseSeo } from "~/utils/seoText";
import { useSiteUrl } from "~/utils/siteUrl";

definePageMeta({
  layout: "course-details",
});

const route = useRoute();
const userStore = useUserStore();
const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);
const site = computed(() => mapHomeSite(setting.value));
const webDomain = getWebDomain();
const { siteOrigin, buildSiteUrl } = useSiteUrl();
const courseId = computed(() => {
  const rawId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? String(id) : null;
});

const { data: course, pending, refresh } = await useAsyncData<CourseDetailsModel>(
  `course-details:${webDomain}:${courseId.value || "invalid"}`,
  async () => {
    if (!courseId.value) {
      throw createError({ statusCode: 404, statusMessage: "Course not found" });
    }

    try {
      return await fetchCourseDetails(
        new CourseDetailsParams(courseId.value),
        webDomain,
        userStore.user?.apiToken,
      );
    } catch (error) {
      if (error instanceof FetchError && [404, 422].includes(error.statusCode || 0)) {
        throw createError({ statusCode: 404, statusMessage: "Course not found" });
      }
      throw error;
    }
  },
  { dedupe: "defer" },
);

watch(courseId, () => refresh());

const courseSeo = computed(() => resolveCourseSeo({
  title: course.value?.title,
  description: course.value?.description,
  fallbackTitle: site.value.metaTitle || site.value.brandName,
  fallbackDescription: site.value.metaDescription || site.value.description,
}));
const courseUrl = computed(() => buildSiteUrl(`/course/${courseId.value || ""}`));
const courseImage = computed(() => {
  const image = course.value?.Image as unknown as {
    img?: string;
    image?: string;
  } | undefined;
  return image?.img || image?.image || undefined;
});
const courseSchema = computed(() => {
  if (!course.value || !courseId.value) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${courseUrl.value}#course`,
    url: courseUrl.value,
    name: courseSeo.value.title,
    description: courseSeo.value.description,
    inLanguage: "ar",
    ...(courseImage.value ? { image: courseImage.value } : {}),
    ...(course.value.Subject?.title
      ? { about: course.value.Subject.title }
      : {}),
    provider: {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: site.value.brandName || course.value.Teacher?.name || "المنصة التعليمية",
      url: `${siteOrigin}/`,
    },
  };
});

useSeoMeta({
  title: () => courseSeo.value.title,
  description: () => courseSeo.value.description,
  ogTitle: () => courseSeo.value.title,
  ogDescription: () => courseSeo.value.description,
  ogUrl: () => courseUrl.value,
  ogImage: () => courseImage.value,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: () => courseSeo.value.title,
  twitterDescription: () => courseSeo.value.description,
  twitterImage: () => courseImage.value,
});

useHead(() => ({
  link: [{ key: "canonical", rel: "canonical", href: courseUrl.value }],
  script: courseSchema.value
    ? [{
        key: "course-schema",
        type: "application/ld+json",
        innerHTML: JSON.stringify(courseSchema.value).replace(/</gu, "\\u003c"),
      }]
    : [],
}));

const refreshCourseDetails = async () => {
  await refresh();
};
</script>
<template>
  <div class="blogs-page">
    <CourseDetailsCourseTabs
      :course-data="course || null"
      :pending="pending"
      @refresh="refreshCourseDetails"
    />
    <!-- <ProfileMyCourseCard /> -->
  </div>
</template>

<style scoped></style>
