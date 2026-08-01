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
      <div>
        <span class="section-tag">عندك سؤال؟</span>
        <h2 id="home-v2-faq-title">الإجابة<br /><em>ببساطة.</em></h2>
        <p>كل الإجابات على الأسئلة الشائعة في مكان واحد.</p>
      </div>
      <div class="home-v2-faq__list">
        <details v-for="(faq, index) in faqs" :key="faq.id" :open="index === 0">
          <summary>{{ faq.question }} <span aria-hidden="true">+</span></summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-faq {
  background: #fff;
}

.home-v2-faq__grid {
  display: grid;
  grid-template-columns: 0.65fr 1.35fr;
  gap: clamp(48px, 8vw, 120px);
}

.home-v2-faq h2 {
  margin: 13px 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.18 var(--home-v2-heading);
}

.home-v2-faq h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-faq__grid > div:first-child > p {
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-v2-faq details {
  border-bottom: 1px solid var(--home-v2-line);
}

.home-v2-faq summary {
  display: flex;
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 0;
  cursor: pointer;
  font: 800 17px var(--home-v2-heading);
  list-style: none;
}

.home-v2-faq summary::-webkit-details-marker {
  display: none;
}

.home-v2-faq summary span {
  color: var(--home-v2-blue);
  font-size: 22px;
}

.home-v2-faq details[open] summary span {
  transform: rotate(45deg);
}

.home-v2-faq details p {
  max-width: 680px;
  margin: 0;
  padding-bottom: 22px;
  color: var(--home-v2-muted);
  line-height: 1.9;
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
  }
}
</style>
