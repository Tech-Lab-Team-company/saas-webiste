<script setup lang="ts">
/* FAQ API temporarily disabled.
import type Fqs from '~/types/fqs'
import { baseUrl } from '~/constant/baseUrl'

type FaqResponse = {
  data: Fqs[]
}

const hostname = useRequestURL().hostname
const webDomain = hostname === 'localhost' || hostname === 'mr-eslamsalama.com'
  ? 'mr-eslamsalama.com'
  : hostname

const { data: faqs, pending, error } = await useAsyncData('home-v2-faqs', async () => {
  const response = await $fetch<FaqResponse>(`${baseUrl}/fetch_faqs`, {
    method: 'GET',
    headers: {
      'Accept-Language': 'ar',
      'web-domain': webDomain,
    },
  })

  return response.data ?? []
}, {
  default: () => [],
})
*/

const faqs = [
  {
    id: 1,
    question: 'كيف أبدأ استخدام المنصة؟',
    answer: 'أنشئ حسابًا جديدًا، ثم اختر مرحلتك الدراسية لتظهر لك الكورسات والمحتوى المناسب.',
  },
  {
    id: 2,
    question: 'هل يمكنني مشاهدة الدروس من الهاتف؟',
    answer: 'نعم، يمكنك استخدام المنصة من الهاتف أو الجهاز اللوحي أو الكمبيوتر بسهولة.',
  },
  {
    id: 3,
    question: 'كيف أشترك في أحد الكورسات؟',
    answer: 'افتح صفحة الكورس المطلوب، ثم اختر طريقة الاشتراك المناسبة وأكمل خطوات الدفع.',
  },
  {
    id: 4,
    question: 'هل أستطيع متابعة تقدمي داخل الكورس؟',
    answer: 'نعم، تعرض مساحة الطالب الدروس المكتملة وتساعدك على متابعة تقدمك بشكل منظم.',
  },
  {
    id: 5,
    question: 'ماذا أفعل إذا واجهت مشكلة؟',
    answer: 'يمكنك التواصل معنا من خلال بيانات الاتصال أو واتساب، وسيساعدك فريق الدعم في أقرب وقت.',
  },
] as const
</script>

<template>
  <section class="section home-v2-faq" aria-labelledby="home-v2-faq-title">
    <div class="container home-v2-faq__grid">
      <div class="home-v2-faq__intro">
        <span class="section-tag">عندك سؤال؟</span>
        <h2 id="home-v2-faq-title">الإجابة<br /><em>ببساطة.</em></h2>
        <p>كل الإجابات على الأسئلة الشائعة في مكان واحد.</p>
        <span class="home-v2-faq__intro-mark" aria-hidden="true">FAQ</span>
      </div>
      <div class="home-v2-faq__list">
        <details v-for="(faq, index) in faqs" :key="faq.id" :open="index === 0">
          <summary>
            <span class="home-v2-faq__number" aria-hidden="true">
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <span class="home-v2-faq__question">{{ faq.question }}</span>
            <span class="home-v2-faq__toggle" aria-hidden="true">
              <i />
              <i />
            </span>
          </summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-faq {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #fff 0%, #f4f7fc 100%);
}

.home-v2-faq__grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1.22fr);
  align-items: start;
  gap: clamp(38px, 6vw, 84px);
}

.home-v2-faq__intro {
  position: sticky;
  top: 110px;
  isolation: isolate;
  min-height: 430px;
  overflow: hidden;
  padding: clamp(36px, 4.5vw, 58px);
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 70%, white);
  border-radius: 26px 26px 88px 26px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--home-v2-blue) 88%, #071735),
    var(--home-v2-deep)
  );
  box-shadow: 0 32px 70px -48px color-mix(in srgb, var(--home-v2-deep) 75%, transparent);
  color: #fff;
}

.home-v2-faq__intro::before {
  position: absolute;
  z-index: -1;
  top: -90px;
  inset-inline-end: -105px;
  width: 270px;
  height: 270px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 50%;
  background: radial-gradient(circle, rgb(255 255 255 / 9%), transparent 68%);
  content: "";
}

.home-v2-faq__intro .section-tag {
  color: color-mix(in srgb, var(--home-v2-coral) 68%, white);
}

.home-v2-faq__intro .section-tag::before {
  background: currentcolor;
}

.home-v2-faq h2 {
  position: relative;
  z-index: 1;
  margin: 24px 0 18px;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.18 var(--home-v2-heading);
}

.home-v2-faq h2 em {
  color: color-mix(in srgb, var(--home-v2-blue-light) 78%, white);
  font-style: normal;
}

.home-v2-faq__intro > p {
  position: relative;
  z-index: 1;
  max-width: 360px;
  margin: 0;
  color: #ffffffbd;
  line-height: 1.9;
}

