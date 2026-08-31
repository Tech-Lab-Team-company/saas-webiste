<script setup lang="ts">
import QuestionBankAction from "~/components/QuestionBank/QuestionBankAction.vue";
import QuestionBankParams from "~/features/QuestionBank/Core/Params/index_question_banks_params";
import type QuestionBankModel from "~/features/QuestionBank/Data/models/question_banks_model";
import QuestionBankController from "~/features/QuestionBank/presentation/controllers/index_question_banks_controller";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

definePageMeta({ layout: "default" });

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const controller = QuestionBankController.getInstance();

const banks = ref<QuestionBankModel[]>([]);
const searchQuery = ref("");
const submittedSearch = ref("");
const loading = ref(true);
const errorMessage = ref("");
const failedImages = ref(new Set<number>());
const failedTeacherImages = ref(new Set<number>());

const normalizedSearch = computed(() => searchQuery.value.trim());
const searchIsTooShort = computed(
  () => normalizedSearch.value.length > 0 && normalizedSearch.value.length < 3,
);

const loadQuestionBanks = async () => {
  if (searchIsTooShort.value) return;

  loading.value = true;
  errorMessage.value = "";
  submittedSearch.value = normalizedSearch.value;

  try {
    const stateRef = await controller.FetchQuestionBanks(
      new QuestionBankParams(submittedSearch.value),
    );
    const state = stateRef.value;

    banks.value = Array.isArray(state.data) ? state.data : [];
    errorMessage.value = state.error?.title || "";
  } catch {
    banks.value = [];
    errorMessage.value = "تعذر تحميل بنوك الأسئلة الآن. حاول مرة أخرى.";
  } finally {
    loading.value = false;
  }
};

const clearSearch = async () => {
  searchQuery.value = "";
  await loadQuestionBanks();
};

const markBankImageFailed = (bankId: number) => {
  failedImages.value = new Set(failedImages.value).add(bankId);
};

const markTeacherImageFailed = (teacherId: number) => {
  failedTeacherImages.value = new Set(failedTeacherImages.value).add(teacherId);
};

const displayPrice = (bank: QuestionBankModel) => {
  if (bank.monthPrice === 0) return "مجاني";

  const price = new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 2,
  }).format(bank.monthPrice);
  const currency = bank.currency === "L.E" ? "جنيه" : bank.currency;
  return `${price} ${currency}`;
};

onMounted(loadQuestionBanks);

