<script setup lang="ts">
import { ref } from "vue";
import RightDots from "~/public/icons/RightDots.vue";
import LeftDots from "~/public/icons/LeftDots.vue";
import StagesTitle from "./StagesTitle.vue";
import type Stages from "~/types/stages";
import type Universitiey from "~/types/universitey";

import { baseUrl } from "~/constant/baseUrl";

const showStages = ref(false);
const showUniversities = ref(false);

const { data: stages } = await useAsyncData("stages", async () => {
  const response = await $fetch<{
    data: Stages[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_stages`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": "abouelezz.com",
    },
  });
  return response.data;
});

const stageYears = ref<Stages[]>([]);
const fetchStageYears = async (stageId: number) => {
  const response = await $fetch<{
    data: Stages[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_stage_years`, {
    method: "POST",
    body: { stage_id: stageId },
    headers: {
      "Accept-Language": "ar",
      "web-domain": "abouelezz.com",
    },
  });
  stageYears.value = response.data;
};

const universitieyTypes = ref<Universitiey[]>([]);
const universities = ref<Universitiey[]>([]);

const { data:universitiey } = await useAsyncData("universitiey", async () => {
  const response = await $fetch<{
    data: Universitiey[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_education_type`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": "abouelezz.com",
    },
    body: {
      category_id: 2,
    },
  });
  universitieyTypes.value = response.data;
  return response.data;
});

const fetchUniversities = async (typeId: number) => {
  const response = await $fetch<{
    data: Universitiey[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_universities`, {
    method: "POST",
    body: { type_id: typeId },
    headers: {
      "Accept-Language": "ar",
      "web-domain": "abouelezz.com",
    },
  });
  universities.value = response.data;
};


const emit =defineEmits(['UpdateDate'])
const CategryId = ref<number>()
const SendData = ()=>{
  emit('UpdateDate',{
    CategryId:CategryId.value,


  })
}

watch(
  ()=>CategryId.value,
  (newValue) => {
    SendData()
  }
)

</script>

<template>
  <div class="stage-container stage-container-dots">
    <div class="stages-background">
      <LeftDots class="background-icon" />
      <RightDots class="background-icon" />
    </div>

    <div class="stages stages-dot">
      <StagesTitle
        :maintitle="`المراحل التعليميه`"
        :subtitle="`اكتشف كل مرحلة في رحلتك التعليمية، من الأساسيات إلى التخصصات المتقدمة`"
      />

      <div class="stages-buttons flex flex-row gap-4 justify-start mt-4">
        <button
          class="btn btn-secondary btn-stages"
          @click="showStages = !showStages; showUniversities = false; CategryId=1"
        >
          تعليم اساسي
        </button>
        <button 
          class="btn btn-secondary btn-stages"
          @click="showUniversities = !showUniversities; showStages = false ;CategryId=2"
        >
          تعليم جامعي
        </button>
      </div>

      <!-- التعليم الأساسي -->
      <div v-if="showStages" class="stages-buttons mt-4 flex flex-wrap gap-3">
        <template v-if="stages">
          <button
            v-for="stage in stages"
            :key="`basic-${stage.id}`"
            class="btn btn-secondary btn-stages btn-stages-education"
            @click="fetchStageYears(stage.id)"
          >
            {{ stage.title }}
          </button>
        </template>

        <template v-if="stageYears">
          <button
            v-for="year in stageYears"
            :key="`secondary-${year.id}`"
            class="btn btn-secondary btn-stages btn-stages-education"
          >
            {{ year.title }}
          </button>
        </template>
      </div>

      <!-- التعليم الجامعي -->
      <div v-if="showUniversities" class="stages-buttons mt-4 flex flex-wrap gap-3">
        <template v-if="universitiey">
          <button
            v-for="type in universitiey"
            :key="`type-${type.id}`"
            class="btn btn-secondary btn-stages btn-stages-education"
            @click="fetchUniversities(type.id)"
          >
          {{ console.log(type.title , "type.title") }}
          {{ type.title }}
        </button>
      </template>
      
      <template v-if="universities">
        <button
        v-for="university in universities"
        :key="`university-${university.id}`"
        class="btn btn-secondary btn-stages btn-stages-education"
        >
        {{ console.log(university.title , "university.title") }}
            {{ university.title }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style setup lang="scss"></style>