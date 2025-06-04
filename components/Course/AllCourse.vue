<script setup lang="ts">
import { ref } from "vue";
import toggleone from "~/public/icons/toggleone.vue";
import toggletwo from "~/public/icons/toggletwo.vue";
import { baseUrl } from "~/constant/baseUrl";
import type CoursesFilterModel from "~/features/CoursesFilter/Data/models/courses_filter_model";
import { useFiltersStore } from '~/stores/courses_filter';

const filtersStore = useFiltersStore();

const CategoryId = ref(filtersStore.CategryId);
const EduicationType = ref(filtersStore.SelectedEductionType);
const UniversityId =  ref(filtersStore.SelectedUniversity);
const CollegeId =   ref(filtersStore.SelectedCollege);
const DepartmentId = ref(filtersStore.SelectedCollegeDepartment);
const DivisionId = ref(filtersStore.SelectedCollegeDepartmentDivision);
const SubjectId =   ref(filtersStore.SelectedSubject);


const CoursesFilter = ref<CoursesFilterModel[]>([]);
const fetchCourses = async () => {
  const response = await $fetch<{
    data: CoursesFilterModel[];
    message: string;
    status: number;
  }>(`${baseUrl}/filter_courses`, {
    method: "POST",
    body: { 
        category_id: CategoryId.value,
        type: 1,
        education_type_id: EduicationType.value,
        stage_id: null,
        year_id: null,
        subject_id:null ,
        university_id: UniversityId.value,
        college_id: CollegeId.value,
        department_id: DepartmentId.value,
        division_id: DivisionId.value,
        university_subject_id: SubjectId.value,
    },
    headers: {
      "Accept-Language": "ar",
      "web-domain": "hrarabians.com",
    },
  });

  CoursesFilter.value = response.data;

};

const CourseFilterData = (data)=>{
  console.log(data , "filter data")
  CategoryId.value = data.CategryId
  EduicationType.value = data.SelectedEductionType
  UniversityId.value = data.SelectedUniversity
  CollegeId.value = data.SelectedCollege
  DepartmentId.value = data.SelectedCollegeDepartment
  DivisionId.value = data.SelectedCollegeDepartmentDivision
  SubjectId.value = data.SelectedSubject
  fetchCourses();
}

onMounted(() => {
  fetchCourses();
});




const props = defineProps(['showUniversities' , 'showStages'])



const selectedToggle = ref();
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

    <!-- {{  console.log(CoursesFilter , "response.data")  }} -->
    <div v-if="selectedToggle === 'two'">
      <CourseAllCourseOne :HomeSections="CoursesFilter " />
    </div>
    <div v-else>
      <CourseAllCourseTwo :HomeSections="CoursesFilter" />
    </div>
  </div>
  <HomeHomeEducationStages 
  @UpdateData="CourseFilterData"
  class="stages"
  />

</template>

<style scoped lang="scss">
.stages{
  background-color: #f6f6f6 !important;
padding-bottom: 20px;
margin-top:20px
  
}
.aa {
  background-color: #f6f6f6 !important;
  width: 100%;
      margin-bottom: 24px;
    padding-bottom: 20px;
  // margin-top: 30px;
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