.home-v2-faq__intro-mark {
  position: absolute;
  z-index: -1;
  inset-inline-end: -12px;
  bottom: -26px;
  color: #ffffff0a;
  font: 900 clamp(100px, 12vw, 180px) / 1 var(--home-v2-heading);
  letter-spacing: -0.08em;
  pointer-events: none;
}

.home-v2-faq__list {
  display: grid;
  gap: 13px;
}

.home-v2-faq details {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--home-v2-line) 82%, transparent);
  border-radius: 16px;
  background: rgb(255 255 255 / 88%);
  box-shadow: 0 14px 34px -32px color-mix(in srgb, var(--home-v2-deep) 45%, transparent);
  transition: border-color 0.25s ease, box-shadow 0.25s ease,
    transform 0.25s ease;
}

.home-v2-faq details:hover {
  border-color: color-mix(in srgb, var(--home-v2-blue) 26%, var(--home-v2-line));
  box-shadow: 0 22px 42px -32px color-mix(in srgb, var(--home-v2-deep) 52%, transparent);
  transform: translateY(-2px);
}

.home-v2-faq details[open] {
  border-color: color-mix(in srgb, var(--home-v2-blue) 42%, transparent);
  background: #fff;
  box-shadow: 0 24px 52px -38px color-mix(in srgb, var(--home-v2-blue) 48%, transparent);
}

.home-v2-faq summary {
  display: grid;
  min-height: 82px;
  grid-template-columns: 44px minmax(0, 1fr) 38px;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  cursor: pointer;
  list-style: none;
}

.home-v2-faq summary::-webkit-details-marker {
  display: none;
}

.home-v2-faq__number {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--home-v2-line);
  border-radius: 12px;
  background: var(--home-v2-paper);
  color: var(--home-v2-blue);
  font: 900 11px var(--home-v2-heading);
  transition: background-color 0.25s ease, color 0.25s ease,
    transform 0.25s ease;
}

.home-v2-faq__question {
  color: var(--home-v2-ink);
  font: 800 17px/1.65 var(--home-v2-heading);
}

.home-v2-faq__toggle {
  position: relative;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-v2-blue) 8%, white);
  color: var(--home-v2-blue);
  transition: background-color 0.25s ease, color 0.25s ease,
    transform 0.3s ease;
}

.home-v2-faq__toggle i {
  position: absolute;
  width: 14px;
  height: 2px;
  border-radius: 999px;
  background: currentcolor;
  transition: transform 0.3s ease;
}

.home-v2-faq__toggle i:last-child {
  transform: rotate(90deg);
}

.home-v2-faq details[open] .home-v2-faq__number {
  background: var(--home-v2-blue);
  color: #fff;
  transform: rotate(-3deg);
}

.home-v2-faq details[open] .home-v2-faq__toggle {
  background: var(--home-v2-blue);
  color: #fff;
  transform: rotate(180deg);
}

.home-v2-faq details[open] .home-v2-faq__toggle i:last-child {
  transform: rotate(0deg);
}

.home-v2-faq details p {
  max-width: 720px;
  margin: -3px 78px 0 58px;
  padding: 0 0 24px;
  color: var(--home-v2-muted);
  line-height: 1.9;
  animation: home-v2-faq-answer 0.32s ease both;
}

.home-v2-faq__status {
  margin: 0;
  padding: 22px 0;
  color: var(--home-v2-muted);
}

.home-v2-faq__status--error {
  color: #b42318;
}

@media (max-width: 760px) {
  .home-v2-faq__grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .home-v2-faq__intro {
    position: relative;
    top: auto;
    min-height: 330px;
    border-radius: 22px 22px 62px 22px;
  }
}

@media (max-width: 520px) {
  .home-v2-faq summary {
    min-height: 72px;
    grid-template-columns: 34px minmax(0, 1fr) 32px;
    gap: 11px;
    padding: 15px 13px;
  }

  .home-v2-faq__number,
  .home-v2-faq__toggle {
    width: 32px;
    height: 32px;
    border-radius: 9px;
  }

  .home-v2-faq__toggle {
    border-radius: 50%;
  }

  .home-v2-faq__question {
    font-size: 15px;
  }

  .home-v2-faq details p {
    margin-inline: 58px 16px;
    font-size: 14px;
  }
}

@keyframes home-v2-faq-answer {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-faq details,
  .home-v2-faq__number,
  .home-v2-faq__toggle,
  .home-v2-faq__toggle i {
    transition: none;
  }

  .home-v2-faq details:hover {
    transform: none;
  }

  .home-v2-faq details p {
    animation: none;
  }
}
</style>
