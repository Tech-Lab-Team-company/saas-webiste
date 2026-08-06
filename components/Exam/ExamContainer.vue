<script setup lang="ts">
type QuestionBankStatus = "active" | "pending";

interface QuestionBankCard {
  id: number;
  title: string;
  subject: string;
  description: string;
  price: string;
  plan: string;
  status: QuestionBankStatus;
  totalQuestions?: number;
  completedQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
}

withDefaults(defineProps<{ embedded?: boolean }>(), {
  embedded: false,
});

const questionBanks: QuestionBankCard[] = [
  {
    id: 1,
    title: "مراجعة النحو الشاملة",
    subject: "اللغة العربية",
    description:
      "تدريبات مرتبة على أهم قواعد النحو، مع أسئلة متنوعة تساعدك على تثبيت كل قاعدة قبل الانتقال إلى التالية.",
    price: "1500 جنيه",
    plan: "اشتراك شهري",
    status: "pending",
  },
  {
    id: 2,
    title: "بنك أسئلة ملخص النحو",
    subject: "اللغة العربية",
    description:
      "كمّل تدريبك من حيث توقفت، وتابع الإجابات الصحيحة والأخطاء التي تحتاج إلى مراجعة.",
    price: "1500 جنيه",
    plan: "اشتراك شهري",
    status: "active",
    totalQuestions: 100,
    completedQuestions: 50,
    correctAnswers: 30,
    wrongAnswers: 20,
  },
];

const activeBanks = computed(
  () => questionBanks.filter((bank) => bank.status === "active").length,
);
const totalQuestions = computed(() =>
  questionBanks.reduce((total, bank) => total + (bank.totalQuestions || 0), 0),
);

const progressPercentage = (bank: QuestionBankCard) => {
  if (!bank.totalQuestions) return 0;
  return Math.round(((bank.completedQuestions || 0) / bank.totalQuestions) * 100);
};
</script>

<template>
  <div :class="['question-bank', { 'question-bank--embedded': embedded }]" dir="rtl">
    <header v-if="!embedded" class="question-bank__hero">
      <div class="container question-bank__hero-grid">
        <div class="question-bank__intro">
          <nav aria-label="مسار الصفحة">
            <NuxtLink to="/home-v2">الرئيسية</NuxtLink>
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
          <strong>{{ totalQuestions || 100 }}</strong>
          <p>سؤال متاح للتدريب والمراجعة</p>
          <div>
            <span><b>{{ activeBanks }}</b> بنك نشط</span>
            <span><b>50%</b> مكتمل</span>
          </div>
        </aside>
      </div>
    </header>

    <section class="question-bank__catalog" aria-labelledby="question-bank-title">
      <div class="container">
        <header v-if="!embedded" class="question-bank__heading">
          <div>
            <span>بنوكك الحالية</span>
            <h2 id="question-bank-title">ابدأ تدريبك أو كمّل من حيث توقفت.</h2>
          </div>
          <p>{{ questionBanks.length }} بنوك أسئلة مرتبطة بحسابك</p>
        </header>

        <div class="question-bank__grid">
          <article
            v-for="(bank, index) in questionBanks"
            :key="bank.id"
            :class="['question-bank-card', `question-bank-card--${bank.status}`]"
          >
            <div class="question-bank-card__visual" aria-hidden="true">
              <span>{{ bank.subject }}</span>
              <strong>{{ index === 0 ? "نحو" : "50" }}</strong>
              <small>{{ String(index + 1).padStart(2, "0") }}</small>
            </div>

            <div class="question-bank-card__content">
              <div class="question-bank-card__topline">
                <span>{{ bank.subject }}</span>
                <b :class="`is-${bank.status}`">
                  {{ bank.status === "active" ? "متاح الآن" : "قيد المراجعة" }}
                </b>
              </div>

              <h3>{{ bank.title }}</h3>
              <p>{{ bank.description }}</p>

              <template v-if="bank.status === 'active'">
                <div class="question-bank-card__stats">
                  <span><b>{{ bank.completedQuestions }}</b> تم التدريب</span>
                  <span class="is-correct"><b>{{ bank.correctAnswers }}</b> صحيحة</span>
                  <span class="is-wrong"><b>{{ bank.wrongAnswers }}</b> تحتاج مراجعة</span>
                </div>
                <div class="question-bank-card__progress">
                  <div>
                    <span>نسبة الإنجاز</span>
                    <b>{{ progressPercentage(bank) }}%</b>
                  </div>
                  <span><i :style="{ width: `${progressPercentage(bank)}%` }" /></span>
                </div>
              </template>

              <div class="question-bank-card__footer">
                <div>
                  <small>{{ bank.plan }}</small>
                  <strong>{{ bank.price }}</strong>
                </div>
                <NuxtLink to="/course">
                  {{ bank.status === "active" ? "كمّل تدريبك" : "عرض الكورسات" }}
                  <span aria-hidden="true">←</span>
                </NuxtLink>
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
.question-bank-card__visual span { position: absolute; top: 25px; right: 25px; font-size: 12px; opacity: .75; }
.question-bank-card__visual strong { font: 900 72px/1 var(--home-v2-heading); }
.question-bank-card__visual small { margin-top: 12px; font-weight: 900; opacity: .65; }
.question-bank-card__content { display: flex; min-width: 0; flex-direction: column; padding: 30px 34px; }
.question-bank-card__topline { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.question-bank-card__topline > span { color: var(--home-v2-blue); font-size: 12px; font-weight: 900; }
.question-bank-card__topline > b { padding: 6px 10px; border-radius: 999px; font-size: 11px; }
.question-bank-card__topline .is-active { background: rgb(20 145 72 / 12%); color: #128044; }
.question-bank-card__topline .is-pending { background: rgb(234 156 31 / 14%); color: #a96400; }
.question-bank-card h3 { margin: 12px 0 8px; color: var(--home-v2-ink); font: 900 27px/1.4 var(--home-v2-heading); }
.question-bank-card__content > p { margin: 0; color: var(--home-v2-muted); line-height: 1.8; }
.question-bank-card__stats { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.question-bank-card__stats span { padding: 7px 10px; border: 1px solid var(--home-v2-line); border-radius: 7px; color: var(--home-v2-muted); font-size: 12px; }
.question-bank-card__stats .is-correct b { color: #128044; }
.question-bank-card__stats .is-wrong b { color: #be4040; }
.question-bank-card__progress { margin-top: 17px; }
.question-bank-card__progress > div { display: flex; justify-content: space-between; margin-bottom: 7px; color: var(--home-v2-muted); font-size: 12px; }
.question-bank-card__progress > span { display: block; height: 7px; overflow: hidden; border-radius: 99px; background: var(--home-v2-cream); }
.question-bank-card__progress i { display: block; height: 100%; border-radius: inherit; background: var(--home-v2-blue); }
.question-bank-card__footer { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-top: auto; padding-top: 22px; }
.question-bank-card__footer > div { display: grid; }
.question-bank-card__footer small { color: var(--home-v2-muted); }
.question-bank-card__footer strong { color: var(--home-v2-ink); font-size: 18px; }
.question-bank-card__footer a { display: inline-flex; gap: 10px; padding: 10px 16px; border: 1px solid var(--home-v2-blue); border-radius: 8px; color: var(--home-v2-blue); font-weight: 900; transition: .2s ease; }
.question-bank-card__footer a:hover { background: var(--home-v2-blue); color: #fff; transform: translateY(-1px); }

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
