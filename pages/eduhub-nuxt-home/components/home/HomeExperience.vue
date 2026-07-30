<script setup lang="ts">
const benefits = [
  { index: '01', title: 'شرح مبسّط', description: 'الفكرة والقانون بخطوات مرتبة وواضحة.' },
  { index: '02', title: 'تطبيق مستمر', description: 'مسائل متدرجة تساعدك تثبّت الفكرة بعد شرحها.' },
  { index: '03', title: 'اختبارات دورية', description: 'محطات مراجعة تقيس استيعابك أثناء المذاكرة.' },
  { index: '04', title: 'متابعة دورية', description: 'تنظيم مستمر يخليك عارف خلّصت إيه وإيه اللي جاي.' },
] as const
</script>

<template>
  <section id="experience" class="experience">
    <div class="container experience-grid">
      <div class="experience-copy" data-motion-reveal="up">
        <span class="section-tag light">رحلة التعلم مع مستر إسلام</span>
        <h2>
          أربع خطوات.<br />
          رحلة واحدة <em>مترابطة.</em>
        </h2>
        <p>شرح مبسّط، تطبيق مستمر، اختبارات دورية ومتابعة تساعدك تمشي في الفيزياء بخطة واضحة.</p>
        <NuxtLink to="/learn" class="button button-light">
          شاهد نموذج الطالب <span aria-hidden="true">←</span>
        </NuxtLink>
      </div>

      <div class="benefit-list">
        <article
          v-for="(benefit, index) in benefits"
          :key="benefit.index"
          data-motion-reveal="up"
          :data-motion-order="index"
        >
          <span>{{ benefit.index }}</span>
          <div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
          <i aria-hidden="true">↙</i>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience {
  position: relative;
  overflow: hidden;
  padding: 96px 0;
  background: var(--deep);
  color: #fff;
}

.experience::after {
  position: absolute;
  bottom: -80px;
  left: -30px;
  color: #ffffff06;
  content: 'PHYSICS';
  font: 900 170px var(--heading);
  white-space: nowrap;
}

.experience-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: center;
  gap: 120px;
}

.experience-copy h2 {
  margin: 14px 0 0;
  font: 900 clamp(38px, 4.1vw, 58px) / 1.16 var(--heading);
  letter-spacing: -0.045em;
}

.experience-copy h2 em {
  color: #5ba8ff;
  font-style: normal;
}

.experience-copy > p {
  color: #ffffffb8;
  font-size: 15px;
  line-height: 1.8;
}

.benefit-list article {
  display: grid;
  grid-template-columns: 52px 1fr 28px;
  align-items: start;
  gap: 18px;
  padding: 25px 0;
  border-bottom: 1px solid #ffffff26;
}

.benefit-list article > span {
  color: #f3ce82;
  font: 700 12px var(--heading);
}

.benefit-list h3 {
  margin: 0 0 5px;
  font: 800 23px var(--heading);
}

.benefit-list p {
  margin: 0;
  color: #ffffffb8;
  font-size: 15px;
  line-height: 1.8;
}

.benefit-list i {
  color: #5ba8ff;
  font-size: 20px;
  font-style: normal;
}

@media (max-width: 900px) {
  .experience-grid {
    grid-template-columns: 1fr;
    gap: 55px;
  }
}

@media (max-width: 620px) {
  .experience {
    padding: 72px 0;
  }

  .experience-copy h2 {
    font-size: 38px;
  }

  .benefit-list article {
    grid-template-columns: 42px 1fr 20px;
    gap: 12px;
  }

  .benefit-list h3 {
    font-size: 20px;
  }

  .experience::after {
    font-size: 100px;
  }
}
</style>
