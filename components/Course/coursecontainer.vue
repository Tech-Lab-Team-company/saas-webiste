<script setup>
import english from "@/assets/images/english.png";
import user from "@/public/icons/user.vue";
import Arrrow from "@/public/icons/Arrrow.vue";
import { HomeHomeEducationStages, NuxtLink } from "#components";

const cards = [
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
];
</script>

<template>
  <HomeHomeEducationStages />
  <div class="card-course">
    <div>
      <p class="cards-heading">(6)جميع الكورسات</p>
    </div>
    <div class="cards-wrapper">
      <div class="cards-grid">
        <NuxtLink
          :to="`/course/${card.id}`"
          v-for="(card, index) in cards"
          :key="index"
          class="card"
          :style="{ backgroundImage: `url(${card.img})` }"
        >
          <div class="card-body" dir="rtl">
            <div class="card-header">
              <h5 class="card-title">{{ card.title }}</h5>
              <p class="card-number">{{ card.number }}</p>
            </div>
            <p class="card-text">{{ card.text }}</p>
            <div class="card-footer">
              <span class="card-icon">
                <component :is="card.icon" />
              </span>
              <span class="card-name">{{ card.name }}</span>
            </div>
            <div class="card-extra-content">
              <Arrrow />
              <p>ابدا الان</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cards-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.cards-heading {
  font-size: 25px;
  color: #222;
  margin-bottom: 20px;
  font-weight: 400;
  font-family: "regular";
  text-align: right;
  width: 87%;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 80%;
}

.card {
  position: relative;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 320px;
  /* width: 92%; */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-size: cover;
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
}

.card:hover::before {
  height: 70%;
}

.card-body {
  position: relative;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  padding: 1rem 1.5rem;
  transform: translateY(50px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(0);
  }

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000, $alpha: 0.7);
    z-index: -1;
    transition: height 0.3s ease;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-title {
  font-weight: 700;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #ffffff;
  margin: 0;
  font-family: "bold";
}

.card-number {
  background: #ffb949;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  padding: 4px 5px;
  font-weight: 500;
  font-size: 14px;
  font-family: "regular";
}

.card-text {
  color: #dde1e6;
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  border-bottom: 1px solid #dde1e6;
  font-family: "regular";
  margin: 10px 0;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "bold";
  margin: 0px 10px;
}

.card-extra-content {
  border-top: 1px solid #dde1e6;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0px;
}

.card-extra-content p {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "bold";
  cursor: pointer;
  margin: 0px 10px;
}

.card-extra-content svg {
  cursor: pointer;
  margin: 0px 10px;
  padding-top: 4px;
}
</style>
