<script setup lang="ts">
import ProfileSidebar from "~/components/Profile/ProfileSidebar.vue";
import { ErrorType } from "~/base/core/networkStructure/Resources/errors/errorModel";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";
import QuestionBankParams from "~/features/QuestionBank/Core/Params/index_question_banks_params";
import type QuestionBankModel from "~/features/QuestionBank/Data/models/question_banks_model";
import QuestionBankController from "~/features/QuestionBank/presentation/controllers/index_question_banks_controller";

definePageMeta({ middleware: ["verified-student"] });

const settingsStore = useSettingStore();
const userStore = useUserStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const questionBankController = QuestionBankController.getInstance();

const yearId = computed(() => Number(userStore.user?.userInfo?.year_id));
const yearLabel = computed(
  () =>
    userStore.user?.userInfo?.year_title ||
    userStore.user?.userInfo?.stage_title ||
    "سنتك الدراسية",
);
const questionBanksKey = computed(
  () =>
    `student-question-banks:${userStore.user?.id ?? "guest"}:${
      Number.isInteger(yearId.value) ? yearId.value : "missing-year"
    }`,
);

const fetchStudentQuestionBanks = async (): Promise<QuestionBankModel[]> => {
  if (!Number.isInteger(yearId.value) || yearId.value <= 0) {
    throw new Error(
      "بيانات السنة الدراسية غير مكتملة. حدّث بياناتك التعليمية ثم حاول مرة أخرى.",
    );
  }

  const stateRef = await questionBankController.FetchQuestionBanks(
    new QuestionBankParams(undefined, yearId.value),
  );
  const state = stateRef.value;

  if (state.error?.type === ErrorType.dataEmpty) return [];
  if (state.error) {
    throw new Error(
      state.error.title || "تعذر تحميل بنوك الأسئلة. حاول مرة أخرى.",
    );
  }

  return Array.isArray(state.data) ? state.data : [];
};

const {
  data: questionBanks,
  pending: questionBanksPending,
  error: questionBanksError,
  refresh: refreshQuestionBanks,
} = await useAsyncData<QuestionBankModel[]>(
  questionBanksKey.value,
  fetchStudentQuestionBanks,
  {
    default: () => [],
    lazy: true,
    server: false,
    watch: [yearId],
  },
);

useSeoMeta({
  title: () => `بنك الأسئلة${site.value.brandName ? ` | ${site.value.brandName}` : ""}`,
  description: "تدرّب على أسئلة المواد، تابع تقدمك وراجع إجاباتك من مكان واحد.",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <div class="prfile-home profile-dashboard">
      <ProfileSidebar class="profile-dashboard-sidebar" />

      <div class="profile-dashboard-workspace">
        <header class="profile-dashboard-topbar">
          <div class="profile-topbar-copy">
            <strong>مساحة الطالب</strong>
            <span>تدريبك ونتائجك في مكان واحد</span>
          </div>

          <div class="profile-topbar-status" aria-label="حالة بنك الأسئلة">
            <span />
            بنك الأسئلة
          </div>
        </header>

        <main class="profile-dashboard-main questions-dashboard-main">
          <header class="profile-page-heading">
            <span>{{ yearLabel }}</span>
            <h1>بنك الأسئلة</h1>
            <p>
              بنوك الأسئلة المناسبة لـ {{ yearLabel }}، جاهزة للتدريب من
              حسابك.
            </p>
          </header>

          <ExamContainer
            embedded
            :question-banks="questionBanks"
            :pending="questionBanksPending"
            :error-message="questionBanksError?.message || ''"
            :year-label="yearLabel"
            @retry="refreshQuestionBanks"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>
