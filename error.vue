<script setup lang="ts">
import { IconsArrowIcon } from "#components";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
</script>

<template>
  <!-- <div class="error-page">
    <div class="content">
      <h2 class="title">Oops! Something Went Wrong</h2>
      <p class="subtitle">
        The page you're trying to access may have been moved or no longer
        exists, Kindly return to the homepage or contact support if the issue
        persists
      </p>
      <NuxtLink to="/">
        <button class="home-btn">
          <span>back to home</span>
          <IconsArrowIcon class="icon" />
        </button>
      </NuxtLink>
    </div>
    <div class="Circles">
      <NuxtImg class="error-circle" src="/images/NewFourth.png" />
      <NuxtImg class="error-circle" src="/images/NewCircle.png" />
      <NuxtImg class="error-circle" src="/images/NewTwo.png" />
      <NuxtImg class="error-circle" src="/images/NewThird.png" />
    </div>
  </div> -->
  <div class="error-container">
    <DotLottieVue
      autoplay
      loop
      class="image"
      src="/lottie/Under_Construction.json"
    />
    <p class="title">الموقع تحت الصيانة</p>
  </div>
</template>

<style scoped lang="scss">
.error-container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  // min-height: 100vh;

  .title {
    text-align: center;
    font-size: 25px;
    font-weight: 700;
    margin-top: 20px;
    padding-bottom: 20px;
    color: #000;
  }
}
// .error-page {
//   background-size: cover;
//   background-image: url("/images/bg.png");
// }
</style>
