<script setup lang="ts">
import Arrow from '~/public/icons/arrow.vue';
import BgCircieIcon from '~/public/icons/BgCircieIcon.vue';


import type CourseInterface from '~/types/course_interface';
import { baseUrl } from "~/constant/baseUrl";
import type AboutUsInterface from '~/types/about_us_interface';
import type AboutUsVisionInterface from '~/types/about_us_vision_interface';




const props = defineProps({
AboutusVision: {
    type: Object as () => AboutUsVisionInterface | null,
    default: null
}
});

const Aboutusvision = ref(props.AboutusVision);

watch(() => props.AboutusVision, (newValue) => {
  Aboutusvision.value = newValue;
}, { immediate: true });




</script>

<template>
  <div class="aboutus-vision-conatiner">
    <div class="aboutus-vid-container">
      <div class="aboutus-vid">
        <video controls autoplay >
          <!-- <source src="../../public/Videos/educationVideo.mp4" type="video/mp4" />
          <source src="../../public/Videos/educationVideo.mp4" type="video/ogg" /> -->
          <source :src="Aboutusvision?.video" type="video/ogg" />
        </video>
      </div>
      <BgCircieIcon class="right-circle" />
      <BgCircieIcon class="left-circle"/>
    </div>

    <div class="aboutus-text-container">
      <div class="aboutus-text" v-for="(vision, index) in Aboutusvision?.ourvision" :key="index">
        <div class="aboutus-text-header">
          <h3>{{ vision.title }}</h3>
            <Arrow />
        </div>
        <p> {{ vision.subtitle }}.</p>
      </div>

      <!-- <div class="aboutus-text" >
        <div class="aboutus-text-header">
          <h3>رسالتنا</h3>
            <Arrow />
        </div>
        <p> نحن في tech lab نسعى إلى تقديم محتوى متميز وشيق ويمكّن المتعلمين من تحقيق أهدافهم وتطوير مهاراتهم.</p>
      </div> -->
      <!-- <div class="aboutus-text" >
        <div class="aboutus-text-header">
          <h3>مهمتنا</h3>
            <Arrow />
        </div>
        <p class="secondary-text"> مهمتنا هي تقديم محتوى غني وموثوق يلهم الزوار ويساعدهم على تحقيق التميز في حياتهم الشخصية والمهنية..</p>
      </div>
      <div class="aboutus-text" >
        <div class="aboutus-text-header">
          <h3>رؤيتنا</h3>
            <Arrow />
        </div>
        <p class="secondary-text"> رؤيتنا هي أن نكون المنصة الرائدة في توفير المعرفة والإلهام لتمكين الأفراد من تحقيق إمكاناتهم الكاملة..</p>
      </div> -->

    </div>


  </div>
</template>

<style scoped lang="scss"></style>