useSeoMeta({
  title: () =>
    `بنك الأسئلة${site.value.brandName ? ` | ${site.value.brandName}` : ""}`,
  description: () =>
    `تدرّب على بنوك الأسئلة المتاحة في ${site.value.brandName || "المنصة"}، وراجع مستواك بخطوات واضحة.`,
  robots: "index, follow",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div class="question-bank-page" dir="rtl">
    <header class="question-bank-hero">
      <span class="question-bank-hero__ring" aria-hidden="true" />
      <span class="question-bank-hero__word" aria-hidden="true">PRACTICE</span>

      <div class="container question-bank-hero__grid">
        <div class="question-bank-hero__title">
          <span>تدريب مستمر، نتيجة أوضح</span>
          <h1>اختبر فهمك.<br /><em>وطوّر مستواك.</em></h1>
        </div>

        <div class="question-bank-hero__copy">
          <p>
            اختار بنك الأسئلة المناسب، ابدأ تدريبك في أي وقت، وارجع لإجاباتك
            حتى تثبّت كل نقطة قبل الاختبار.
          </p>
          <div>
            <span><i class="pi pi-check-circle" /> تدريب منظم</span>
            <span><i class="pi pi-history" /> تعلّم على وقتك</span>
          </div>
        </div>
      </div>
    </header>

    <section class="question-bank-catalog" aria-labelledby="question-bank-title">
      <div class="container">
        <div class="question-bank-catalog__heading">
          <div>
            <span>مساحتك للتدريب</span>
            <h2 id="question-bank-title">بنوك الأسئلة المتاحة</h2>
            <p>اختار البنك المناسب وابدأ حل الأسئلة بخطوات بسيطة وواضحة.</p>
          </div>

          <form class="question-bank-search" role="search" @submit.prevent="loadQuestionBanks">
            <label for="question-bank-search">ابحث باسم بنك الأسئلة</label>
            <div>
              <i class="pi pi-search" aria-hidden="true" />
              <input id="question-bank-search" v-model="searchQuery" type="search" placeholder="مثال: مراجعة النحو"
                autocomplete="off" />
              <button v-if="searchQuery" type="button" class="question-bank-search__clear" aria-label="مسح البحث"
                @click="clearSearch">
                <i class="pi pi-times" />
              </button>
              <button type="submit" :disabled="searchIsTooShort || loading">بحث</button>
            </div>
            <small v-if="searchIsTooShort" role="status">
              <i class="pi pi-info-circle" aria-hidden="true" />
              اكتب 3 أحرف على الأقل للبحث
            </small>
          </form>
        </div>

        <div v-if="!loading && !errorMessage" class="question-bank-results" aria-live="polite">
          <span>
            <b>{{ banks.length }}</b>
            {{ banks.length === 1 ? "بنك أسئلة متاح" : "بنوك أسئلة متاحة" }}
          </span>
          <button v-if="submittedSearch" type="button" @click="clearSearch">
            نتائج البحث عن «{{ submittedSearch }}»
            <i class="pi pi-times" aria-hidden="true" />
          </button>
        </div>

        <div v-if="loading" class="question-bank-grid" aria-label="جاري تحميل بنوك الأسئلة">
          <article v-for="index in 2" :key="index" class="question-bank-card question-bank-card--skeleton">
            <span />
            <div><i /><i /><i /></div>
          </article>
        </div>

        <div v-else-if="errorMessage" class="question-bank-state question-bank-state--error" role="alert">
          <span><i class="pi pi-exclamation-triangle" /></span>
          <h3>لم نتمكن من تحميل بنوك الأسئلة</h3>
          <p>{{ errorMessage }}</p>
          <button type="button" @click="loadQuestionBanks">
            <i class="pi pi-refresh" /> حاول مرة أخرى
          </button>
        </div>

        <div v-else-if="banks.length === 0" class="question-bank-state">
          <span><i class="pi pi-file-edit" /></span>
          <h3>{{ submittedSearch ? "لا توجد نتائج مطابقة" : "لا توجد بنوك أسئلة حاليًا" }}</h3>
          <p>
            {{ submittedSearch
              ? "جرّب اسمًا آخر أو امسح البحث لعرض كل بنوك الأسئلة."
              : "ستظهر بنوك الأسئلة هنا فور إضافتها إلى المنصة." }}
          </p>
          <button v-if="submittedSearch" type="button" @click="clearSearch">عرض الكل</button>
        </div>

        <div v-else class="question-bank-grid">
          <article v-for="bank in banks" :key="bank.id" class="question-bank-card">
            <div class="question-bank-card__visual">
              <img v-if="bank.image?.img && !failedImages.has(bank.id)" :src="bank.image.img"
                :alt="bank.image.alt || `غلاف ${bank.title}`" loading="lazy" @error="markBankImageFailed(bank.id)" />
              <div v-else class="question-bank-card__fallback" aria-hidden="true">
                <i class="pi pi-file-edit" />
                <span>بنك أسئلة</span>
              </div>

              <span :class="[
                'question-bank-card__status',
                bank.isSubscribed ? 'is-subscribed' : bank.isActive ? 'is-active' : 'is-inactive',
              ]">
                <i :class="bank.isSubscribed ? 'pi pi-check' : 'pi pi-circle-fill'" />
                {{ bank.isSubscribed ? "مشترك" : bank.isActive ? "متاح الآن" : "غير متاح" }}
              </span>
            </div>

            <div class="question-bank-card__content">
              <div class="question-bank-card__teacher">
                <img v-if="bank.teacher?.image?.img && !failedTeacherImages.has(bank.teacher.id)"
                  :src="bank.teacher.image.img" :alt="bank.teacher.image.alt || bank.teacher.name" loading="lazy"
                  @error="markTeacherImageFailed(bank.teacher.id)" />
                <span v-else aria-hidden="true">{{ bank.teacher?.name?.charAt(0) || "م" }}</span>
                <div>
                  <small>إعداد المدرس</small>
                  <b>{{ bank.teacher?.name || site.brandName || "فريق المنصة" }}</b>
                </div>
              </div>

              <h3>{{ bank.title }}</h3>
              <p>
                {{ bank.description || "تدرّب على أسئلة مختارة تساعدك على تثبيت المعلومة والاستعداد بشكل أفضل." }}
              </p>

              <footer class="question-bank-card__footer">
                <div class="question-bank-card__price">
                  <small>{{ bank.monthPrice > 0 ? "اشتراك شهري" : "سعر الاشتراك" }}</small>
                  <strong>{{ displayPrice(bank) }}</strong>
                </div>

                <QuestionBankAction :bank="bank" />
              </footer>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.question-bank-page {
  width: 100%;
  min-width: 0;
  background: color-mix(in srgb, var(--home-v2-blue) 2%, var(--app-bg, #fbfcff));
}

.question-bank-hero {
  position: relative;
  min-height: 335px;
  overflow: hidden;
  background: linear-gradient(115deg, color-mix(in srgb, var(--home-v2-blue) 82%, #06113d), var(--home-v2-blue));
  color: #fff;
}

.question-bank-hero__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 335px;
  align-items: center;
  gap: clamp(60px, 9vw, 150px);
  padding-block: 58px;
}

.question-bank-hero__title {
  justify-self: start;
  animation: question-bank-rise .8s cubic-bezier(.2, .75, .25, 1) both;
}

.question-bank-hero__title>span {
  color: #ffd05e;
  font-size: 12px;
  font-weight: 900;
}

.question-bank-hero h1 {
  margin: 22px 0 0;
  font: 900 clamp(48px, 5vw, 76px)/1.08 var(--home-v2-heading);
  letter-spacing: -.045em;
}

.question-bank-hero h1 em {
  color: #ff7a61;
  font-style: normal;
}

.question-bank-hero__copy {
  max-width: 430px;
  margin-top: 55px;
  animation: question-bank-copy .75s .15s ease both;
}

.question-bank-hero__copy p {
  margin: 0;
  color: rgb(255 255 255 / 72%);
  font-size: 15px;
  line-height: 1.95;
}

.question-bank-hero__copy>div {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.question-bank-hero__copy span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 999px;
  background: rgb(255 255 255 / 7%);
  color: rgb(255 255 255 / 88%);
  font-size: 11px;
  font-weight: 800;
}

.question-bank-hero__ring {
  position: absolute;
  top: -185px;
  left: -115px;
  width: 405px;
  height: 405px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
}

.question-bank-hero__word {
  position: absolute;
  bottom: -13px;
  left: 4%;
  color: rgb(255 255 255 / 4%);
  font: 900 clamp(72px, 9vw, 132px)/1 var(--home-v2-heading);
  letter-spacing: -.06em;
}

.question-bank-catalog {
  padding: clamp(58px, 7vw, 90px) 0 clamp(72px, 9vw, 120px);
}

.question-bank-catalog__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(330px, 430px);
  align-items: end;
  gap: 36px;
  margin-bottom: 24px;
}

.question-bank-catalog__heading>div>span {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}

.question-bank-catalog__heading h2 {
  margin: 8px 0 6px;
  color: var(--home-v2-ink);
  font: 900 clamp(30px, 3vw, 42px)/1.25 var(--home-v2-heading);
}

.question-bank-catalog__heading p {
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.8;
}

.question-bank-search {
  position: relative;
}

.question-bank-search>label {
  display: block;
  margin-bottom: 7px;
  color: var(--home-v2-ink);
  font-size: 11px;
  font-weight: 900;
}

.question-bank-search>div {
  display: flex;
  min-height: 54px;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 13px;
  background: var(--home-v2-surface);
  box-shadow: 0 12px 30px rgb(17 32 66 / 6%);
}

.question-bank-search>div>i {
  margin-inline-start: 16px;
  color: var(--home-v2-blue);
}

.question-bank-search input {
  min-width: 0;
  flex: 1;
  align-self: stretch;
  padding: 0 12px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--home-v2-ink);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
}

.question-bank-search button {
  align-self: stretch;
  padding: 0 22px;
  border: 0;
  background: var(--home-v2-blue);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
}

.question-bank-search button:disabled {
  cursor: not-allowed;
  opacity: .5;
}

.question-bank-search .question-bank-search__clear {
  padding: 0 10px;
  background: transparent;
  color: var(--home-v2-muted);
}

.question-bank-search small {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  color: #a96400;
  font-size: 11px;
  font-weight: 800;
}

.question-bank-results {
  display: flex;
  min-height: 38px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 17px;
  color: var(--home-v2-muted);
  font-size: 12px;
}

.question-bank-results b {
  color: var(--home-v2-ink);
  font-size: 16px;
}

.question-bank-results button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border: 1px solid var(--home-v2-line);
  border-radius: 999px;
  background: var(--home-v2-surface);
  color: var(--home-v2-blue);
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 800;
}

.question-bank-grid {
  display: grid;
  gap: 22px;
}

.question-bank-card {
  display: grid;
  grid-template-columns: minmax(230px, 285px) minmax(0, 1fr);
  min-height: 286px;
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 22px;
  background: var(--home-v2-surface);
  box-shadow: 0 18px 55px rgb(17 32 66 / 7%);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}

.question-bank-card:hover {
  border-color: color-mix(in srgb, var(--home-v2-blue) 28%, var(--home-v2-line));
  box-shadow: 0 24px 65px rgb(17 32 66 / 11%);
  transform: translateY(-3px);
}

.question-bank-card__visual {
  position: relative;
  min-height: 286px;
  overflow: hidden;
  background: color-mix(in srgb, var(--home-v2-blue) 9%, var(--home-v2-surface));
}

.question-bank-card__visual::after {
  position: absolute;
  inset: auto 0 0;
  height: 42%;
  background: linear-gradient(transparent, rgb(5 16 52 / 35%));
  content: "";
  pointer-events: none;
}

.question-bank-card__visual>img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}

