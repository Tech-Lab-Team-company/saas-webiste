<script setup lang="ts">
import QuestionBankAction from "~/components/QuestionBank/QuestionBankAction.vue";
import type QuestionBankModel from "~/features/QuestionBank/Data/models/question_banks_model";

const props = withDefaults(
  defineProps<{
    embedded?: boolean;
    questionBanks?: QuestionBankModel[];
    pending?: boolean;
    errorMessage?: string;
    yearLabel?: string;
  }>(),
  {
    embedded: false,
    questionBanks: () => [],
    pending: false,
    errorMessage: "",
    yearLabel: "مستواك الدراسي",
  },
);
const emit = defineEmits<{ retry: [] }>();

const questionBanks = computed(() => props.questionBanks);
const failedImages = ref<Set<number>>(new Set());

const activeBanks = computed(
  () => questionBanks.value.filter((bank) => bank.isActive).length,
);
const subscribedBanks = computed(
  () => questionBanks.value.filter((bank) => bank.isSubscribed).length,
);

const markImageFailed = (bankId: number) => {
  failedImages.value = new Set(failedImages.value).add(bankId);
};

const displayPrice = (bank: QuestionBankModel) => {
  if (bank.monthPrice <= 0) return "مجاني";

  const price = new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 2,
  }).format(bank.monthPrice);
  const currency = bank.currency === "L.E" ? "جنيه" : bank.currency;
  return `${price} ${currency}`;
};

const bankStatus = (bank: QuestionBankModel) => {
  if (bank.isSubscribed) return { className: "active", label: "مشترك" };
  if (bank.isActive) return { className: "available", label: "متاح الآن" };
  return { className: "inactive", label: "غير متاح" };
};

const bankDescription = (bank: QuestionBankModel) =>
  bank.description ||
  `تدرّب على أسئلة مناسبة لـ ${props.yearLabel} وثبّت فهمك خطوة بخطوة.`;

const bankVisualLabel = (bank: QuestionBankModel) => {
  const firstWord = bank.title.trim().split(/\s+/u)[0] || "بنك";
  return firstWord.slice(0, 5);
};
</script>

