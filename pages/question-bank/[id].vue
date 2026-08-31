<script setup lang="ts">
import FetchQuestionBankQuestionsParams from "~/features/QuestionBank/Core/Params/fetch_question_bank_questions_params";
import type QuestionBankContentModel from "~/features/QuestionBank/Data/models/question_bank_content_model";
import type { QuestionBankQuestion } from "~/features/QuestionBank/Data/models/question_bank_content_model";
import FetchQuestionBankQuestionsController from "~/features/QuestionBank/presentation/controllers/fetch_question_bank_questions_controller";

definePageMeta({
  layout: "default",
  middleware: ["verified-student"],
});

const route = useRoute();
const controller = FetchQuestionBankQuestionsController.getInstance();
const bankId = computed(() => Number(route.params.id));
const content = ref<QuestionBankContentModel | null>(null);
const loading = ref(true);
const errorMessage = ref("");
const currentIndex = ref(0);
const selectedAnswers = reactive<Record<number, number>>({});
const checkedQuestions = ref<Set<number>>(new Set());
const failedImages = ref<Set<string>>(new Set());

const questions = computed(() => content.value?.questions ?? []);
const currentQuestion = computed<QuestionBankQuestion | null>(
  () => questions.value[currentIndex.value] ?? null,
);
const answeredCount = computed(
  () => questions.value.filter((question) => selectedAnswers[question.id]).length,
);
const progress = computed(() =>
  questions.value.length
    ? Math.round((answeredCount.value / questions.value.length) * 100)
    : 0,
);
const hasKnownCorrectAnswer = computed(() =>
  Boolean(currentQuestion.value?.answers.some((answer) => answer.isCorrect !== null)),
);
const currentQuestionChecked = computed(() =>
  currentQuestion.value
    ? checkedQuestions.value.has(currentQuestion.value.id)
    : false,
);
const isAccessError = computed(() => {
  const message = errorMessage.value.toLowerCase();
  return message.includes("forbidden")
    || message.includes("unauthorized")
    || message.includes("غير مصرح")
    || message.includes("اشتراك");
});

const hydrateSavedAnswers = () => {
  questions.value.forEach((question) => {
    if (question.selectedAnswerId) {
      selectedAnswers[question.id] = question.selectedAnswerId;
    }
  });
};