.question-bank-card:hover .question-bank-card__visual>img {
  transform: scale(1.035);
}

.question-bank-card__fallback {
  display: grid;
  height: 100%;
  min-height: 286px;
  place-content: center;
  gap: 12px;
  background: linear-gradient(145deg, var(--home-v2-blue), var(--home-v2-deep));
  color: #fff;
  text-align: center;
}

.question-bank-card__fallback i {
  font-size: 48px;
}

.question-bank-card__fallback span {
  font-weight: 900;
}

.question-bank-card__status {
  position: absolute;
  z-index: 2;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 8px 20px rgb(5 16 52 / 14%);
  font-size: 10px;
  font-weight: 900;
  backdrop-filter: blur(8px);
}

.question-bank-card__status.is-active {
  color: #128044;
}

.question-bank-card__status.is-subscribed {
  color: var(--home-v2-blue);
}

.question-bank-card__status.is-inactive {
  color: #9a3d3d;
}

.question-bank-card__status i {
  font-size: 8px;
}

.question-bank-card__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: clamp(24px, 3vw, 36px);
}

.question-bank-card__teacher {
  display: flex;
  align-items: center;
  gap: 10px;
}

.question-bank-card__teacher>img,
.question-bank-card__teacher>span {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border: 2px solid var(--home-v2-surface);
  border-radius: 50%;
  background: var(--home-v2-blue-light);
  color: var(--home-v2-blue);
  box-shadow: 0 0 0 1px var(--home-v2-line);
  font-weight: 900;
  object-fit: cover;
}