<template>
  <div
    :class="['question-bank', { 'question-bank--embedded': props.embedded }]"
    dir="rtl"
  >
    <header v-if="!props.embedded" class="question-bank__hero">
      <div class="container question-bank__hero-grid">
        <div class="question-bank__intro">
          <nav aria-label="مسار الصفحة">
            <NuxtLink to="/">الرئيسية</NuxtLink>
            <span aria-hidden="true">/</span>
            <b>بنك الأسئلة</b>
          </nav>
          <span class="question-bank__eyebrow">تدريب أذكى، نتيجة أوضح</span>
          <h1>كل سؤال تحلّه،<br /><em>يقربك من هدفك.</em></h1>
          <p>
            اختار بنك الأسئلة المناسب، تدرّب على مهلك، وارجع لأخطائك حتى
            تتحول كل نقطة صعبة إلى خطوة مضمونة.
          </p>
          <NuxtLink to="/course" class="question-bank__primary-action">
            تصفّح الكورسات <span aria-hidden="true">←</span>
          </NuxtLink>
        </div>

        <aside class="question-bank__summary" aria-label="ملخص بنك الأسئلة">
          <span>مساحتك التدريبية</span>
          <strong>{{ questionBanks.length }}</strong>
          <p>بنك أسئلة مناسب لـ {{ props.yearLabel }}</p>
          <div>
            <span><b>{{ activeBanks }}</b> بنك نشط</span>
            <span><b>{{ subscribedBanks }}</b> مشترك</span>
          </div>
        </aside>
      </div>
    </header>

    <section class="question-bank__catalog" aria-labelledby="question-bank-title">
      <div class="container">
        <header v-if="!props.embedded" class="question-bank__heading">
          <div>
            <span>بنوكك الحالية</span>
            <h2 id="question-bank-title">ابدأ تدريبك أو كمّل من حيث توقفت.</h2>
          </div>
          <p>{{ questionBanks.length }} بنوك أسئلة مرتبطة بحسابك</p>
        </header>

        <div
          v-if="props.pending"
          class="question-bank__state"
          role="status"
          aria-live="polite"
        >
          <i class="pi pi-spin pi-spinner" aria-hidden="true" />
          <strong>جاري تحميل بنوك أسئلة {{ props.yearLabel }}...</strong>
          <p>لحظات ونجهز لك التدريبات المناسبة لبيانات حسابك.</p>
        </div>

        <div
          v-else-if="props.errorMessage"
          class="question-bank__state question-bank__state--error"
          role="alert"
        >
          <i class="pi pi-exclamation-circle" aria-hidden="true" />
          <strong>تعذر تحميل بنوك الأسئلة</strong>
          <p>{{ props.errorMessage }}</p>
          <button type="button" @click="emit('retry')">
            <i class="pi pi-refresh" aria-hidden="true" />
            حاول مرة أخرى
          </button>
        </div>

        <div v-else-if="questionBanks.length === 0" class="question-bank__state">
          <i class="pi pi-file-edit" aria-hidden="true" />
          <strong>لا توجد بنوك أسئلة لـ {{ props.yearLabel }} حاليًا</strong>
          <p>ستظهر هنا تلقائيًا فور إضافة بنوك أسئلة مرتبطة بسنتك الدراسية.</p>
          <NuxtLink to="/profileavailablecourses">تصفّح كورسات مرحلتك</NuxtLink>
        </div>

        <div v-else class="question-bank__grid">
          <article
            v-for="(bank, index) in questionBanks"
            :key="bank.id"
            :class="[
              'question-bank-card',
              `question-bank-card--${bankStatus(bank).className}`,
            ]"
          >
            <div class="question-bank-card__visual">
              <img
                v-if="bank.image?.img && !failedImages.has(bank.id)"
                :src="bank.image.img"
                :alt="bank.image.alt || `غلاف ${bank.title}`"
                loading="lazy"
                @error="markImageFailed(bank.id)"
              />
              <span>{{ bank.teacher?.name || props.yearLabel }}</span>
              <strong>{{ bankVisualLabel(bank) }}</strong>
              <small>{{ String(index + 1).padStart(2, "0") }}</small>
            </div>

            <div class="question-bank-card__content">
              <div class="question-bank-card__topline">
                <span>{{ bank.teacher?.name || props.yearLabel }}</span>
                <b :class="`is-${bankStatus(bank).className}`">
                  {{ bankStatus(bank).label }}
                </b>
              </div>

              <h3>{{ bank.title }}</h3>
              <p>{{ bankDescription(bank) }}</p>

              <div class="question-bank-card__footer">
                <div>
                  <small>{{ bank.monthPrice > 0 ? "اشتراك شهري" : "سعر البنك" }}</small>
                  <strong>{{ displayPrice(bank) }}</strong>
                </div>
                <QuestionBankAction :bank="bank" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.question-bank {
  min-width: 0;
  background: var(--home-v2-paper);
  color: var(--home-v2-ink);
}

.question-bank--embedded {
  --home-v2-paper: var(--profile-canvas);
  --home-v2-cream: var(--profile-surface-raised);
  --home-v2-surface: var(--profile-surface);
  --home-v2-ink: var(--profile-ink);
  --home-v2-muted: var(--profile-muted);
  --home-v2-line: var(--profile-border);
  --home-v2-blue: var(--profile-secondary);
  --home-v2-deep: var(--profile-primary);
  --home-v2-shadow: var(--app-shadow, rgb(6 17 71 / 40%));
  --home-v2-heading: "Cairo", sans-serif;
  background: transparent;
}

.question-bank--embedded .question-bank__catalog {
  padding: 0;
}

.question-bank--embedded .question-bank__catalog > .container {
  width: 100%;
  max-width: none;
  padding: 0;
}

