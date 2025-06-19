<script setup lang="ts">
import { ref } from "vue";
import RightDots from "~/public/icons/RightDots.vue";
import LeftDots from "~/public/icons/LeftDots.vue";
import StagesTitle from "./StagesTitle.vue";
import type Stages from "~/types/stages";
import type Universitiey from "~/types/universitey";
import { baseUrl } from "~/constant/baseUrl";
import { useFiltersStore } from '~/stores/courses_filter';
import {useSettingStore} from "~/stores/setting";
import {getWebDomain} from "~/constant/webDomain";

const filtersStore = useFiltersStore();
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
      "web-domain": getWebDomain,
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
      "web-domain": getWebDomain,
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
      "web-domain": getWebDomain,
    },
    body: {
      category_id: 2,
    },
  });
  universitieyTypes.value = response.data;
  return response.data;
});





const SelectedEducationTypeId = ref(filtersStore.SelectedEductionType)

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
      "web-domain": getWebDomain,
    },
  });
  SelectedEducationTypeId.value = typeId;
  universities.value = response.data;
  SendData();
};



const Colleges = ref<Universitiey[]>([]);
const SelectedUniversity = ref(filtersStore.SelectedUniversity)
const fetchColleges = async (typeId: number) => {
  const response = await $fetch<{
    data: Universitiey[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_colleges`, {
    method: "POST",
    body: { university_id: typeId },
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain,
    },
  });
  SelectedUniversity.value = typeId;
  Colleges.value = response.data;
  SendData();
};


const SelectedCollege = ref(filtersStore.SelectedCollege)
const CollegesDepartments = ref<Universitiey[]>([]);
const fetchCollegeDepartment = async (typeId: number) => {
  const response = await $fetch<{
    data: Universitiey[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_college_departments`, {
    method: "POST",
    body: { college_id: typeId },
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain,
    },
  });
  SelectedCollege.value = typeId;
  CollegesDepartments.value = response.data;
  SendData();
};


const SelectedCollegeDepartment = ref(filtersStore.SelectedCollegeDepartment)
const CollegesDepartmentsDivisions = ref<Universitiey[]>([]);
const fetchCollegeDepartmentDivision = async (typeId: number) => {
  const response = await $fetch<{
    data: Universitiey[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_college_department_divisions`, {
    method: "POST",
    body: { department_id: typeId },
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain,
    },
  });
  SelectedCollegeDepartment.value = typeId;
  CollegesDepartmentsDivisions.value = response.data;
  SendData();
};


const SelectedCollegeDepartmentDivision = ref(filtersStore.SelectedCollegeDepartmentDivision)
const Subjects = ref<Universitiey[]>([]);
const fetchSubjects = async (typeId: number) => {
  const response = await $fetch<{
    data: Universitiey[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_subjects`, {
    method: "POST",
    body: { category_id: CategryId.value },
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain,
    },
  });
  SelectedCollegeDepartmentDivision.value = typeId;
  Subjects.value = response.data;
  SendData();
};


const SelectedSubject = ref(filtersStore.SelectedSubject)
const SelectSubject = (typeId: number)=>{
    SelectedSubject.value = typeId
    SendData();
}

const CategryId = ref(filtersStore.CategryId)


watch(
  ()=>CategryId.value,
  (newValue) => {
    SendData()
  }
)
const emit = defineEmits(['UpdateData'])

const SendData = () => {
  filtersStore.updateFilters({
    CategryId: CategryId.value,
    SelectedEductionType: SelectedEducationTypeId.value,
    SelectedUniversity: SelectedUniversity.value,
    SelectedCollege: SelectedCollege.value,
    SelectedCollegeDepartment: SelectedCollegeDepartment.value,
    SelectedCollegeDepartmentDivision: SelectedCollegeDepartmentDivision.value,
    SelectedSubject: SelectedSubject.value
  });

  emit('UpdateData' ,{
        CategryId: CategryId.value,
    SelectedEductionType: SelectedEducationTypeId.value,
    SelectedUniversity: SelectedUniversity.value,
    SelectedCollege: SelectedCollege.value,
    SelectedCollegeDepartment: SelectedCollegeDepartment.value,
    SelectedCollegeDepartmentDivision: SelectedCollegeDepartmentDivision.value,
    SelectedSubject: SelectedSubject.value
  })
};

const settingStore = useSettingStore();


</script>

<template>
  <div class="stage-container stage-container-dots" v-if="!settingStore?.setting?.has_general">
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
          {{ $t('تعليم اساسي') }}
        </button>
        <button 
          class="btn btn-secondary btn-stages"
          @click="showUniversities = !showUniversities; showStages = false ;CategryId=2"
        >
          {{ $t('تعليم جامعي') }}
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
          {{ type.title }}
        </button>
      </template>
      
      <template v-if="universities">
        <button
        v-for="university in universities"
        :key="`university-${university.id}`"
        class="btn btn-secondary btn-stages btn-stages-education"
        @click="fetchColleges(university.id)"
        >
            {{ university.title }}
          </button>
        </template>
      </div>



      <div v-if="showUniversities" class="stages-buttons mt-4 flex flex-wrap gap-3">
        <template v-if="Colleges">
          <button
            v-for="type in Colleges"
            :key="`type-${type.id}`"
            class="btn btn-secondary btn-stages btn-stages-education"
            @click="fetchCollegeDepartment(type.id)"
          >
          {{ type.title }}
        </button>
      </template>
      
      <template v-if="CollegesDepartments">
        <button
        v-for="type in CollegesDepartments"
        :key="`university-${type.id}`"
        class="btn btn-secondary btn-stages btn-stages-education"
        @click="fetchCollegeDepartmentDivision(type.id)"
        >
            {{ type.title }}
          </button>
        </template>
      </div>


      <div v-if="showUniversities" class="stages-buttons mt-4 flex flex-wrap gap-3">
        <template v-if="CollegesDepartmentsDivisions">
          <button
            v-for="type in CollegesDepartmentsDivisions"
            :key="`type-${type.id}`"
            class="btn btn-secondary btn-stages btn-stages-education"
            @click="fetchSubjects(type.id)"
          >
          {{ type.title }}
        </button>
      </template>
      
      <template class="subjects-btns" v-if="Subjects">
       <Nuxt-link  to="/course">
         <button
        v-for="type in Subjects"
        :key="`university-${type.id}`"
        class="btn btn-secondary btn-stages btn-stages-education"
        @click="SelectSubject(type.id)"
        >
            {{ type.title }}
          </button>
        </Nuxt-link>
        </template>
      </div>







    </div>
  </div>
</template>

<style setup lang="scss">
.subjects-btns{
  display: flex;
  align-items: center;
}
</style>