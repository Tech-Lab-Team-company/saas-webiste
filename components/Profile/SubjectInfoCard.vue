<script setup lang="ts">
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
import UpdateProfileParams from "~/features/UpdateProfileFeature/Core/Params/update_profile_params";
import UpdateProfileController from "~/features/UpdateProfileFeature/presentation/controllers/update_profile_controller";

const studentCategory = ref(0);

const Eductaion_Type = ref<TitleModel[]>([]);
const EducationCategory = ref<number>();
const University = ref<TitleModel[]>([]);
const Colleges = ref<TitleModel[]>([]);
const CollegeDeprtment = ref<TitleModel[]>([]);
const CollegeDeprtmentDivision = ref<TitleModel[]>([]);

const userStore = useUserStore();

const FetchEducationStages = async () => {
  const educationStagesParams = new EducationStagesParams(
    userStore?.user?.category_id,
  );
  const educationStagesController = EducationStagesController.getInstance();
  const state = await educationStagesController.FetchEducationStages(
    educationStagesParams,
  );

  if (state.value.data) {
    Eductaion_Type.value.push(...state.value.data);
  }
};

watch(
  () => studentCategory.value,
  (NewValue) => {
    studentCategory.value = NewValue;
    FetchEducationStages();
  },
);

const FetchUniversityEducationLevel = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value));
  const universityParams = new UniversityParams(
    Number((data.target as HTMLSelectElement).value),
    1,
  );
  const universityController = UniversityController.getInstance();
  const state = await universityController.FetchUniversity(universityParams);

  if (state.value.data) {
    University.value.push(...state.value.data);
  }
};

const FetchColleges = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value));
  const collegesParams = new CollegesParams(
    Number((data.target as HTMLSelectElement).value),
  );
  const collegesController = CollegesController.getInstance();
  const state = await collegesController.FetchColleges(collegesParams);

  if (state.value.data) {
    Colleges.value.push(...state.value.data);
  }
  console.log(Colleges.value);
};
const FetchCollegesDeprtment = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value));
  const collegeDetpartmentParams = new CollegeDetpartmentParams(
    Number((data.target as HTMLSelectElement).value),
  );
  const collegeDepartmentController = CollegeDepartmentController.getInstance();
  const state = await collegeDepartmentController.FetchCollegeDepartment(
    collegeDetpartmentParams,
  );

  if (state.value.data) {
    CollegeDeprtment.value.push(...state.value.data);
  }
  console.log(Colleges.value);
};
const FetchCollegesDeprtmentDivisions = async (data: Event) => {
  console.log(Number((data.target as HTMLSelectElement).value));
  const collegeDetpartmentDivisionsParams =
    new CollegeDetpartmentDivisionsParams(
      Number((data.target as HTMLSelectElement).value),
    );
  const collegeDepartmentDivisionsController =
    CollegeDepartmentDivisionsController.getInstance();
  const state =
    await collegeDepartmentDivisionsController.FetchCollegeDepartmentDivisions(
      collegeDetpartmentDivisionsParams,
    );

  if (state.value.data) {
    CollegeDeprtmentDivision.value.push(...state.value.data);
  }
};

onMounted(() => {
  FetchEducationStages();
});

const SendUniversityData = async () => {
  const EducationDataParams = new SubmitEducationDataParams(
    Eductaion_Type?.value?.[0]?.id,
    CollegeDeprtmentDivision.value?.[0]?.id,
    studentCategory?.value,
    University.value?.[0]?.id,
    Colleges.value?.[0]?.id,
    CollegeDeprtment.value?.[0]?.id,
    null,
    null,
    null,
  );
  const submitEducationDataController =
    SubmitEducationDataController.getInstance();
  const state = await submitEducationDataController.SubmitEducationData(
    EducationDataParams,
  );
};

const SendGeneralData = async () => {
  const EducationDataParams = new SubmitEducationDataParams(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  );
  const submitEducationDataController =
    SubmitEducationDataController.getInstance();
  const state = await submitEducationDataController.SubmitEducationData(
    EducationDataParams,
  );
};

const selectedSubject = ref();
const Subjects = ref();

const BasicEducationCategory = ref<number | null>(null);
const FetchEduciationLevels = async () => {
  const educationBasicLevelsParams = new EducationBasicLevelsParams(
    BasicEducationCategory.value,
  );
  const educationBasicLevelsController =
    EducationBasicLevelsController.getInstance();
  const state = await educationBasicLevelsController.FetchEducationBasicLevels(
    educationBasicLevelsParams,
  );
  if (state.value.data) {
    Levels.value.push(...state.value.data);
  }
};

