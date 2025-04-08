<script setup>
import book from "@/assets/images/book.png";
import microphone from "@/public/icons/microphone.vue";
import user from "@/public/icons/user.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";

const cards = [
  { id: 1, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 2, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 3, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 4, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 5, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 6, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 7, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 8, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
  { id: 9, title: "كورس مراجعه النحو مادة اللغه العربيه", img: book, text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة" },
];
</script>

<template>
  <div class="card-course-three">
    <div class="cards-wrapper">
      <div class="cards-container">
        <div class="card" v-for="(card, index) in cards" :key="index">
          <div class="image-container">
            <img :src="card.img" alt="Card image" class="course-image" />
            <p class="overlay-text">1500 جنيه</p>
          </div>
          <div class="card-body" dir="rtl">
            <h5 class="card-title">{{ card.title }}</h5>
            <div class="card-content">
              <p class="card-text1"><video1 /> 20 ملف ورقي</p>
              <p class="card-text1"><note /> 20 ملف ورقي</p>
              <p class="card-text1"><microphone /> 20 ملف ورقي</p>
            </div>
            <div class="card-footer">
              <p class="card-text">{{ card.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 100vh; 
}

.slider-heading {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 أعمدة متساوية */
  gap: 20px;
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin-bottom: 50px; /* إضافة هامش سفلي لتجنب التداخل مع الفوتر */
}

.card {
  width: 81%;
  height: auto;
  
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}



.image-container {
  position: relative;
}

.course-image {
  width: 100%;
  height: auto;
}

.overlay-text {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
}

.card-body {
  padding: 15px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.card-content {
  margin-top: 10px;
}

.card-text1 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}

.card-footer {
  margin-top: 15px;
}

.card-text {
  font-size: 0.9rem;
  color: #555;
}


</style>

<style>
@import "swiper/css";
@import "swiper/css/navigation";
</style>