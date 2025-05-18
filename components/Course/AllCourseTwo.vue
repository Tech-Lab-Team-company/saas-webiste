<script setup lang="ts">
import Arrroww from "@/public/icons/Arrroww.vue";
import microphone from "@/public/icons/microphone.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";
import type HomeFirstSection from "~/types/home_first_section";

const props = defineProps<{
  HomeSections: HomeFirstSection[];
}>();
</script>

<template>
  <div class="card-course-twoo">
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
        >
          <div class="card-inner" dir="rtl">
            <div class="image-container">
    
              <img :src="card.image.img || ''" alt="course image" class="card-image" />
            </div>

            <div class="card-body">
              <div class="card-header">
                <h5 class="card-title">{{ card.title }}</h5>
              </div>

              <p class="card-text">{{ card.description }}</p>

              <div class="card-content">
                <p class="card-text1">
                  <video1 />
                  فيديو
                </p>
                <p class="card-text1">
                  <note />
                  ملف ورقي
                </p>
                <p class="card-text1">
                  <microphone />
                  ملف صوتى
                </p>
              </div>

              <div class="card-footer">
                <span class="card-icon">
                  <img
                  :src="card.teacher.image.img"
                  :alt="card.teacher.image.alt"
                  class="teacher-image"
                />
                  <span class="card-name">{{ card.teacher.name }}</span>
                </span>
                <p class="card-number">{{ card.course_price }}</p>
              </div>

              <div class="card-extra-content">
                <Arrroww />
                <p>ابدا الان</p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.card-course-twoo{
  width:100%;
}
.card {
  display: flex;
  border-radius: 15px;
  background: white;
}

@media(max-width: 768px) {
  .card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

}

.card-inner {
  display: flex;
  width: 98%;
  height: 95%;
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
  height: 95%;
}

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
  gap: 20px;
  width: 90%;
}

.card {
  position: relative;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  // height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-size: cover;
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
  font-weight: 700;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #000;
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
  color: #656b78;
  font-weight: 400;
  font-size: 16px;
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
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "bold";
  // margin: 0px 10px;
  color: #000;
}

.card-extra-content {
  border-top: 1px solid #dde1e6;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  // padding: 2px 5px;
}

.card-extra-content p {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: #000000;
  font-family: "bold";
  cursor: pointer;
  margin: 0px 10px;
}

.card-extra-content svg {
  cursor: pointer;
  padding-top: 4px;
  color: #000000;
}
.card-content {
  display: flex;
  gap: 2rem;
  // margin-top: 10px;
}
.card-text1 {
  color: #737e8a;
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  font-family: "regular";
  display: flex;
  gap: 5px;
}
.card-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
