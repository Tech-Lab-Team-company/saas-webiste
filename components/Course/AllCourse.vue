<script setup lang="ts">
import { ref } from "vue";
import toggleone from "~/public/icons/toggleone.vue";
import toggletwo from "~/public/icons/toggletwo.vue";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import { baseUrl } from "~/constant/baseUrl";

const { data: HomeSections } = useAsyncData("HomeSectionss", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_home_website_section`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": "abouelezz.com",
    },
    body: {
      type: SectionTypeEnum.Course,
    },
  });

  return response.data;
});

const selectedToggle = ref("one");
</script>
<template>

  <div class="aa">
    <div class="header-toggle">
      <p class="cards-heading">(6) جميع الكورسات</p>
      <div class="toggle">
        <div
          :class="['toggle-icon', { active: selectedToggle === 'two' }]"
          @click="selectedToggle = 'two'"
        >
          <toggletwo />
        </div>
        <div
          :class="['toggle-icon', { active: selectedToggle === 'one' }]"
          @click="selectedToggle = 'one'"
        >
          <toggleone />
        </div>
      </div>
    </div>

    <div v-if="selectedToggle === 'two'">
      <CourseAllCourseOne :HomeSections="HomeSections" />
    </div>
    <div v-else>
      <CourseAllCourseTwo :HomeSections="HomeSections" />
    </div>
  </div>
  <HomeHomeEducationStages />

</template>

<style scoped lang="scss">
.aa {
  background-color: #f6f6f6 !important;
}

.header-toggle {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
  width: 100%;
}

.cards-heading {
  font-size: 25px;
  color: #222;
  font-weight: 400;
  font-family: "regular";
  margin: 0;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #222;
  font-weight: 400;
  font-family: "regular";
}

.toggle-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: transparent;
  width: 43px;
  height: 43px;

  &.active {
    background-color: #ffb949;
    border: 2px solid #ffb949;
    width: 43px;
    height: 43px;
  }
}

.stages-container,
.stage-container .stages {
  background-color: #f6f6f6 !important;
}
</style>