const loadContent = async () => {
  if (!Number.isInteger(bankId.value) || bankId.value <= 0) {
    errorMessage.value = "رابط بنك الأسئلة غير صحيح.";
    loading.value = false;
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  content.value = null;
  currentIndex.value = 0;

  try {
    const stateRef = await controller.fetchQuestionBankQuestions(
      new FetchQuestionBankQuestionsParams(bankId.value),
    );
    const state = stateRef.value;
    if (!state.data) {
      throw new Error(
        state.error?.title || "تعذر تحميل محتوى بنك الأسئلة.",
      );
    }

    content.value = state.data;
    hydrateSavedAnswers();
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "تعذر تحميل محتوى بنك الأسئلة. حاول مرة أخرى.";
  } finally {
    loading.value = false;
  }
};

const goToQuestion = (index: number) => {
  if (index < 0 || index >= questions.value.length) return;
  currentIndex.value = index;
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const selectAnswer = (answerId: number) => {
  if (!currentQuestion.value || currentQuestionChecked.value) return;
  selectedAnswers[currentQuestion.value.id] = answerId;
};

const checkAnswer = () => {
  const question = currentQuestion.value;
  if (!question || !selectedAnswers[question.id]) return;
  checkedQuestions.value = new Set(checkedQuestions.value).add(question.id);
};

const answerClass = (answerId: number, isCorrect: boolean | null) => {
  const question = currentQuestion.value;
  if (!question) return {};
  const isSelected = selectedAnswers[question.id] === answerId;
  const isChecked = checkedQuestions.value.has(question.id);

  return {
    "is-selected": isSelected,
    "is-correct": isChecked && isCorrect === true,
    "is-wrong": isChecked && isSelected && isCorrect === false,
  };
};

const answerLetter = (index: number) =>
  ["أ", "ب", "ج", "د", "هـ", "و"][index] || String(index + 1);

const markImageFailed = (src: string) => {
  failedImages.value = new Set(failedImages.value).add(src);
};

watch(bankId, loadContent);
onMounted(loadContent);

useSeoMeta({
  title: () => `${content.value?.title || "بنك الأسئلة"} | التدريب`,
  description: () =>
    content.value?.description
    || "تدرّب على أسئلة البنك وتابع تقدمك خطوة بخطوة.",
  robots: "noindex, nofollow",
});
useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <main class="bank-workspace" dir="rtl">
    <div v-if="loading" class="bank-state bank-state--loading" role="status" aria-live="polite">
      <span class="pi pi-spin pi-spinner" aria-hidden="true" />
      <h1>بنجهّز بنك الأسئلة...</h1>
      <p>لحظات ونرتب لك الأسئلة والتقدم الخاص بك.</p>
    </div>

    <div v-else-if="errorMessage" class="bank-state bank-state--error" role="alert">
      <span :class="['pi', isAccessError ? 'pi-lock' : 'pi-exclamation-circle']" aria-hidden="true" />
      <h1>{{ isAccessError ? "هذا البنك غير مفعّل على حسابك" : "تعذر فتح بنك الأسئلة" }}</h1>
      <p>
        {{
          isAccessError
            ? "أكمل شراء بنك الأسئلة أولًا، أو انتظر اعتماد طلب الدفع إذا كنت أرسلته بالفعل."
            : errorMessage
        }}
      </p>
      <div>
        <NuxtLink to="/question-bank">
          {{ isAccessError ? "عرض بنوك الأسئلة" : "العودة للقائمة" }}
        </NuxtLink>
        <button v-if="!isAccessError" type="button" @click="loadContent">
          <i class="pi pi-refresh" aria-hidden="true" />
          حاول مرة أخرى
        </button>
      </div>
    </div>

    <div v-else-if="content && questions.length === 0" class="bank-state">
      <span class="pi pi-inbox" aria-hidden="true" />
      <h1>لا توجد أسئلة داخل البنك حاليًا</h1>
      <p>البنك مفعّل على حسابك، وستظهر الأسئلة هنا فور إضافتها.</p>
      <NuxtLink to="/question-bank">العودة لبنوك الأسئلة</NuxtLink>
    </div>

    <template v-else-if="content && currentQuestion">
      <header class="bank-header">
        <div class="bank-header__inner">
          <div class="bank-header__copy">
            <nav aria-label="مسار الصفحة">
              <NuxtLink to="/question-bank">بنوك الأسئلة</NuxtLink>
              <i class="pi pi-chevron-left" aria-hidden="true" />
              <span>{{ content.title }}</span>
            </nav>
            <span class="bank-header__eyebrow">مساحة التدريب</span>
            <h1>{{ content.title }}</h1>
            <p>{{ content.description || "حلّ على مهلك، تنقّل بين الأسئلة، وراجع تقدمك من مكان واحد." }}</p>
          </div>

          <div class="bank-header__stats" aria-label="ملخص التقدم">
            <div>
              <strong>{{ answeredCount }}</strong>
              <span>تمت إجابتها</span>
            </div>
            <div>
              <strong>{{ questions.length }}</strong>
              <span>إجمالي الأسئلة</span>
            </div>
            <div>
              <strong>{{ progress }}%</strong>
              <span>نسبة التقدم</span>
            </div>
          </div>
        </div>
        <div class="bank-header__progress" aria-hidden="true">
          <span :style="{ width: `${progress}%` }" />
        </div>
      </header>

      <div class="bank-layout">
        <aside class="bank-nav" aria-label="التنقل بين الأسئلة">
          <div class="bank-nav__title">
            <div>
              <span>خريطة البنك</span>
              <strong>{{ questions.length }} سؤال</strong>
            </div>
            <NuxtLink to="/question-bank" aria-label="إغلاق بنك الأسئلة">
              <i class="pi pi-times" aria-hidden="true" />
            </NuxtLink>
          </div>

          <div class="bank-nav__legend">
            <span><i /> لم يُحل</span>
            <span><i /> تمت الإجابة</span>
          </div>

          <div class="bank-nav__grid">
            <button
              v-for="(question, index) in questions"
              :key="question.id"
              type="button"
              :class="{
                active: index === currentIndex,
                answered: Boolean(selectedAnswers[question.id]),
              }"
              :aria-current="index === currentIndex ? 'step' : undefined"
              :aria-label="`السؤال ${index + 1}${selectedAnswers[question.id] ? '، تمت الإجابة' : ''}`"
              @click="goToQuestion(index)"
            >
              {{ index + 1 }}
            </button>
          </div>

          <div class="bank-nav__summary">
            <span>تقدمك الحالي</span>
            <strong>{{ answeredCount }} من {{ questions.length }}</strong>
            <div><i :style="{ width: `${progress}%` }" /></div>
          </div>
        </aside>

        <section class="question-panel" aria-live="polite">
          <div class="question-panel__topline">
            <div>
              <span>السؤال {{ currentIndex + 1 }}</span>
              <small>من {{ questions.length }}</small>
            </div>
            <span v-if="currentQuestion.sectionTitle" class="question-panel__section">
              {{ currentQuestion.sectionTitle }}
            </span>
          </div>

          <article class="question-card">
            <h2>{{ currentQuestion.text || `السؤال رقم ${currentIndex + 1}` }}</h2>
            <img
              v-if="currentQuestion.image && !failedImages.has(currentQuestion.image)"
              class="question-card__image"
              :src="currentQuestion.image"
              :alt="`صورة السؤال ${currentIndex + 1}`"
              @error="markImageFailed(currentQuestion.image!)"
            />

            <div v-if="currentQuestion.answers.length" class="question-options" role="radiogroup" :aria-label="`إجابات السؤال ${currentIndex + 1}`">
              <button
                v-for="(answer, answerIndex) in currentQuestion.answers"
                :key="answer.id"
                type="button"
                role="radio"
                :aria-checked="selectedAnswers[currentQuestion.id] === answer.id"
                :class="answerClass(answer.id, answer.isCorrect)"
                :disabled="currentQuestionChecked"
                @click="selectAnswer(answer.id)"
              >
                <span class="question-options__letter">{{ answerLetter(answerIndex) }}</span>
                <span class="question-options__content">
                  <b v-if="answer.text">{{ answer.text }}</b>
                  <img
                    v-if="answer.image && !failedImages.has(answer.image)"
                    :src="answer.image"
                    :alt="`صورة الإجابة ${answerLetter(answerIndex)}`"
                    @error="markImageFailed(answer.image!)"
                  />
                </span>
                <i class="pi pi-check" aria-hidden="true" />
              </button>
            </div>

            <div v-else class="question-card__no-options">
              <i class="pi pi-pencil" aria-hidden="true" />
              <div>
                <strong>سؤال للمراجعة</strong>
                <p>راجع السؤال ثم انتقل للسؤال التالي عندما تكون جاهزًا.</p>
              </div>
            </div>

            <div
              v-if="currentQuestionChecked && hasKnownCorrectAnswer"
              class="question-feedback"
              role="status"
            >
              <i class="pi pi-lightbulb" aria-hidden="true" />
              <div>
                <strong>تمت مراجعة إجابتك</strong>
                <p v-if="currentQuestion.explanation">{{ currentQuestion.explanation }}</p>
                <p v-else>الإجابة الصحيحة موضحة باللون الأخضر.</p>
              </div>
            </div>
          </article>

          <footer class="question-panel__actions">
            <button type="button" class="secondary" :disabled="currentIndex === 0" @click="goToQuestion(currentIndex - 1)">
              <i class="pi pi-arrow-right" aria-hidden="true" />
              السابق
            </button>

            <button
              v-if="hasKnownCorrectAnswer && !currentQuestionChecked"
              type="button"
              class="check"
              :disabled="!selectedAnswers[currentQuestion.id]"
              @click="checkAnswer"
            >
              تحقق من الإجابة
            </button>

            <button
              v-if="currentIndex < questions.length - 1"
              type="button"
              class="primary"
              @click="goToQuestion(currentIndex + 1)"
            >
              التالي
              <i class="pi pi-arrow-left" aria-hidden="true" />
            </button>
            <NuxtLink v-else class="primary" to="/profilecourse">
              عرض مشترياتي
              <i class="pi pi-check" aria-hidden="true" />
            </NuxtLink>
          </footer>
        </section>
      </div>
    </template>
  </main>
</template>

<style scoped>
.bank-workspace {
  min-height: 70vh;
  background: color-mix(in srgb, var(--app-accent) 2%, var(--app-bg));
  color: var(--app-text);
}

.bank-header {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--app-line);
  background:
    radial-gradient(circle at 10% 0, color-mix(in srgb, var(--app-accent) 18%, transparent), transparent 35%),
    var(--app-surface);
}

