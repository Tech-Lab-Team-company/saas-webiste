<script lang="ts" setup>
import student from "../../public/icons/student.vue";
import RegisterBook from "../../public/icons/RegisterBook.vue";
import RegisterBookOne from "../../public/icons/RegisterBookOne.vue";
import Award from "../../public/icons/Award.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import { StudentCategoryEnum } from "~/features/RegisterFeature/Core/Enums/education_type_enum";
import EducationStagesController from "~/features/FetchEducationStages/presentation/controllers/education_stages_controller";
import EducationStagesParams from "~/features/FetchEducationStages/Core/Params/education_stages_params";
import EducationLevelsController from "~/features/FetchEducationLevels/presentation/controllers/education_levels_controller";
import EducationLevelsParams from "~/features/FetchEducationLevels/Core/Params/education_levels_params";
import UniversityParams from "~/features/FetchUniversity/Core/Params/univerisity_params";
import type UserModel from "~/features/FetchEducationStages/Data/models/education_stages_model";
import type TitleModel from "~/base/core/Models/title_model";
import UniversityController from "~/features/FetchUniversity/presentation/controllers/university_controller";
import CollegesController from "~/features/FetchCollege/presentation/controllers/colleges_controller";
import CollegesParams from "~/features/FetchCollege/Core/Params/colleges_params";
import CollegeDepartmentController from "~/features/FetchCollegeDepartment/presentation/controllers/college_department_controller";
import CollegeDetpartmentParams from "~/features/FetchCollegeDepartment/Core/Params/colleges_department_params";
import CollegeDepartmentDivisionsController from "~/features/FetchCollegeDepartmentDivisions/presentation/controllers/college_department_divisions_controller";
import CollegeDetpartmentDivisionsParams from "~/features/FetchCollegeDepartmentDivisions/Core/Params/colleges_department_divisions_params";
import SubmitEducationDataController from "~/features/SubmitEducationData/presentation/controllers/submit_education_data_controller";
import SubmitEducationDataParams from "~/features/SubmitEducationData/Core/Params/submit_education_data_params";
import FetchGeneralCoursesSubjectController from "~/features/FetchGeneralCourseSubject/presentation/controllers/fetch_general_course_subjects_controller";
import FetchGeneralCoursesSubjectParams from "~/features/FetchGeneralCourseSubject/Core/Params/fetch_general_course_subjects_params";


import EducationBasicLevelsController from "~/features/FetchBasicEducationStages/presentation/controllers/education_basic_levels_controller";
import EducationBasicLevelsParams from "~/features/FetchBasicEducationStages/Core/Params/basic_education_levels_params";

import EducationBasicStagesYearController from "~/features/FetchBasicStagesYear/presentation/controllers/education_basic_stages_year_controller";
import EducationBasicStagesYearParams from "~/features/FetchBasicStagesYear/Core/Params/basic_education_stages_year_params";

import EducationBasicSubjectsController from "~/features/FetchBasicSubjects/presentation/controllers/education_basic_subjects_controller";
import EducationBasicSubjectsParams from "~/features/FetchBasicSubjects/Core/Params/basic_education_subjects_params";


const studentCategory = ref(0)

const Eductaion_Type = ref<TitleModel[]>([]);
const EducationCategory = ref<number>();
const University = ref<TitleModel[]>([]);
const Colleges = ref<TitleModel[]>([]);
const CollegeDeprtment = ref<TitleModel[]>([]);
const CollegeDeprtmentDivision = ref<TitleModel[]>([]);

const userStore = useUserStore()


const FetchEducationStages = async () => {
  const educationStagesParams = new EducationStagesParams(userStore?.user?.category_id);
  const educationStagesController = EducationStagesController.getInstance();
  const state = await educationStagesController.FetchEducationStages(educationStagesParams);

  if (state.value.data) {
    Eductaion_Type.value.push(...state.value.data);
  }
}

watch(() => studentCategory.value,
  (NewValue) => {
    studentCategory.value = NewValue;
    FetchEducationStages();
  })




const FetchUniversityEducationLevel = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value))
  const universityParams = new UniversityParams(Number((data.target as HTMLSelectElement).value), 1);
  const universityController = UniversityController.getInstance();
  const state = await universityController.FetchUniversity(universityParams)


  if (state.value.data) {
    University.value.push(...state.value.data);
  }
}