.question-bank__hero {
  padding: 150px 0 76px;
  background:
    radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--home-v2-blue) 18%, transparent) 0 2px, transparent 3px),
    linear-gradient(135deg, var(--home-v2-cream), var(--home-v2-paper));
  background-size: 32px 32px, auto;
  border-bottom: 1px solid var(--home-v2-line);
}

.question-bank__hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: center;
  gap: clamp(45px, 8vw, 110px);
}

.question-bank__intro nav {
  display: flex;
  gap: 9px;
  margin-bottom: 24px;
  color: var(--home-v2-muted);
  font-size: 13px;
}

.question-bank__intro nav b { color: var(--home-v2-ink); }
.question-bank__eyebrow,
.question-bank__heading span {
  color: var(--home-v2-blue);
  font-size: 13px;
  font-weight: 900;
}

.question-bank__intro h1 {
  margin: 14px 0 18px;
  color: var(--home-v2-ink);
  font: 900 clamp(42px, 5vw, 68px) / 1.18 var(--home-v2-heading);
  letter-spacing: -.035em;
}

.question-bank__intro h1 em { color: var(--home-v2-blue); font-style: normal; }
.question-bank__intro > p {
  max-width: 690px;
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 17px;
  line-height: 1.95;
}

.question-bank__primary-action {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  padding: 12px 19px;
  border-radius: 9px;
  background: var(--home-v2-blue);
  color: #fff;
  font-weight: 900;
}

.question-bank__summary {
  position: relative;
  overflow: hidden;
  padding: 34px;
  border-radius: 20px;
  background: var(--home-v2-deep);
  color: #fff;
  box-shadow: 22px 24px color-mix(in srgb, var(--home-v2-blue) 11%, transparent);
}

.question-bank__summary::after {
  position: absolute;
  width: 220px;
  height: 220px;
  right: -90px;
  bottom: -130px;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 50%;
  content: "";
}

.question-bank__summary > span { font-size: 12px; font-weight: 900; opacity: .72; }
.question-bank__summary > strong { display: block; margin-top: 12px; font: 900 78px/1 var(--home-v2-heading); }
.question-bank__summary > p { margin: 8px 0 30px; color: rgb(255 255 255 / 76%); }
.question-bank__summary > div { display: flex; gap: 12px; }
.question-bank__summary > div span { padding: 8px 11px; border: 1px solid rgb(255 255 255 / 20%); border-radius: 8px; font-size: 12px; }

.question-bank__catalog { padding: 76px 0 90px; }
.question-bank__heading { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 32px; }
.question-bank__heading h2 { margin: 7px 0 0; color: var(--home-v2-ink); font: 900 clamp(27px, 3vw, 39px)/1.35 var(--home-v2-heading); }
.question-bank__heading p { margin: 0; color: var(--home-v2-muted); }
.question-bank__grid { display: grid; gap: 24px; }

.question-bank__state {
  min-height: 290px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 9px;
  padding: 42px 24px;
  border: 1px dashed color-mix(in srgb, var(--home-v2-blue) 28%, var(--home-v2-line));
  border-radius: 18px;
  background: var(--home-v2-surface);
  color: var(--home-v2-muted);
  text-align: center;
}

.question-bank__state > i {
  margin-bottom: 7px;
  color: var(--home-v2-blue);
  font-size: 34px;
}

.question-bank__state > strong {
  color: var(--home-v2-ink);
  font-size: 19px;
}

.question-bank__state > p {
  max-width: 560px;
  margin: 0;
  line-height: 1.8;
}

.question-bank__state > button,
.question-bank__state > a {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 9px 16px;
  border: 1px solid var(--home-v2-blue);
  border-radius: 9px;
  background: var(--home-v2-blue);
  color: #fff;
  cursor: pointer;
  font: 800 13px/1.4 inherit;
}

.question-bank__state--error > i {
  color: #c24141;
}

.question-bank-card {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 18px;
  background: var(--home-v2-surface);
  box-shadow: 0 24px 60px -52px var(--home-v2-shadow);
}

.question-bank-card__visual {
  position: relative;
  display: grid;
  min-height: 315px;
  place-content: center;
  overflow: hidden;
  background: var(--home-v2-deep);
  color: #fff;
  text-align: center;
}