const selectedLevel = ref<number | null>(null);
const Levels = ref<TitleModel[]>([]);
const FetchStage = async () => {
  const educationBasicStagesYearParams = new EducationBasicStagesYearParams(
    selectedLevel.value,
  );
  const educationBasicStagesYearController =
    EducationBasicStagesYearController.getInstance();
  const state =
    await educationBasicStagesYearController.FetchEducationBasicStagesYear(
      educationBasicStagesYearParams,
    );
  if (state.value.data) {
    Stages.value.push(...state.value.data);
  }
};

const selectedStage = ref<number | null>(null);
const Stages = ref<TitleModel[]>([]);
const FetchSubjects = async () => {
  const educationBasicSubjectsParams = new EducationBasicSubjectsParams(
    userStore.user?.category_id,
    selectedStage.value,
  );
  const educationBasicSubjectsController =
    EducationBasicSubjectsController.getInstance();

  const state =
    await educationBasicSubjectsController.FetchEducationBasicSubjects(
      educationBasicSubjectsParams,
    );
  if (state.value.data) {
    BasicSubjects.value.push(...state.value.data);
  }
};

const BasicSubjects = ref<TitleModel[]>([]);
const selectedBasicSubject = ref<number | null>(null);

const updateProfileController = UpdateProfileController.getInstance();

const SendBasicData = async () => {
  console.log("sssssss");
  const EducationDataParams = new UpdateProfileParams(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    userStore.user?.category_id,
    null,
    null,
    null,
    selectedStage.value,
    BasicEducationCategory.value,
    selectedLevel.value,
  );
  await updateProfileController.updateProfile(EducationDataParams);
};
</script>

<template>
  <div class="subject-info">
    <div class="profile-home-text">
      <p>{{ $t("بياناتك التعليمية") }}</p>
      <p>
        {{
          $t(
            "مرحبا بك فى منصتنا ادخل معلوماتك الشخصيه التاليه و احرص على ادخال البياناتك الضروريه و المحاطه باللون الازرق وعلامه مميزه *",
          )
        }}
      </p>
    </div>

    <hr class="profile-text-hr" />

    <div class="inputs-collection">
      <div class="inputs">
        <div class="login-input">
          <select
            class="student-select"
            disabled
            :value="
              userStore.user?.category_id == 1
                ? StudentCategoryEnum.base
                : userStore.user?.category_id == 2
                ? StudentCategoryEnum.university
                : StudentCategoryEnum.general
            "
          >
            <option :value="StudentCategoryEnum.base">اساسى</option>
            <option :value="StudentCategoryEnum.university">جامعى</option>
            <option :value="StudentCategoryEnum.general">عام</option>
          </select>
          <Award class="login-call-icon" />
        </div>
      </div>

      <div class="inputs" v-if="userStore.user?.category_id == 2">
        <div class="login-input">
          <select
            class="student-select"
            v-model="EducationCategory"
            @change="FetchUniversityEducationLevel"
          >
            <option value="" disabled selected>نوع التعليم</option>
            <option
              v-for="(item, index) in Eductaion_Type"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <Award class="login-call-icon" />
        </div>
      </div>

      <div class="inputs" v-if="userStore.user?.category_id == 1">
        <div class="login-input">
          <label
            :class="{
              'select-placeholder': !BasicEducationCategory,
              hidden: BasicEducationCategory,
            }"
            >نوع التعليم</label
          >
          <select
            class="student-select"
            v-model="BasicEducationCategory"
            @change="FetchEduciationLevels"
          >
            <!-- <option value="" disabled selected>نوع التعليم</option> -->
            <option
              v-for="(item, index) in Eductaion_Type"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <Award class="login-call-icon" />
        </div>
      </div>

      <div class="inputs" v-if="userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select" @change="FetchColleges">
            <option value="" disabled selected>جامعة</option>
            <option
              v-for="(item, index) in University"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs" v-if="userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select" @change="FetchCollegesDeprtment">
            <option value="" disabled selected>الكلية</option>
            <option
              v-for="(item, index) in Colleges"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs" v-if="userStore.user?.category_id == 2">
        <div class="login-input">
          <select
            class="student-select"
            @change="FetchCollegesDeprtmentDivisions"
          >
            <option value="" disabled selected>القسم</option>
            <option
              v-for="(item, index) in CollegeDeprtment"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs" v-if="userStore.user?.category_id == 2">
        <div class="login-input">
          <select class="student-select">
            <option value="" disabled selected>المستوى</option>
            <option
              v-for="(item, index) in CollegeDeprtmentDivision"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>

      <div
        class="inputs"
        v-if="userStore.user?.category_id == 1 && BasicEducationCategory"
      >
        <div class="login-input">
          <label
            :class="{
              'select-placeholder': !selectedLevel,
              hidden: selectedLevel,
            }"
            >المرحلة</label
          >
          <select
            class="student-select"
            v-model="selectedLevel"
            @change="FetchStage"
          >
            <option
              v-for="(item, index) in Levels"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>

      <div
        class="inputs"
        v-if="userStore.user?.category_id == 1 && selectedLevel"
      >
        <div class="login-input">
          <label
            :class="{
              'select-placeholder': !selectedStage,
              hidden: selectedStage,
            }"
            >الصف</label
          >
          <select
            class="student-select"
            v-model="selectedStage"
            @change="FetchSubjects"
          >
            <option
              v-for="(item, index) in Stages"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div
        class="inputs"
        v-if="userStore.user?.category_id == 1 && selectedStage"
      >
        <div class="login-input">
          <label
            :class="{
              'select-placeholder': !selectedBasicSubject,
              hidden: selectedBasicSubject,
            }"
            >المادة</label
          >
          <select class="student-select" v-model="selectedBasicSubject">
            <option
              v-for="(item, index) in BasicSubjects"
              :key="index"
              :value="item.id"
            >
              {{ item.title }}
            </option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
    </div>

    <div
      class="btns btns-home"
      @click="SendUniversityData"
      v-if="userStore.user?.category_id == 2"
    >
      <button class="login-btn">
        تأكيد
        <LeftArrowIcon class="left-icon" />
      </button>
    </div>
    <div
      class="btns btns-home"
      @click="SendGeneralData"
      v-if="userStore.user?.category_id == 3"
    >
      <button class="login-btn">
        تأكيد
        <LeftArrowIcon class="left-icon" />
      </button>
    </div>
    <div
      class="btns btns-home"
      @click="SendBasicData"
      v-if="userStore.user?.category_id == 1"
    >
      <button class="login-btn">
        تأكيدsss
        <LeftArrowIcon class="left-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.subject-info {
  border-radius: 20px;
  background-color: #f6f6f6;
  padding: 20px;
  box-sizing: border-box;
}