const FetchColleges = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value))
  const collegesParams = new CollegesParams(Number((data.target as HTMLSelectElement).value));
  const collegesController = CollegesController.getInstance();
  const state = await collegesController.FetchColleges(collegesParams)


  if (state.value.data) {
    Colleges.value.push(...state.value.data);
  }
  console.log(Colleges.value)

}
const FetchCollegesDeprtment = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value))
  const collegeDetpartmentParams = new CollegeDetpartmentParams(Number((data.target as HTMLSelectElement).value));
  const collegeDepartmentController = CollegeDepartmentController.getInstance();
  const state = await collegeDepartmentController.FetchCollegeDepartment(collegeDetpartmentParams)


  if (state.value.data) {
    CollegeDeprtment.value.push(...state.value.data);
  }
  console.log(Colleges.value)

}
const FetchCollegesDeprtmentDivisions = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value))
  const collegeDetpartmentDivisionsParams = new CollegeDetpartmentDivisionsParams(Number((data.target as HTMLSelectElement).value));
  const collegeDepartmentDivisionsController = CollegeDepartmentDivisionsController.getInstance();
  const state = await collegeDepartmentDivisionsController.FetchCollegeDepartmentDivisions(collegeDetpartmentDivisionsParams)


  if (state.value.data) {
    CollegeDeprtmentDivision.value.push(...state.value.data);
  }


}

onMounted(() => {
  FetchEducationStages();
})

const SendUniversityData = async () => {
    const EducationDataParams = new SubmitEducationDataParams(Eductaion_Type?.value?.[0]?.id, CollegeDeprtmentDivision.value?.[0]?.id, studentCategory?.value, University.value?.[0]?.id,
      Colleges.value?.[0]?.id, CollegeDeprtment.value?.[0]?.id ,null , null , null);
  const submitEducationDataController = SubmitEducationDataController.getInstance();
  const state = await submitEducationDataController.SubmitEducationData(EducationDataParams);
}

const SendGeneralData = async () => {
  const EducationDataParams = new SubmitEducationDataParams(null,null,null,null,null,null,null , null , null );
  const submitEducationDataController = SubmitEducationDataController.getInstance();
  const state = await submitEducationDataController.SubmitEducationData(EducationDataParams);
}




const selectedSubject = ref()
const Subjects = ref()



const  BasicEducationCategory = ref<number | null>(null);
const FetchEduciationLevels =async ()=>{
  const educationBasicLevelsParams = new EducationBasicLevelsParams(BasicEducationCategory.value);
  const educationBasicLevelsController = EducationBasicLevelsController.getInstance();
  const state = await educationBasicLevelsController.FetchEducationBasicLevels(educationBasicLevelsParams);
  if(state.value.data) {
    Levels.value.push(...state.value.data);

  }

}



const selectedLevel = ref<number | null>(null);
const Levels = ref<TitleModel[]>([]);
const FetchStage = async ()=>{
  const educationBasicStagesYearParams = new EducationBasicStagesYearParams(selectedLevel.value)
  const educationBasicStagesYearController = EducationBasicStagesYearController.getInstance();
  const state = await educationBasicStagesYearController.FetchEducationBasicStagesYear(educationBasicStagesYearParams);
  if(state.value.data) {
    Stages.value.push(...state.value.data);
  }
}




const selectedStage = ref<number | null>(null);
const Stages = ref<TitleModel[]>([]);
const FetchSubjects =async ()=>{
  const educationBasicSubjectsParams = new EducationBasicSubjectsParams(userStore.user?.category_id , selectedStage.value);
  const educationBasicSubjectsController = EducationBasicSubjectsController.getInstance();

  const state = await educationBasicSubjectsController.FetchEducationBasicSubjects(educationBasicSubjectsParams);
  if(state.value.data) {
    BasicSubjects.value.push(...state.value.data);
  }
}


const BasicSubjects = ref<TitleModel[]>([]);
const selectedBasicSubject = ref<number | null>(null);

const SendBasicData = async()=>{
 const EducationDataParams = new SubmitEducationDataParams(null,null,null,null,null,null,selectedStage.value , BasicEducationCategory.value , selectedLevel.value);
  const submitEducationDataController = SubmitEducationDataController.getInstance();
  const state = await submitEducationDataController.SubmitEducationData(EducationDataParams);
}

</script>

