<script setup lang="ts">
import { ref } from "vue";
import toggleone from "~/public/icons/toggleone.vue";
import toggletwo from "~/public/icons/toggletwo.vue";
import { baseUrl } from "~/constant/baseUrl";
import type CoursesFilterModel from "~/features/CoursesFilter/Data/models/courses_filter_model";
import { useFiltersStore } from '~/stores/courses_filter';
import {getWebDomain} from "~/constant/webDomain";
import CoursesFilterParams from "~/features/CoursesFilter/Core/Params/courses_filter_params";
import CoursesFilterController from "~/features/CoursesFilter/presentation/controllers/courses_filter_controller";
import Loder from "../Loader/Loder.vue";

const filtersStore = useFiltersStore();

const CategoryId = ref(filtersStore.CategryId);
const EduicationType = ref(filtersStore.SelectedEductionType);
const UniversityId =  ref(filtersStore.SelectedUniversity);
const CollegeId =   ref(filtersStore.SelectedCollege);
const DepartmentId = ref(filtersStore.SelectedCollegeDepartment);
const DivisionId = ref(filtersStore.SelectedCollegeDepartmentDivision);
const SubjectId =   ref(filtersStore.SelectedSubject);
const StageId =   ref(filtersStore.SelectedStage);
const StageYearId =   ref(filtersStore.SelectedStageYear);
const StageTitle =   ref(filtersStore.SelectedStageTitle);
const StageYearTitle =   ref(filtersStore.SelectedStageYearTitle);


   const userStore = useUserStore(); 



const CoursesFilter = ref<CoursesFilterModel[]>([]);
const token: string | undefined = userStore?.user?.apiToken;
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
        stage_id: StageId.value,
        year_id: StageYearId.value,
        subject_id:null ,
        university_id: UniversityId.value,
        college_id: CollegeId.value,
        department_id: DepartmentId.value,
        division_id: DivisionId.value,
        university_subject_id: SubjectId.value,
    },
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain(),
      // 'Authorization' : 'Bearer ' + token,
      
    },
  });

  CoursesFilter.value = response.data;

};

// const fetchCourses = async () => {
//   const coursesFilterParams = new CoursesFilterParams(CategoryId.value ,1,EduicationType.value,StageId.value,StageYearId.value,null,UniversityId.value,CollegeId.value,DepartmentId.value,DivisionId.value,SubjectId.value)
//   const coursesFilterController = CoursesFilterController.getInstance() ;
//   const response = await coursesFilterController.CoursesFilter(coursesFilterParams);
//   if(response.value.data){
//     CoursesFilter.value = response.value.data
//   }

// }


const CourseFilterData = (data)=>{
  CategoryId.value = data.CategryId
  EduicationType.value = data.SelectedEductionType
  UniversityId.value = data.SelectedUniversity
  CollegeId.value = data.SelectedCollege
  DepartmentId.value = data.SelectedCollegeDepartment
  DivisionId.value = data.SelectedCollegeDepartmentDivision
  SubjectId.value = data.SelectedSubject
  StageId.value = data.SelectedStage
  StageYearId.value = data.SelectedStageYear
  StageTitle.value=data.SelectedStageTitle
  StageYearTitle.value=data.SelectedStageYearTitle
  fetchCourses();
}

onMounted(() => {
  fetchCourses();
});




const props = defineProps(['showUniversities' , 'showStages'])



const selectedToggle = ref();

watch(()=>filtersStore,
()=>{
  StageTitle.value = filtersStore.SelectedStageTitle
  StageYearTitle.value = filtersStore.SelectedStageYearTitle
}


)
</script>
<template>
    <div class="page-loader" v-if="!CoursesFilter"  >
      <Loder />
    </div>
  

  <div class="aa">
    <div class="header-toggle">
    
      <p class="cards-heading">{{ CoursesFilter.length }} {{ $t('جميع الكورسات') }} {{ StageTitle ?  `(${StageTitle} - ${StageYearTitle ? StageYearTitle:''})` : `` }}</p>
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
    <div v-if="selectedToggle === 'one'">
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

.page-loader{
  height: 100vh;
  width: 100%;
      position: absolute;
    background-color: #000000c9;
    top: 0;
    left: 0;
        z-index: 99;
}
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
  margin: 20px 0;
  padding: 0 20px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
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
    background-color: var(--secondary-color);
    border: 2px solid var(--secondary-color);
    width: 43px;
    height: 43px;
  }
}

.stages-container,
.stage-container .stages {
  background-color: #f6f6f6 !important;
}
</style>
