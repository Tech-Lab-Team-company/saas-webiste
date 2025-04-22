<script setup lang="ts">
import BottomDashedIcon from '~/public/icons/BottomDashedIcon.vue';
import SquareIcon from '~/public/icons/squareIcon.vue';
import TopDashedArrow from '~/public/icons/TopDashedArrow.vue';
import { ref, onMounted } from 'vue';

const stepsContainer = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.3 }
  );

  if (stepsContainer.value) {
    observer.observe(stepsContainer.value);
  }

  return () => {
    if (stepsContainer.value) {
      observer.unobserve(stepsContainer.value);
    }
  };
});




import type TitleInterface from '~/types/title_intefrace';


  const props = defineProps({
  AboutusSteps: {
      type: Object as () => TitleInterface[] | null,
      default: null
  }
  });

  const Aboutussteps = ref(props.AboutusSteps);

  watch(() => props.AboutusSteps, (newValue) => {
    Aboutussteps.value = newValue;
  }, { immediate: true });


</script>

<template>
    <div class="aboutus-steps-container">
        <div class="aboutus-steps-header">
            <h3>خطوات بسيطة لإدارة منهجك التعليمي</h3>
            <hr class="abotus-hr">
        </div>

        <div class="aboutus-setps" ref="stepsContainer" :class="{ 'animate': isVisible }">
            <div class="left-stpes">
                <!-- <div class="aboutus-circle-steps aboutus-circle-steps-start">
                    <h4>2- ابدأ التعلّم وتابِع تقدّمك</h4>
                    <p>شاهد الدروس، حل التمارين، وراجع كل خطوة بتعملها من خلال صفحة كورساتي الخاصة. 
                اختبر نفسك في بنك الأسئلة 📚</p>
                </div> -->
                <div class="aboutus-circle-steps aboutus-circle-steps-start">
                    <h4>{{ Aboutussteps[0]?.title }}</h4>
                    <p>{{ Aboutussteps[0].subtitle}}</p>
                </div>
            </div>
            <div class="aboutus-arrows">
                <TopDashedArrow class="aboutus-arrow"/>
                <BottomDashedIcon class="aboutus-arrow" />
            </div>
            <div class="right-steps">
                <!-- <div class="aboutus-circle-steps">
                    <h4>1- اختار الكورسات اللي تهمك</h4>
                    <p>تصفّح مجموعة كبيرة من الدورات التعليمية في مختلف التخصصات، واختار اللي يناسب مستواك واهتماماتك.
                        ابدأ التعلّم وتابِع تقدّمك</p>
                </div> -->
                <div class="aboutus-circle-steps">
                    <h4>{{ Aboutussteps[0]?.title }}</h4>
                    <p>{{Aboutussteps[0].subtitle }}</p>
                </div>
                <!-- <div class="aboutus-circle-steps aboutus-circle-steps-test ">
                    <h4>3- اختبر نفسك في بنك الأسئلة</h4>
                    <p>ادخل على بنك الأسئلة وتدرّب على أسئلة متنوعة حسب المادة أو المهارة، علشان تثبت معلوماتك. ✍️</p>
                </div> -->
                <div class="aboutus-circle-steps aboutus-circle-steps-test ">
                    <h4>{{ Aboutussteps[0]?.title }}</h4>
                    <p>{{Aboutussteps[0].subtitle }}</p>
                </div>
            </div>

            <SquareIcon class="first-square" />
            <SquareIcon class="second-square" />
            <SquareIcon class="third-square" />
        </div>
    </div>
</template>

<style scoped></style>