<template>
  <div class="login-container pass-forgit">
    <div class="login-form">
      <h3>بياناتك التعليمية</h3>
      <p>
        مرحبا بك فى منصتنا ادخل معلوماتك الشخصيه التاليه و احرص على ادخال
        البياناتك الضروريه و المحاطه باللون الازرق وعلامه مميزه *
      </p>

      <div class="inputs">
        <div class="login-input">
           <select class="student-select" 
           disabled
          :value="userStore.user?.category_id == 1 ? StudentCategoryEnum.base : userStore.user?.category_id == 2 ? StudentCategoryEnum.university : StudentCategoryEnum.general"
          >
            <option  :value="StudentCategoryEnum.base">اساسى</option>
            <option :value="StudentCategoryEnum.university">جامعى</option>
            <option :value="StudentCategoryEnum.general">عام</option>
          </select>
          <Award class="login-call-icon" />
        </div>
      </div>


      <div class="inputs" v-if="userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select" v-model="EducationCategory" @change="FetchUniversityEducationLevel">
            <option value="" disabled selected>نوع التعليم</option>
            <option v-for="(item, index) in Eductaion_Type" :key="index" :value="item.id">{{ item.title }}</option>

          </select>
          <Award class="login-call-icon" />
        </div>
      </div>


      <div class="inputs" v-if="userStore.user?.category_id == 1">
        <div class="login-input">
          <label :class="{'select-placeholder': !BasicEducationCategory , 'hidden':BasicEducationCategory}">نوع التعليم</label>
          <select class="student-select" v-model="BasicEducationCategory" @change="FetchEduciationLevels">
            <!-- <option value="" disabled selected>نوع التعليم</option> -->
            <option v-for="(item, index) in Eductaion_Type" :key="index" :value="item.id">{{ item.title }}</option>

          </select>
          <Award class="login-call-icon" />
        </div>
      </div>




      <div class="inputs" v-if=" userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select" @change="FetchColleges">
            <option value="" disabled selected>جامعة</option>
            <option v-for="(item, index) in University" :key="index" :value="item.id">{{ item.title }}</option>

          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs" v-if=" userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select" @change="FetchCollegesDeprtment">
            <option value="" disabled selected>الكلية</option>
            <option v-for="(item, index) in Colleges" :key="index" :value="item.id">{{ item.title }}</option>


          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs" v-if=" userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select" @change="FetchCollegesDeprtmentDivisions">
            <option value="" disabled selected>القسم</option>
            <option v-for="(item, index) in CollegeDeprtment" :key="index" :value="item.id">{{ item.title }}</option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs" v-if=" userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select">
            <option value="" disabled selected>المستوى</option>
            <option v-for="(item, index) in CollegeDeprtmentDivision" :key="index" :value="item.id">{{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>



      <div class="inputs" v-if=" userStore.user?.category_id == 1 && BasicEducationCategory">
        <div class="login-input">
          <label :class="{'select-placeholder': !selectedLevel , 'hidden':selectedLevel}">المرحلة</label>
          <select class="student-select" v-model="selectedLevel" @change="FetchStage">
            <option v-for="(item, index) in Levels" :key="index" :value="item.id">{{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>

      <div class="inputs" v-if=" userStore.user?.category_id == 1 && selectedLevel">
        <div class="login-input">
          <label :class="{'select-placeholder': !selectedStage , 'hidden':selectedStage}">الصف</label>
          <select class="student-select" v-model="selectedStage" @change="FetchSubjects">
            <option v-for="(item, index) in Stages" :key="index" :value="item.id">{{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs" v-if=" userStore.user?.category_id == 1 && selectedStage">
        <div class="login-input">
          <label :class="{'select-placeholder': !selectedBasicSubject , 'hidden':selectedBasicSubject}">المادة</label>
          <select class="student-select" v-model="selectedBasicSubject" >
            <option v-for="(item, index) in BasicSubjects" :key="index" :value="item.id">{{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>




      <div class="btns btns-home" @click="SendUniversityData"  v-if="userStore.user?.category_id == 2">
        <button class="login-btn" >
          اختر فئاتك المفضله
          <LeftArrowIcon class="left-icon" />
        </button>

      </div>
      <div class="btns btns-home" @click="SendGeneralData" v-if="userStore.user?.category_id == 3">
        <button class="login-btn" >
          اختر فئاتك المفضله
          <LeftArrowIcon class="left-icon" />
        </button>

      </div>
      <div class="btns btns-home" @click="SendBasicData" v-if="userStore.user?.category_id == 1">
        <button class="login-btn" >
          اختر فئاتك المفضله
          <LeftArrowIcon class="left-icon" />
        </button>

      </div>
    </div>
  </div>
</template>

<style scoped>

.hidden{
  display: none;
}

.login-input {
  position: relative;
}

.select-placeholder {
  position: absolute;
  top: 50%;
  right: 7%;
  transform: translateY(-50%);
  color: #909dad;
  pointer-events: none;
  transition: 0.2s;
}
.pass-forgit {
  background-image: url(../../public//images/background.png);
}

select {
  color: #a3adbb;
  text-align: right;
  padding: 10px 30px 10px 0;
  border-radius: 10px;
  border: 1px solid #dde1e6;
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
  direction: rtl;
}

select:focus {
  outline: none;
  border: 1px solid #b2bbc6;
}

input {
  width: 100%;
  padding: 10px 60px 10px 10px;
  border: 1px solid #dde1e6;
  border-radius: 10px;
  direction: rtl;
}

input:focus {
  outline: none;
  border: 1px solid #b2bbc6;
}

.login-container .login-form .btns.btns-home button {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}

.left-icon {
  width: 24px;
  height: 24px;
}

.login-container .login-form .btns.btns-home button {
  width: 51% !important;
}
</style>