.question-bank-card--active .question-bank-card__visual { background: var(--home-v2-blue); }
.question-bank-card--available .question-bank-card__visual { background: color-mix(in srgb, var(--home-v2-blue) 82%, var(--home-v2-deep)); }
.question-bank-card--inactive .question-bank-card__visual { filter: saturate(.35); }
.question-bank-card__visual::after { position: absolute; z-index: 1; inset: 0; background: linear-gradient(180deg, rgb(4 14 45 / 25%), rgb(4 14 45 / 76%)); content: ""; }
.question-bank-card__visual > img { position: absolute; z-index: 0; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.question-bank-card__visual span { position: absolute; z-index: 2; top: 25px; right: 25px; left: 25px; overflow: hidden; font-size: 12px; opacity: .9; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
.question-bank-card__visual strong { position: relative; z-index: 2; padding-inline: 20px; font: 900 clamp(42px, 5vw, 64px)/1 var(--home-v2-heading); text-shadow: 0 8px 24px rgb(0 0 0 / 35%); }
.question-bank-card__visual small { position: relative; z-index: 2; margin-top: 12px; font-weight: 900; opacity: .8; }
.question-bank-card__content { display: flex; min-width: 0; flex-direction: column; padding: 30px 34px; }
.question-bank-card__topline { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.question-bank-card__topline > span { color: var(--home-v2-blue); font-size: 12px; font-weight: 900; }
.question-bank-card__topline > b { padding: 6px 10px; border-radius: 999px; font-size: 11px; }
.question-bank-card__topline .is-active { background: rgb(20 145 72 / 12%); color: #128044; }
.question-bank-card__topline .is-available { background: color-mix(in srgb, var(--home-v2-blue) 12%, transparent); color: var(--home-v2-blue); }
.question-bank-card__topline .is-inactive { background: rgb(100 116 139 / 12%); color: #64748b; }
.question-bank-card h3 { margin: 12px 0 8px; color: var(--home-v2-ink); font: 900 27px/1.4 var(--home-v2-heading); }
.question-bank-card__content > p { margin: 0; color: var(--home-v2-muted); line-height: 1.8; }
.question-bank-card__footer { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-top: auto; padding-top: 22px; }
.question-bank-card__footer > div { display: grid; }
.question-bank-card__footer small { color: var(--home-v2-muted); }
.question-bank-card__footer strong { color: var(--home-v2-ink); font-size: 18px; }
.question-bank-card__footer a { display: inline-flex; gap: 10px; padding: 10px 16px; border: 1px solid var(--home-v2-blue); border-radius: 8px; color: var(--home-v2-blue); font-weight: 900; transition: .2s ease; }
.question-bank-card__footer a:hover { background: var(--home-v2-blue); color: #fff; transform: translateY(-1px); }
.question-bank-card__disabled { display: inline-flex; padding: 10px 16px; border-radius: 8px; background: var(--home-v2-cream); color: var(--home-v2-muted); font-size: 13px; font-weight: 800; }

@media (max-width: 900px) {
  .question-bank__hero-grid { grid-template-columns: 1fr; }
  .question-bank__summary { max-width: 520px; }
  .question-bank-card { grid-template-columns: 210px minmax(0, 1fr); }
}

@media (max-width: 680px) {
  .question-bank__hero { padding: 125px 0 55px; }
  .question-bank__hero-grid { gap: 35px; }
  .question-bank__summary { padding: 27px; box-shadow: 10px 12px color-mix(in srgb, var(--home-v2-blue) 11%, transparent); }
  .question-bank__heading { display: block; }
  .question-bank__heading p { margin-top: 10px; }
  .question-bank-card { grid-template-columns: 1fr; }
  .question-bank-card__visual { min-height: 205px; }
  .question-bank-card__content { padding: 24px 20px; }
  .question-bank-card__footer { align-items: stretch; flex-direction: column; }
  .question-bank-card__footer a { justify-content: center; }
}
</style>
