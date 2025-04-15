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

const studentCategory = ref(0)

const Eductaion_Type = ref<TitleModel[]>([]);
const EducationCategory = ref<number>();
const University = ref<TitleModel[]>([]);
const Colleges = ref<TitleModel[]>([]);
const CollegeDeprtment = ref<TitleModel[]>([]);
const CollegeDeprtmentDivision = ref<TitleModel[]>([]);



const FetchEducationStages = async() =>{
  const educationStagesParams = new EducationStagesParams(2); 
  const educationStagesController = EducationStagesController.getInstance();
  const state = await educationStagesController.FetchEducationStages(educationStagesParams);

  if (state.value.data) {
    Eductaion_Type.value.push(...state.value.data);
  }
}




const FetchUniversityEducationLevel = async(data: Event) =>{
  console.log(Number((data.target as HTMLSelectElement).value))
  const universityParams = new UniversityParams(Number((data.target as HTMLSelectElement).value), 1);
  const universityController = UniversityController.getInstance();
  const state = await universityController.FetchUniversity(universityParams)


  if (state.value.data  ) {
    University.value.push(...state.value.data);
  }
} 

const FetchColleges = async(data: Event) =>{
  console.log(Number((data.target as HTMLSelectElement).value))
  const collegesParams = new CollegesParams(Number((data.target as HTMLSelectElement).value));
  const collegesController = CollegesController.getInstance();
  const state = await collegesController.FetchColleges(collegesParams)


  if (state.value.data  ) {
    Colleges.value.push(...state.value.data);
  }
  console.log( Colleges.value)

} 
const FetchCollegesDeprtment = async(data: Event) =>{
  console.log(Number((data.target as HTMLSelectElement).value))
  const collegeDetpartmentParams = new CollegeDetpartmentParams(Number((data.target as HTMLSelectElement).value));
  const collegeDepartmentController = CollegeDepartmentController.getInstance();
  const state = await collegeDepartmentController.FetchCollegeDepartment(collegeDetpartmentParams)


  if (state.value.data  ) {
    CollegeDeprtment.value.push(...state.value.data);
  }
  console.log( Colleges.value)

} 
const FetchCollegesDeprtmentDivisions = async(data: Event) =>{
  console.log(Number((data.target as HTMLSelectElement).value))
  const collegeDetpartmentDivisionsParams = new CollegeDetpartmentDivisionsParams(Number((data.target as HTMLSelectElement).value));
  const collegeDepartmentDivisionsController = CollegeDepartmentDivisionsController.getInstance();
  const state = await collegeDepartmentDivisionsController.FetchCollegeDepartmentDivisions(collegeDetpartmentDivisionsParams)


  if (state.value.data  ) {
    CollegeDeprtmentDivision.value.push(...state.value.data);
  }


} 

onMounted(()=>{
  FetchEducationStages();
})

const SendData = ()=>{
  // student category ==  caregory_id
  // student category ==  caregory_id
  const EducationDataParams = new SubmitEducationDataParams(Eductaion_Type.value[0].id , CollegeDeprtmentDivision.value[0].id , studentCategory.value ,University.value[0].id ,
   Colleges.value[0].id , CollegeDeprtment.value[0].id );
  const submitEducationDataController = SubmitEducationDataController.getInstance(); 
  submitEducationDataController.SubmitEducationData(EducationDataParams);
}



 


</script>

<template>
  <div class="login-container pass-forgit">
    <div class="login-form">
      <h3 >بياناتك التعليمية</h3>
      <p>
        مرحبا بك فى منصتنا ادخل معلوماتك الشخصيه التاليه و احرص على ادخال
        البياناتك الضروريه و المحاطه باللون الازرق وعلامه مميزه *
      </p>

      <div class="inputs">
        <div class="login-input">
          <select class="student-select" v-model="studentCategory">
            <option value="" disabled selected> نوع التعليم</option>
            <option :value="StudentCategoryEnum.base">اساسى</option>
            <option :value="StudentCategoryEnum.university">جامعى</option>
            <option :value="StudentCategoryEnum.general">عام</option>
            
          </select>
          <Award class="login-call-icon" />
        </div>
      </div>

      <div class="inputs">
        <div class="login-input">
          <select class="student-select" v-model="EducationCategory" @change="FetchUniversityEducationLevel">
            <option value="" disabled selected>نوع التعليم</option>
            <option v-for="(item,index) in Eductaion_Type" :key="index" :value="item.id">{{ item.title }}</option>

          </select>
          <Award class="login-call-icon" />
        </div>
      </div>

      <div class="inputs">
        <div class="login-input">
          <select class="student-select" @change="FetchColleges">
            <option value="" disabled selected>جامعة</option>
            <option v-for="(item,index) in University" :key="index" :value="item.id">{{ item.title }}</option>
            
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs">
        <div class="login-input">
          <select class="student-select" @change="FetchCollegesDeprtment">
            <option value="" disabled selected>الكلية</option>
            <option v-for="(item,index) in Colleges" :key="index" :value="item.id">{{ item.title }}</option>
            
       
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs">
        <div class="login-input">
          <select class="student-select" @change="FetchCollegesDeprtmentDivisions">
            <option value="" disabled selected>القسم</option>
            <option v-for="(item,index) in CollegeDeprtment" :key="index" :value="item.id">{{ item.title }}</option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs">
        <div class="login-input">
          <select class="student-select" >
            <option value="" disabled selected>المستوى</option>
            <option v-for="(item,index) in CollegeDeprtmentDivision" :key="index" :value="item.id">{{ item.title }}</option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>

<!-- 
      <div class="inputs">
        <div class="login-input">
          <select class="student-select">
            <option value="" disabled selected>السنه الدراسيه</option>
            <option value="student1">طالب</option>
            <option value="student2">طالب</option>
            <option value="student3">طالب</option>
          </select>
          <RegisterBookOne class="login-call-icon" />
        </div>
      </div> -->

 
      <div class="btns btns-home">
   <button class="login-btn" @click="SendData"> 
                 اختر  فئاتك المفضله
                <LeftArrowIcon class="left-icon" />
              </button>
         
        </div>
    </div>
  </div>
</template>

<style scoped>

.pass-forgit{
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
