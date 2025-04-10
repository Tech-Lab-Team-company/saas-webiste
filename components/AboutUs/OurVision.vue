<script setup lang="ts">
import Arrow from '~/public/icons/arrow.vue';
import BgCircieIcon from '~/public/icons/BgCircieIcon.vue';









</script>

<template>
  <div class="aboutus-vision-conatiner">
    <div class="aboutus-vid-container">
      <div class="aboutus-vid">
        <video autoplay src="../../public/Videos/educationVideo.mp4"></video>
      </div>
      <BgCircieIcon class="right-circle" />
      <BgCircieIcon class="left-circle"/>
    </div>

    <div class="aboutus-text-container">

      <div class="aboutus-text" >
        <div class="aboutus-text-header">
          <h3>رسالتنا</h3>
            <Arrow />
        </div>
        <p> نحن في tech lab نسعى إلى تقديم محتوى متميز وشيق ويمكّن المتعلمين من تحقيق أهدافهم وتطوير مهاراتهم.</p>
      </div>
      <div class="aboutus-text" >
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
      </div>

    </div>


  </div>
</template>

<style scoped lang="scss"></style>
