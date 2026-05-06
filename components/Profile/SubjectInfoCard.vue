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

// const studentCategory = ref(0); // Removed redundant ref

const Eductaion_Type = ref<TitleModel[]>([]);
const EducationCategory = ref<number>();
const University = ref<TitleModel[]>([]);
const selectedUniversity = ref<number>();
const Colleges = ref<TitleModel[]>([]);
const selectedCollege = ref<number>();
const CollegeDeprtment = ref<TitleModel[]>([]);
const selectedDepartment = ref<number>();
const CollegeDeprtmentDivision = ref<TitleModel[]>([]);
const selectedDivision = ref<number>();

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
    Eductaion_Type.value = state.value.data;
    if (userStore.user?.category_id == 2) {
      EducationCategory.value = Number(
        userStore.user?.userInfo?.university_education_type_id,
      );
      if (EducationCategory.value) {
        FetchUniversityEducationLevel();
      }
    } else if (userStore.user?.category_id == 1) {
      BasicEducationCategory.value = Number(
        userStore.user?.userInfo?.basic_education_type_id,
      );
      if (BasicEducationCategory.value) {
        FetchEduciationLevels();
      }
    }
  }
};

// watch(
//   () => studentCategory.value,
//   (NewValue) => {
//     studentCategory.value = NewValue;
//     FetchEducationStages();
//   },
// );

const FetchUniversityEducationLevel = async () => {
  if (!EducationCategory.value) return;

  // Reset dependents
  University.value = [];
  selectedUniversity.value = undefined;
  Colleges.value = [];
  selectedCollege.value = undefined;
  CollegeDeprtment.value = [];
  selectedDepartment.value = undefined;
  CollegeDeprtmentDivision.value = [];
  selectedDivision.value = undefined;

  const universityParams = new UniversityParams(
    Number(EducationCategory.value),
    1,
  );
  const universityController = UniversityController.getInstance();
  const state = await universityController.FetchUniversity(universityParams);

  if (state.value.data) {
    University.value = state.value.data;
    if (userStore.user?.userInfo?.university_id && !selectedUniversity.value) {
      selectedUniversity.value = Number(userStore.user.userInfo.university_id);
      FetchColleges();
    }
  }
};

const FetchColleges = async () => {
  if (!selectedUniversity.value) return;

  // Reset dependents
  Colleges.value = [];
  selectedCollege.value = undefined;
  CollegeDeprtment.value = [];
  selectedDepartment.value = undefined;
  CollegeDeprtmentDivision.value = [];
  selectedDivision.value = undefined;

  const collegesParams = new CollegesParams(Number(selectedUniversity.value));
  const collegesController = CollegesController.getInstance();
  const state = await collegesController.FetchColleges(collegesParams);

  if (state.value.data) {
    Colleges.value = state.value.data;
    if (userStore.user?.userInfo?.college_id && !selectedCollege.value) {
      selectedCollege.value = Number(userStore.user.userInfo.college_id);
      FetchCollegesDeprtment();
    }
  }
};

const FetchCollegesDeprtment = async () => {
  if (!selectedCollege.value) return;

  // Reset dependents
  CollegeDeprtment.value = [];
  selectedDepartment.value = undefined;
  CollegeDeprtmentDivision.value = [];
  selectedDivision.value = undefined;

  const collegeDetpartmentParams = new CollegeDetpartmentParams(
    Number(selectedCollege.value),
  );
  const collegeDepartmentController = CollegeDepartmentController.getInstance();
  const state = await collegeDepartmentController.FetchCollegeDepartment(
    collegeDetpartmentParams,
  );

  if (state.value.data) {
    CollegeDeprtment.value = state.value.data;
    if (userStore.user?.userInfo?.department_id && !selectedDepartment.value) {
      selectedDepartment.value = Number(userStore.user.userInfo.department_id);
      FetchCollegesDeprtmentDivisions();
    }
  }
};

const FetchCollegesDeprtmentDivisions = async () => {
  if (!selectedDepartment.value) return;

  // Reset dependents
  CollegeDeprtmentDivision.value = [];
  selectedDivision.value = undefined;

  const collegeDetpartmentDivisionsParams =
    new CollegeDetpartmentDivisionsParams(Number(selectedDepartment.value));
  const collegeDepartmentDivisionsController =
    CollegeDepartmentDivisionsController.getInstance();
  const state =
    await collegeDepartmentDivisionsController.FetchCollegeDepartmentDivisions(
      collegeDetpartmentDivisionsParams,
    );

  if (state.value.data) {
    CollegeDeprtmentDivision.value = state.value.data;
    if (userStore.user?.userInfo?.division_id && !selectedDivision.value) {
      selectedDivision.value = Number(userStore.user.userInfo.division_id);
    }
  }
};

onMounted(() => {
  FetchEducationStages();
});

const SendUniversityData = async () => {
  const EducationDataParams = new SubmitEducationDataParams(
    EducationCategory.value,
    selectedDivision.value,
    userStore?.user?.category_id,
    selectedUniversity.value,
    selectedCollege.value,
    selectedDepartment.value,
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
  if (!BasicEducationCategory.value) return;

  // Reset dependents
  Levels.value = [];
  selectedLevel.value = null;
  Stages.value = [];
  selectedStage.value = null;
  BasicSubjects.value = [];
  selectedBasicSubject.value = null;

  const educationBasicLevelsParams = new EducationBasicLevelsParams(
    BasicEducationCategory.value,
  );
  const educationBasicLevelsController =
    EducationBasicLevelsController.getInstance();
  const state = await educationBasicLevelsController.FetchEducationBasicLevels(
    educationBasicLevelsParams,
  );
  if (state.value.data) {
    Levels.value = state.value.data;
    if (userStore.user?.userInfo?.stage_id && !selectedLevel.value) {
      selectedLevel.value = Number(userStore.user.userInfo.stage_id);
      FetchStage();
    }
  }
};

const selectedLevel = ref<number | null>(null);
const Levels = ref<TitleModel[]>([]);
const FetchStage = async () => {
  if (!selectedLevel.value) return;

  // Reset dependents
  Stages.value = [];
  selectedStage.value = null;
  BasicSubjects.value = [];
  selectedBasicSubject.value = null;

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
    Stages.value = state.value.data;
    if (userStore.user?.userInfo?.year_id && !selectedStage.value) {
      selectedStage.value = Number(userStore.user.userInfo.year_id);
      FetchSubjects();
    }
  }
};

const selectedStage = ref<number | null>(null);
const Stages = ref<TitleModel[]>([]);
const FetchSubjects = async () => {
  if (!selectedStage.value) return;

  // Reset dependents
  BasicSubjects.value = [];
  selectedBasicSubject.value = null;

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
    BasicSubjects.value = state.value.data;
  }
};

const BasicSubjects = ref<TitleModel[]>([]);
const selectedBasicSubject = ref<number | null>(null);

const updateProfileController = UpdateProfileController.getInstance();

const SendBasicData = async () => {
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

      <!-- <pre>{{ userStore.user?.userInfo }}</pre> -->
      <!-- {{ EducationCategory }} -->
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
          <select
            class="student-select"
            v-model="selectedUniversity"
            @change="FetchColleges"
          >
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
          <select
            class="student-select"
            v-model="selectedCollege"
            @change="FetchCollegesDeprtment"
          >
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
            v-model="selectedDepartment"
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
          <select class="student-select" v-model="selectedDivision">
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
        تأكيد
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
  direction: rtl;
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
  // text-align: left !important;
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
    padding-inline-start: 14px;
    padding-inline-end: 40px;
    background-position: left 12px center; /* RTL */

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
