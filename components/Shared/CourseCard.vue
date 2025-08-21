<script setup lang="ts">

import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import { getWebDomain } from "~/constant/webDomain";
import { HomeCoursesTeachersSection } from "#components";

const { data: HomeSections } = await useAsyncData("FirstHomeSections", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_home_website_section`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain(),
    },
    body: {
      type: SectionTypeEnum.Course,
    },
  });


  const FirstSectionFilter = response.data.filter(section => section.style === 1);
  const SecondSectionFilter = response.data.filter(section => section.style === 2);
  const ThirdSectionFilter = response.data.filter(section => section.style === 3);

  return { FirstSectionFilter, SecondSectionFilter, ThirdSectionFilter };


});

const setting = useSettingStore();

</script>

<template>
  <div>
    <SharedGarduationPartySection />

    <HomeCoursesSectionOne v-if="HomeSections?.FirstSectionFilter?.length > 0"
      v-for="(section, index) in HomeSections?.FirstSectionFilter" :key="index" :HomeSections="section" />

    <HomeCoursesSectionTwo v-if="HomeSections?.SecondSectionFilter?.length > 0"
      v-for="(section, index) in HomeSections?.SecondSectionFilter" :key="index" :HomeSections="section" />

    <HomeCoursesSectionThree v-if="HomeSections?.ThirdSectionFilter?.length > 0"
      v-for="(section, index) in HomeSections?.ThirdSectionFilter" :key="index" :HomeSections="section" />

    <HomeCoursesSectionFour />
    <HomeCoursesTeachersSection v-if="setting?.setting?.teachers_slider" />
    <SharedBlog />
  </div>
</template>

<style scoped></style>
