<script setup>
import pen from "@/assets/images/pen.png";

const cards = [
  {
    image: pen,
    desc: "تعلّم بذكاء – دليل شامل لاكتساب المعرفة وتطوير المهارات لتحقيق التفوق الأكاديمي والمهني",
  },
];
</script>

<template>
  <div class="blogs-page-image">
    <div class="image">
      <div class="blogs-page-image-cards">
        <div
          class="blogs-page-image-card"
          v-for="(card, index) in cards"
          :key="index"
        >
          <img :src="card.image" :alt="card.desc" />
        </div>
        <div class="des">
          <div class="blogs-page-des">
            <p
              class="blogs-page-desc"
              v-for="(card, index) in cards"
              :key="index"
            >
              {{ card.desc }}
            </p>
            <p>
              مقدمة النحو هو العمود الفقري للغة العربية، فهو الذي ينظم الكلمات
              داخل الجمل ويعطيها المعنى الصحيح. بدون النحو، قد تختلط المعاني
              وتضيع الدقة اللغوية. سواء كنت طالبًا أو كاتبًا أو حتى محبًا للغة،
              فإن فهم القواعد النحوية يساعدك على التعبير بطريقة صحيحة وواضحة. ما
              هو النحو؟ النحو هو العلم الذي يدرس تكوين الجملة العربية، ويحدد
              وظائف الكلمات فيها، مثل الفاعل والمفعول به والمبتدأ والخبر. يساعد
              النحو في فهم العلاقة بين الكلمات في الجملة، مما يسهل القراءة
            </p>
            
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.blogs-page-image {
  border-radius: 10px;
  background: #f6f6f6;
  margin: 5px 10px;
}

/* .blogs-page-image-card {
  display: flex;
  justify-content: center;
  align-items: center;
} */
.blogs-page-image-card img {
  width: 92%;
  height: 500px;
}

.des {
  display: flex;
  margin: 0 15px;
  padding-top: 45px;
}
</style>
