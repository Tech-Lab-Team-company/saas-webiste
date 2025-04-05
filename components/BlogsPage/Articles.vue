<script setup>
import pic from "@/assets/images/pic.png";

const cards = [
  {
    date: "2023-10-01",
    text: "تعلّم بذكاء – دليل شامل لاكتساب المعرفة وتطوير المهارات لتحقيق التفوق الأكاديمي والمهني",
    img: pic,
  },
];
</script>

<template>
  <div class="blogs-page-articles">
    <div class="container">
      <div class="grid-container">
        <!-- الجزء الأيسر لعرض المقالات -->
        <div class="blogs-page-articles-cards">
         
        </div>

        <!-- الجزء الأيمن لعرض محتوى آخر (مثال للقائمة الجانبية) -->
        <div class="sidebar" dir="rtl">
            <h2> آخر المقالات</h2>
            <div class="blogs-page-articles-card" v-for="card in cards" :key="card.id">
              <div class="blogs-page-articles-card-img">
                <img :src="card.img" alt="card.title" />
              </div>
              <div class="blogs-page-articles-card-info">
                <p>{{ card.date }}</p>

                <h3>{{ card.text }}</h3>
              </div>
            </div>
        
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 4fr 1fr; 
  gap: 20px;
  
}


.sidebar {
border-radius: 18px;
width: 450px;
padding: 24px;
background: #F6F6F6;
margin:5px 10px ;

}

.blogs-page-articles-card {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.blogs-page-articles-card-img img {
    width: 450px;
height: 130px;
    border-radius: 5px;
    object-fit: cover;
    

}

.blogs-page-articles-card-info {
  flex-grow: 1;
}

.blogs-page-articles-card-btns button {
  margin-right: 10px;
}

.blogs-page-articles-btns {
  margin-top: 20px;
}
</style>