/* ================= TEXT ================= */
.profile-home-text {
  margin-bottom: 10px;

  p:first-child {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }

  p:last-child {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
  }
}

/* ================= HR ================= */
.profile-text-hr {
  border: none;
  height: 2px;
  border-radius: 5px;
  margin: 4px 10px;
  background-image: linear-gradient(
    to left,
    var(--secondary-color) 0% 20%,
    #e6e6e6 60%
  );
  margin-left: auto;
}

/* ================= FORM ================= */
.inputs-collection {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 30px 0;
}

/* ================= INPUT ================= */
.login-input {
  position: relative;

  select {
    width: 100%;
    padding: 12px 14px;
    padding-left: 40px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    font-size: 14px;
    color: #111827;
    transition: all 0.25s ease;
    appearance: none;
    cursor: pointer;

    /* custom arrow */
    background-image: url("data:image/svg+xml,%3Csvg fill='%236b7280' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.25 7.5l4.5 4.5 4.5-4.5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;

    &:hover {
      background-color: #f3f4f6;
    }

    &:focus {
      border-color: #093a8a;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(9, 58, 138, 0.1);
      outline: none;
    }

    &:disabled {
      background: #e5e7eb;
      cursor: not-allowed;
      color: #9ca3af;
    }
  }

  .login-call-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.6;
    pointer-events: none;
  }
}

/* ================= LABEL ================= */
.select-placeholder {
  position: absolute;
  top: -8px;
  left: 10px;
  font-size: 11px;
  background: #fff;
  padding: 0 5px;
  color: #093a8a;
}

.hidden {
  display: none;
}

/* ================= BUTTON ================= */
.btns-home {
  margin-top: 20px;

  .login-btn {
    width: 100%;
    padding: 13px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #3a3e7e 60%, #3a3e7e 40%);
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;

    .left-icon {
      transition: transform 0.25s;
      transform: rotate(-180deg);
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(9, 58, 138, 0.2);

      .left-icon {
        transform: translateX(-4px);
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 600px) {
  .subject-info {
    padding: 15px;
  }
}
</style>

<!-- <style scoped lang="scss">
.profile-homes {
  border-radius: 20px;
  background-color: #f6f6f6;
  padding: 20px;
  box-sizing: border-box;

  .profile-home-card {
    display: grid;
    grid-template-columns: repeat(1fr);
    gap: 20px;
  }
}

.profile-home-text {
  // text-align: right;
  // padding: 20px 10px;

  // &.profile-home-text2 {
  //   margin-top: 30px;
  // }

  p {
    &:first-child {
      font-size: 20px;
      font-weight: 500;
    }

    &:last-child {
      color: #6f777b;
    }
  }
}
.profile-text-hr {
  border: none;
  height: 2px;
  border-radius: 5px;
  margin: 4px 10px;
  background-image: linear-gradient(
    to left,
    var(--secondary-color) 0% 20%,
    #e6e6e6 60%
  );
  margin-left: auto;
}
.inputs-collection {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
}
</style> -->
