<script setup>
import pic from "@/assets/images/pic.png";

const cards = [
  {
    date: "2023-10-01",
    text: "تعلّم بذكاء – دليل شامل لاكتساب المعرفة وتطوير المهارات لتحقيق التفوق الأكاديمي والمهني",
    img: pic,

  },
  {
    date: "2023-10-01",
    text: "تعلّم بذكاء – دليل شامل لاكتساب المعرفة وتطوير المهارات لتحقيق التفوق الأكاديمي والمهني",
    img: pic,
 
  },
  {
    date: "2023-10-01",
    text: "تعلّم بذكاء – دليل شامل لاكتساب المعرفة وتطوير المهارات لتحقيق التفوق الأكاديمي والمهني",
    img: pic,

  },
  {
    date: "2023-10-01",
    text: "تعلّم بذكاء – دليل شامل لاكتساب المعرفة وتطوير المهارات لتحقيق التفوق الأكاديمي والمهني",
    img: pic,

  },
];
</script>

<template>
     <!-- sidebar -->
     <div class="sidebar-articles" dir="rtl">
          <h2 class="sidebar-title">آخر المقالات</h2>
          <div
            class="sidebar-page-articles-card"
            v-for="(card, index) in cards"
            :key="index"
          >
            <div class="sidebar-page-articles-card-img">
              <img :src="card.img" :alt="card.text" />
            </div>
            <div class="sidebar-page-articles-card-info">
              <p class="sidebar-date">{{ card.date }}</p>
              <h3 class="sidebar-text">{{ card.text }}</h3>
            </div>
          </div>

        </div>
        <!-- end sidebar -->
</template>
<style scoped>


/* sidebar-articles style */
.sidebar-title {
  font-family: "regular";
  font-weight: 500;
  font-size: 25px;
  text-align: right;
  color: #000000;
}

.sidebar-page-articles-card {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.sidebar-page-articles-card-img img {
  width: 400px;
  height: 100px;
  border-radius: 5px;
  object-fit: cover;
}
.sidebar-date {
  font-family: "regular";
  font-weight: 400;
  font-size: 15px;
  text-align: right;
  color: #8c8896;
}
.sidebar-text {
  font-family: "medium";
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  color: #000000;
}
/* end sidebar-articles style */
</style>