<script setup lang="ts">
defineProps<{
  teacherRole: string;
}>();
</script>

<template>
  <section
    id="experience"
    class="about-teacher-section about-teacher-experience"
    aria-labelledby="teacher-experience-title"
  >
    <div class="container">
      <header class="about-teacher-section__head" data-about-reveal>
        <div>
          <span>خبرة المدرس</span>
          <h2 id="teacher-experience-title">خبرة في تبسيط المعلومة وتحويلها لتطبيق.</h2>
        </div>
        <p>
          {{ teacherRole }}، من تأسيس الفكرة إلى تحليل السؤال والوصول للحل بطريقة
          واضحة.
        </p>
      </header>

      <article class="about-teacher-stage-card" data-about-reveal>
        <div class="about-teacher-stage-card__chips" aria-label="المراحل الدراسية">
          <span>أولى ثانوي</span>
          <span>ثانية ثانوي</span>
          <span>ثالثة ثانوي</span>
        </div>
        <div class="about-teacher-stage-card__content">
          <span aria-hidden="true">✦</span>
          <h3>محتوى مناسب لكل مرحلة دراسية</h3>
          <p>
            كل صف له مساره المنظم، ومحاضراته، وتدريباته التي تناسب أهدافه خلال
            العام الدراسي.
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