.bank-header__inner {
  display: flex;
  width: min(1180px, calc(100% - 40px));
  min-height: 230px;
  align-items: center;
  justify-content: space-between;
  gap: 45px;
  margin: auto;
  padding-block: 46px;
}

.bank-header__copy { max-width: 690px; }
.bank-header__copy nav { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: var(--app-muted); font-size: 12px; }
.bank-header__copy nav a { color: var(--app-accent); text-decoration: none; }
.bank-header__copy nav i { font-size: 8px; }
.bank-header__eyebrow { color: var(--app-accent); font-size: 12px; font-weight: 900; }
.bank-header h1 { margin: 6px 0; font: 900 clamp(30px, 4vw, 48px)/1.35 "Cairo", sans-serif; letter-spacing: -.035em; }
.bank-header__copy > p { margin: 0; color: var(--app-muted); line-height: 1.8; }

.bank-header__stats { display: grid; min-width: 290px; grid-template-columns: repeat(3, 1fr); overflow: hidden; border: 1px solid var(--app-line); border-radius: 16px; background: var(--app-surface-raised); box-shadow: var(--app-shadow); }
.bank-header__stats > div { display: grid; gap: 3px; padding: 22px 15px; text-align: center; }
.bank-header__stats > div + div { border-inline-start: 1px solid var(--app-line); }
.bank-header__stats strong { color: var(--app-accent); font-size: 25px; }
.bank-header__stats span { color: var(--app-muted); font-size: 10px; }
.bank-header__progress { position: absolute; right: 0; bottom: 0; left: 0; height: 4px; background: var(--app-bg-muted); }
.bank-header__progress span { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--app-brand-secondary), var(--app-accent)); transition: width 240ms ease; }