.question-bank-card__teacher>div {
  display: grid;
  gap: 1px;
}

.question-bank-card__teacher small,
.question-bank-card__price small {
  color: var(--home-v2-muted);
  font-size: 10px;
}

.question-bank-card__teacher b {
  color: var(--home-v2-ink);
  font-size: 12px;
}

.question-bank-card h3 {
  margin: 18px 0 7px;
  color: var(--home-v2-ink);
  font: 900 clamp(23px, 2.6vw, 31px)/1.35 var(--home-v2-heading);
}

.question-bank-card__content>p {
  max-width: 720px;
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 13px;
  line-height: 1.85;
}

.question-bank-card__footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-top: auto;
  padding-top: 24px;
}

.question-bank-card__price {
  display: grid;
  gap: 3px;
}

.question-bank-card__price strong {
  color: var(--home-v2-ink);
  font-size: 19px;
}

.question-bank-card__footer a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 17px;
  border-radius: 10px;
  background: var(--home-v2-blue);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  transition: transform .2s ease, background-color .2s ease;
}

.question-bank-card__footer a:hover {
  background: var(--home-v2-deep);
  transform: translateY(-1px);
}

.question-bank-card__disabled {
  color: var(--home-v2-muted);
  font-size: 12px;
  font-weight: 800;
}

