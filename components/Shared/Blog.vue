<script setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

import Rectangle from "@/assets/images/Rectangle.png";
import Rectangle2 from "@/assets/images/Rectangle2.png";
import Rectangle3 from "@/assets/images/Rectangle3.png";

const cards = [
  {
    id: 1,
    title: "رحلة نحو المعرفة والتفوق",
    text: "مدونتك التعليمية – نافذتك إلى عالم المعرفة",
    img: Rectangle,
    text2:
      "رحلة التعلم لا تتوقف أبدًا! هنا ستجد مقالات تعليمية ملهمة، نصائح دراسية فعالة، وأحدث الاستراتيجيات لمساعدتك على تحقيق التفوق الأكاديمي. استكشف موضوعات متنوعة، اكتسب مهارات جديدة، واستعد لكل تحدٍ تعليمي بثقة",
    date: "2023-10-01",
  },
  {
    id: 2,
    title: "رحلة نحو المعرفة والتفوق",
    text: "مدونتك التعليمية – نافذتك إلى عالم المعرفة",
    img: Rectangle2,
    text2:
      "رحلة التعلم لا تتوقف أبدًا! هنا ستجد مقالات تعليمية ملهمة، نصائح دراسية فعالة، وأحدث الاستراتيجيات لمساعدتك على تحقيق التفوق الأكاديمي. استكشف موضوعات متنوعة، اكتسب مهارات جديدة، واستعد لكل تحدٍ تعليمي بثقة",
    date: "2023-10-01",
  },
  {
    id: 3,
    title: "رحلة نحو المعرفة والتفوق",
    text: "مدونتك التعليمية – نافذتك إلى عالم المعرفة",
    img: Rectangle3,
    text2:
      "رحلة التعلم لا تتوقف أبدًا! هنا ستجد مقالات تعليمية ملهمة، نصائح دراسية فعالة، وأحدث الاستراتيجيات لمساعدتك على تحقيق التفوق الأكاديمي. استكشف موضوعات متنوعة، اكتسب مهارات جديدة، واستعد لكل تحدٍ تعليمي بثقة",
    date: "2023-10-01",
  },
  {
    id: 3,
    title: "رحلة نحو المعرفة والتفوق",
    text: "مدونتك التعليمية – نافذتك إلى عالم المعرفة",
    img: Rectangle3,
    text2:
      "رحلة التعلم لا تتوقف أبدًا! هنا ستجد مقالات تعليمية ملهمة، نصائح دراسية فعالة، وأحدث الاستراتيجيات لمساعدتك على تحقيق التفوق الأكاديمي. استكشف موضوعات متنوعة، اكتسب مهارات جديدة، واستعد لكل تحدٍ تعليمي بثقة",
    date: "2023-10-01",
  },
];
const splideOptions = {
  type: "slide",
  perPage: 3,
  gap: "3px",
  pagination: false,
  arrows: false,
  drag: true,
  cloneStatus: true, 
  
};

</script>

<template>
  <div class="Blog" dir="rtl">
    <div class="slider-wrapper pt-md">
      <p class="slider-heading">المدونه</p>
      <h3 class="slider-heading1">تعرف علي آخر أخبارنا</h3>
      <p class="slider-text">
        قم بتطوير مهارة مهنية محددة من خلال سلسلة من الدورات التدريبية المترابطة
      </p>

      <Splide :options="splideOptions" class="splide-container" >
        <SplideSlide v-for="(card, index) in cards" :key="index">
          <div class="card">
            <img :src="card.img" alt="Card image" class="course-image" />
            <div class="card-body">
              <div class="card-header">
                <hr />
                <h5 class="card-title">{{ card.title }}</h5>
                <div class="card-date">
                  <p>{{ card.date }}</p>
                </div>
              </div>
              <p class="card-text">{{ card.text }}</p>
              <div class="card-footer">
                <P > {{ card.text2 }}</P>
              </div>
            </div>
          </div>
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>
<style scoped>
/* heading */

.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
}
.card-header hr {
  width: 41px;
  height: 3px;
  border-radius: 4px;
  background: #ff931e;
  border: none;
}
.slider-heading {
  width: 227px;
  height: 25px;
  gap: 10px;
  padding-right: 10px;
  padding-left: 10px;
  background: linear-gradient(
    360deg,
    rgba(255, 185, 73, 0.5) -102%,
    #ffffff 48%
  );
  font-family: "medium";
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #ffb949;
}
.slider-heading1 {
  font-size: 35px;
  color: #222;
  text-align: center;
  margin-bottom: 2px;
  line-height: 200%;
  letter-spacing: 0%;
  vertical-align: middle;
  font-family: "medium";
  font-weight: 700;
}

.card-date p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a3adbb;
  direction: ltr;
  font-weight: 400;
  font-size: 14px;
  text-transform: capitalize;
  font-family: "regular";
}

.card-date p::after {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 8px;
  background: #a3adbb;
  border-radius: 50%;
}

.slider-text {
  font-weight: 400;
  font-size: 18px;
  vertical-align: middle;
  color: #737e8a;
  font-family: "regular";
  margin-bottom: 10px;
  font-family: "regular";
}

/* splide style */
.splide-container {
  width: 86%;
  height: 100%;
  padding-bottom: 30px;
}

.splide-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* card */
.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  width: 92%;
}
.card img {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 30px;
  text-align: right;
  margin: 0;
  font-family: "bold";
}

.card-text {
font-weight: 700;
font-size: 18px;

color: #000000;
font-family: "medium";
margin-top: 8px;

}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.card-footer p{
font-weight: 400;
font-size: 14px;
font-family: "regular";
margin-top: 2px;
color: #656B78;
line-height: 170%;
}
.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
}

/* splide buttons */

.splide__arrow--prev {
  left: -30px;
}

.splide__arrow--next {
  right: -30px;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #ccc;
}
</style>
