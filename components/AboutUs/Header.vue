<script setup lang="ts">
import Aboutusarrow from '~/public/icons/Aboutusarrow.vue';
import { ref, onMounted } from 'vue';

const headerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 }
  );

  if (headerRef.value) {
    observer.observe(headerRef.value);
  }
});
</script>

<template>
    <div class="aboutus-header" ref="headerRef">
        <div class="header-title">
            <h3 :class="{ 'animate': isVisible }">نحن منصة تعليمية مبتكرة نسعى إلى تقديم تجربة تعلُّم <span>تفاعلية وممتعة</span></h3>
        </div>
        <div class="header-description-container">
            <div class="header-description">
                <p :class="{ 'animate': isVisible }">نوفر محتوى تعليمي متميز، تدريبات تفاعلية، واختبارات ذكية تساعد الطلاب على الفهم، التكرار، والتفوّق. رؤيتنا هي بناء جيل واعٍ، واثق، ومحب للمعرفة… خطوة بخطوة نحو النجاح</p>
            </div>
            <img 
                src="../../public/images/handbg.png" 
                alt="hand image"
                :class="{ 'animate': isVisible }"
            >
        </div>
        <Aboutusarrow class="arrow-icon" :class="{ 'animate': isVisible }" />
    </div>
</template>

<style scoped></style>