.question-bank-state {
  display: grid;
  min-height: 300px;
  place-items: center;
  align-content: center;
  gap: 10px;
  padding: 35px;
  border: 1px dashed var(--home-v2-line);
  border-radius: 22px;
  background: var(--home-v2-surface);
  text-align: center;
}

.question-bank-state>span {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 16px;
  background: var(--home-v2-blue-light);
  color: var(--home-v2-blue);
  font-size: 21px;
}

.question-bank-state h3 {
  margin: 5px 0 0;
  color: var(--home-v2-ink);
}

.question-bank-state p {
  max-width: 460px;
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.8;
}

.question-bank-state button {
  margin-top: 7px;
  padding: 10px 16px;
  border: 0;
  border-radius: 9px;
  background: var(--home-v2-blue);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
}

.question-bank-state--error>span {
  background: rgb(190 64 64 / 10%);
  color: #b33b3b;
}

.question-bank-card--skeleton {
  pointer-events: none;
}

.question-bank-card--skeleton>span,
.question-bank-card--skeleton i {
  display: block;
  background: linear-gradient(90deg, #eef1f5 25%, #f8f9fb 50%, #eef1f5 75%);
  background-size: 200% 100%;
  animation: question-bank-shimmer 1.2s infinite linear;
}

.question-bank-card--skeleton>span {
  min-height: 286px;
}

.question-bank-card--skeleton>div {
  display: grid;
  align-content: center;
  gap: 18px;
  padding: 36px;
}

.question-bank-card--skeleton i {
  height: 18px;
  border-radius: 6px;
}

.question-bank-card--skeleton i:nth-child(1) {
  width: 35%;
}

.question-bank-card--skeleton i:nth-child(2) {
  width: 70%;
  height: 32px;
}

.question-bank-card--skeleton i:nth-child(3) {
  width: 92%;
}

@keyframes question-bank-rise {
  from {
    opacity: 0;
    transform: translateY(34px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes question-bank-copy {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes question-bank-shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 820px) {
  .question-bank-catalog__heading {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .question-bank-card {
    grid-template-columns: 220px minmax(0, 1fr);
  }
}

@media (max-width: 700px) {

  .question-bank-hero,
  .question-bank-hero__grid {
    min-height: 280px;
  }

  .question-bank-hero__grid {
    grid-template-columns: 1fr;
    align-content: center;
    gap: 12px;
    padding-block: 28px;
  }

  .question-bank-hero__title {
    justify-self: stretch;
  }

  .question-bank-hero__title>span {
    font-size: 10px;
  }

  .question-bank-hero h1 {
    margin-top: 10px;
    font-size: clamp(30px, 8.5vw, 36px);
    line-height: 1.2;
  }

  .question-bank-hero__copy {
    max-width: 340px;
    margin-top: 0;
  }

  .question-bank-hero__copy p {
    font-size: 12px;
    line-height: 1.7;
  }

  .question-bank-hero__copy>div {
    margin-top: 12px;
  }

  .question-bank-hero__word {
    font-size: 44px;
  }

  .question-bank-catalog {
    padding-top: 48px;
  }

  .question-bank-card {
    grid-template-columns: 1fr;
  }

  .question-bank-card__visual,
  .question-bank-card__fallback {
    min-height: 220px;
    height: 220px;
  }

  .question-bank-card__content {
    padding: 22px 18px;
  }

  .question-bank-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .question-bank-results {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .question-bank-search button {
    padding-inline: 15px;
  }

  .question-bank-card__footer a {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {

  .question-bank-hero__title,
  .question-bank-hero__copy,
  .question-bank-card--skeleton i,
  .question-bank-card--skeleton>span {
    animation: none;
  }

  .question-bank-card,
  .question-bank-card__visual>img,
  .question-bank-card__footer a {
    transition: none;
  }
}
</style>
