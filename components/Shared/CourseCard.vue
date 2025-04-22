<script setup lang="ts">

import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";

const { data: HomeSections } = await useAsyncData("HomeSections", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_home_website_section`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"abouelezz.com",
    },
    body: {
      type: SectionTypeEnum.Course,
    },
  });
  return response.data;
});

</script>

<template>
  <div >
    <SharedCourseCardOne 
      :HomeSections="HomeSections?.[0]"
    />
    <SharedCourseCardTwo
      :HomeSecondSection="HomeSections?.[1]"
    />
    <SharedCourseCardThree 
      :HomeThirdSection="HomeSections?.[2]"
    />
    <SharedCourseCardFour />
    <SharedBlog />
  </div>
</template>

<style></style>
