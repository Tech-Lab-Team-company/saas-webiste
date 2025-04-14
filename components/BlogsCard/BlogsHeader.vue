<script setup>
import { NuxtLink } from "#components";
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
    id: 4,
    title: "رحلة نحو المعرفة والتفوق",
    text: "مدونتك التعليمية – نافذتك إلى عالم المعرفة",
    img: Rectangle,
    text2:
      "رحلة التعلم لا تتوقف أبدًا! هنا ستجد مقالات تعليمية ملهمة، نصائح دراسية فعالة، وأحدث الاستراتيجيات لمساعدتك على تحقيق التفوق الأكاديمي. استكشف موضوعات متنوعة، اكتسب مهارات جديدة، واستعد لكل تحدٍ تعليمي بثقة",
    date: "2023-10-01",
  },
];
</script>

<template>
  <NuxtLink :to="`/blogs/${id}`" class="blogs-page-articles-cards" dir="rtl">
    <div class="Blog" dir="rtl">
      <div class="cards-container">
        <div class="card" v-for="(card, index) in cards" :key="index">
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
              <p>{{ card.text2 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.blogs-page-articles-cards {
  border-radius: 18px;
  height: auto;
  padding: 24px;
  background: #f6f6f6;
  margin: 5px 10px;
  width: 95%;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(10px);
}

.card img {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border: 1px solid #ccc;
}

.card-body {
  padding: 20px;
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

.card-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 30px;
  text-align: right;
  margin: 0;
  font-family: "bold";
}

.card-date p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a3adbb;
  direction: ltr;
  font-weight: 400;
  font-size: 14px;
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

.card-footer p {
  font-weight: 400;
  font-size: 14px;
  font-family: "regular";
  margin-top: 2px;
  color: #656b78;
  line-height: 170%;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #ccc;
}
</style>