.bank-layout { display: grid; width: min(1180px, calc(100% - 40px)); grid-template-columns: 255px minmax(0, 1fr); gap: 24px; margin: auto; padding-block: 34px 70px; }
.bank-nav { position: sticky; top: 24px; align-self: start; padding: 20px; border: 1px solid var(--app-line); border-radius: 16px; background: var(--app-surface); box-shadow: 0 18px 45px -38px var(--app-text); }
.bank-nav__title { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--app-line); }
.bank-nav__title > div { display: grid; gap: 2px; }
.bank-nav__title span, .bank-nav__summary > span { color: var(--app-muted); font-size: 11px; }
.bank-nav__title strong { font-size: 15px; }
.bank-nav__title > a { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid var(--app-line); border-radius: 9px; color: var(--app-muted); text-decoration: none; }
.bank-nav__legend { display: flex; gap: 14px; margin: 14px 0; color: var(--app-muted); font-size: 9px; }
.bank-nav__legend span { display: flex; align-items: center; gap: 5px; }
.bank-nav__legend i { width: 7px; height: 7px; border: 1px solid var(--app-line); border-radius: 50%; background: var(--app-surface-raised); }
.bank-nav__legend span:last-child i { border-color: var(--app-accent); background: var(--app-accent); }
.bank-nav__grid { display: grid; max-height: 320px; grid-template-columns: repeat(5, 1fr); gap: 7px; overflow: auto; padding: 2px; }
.bank-nav__grid button { aspect-ratio: 1; border: 1px solid var(--app-line); border-radius: 8px; background: var(--app-surface-raised); color: var(--app-muted); font: 800 11px inherit; cursor: pointer; }
.bank-nav__grid button.answered { border-color: color-mix(in srgb, var(--app-accent) 42%, var(--app-line)); background: color-mix(in srgb, var(--app-accent) 9%, var(--app-surface)); color: var(--app-accent); }
.bank-nav__grid button.active { border-color: var(--app-accent); background: var(--app-accent); box-shadow: 0 6px 16px color-mix(in srgb, var(--app-accent) 25%, transparent); color: #fff; }
.bank-nav__summary { display: grid; gap: 6px; margin-top: 17px; padding-top: 15px; border-top: 1px solid var(--app-line); }
.bank-nav__summary > div { height: 5px; overflow: hidden; border-radius: 5px; background: var(--app-bg-muted); }
.bank-nav__summary > div i { display: block; height: 100%; background: var(--app-accent); }

.question-panel { min-width: 0; }
.question-panel__topline { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 12px; }
.question-panel__topline > div { display: flex; align-items: baseline; gap: 6px; }
.question-panel__topline span { font-weight: 900; }
.question-panel__topline small { color: var(--app-muted); }
.question-panel__section { padding: 5px 10px; border-radius: 999px; background: color-mix(in srgb, var(--app-accent) 10%, transparent); color: var(--app-accent); font-size: 10px; }
.question-card { min-height: 430px; padding: clamp(24px, 4vw, 46px); border: 1px solid var(--app-line); border-radius: 20px; background: var(--app-surface); box-shadow: 0 22px 55px -45px var(--app-text); }
.question-card h2 { margin: 0 0 28px; font: 850 clamp(20px, 2.5vw, 28px)/1.85 "Cairo", sans-serif; }
.question-card__image { display: block; width: min(100%, 720px); max-height: 380px; margin: 0 auto 28px; border: 1px solid var(--app-line); border-radius: 14px; object-fit: contain; }
.question-options { display: grid; gap: 11px; }
.question-options > button { display: grid; min-height: 66px; grid-template-columns: 40px minmax(0, 1fr) 28px; align-items: center; gap: 13px; padding: 12px 15px; border: 1px solid var(--app-line); border-radius: 12px; background: var(--app-surface-raised); color: var(--app-text); text-align: start; cursor: pointer; transition: border-color 170ms ease, background-color 170ms ease, transform 170ms ease; }
.question-options > button:hover:not(:disabled) { border-color: color-mix(in srgb, var(--app-accent) 55%, var(--app-line)); transform: translateX(-2px); }
.question-options > button.is-selected { border-color: var(--app-accent); background: color-mix(in srgb, var(--app-accent) 8%, var(--app-surface)); }
.question-options > button.is-correct { border-color: #16975a; background: color-mix(in srgb, #16975a 10%, var(--app-surface)); }
.question-options > button.is-wrong { border-color: #d84c58; background: color-mix(in srgb, #d84c58 9%, var(--app-surface)); }
.question-options__letter { display: grid; width: 40px; height: 40px; place-items: center; border: 1px solid var(--app-line); border-radius: 10px; background: var(--app-surface); color: var(--app-muted); font-weight: 900; }
.is-selected .question-options__letter { border-color: var(--app-accent); background: var(--app-accent); color: #fff; }
.question-options__content { display: grid; gap: 8px; }
.question-options__content b { font-size: 15px; line-height: 1.7; }
.question-options__content img { max-width: min(100%, 380px); max-height: 210px; border-radius: 8px; object-fit: contain; }
.question-options > button > i { display: grid; width: 24px; height: 24px; place-items: center; border: 1px solid var(--app-line); border-radius: 50%; color: transparent; font-size: 10px; }
.question-options > button.is-selected > i, .question-options > button.is-correct > i { border-color: var(--app-accent); background: var(--app-accent); color: #fff; }
.question-card__no-options, .question-feedback { display: flex; align-items: center; gap: 13px; padding: 17px; border: 1px solid var(--app-line); border-radius: 12px; background: var(--app-bg-muted); }
.question-card__no-options > i, .question-feedback > i { color: var(--app-accent); font-size: 20px; }
.question-card__no-options p, .question-feedback p { margin: 3px 0 0; color: var(--app-muted); line-height: 1.7; }
.question-feedback { margin-top: 18px; border-color: color-mix(in srgb, #16975a 35%, var(--app-line)); background: color-mix(in srgb, #16975a 7%, var(--app-surface)); }
.question-feedback > i { color: #16975a; }

.question-panel__actions { display: flex; align-items: center; justify-content: flex-end; gap: 9px; margin-top: 14px; }
.question-panel__actions button, .question-panel__actions a { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 8px; padding: 9px 17px; border: 1px solid var(--app-line); border-radius: 10px; font: 850 12px inherit; text-decoration: none; cursor: pointer; }
.question-panel__actions .secondary { margin-inline-end: auto; background: var(--app-surface); color: var(--app-text); }
.question-panel__actions .check { border-color: var(--app-accent); background: transparent; color: var(--app-accent); }
.question-panel__actions .primary { border-color: var(--app-accent); background: var(--app-accent); color: #fff; }
.question-panel__actions button:disabled { cursor: not-allowed; opacity: .42; }

.bank-state { display: grid; width: min(650px, calc(100% - 32px)); min-height: 65vh; align-content: center; justify-items: center; gap: 10px; margin: auto; padding: 60px 20px; text-align: center; }
.bank-state > span { display: grid; width: 70px; height: 70px; place-items: center; border-radius: 22px; background: color-mix(in srgb, var(--app-accent) 10%, var(--app-surface)); color: var(--app-accent); font-size: 29px; }
.bank-state h1 { margin: 10px 0 0; font: 900 clamp(25px, 4vw, 36px)/1.4 "Cairo", sans-serif; }
.bank-state p { max-width: 520px; margin: 0; color: var(--app-muted); line-height: 1.8; }
.bank-state > div { display: flex; gap: 9px; margin-top: 12px; }
.bank-state a, .bank-state button { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 7px; padding: 9px 17px; border: 1px solid var(--app-accent); border-radius: 10px; background: var(--app-accent); color: #fff; font-weight: 850; text-decoration: none; cursor: pointer; }
.bank-state button { background: transparent; color: var(--app-accent); }
.bank-state--error > span { background: color-mix(in srgb, #d84c58 10%, var(--app-surface)); color: #d84c58; }

@media (max-width: 920px) {
  .bank-header__inner { align-items: stretch; flex-direction: column; gap: 25px; }
  .bank-header__stats { width: 100%; min-width: 0; }
  .bank-layout { grid-template-columns: 1fr; }
  .bank-nav { position: static; }
  .bank-nav__grid { max-height: 155px; grid-template-columns: repeat(10, 1fr); }
}

@media (max-width: 640px) {
  .bank-header__inner, .bank-layout { width: min(100% - 24px, 1180px); }
  .bank-header__inner { padding-block: 30px; }
  .bank-header__stats > div { padding: 16px 8px; }
  .bank-header__stats strong { font-size: 20px; }
  .bank-layout { padding-block: 20px 45px; }
  .bank-nav { padding: 15px; }
  .bank-nav__grid { grid-template-columns: repeat(6, 1fr); }
  .question-card { min-height: 360px; padding: 21px 16px; border-radius: 15px; }
  .question-card h2 { margin-bottom: 20px; }
  .question-options > button { grid-template-columns: 35px minmax(0, 1fr) 24px; padding: 10px; }
  .question-options__letter { width: 35px; height: 35px; }
  .question-panel__actions { display: grid; grid-template-columns: 1fr 1fr; }
  .question-panel__actions .secondary { margin: 0; }
  .question-panel__actions .check { grid-column: 1 / -1; grid-row: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .bank-header__progress span,
  .question-options > button { transition: none; }
}
</style>
