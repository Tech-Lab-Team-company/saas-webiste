<script setup lang="ts">
const renderBullet = (index: number, className: string): string => {
  return `<span class="${className} my-bullet"></span>`;
};
</script>

<template>
<!--  <Swiper-->
<!--    :slides-per-view="1"-->
<!--    :space-between="50"-->
<!--    :navigation="false"-->
<!--    :pagination="{-->
<!--      clickable: true,-->
<!--      dynamicBullets: true,-->
<!--      el: '.swiper-pagination',-->
<!--      bulletClass: 'my-bullet',-->
<!--      bulletActiveClass: 'my-bullet-active',-->
<!--    }"-->
<!--    :autoplay="{-->
<!--      delay: 2500,-->
<!--      disableOnInteraction: false,-->
<!--    }"-->
<!--    :modules="[SwiperAutoplay, SwiperPagination]"-->
<!--    class="mySwiper swiper-login"-->
<!--  >-->
<!--    &lt;!&ndash;    <SwiperSlide>&ndash;&gt;-->
<!--    &lt;!&ndash;      <div class="slide">&ndash;&gt;-->
<!--    &lt;!&ndash;        <img&ndash;&gt;-->
<!--    &lt;!&ndash;          src="~/assets/images/welcome-login.png"&ndash;&gt;-->
<!--    &lt;!&ndash;          alt="login swiper image"&ndash;&gt;-->
<!--    &lt;!&ndash;          class="slide-img"&ndash;&gt;-->
<!--    &lt;!&ndash;        />&ndash;&gt;-->
<!--    &lt;!&ndash;      </div>&ndash;&gt;-->
<!--    &lt;!&ndash;    </SwiperSlide>&ndash;&gt;-->
<!--    <SwiperSlide>-->
<!--      <div class="slide">-->
<!--        -->
<!--      </div>-->
<!--    </SwiperSlide>-->
<!--    <SwiperSlide>-->
<!--      <div class="slide">-->
<!--        <NuxtImg-->
<!--          src="/Group-3.png"-->
<!--          alt="login swiper image"-->
<!--          class="slide-img"-->
<!--        />-->
<!--      </div>-->
<!--    </SwiperSlide>-->
<!--  </Swiper>-->
  <NuxtImg
      src="/Group-1.png"
      alt="login swiper image"
      class="login-img"
  />
</template>

<style scoped></style>
