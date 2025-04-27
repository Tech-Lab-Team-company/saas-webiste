<script setup lang="ts">
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
const props = defineProps<{
  HomeSections: HomeFirstSection[];
}>();
</script>
<template>
  <div class="card-course">
    <div
      class="cards-wrapper"
      v-for="section in props.HomeSections"
      :key="section.id"
    >
      <div class="cards-grid">
        <NuxtLink
          v-for="card in section.courses"
          :key="card.id"
          :to="`/course/${card.id}`"
          class="card"
          :style="{ backgroundImage: `url(${card.image.img})` }"
        >
          <div class="card-body" dir="rtl">
            <div class="card-header">
              <h5 class="card-title">{{ card.title }}</h5>
              <p class="card-number">{{ card.course_price }}</p>
            </div>
            <p class="card-text">{{ card.description }}</p>
            <div class="card-footer">
              <span class="card-icon">
                <img
                  :src="card.teacher.image.img"
                  :alt="card.teacher.image.alt"
                  class="teacher-image"
                />
              </span>
              <span class="card-name">{{ card.teacher.name }}</span>
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
  // display: flex;
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
  background-size: cover;
  background-position: center;
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
  font-size: 21px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #ffffff;
  margin: 0;
  font-family: "bold";
}

.card-number {
  background: #ffb949;
  // width: 100px;
  border-radius: 20px;
  text-align: center;
  padding: 4px 5px;
  font-weight: 500;
  font-size: 14px;
  font-family: "regular";
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 5px 1px;
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
  padding: 2px 5px;
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
