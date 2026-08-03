<script setup lang="ts">
defineProps<{
  teacherName: string;
  teacherRole: string;
  teacherImage: string;
}>();
</script>

<template>
  <section class="about-teacher-hero" aria-labelledby="about-teacher-title">
    <div class="container about-teacher-hero__grid">
      <div class="about-teacher-hero__copy" data-about-reveal>
        <span class="about-teacher-eyebrow">عن المدرس</span>
        <h1 id="about-teacher-title">
          الفيزياء أوضح لما <em>تفهم معنى القانون.</em>
        </h1>
        <p>
          {{ teacherName }} — {{ teacherRole }}. نقدّم محتوى تعليميًا منظمًا يبدأ
          من فهم الفكرة وينتهي بإتقان تطبيقها في المسألة.
        </p>
        <div class="about-teacher-hero__actions">
          <NuxtLink to="/course">
            اختار صفك <span aria-hidden="true">←</span>
          </NuxtLink>
          <a href="#study-method">اعرف نظام الدراسة</a>
        </div>
      </div>

      <figure class="about-teacher-portrait" data-about-reveal>
        <NuxtImg
          :src="teacherImage"
          :alt="`${teacherName} — ${teacherRole}`"
          width="1086"
          height="1448"
          sizes="(max-width: 900px) 100vw, 36vw"
          loading="eager"
        />
        <figcaption>
          <span>{{ teacherName }}</span>
          <small>{{ teacherRole }}</small>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
