<script setup lang="ts">

import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";

const { data: HomeSections } = await useAsyncData("FirstHomeSections", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_home_website_section`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"hrarabians.com",
    },
    body: {
      type: SectionTypeEnum.Course,
    },
  });


  const FirstSectionFilter = response.data.filter(section => section.style === 1);
  const SecondSectionFilter = response.data.filter(section => section.style === 2);
  const ThirdSectionFilter = response.data.filter(section => section.style === 3);

  return {FirstSectionFilter , SecondSectionFilter, ThirdSectionFilter};
  

});


</script>

<template>
  <div >
    <SharedGarduationPartySection />
    
    <SharedCourseCardOne 
      v-for="(section , index) in HomeSections?.FirstSectionFilter"
      :key="index"
      :HomeSections="section"
    />
    <SharedCourseCardTwo 
    v-for="(section , index) in HomeSections?.SecondSectionFilter"
      :key="index"
      :HomeSections="section"
    />
    <SharedCourseCardThree 
        v-for="(section , index) in HomeSections?.ThirdSectionFilter"
      :key="index"
      :HomeSections="section"/>
    <SharedCourseCardFour />
    <SharedBlog />
  </div>
</template>

<style scoped></style>
