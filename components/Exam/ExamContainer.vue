<script setup>
import english from "@/assets/images/english.png";
import user from "@/public/icons/user.vue";
import iconcontainer from "@/public/icons/iconcontainer.vue";
import { HomeHomeEducationStages, NuxtLink } from "#components";

import heart from "@/public/icons/heart.vue";

const cards = [

  {
    title: "  كورس مراجعه النحو مادة اللغه العربيه",
    text: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى لقد تم توليد هذا النص من مولد النص العربىهذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى لقد تم توليد هذا النص من مولد النص العربىهذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى لقد تم توليد هذا النص من مولد النص العربى",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "اشتراك شهري",
  },
];

const cardd = [
  {
    title: "بنك اسئله ملخص النحو",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "اشتراك شهري",
    train: "تدربت منهم علي ",
    true: "الاجابات الصحيحه ",
    false: "الاسئله الخطأ ",
    qusetion: "50 سؤال",
    qusetion2: "20 سؤال",
    qusetion1: "30 سؤال",
    heart: heart, 
}]

const { locale } = useI18n();
</script>

<template>
  <!-- <HomeHomeEducationStages /> -->
  <div class="card-course-exam">
    <div class="cards-wrapper">
      <div class="cards-grid">
        <NuxtLink
          :to="`/course/${card.id}`"
          v-for="(card, index) in cards"
          :key="index"
          class="card"
        >
          <div class="card-inner" dir="rtl">
            <div class="image-container">
              <img :src="card.img" alt="course image" class="card-image" />
            </div>

            <div class="card-body">
              <div class="card-header">
                <div class="card-icon">
                  <iconcontainer :icon="card.icon" />
                  <h5 class="card-title">{{ card.title }}</h5>
                </div>
              </div>
              <p class="card-text">{{ card.text }}</p>
              <hr />
              <!-- <div class="card-results">
                <div class="card-stats">
                  <div class="correct">
                    <span>{{ card.true }}</span>
                    <p>{{ card.qusetion1 }}</p>
                  </div>
                  <div class="wrong">
                    <span>{{ card.false }}</span>
                    <p>{{ card.qusetion2 }}</p>
                  </div>
                </div>
                <component :is="card.heart" />
                <div class="card-progress">
                  <div class="train-info">
                    <p class="train-text">{{ card.train }}</p>
                    <p class="train-count">{{ card.qusetion }}</p>
                  </div>
                </div>
              </div> -->

              <div class="card-footer">
                <span class="card-icon">
                  <span class="card-name">{{ card.name }}</span>
                </span>
                <p class="card-number">{{ card.number }}</p>
              </div>

              <div class="card-button">
                <button>الغاء طلب الانضمام</button>
              </div>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink
          :to="`/course/${card.id}`"
          v-for="(card, index) in cardd"
          :key="index"
          class="card"
        >
          <div class="card-inner" dir="rtl">
            <div class="image-container">
              <img :src="card.img" alt="course image" class="card-image" />
            </div>

            <div class="card-body">
              <div class="card-header">
                <div class="card-icon">
                  <iconcontainer :icon="card.icon" />
                  <h5 class="card-title">{{ card.title }}</h5>
                </div>
              </div>
              <p class="card-text">{{ card.text }}</p>
              <div class="card-footer">
                <span class="card-icon">
                  <span class="card-name">{{ card.name }}</span>
                </span>
                <p class="card-number">{{ card.number }}</p>
              </div>
              <hr />
              <div class="card-results">
                <div class="card-stats">
                  <div class="correct">
                    <span>{{ card.true }}</span>
                    <p>{{ card.qusetion1 }}</p>
                  </div>
                  <div class="wrong">
                    <span>{{ card.false }}</span>
                    <p>{{ card.qusetion2 }}</p>
                  </div>
                </div>
                <component :is="card.heart" />
                <div class="card-progress">
                  <div class="train-info">
                    <p class="train-text">{{ card.train }}</p>
                    <p class="train-count">{{ card.qusetion }}</p>
                  </div>
                </div>
              </div>

             

              <div class="card-button">
                <button>  يلا كمل تدريبك</button>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-results {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 15px;
  gap: 20px;
}

.card-stats {
  display: grid;
  flex-direction: column;
  justify-content: space-between;
  gap: 5rem;
  justify-items: center;

  span {
    font-weight: 700;
    font-size: 16px;
    font-family: "bold";
    size: 18px;
  }

  .correct {
    color: #08851b;
    display: flex;
    align-items: center;
    gap: 3rem;
  }
  .correct p {
    color: #000;
  }

  .wrong {
    color: #be2426;
    display: flex;
    align-items: center;
    gap: 5rem;
  }

  .wrong p {
    color: #000;
  }
}

.card-progress {
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 60px;
    height: 60px;
  }

  .train-info {
    display: grid;
    justify-items: center;
    gap: 1rem;

    .train-text {
      color: #ffa500;
      font-weight: bold;
      font-size: 16px;
      margin: 0;
    }

    .train-count {
      color: #000;
      margin: 0;
      font-size: 14px;
    }
  }
}

hr {
  border: 1px solid #dde1e6;
}
.card-course-exam {
  background: #f6f6f6;
}
.card {
  display: flex;
  border-radius: 15px;
  background: white;
}
.card-icon {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.card-inner {
  display: flex;
  width: 98%;
  height: auto;
  // align-items: start;
  flex-direction: row;
}
.image-container {
  position: relative;
  width: 48%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-image {
  width: 100%;
  height: 100%;
}

.cards-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.cards-grid {
  display: grid;
  gap: 20px;
  width: 90%;
}

.card {
  position: relative;
  background: white;
  border-radius: 55px;
  overflow: hidden;
  // height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-size: cover;
  height: auto;
}

.card-body {
  position: relative;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 95%;
  padding: 1rem 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-title {
  font-weight: 400;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #000;
  margin: 0;
  font-family: "regular";
}

.card-number {
  color: var(--secondary-color);
  width: 100px;
  border-radius: 20px;
  text-align: center;
  padding: 4px 5px;
  font-weight: 500;
  font-size: 24px;
  font-family: "regular";
}

.card-text {
  color: #656b78;
  font-weight: 400;
  font-size: 18px;
  text-align: right;
  font-family: "regular";
  // margin: 10px 0;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 5px 1px;
  justify-content: space-between;
}

.card-name {
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "regular";
  // margin: 0px 10px;
  color: #000;
}

.card-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.card-button button {
  background: #ffff;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 18px;
  color: #000;
  border: none;
  border: 1px solid #000;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}
.card-button button:hover {
  border: 1px solid #ff9f00;
  background-color: #ff9f00;
  color: #fff;
}
.card-button button:focus {
  outline: none;
}
</style>
