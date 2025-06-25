<script setup lang="ts">
import { baseUrl } from "~/constant/baseUrl";
import type CoursesFilterModel from "~/features/CoursesFilter/Data/models/courses_filter_model";
const props = defineProps<{
  HomeSections: CoursesFilterModel[];
}>();

const { locale } = useI18n();
const UserSetting = useSettingStore();
</script>
<template>
  
  <!-- <pre>{{ props.HomeSections }}</pre> -->
  <div class="card-course">
    <div
      class="cards-wrapper"
    >
      <div class="cards-grid">
        <NuxtLink
          v-for="card in props.HomeSections"           
          :key="card.id"
          :to="`/course/${card.id}`"
          class="card"
          
          :style="{ backgroundImage: `url(${card.image.img|| UserSetting.setting?.image?.img})` }"
        >
          <!-- <div class="image-container">
  
              <img :src="card.image.img || ''" alt="course image" class="card-image" />
            </div> -->
          <div class="card-body" dir="rtl">
            <div class="card-header">
              <h5 class="card-title">{{ card.title }}</h5>
              <p class="card-number" v-if="card.course_price > 0 && !(card.is_subscribed)">{{ card.course_price }} {{ card?.currency }}</p>
               <p class="salary" v-else-if="card?.is_subscribed">تم شراء الكورس</p>
              <p class="card-number" v-else>{{$t('مجانى') }}</p>
            </div>
            <p class="card-text" v-html="card.description"></p>
            <div class="card-footer">
              <span class="card-icon">
                <img
                  :src="card.teacher?.image?.img"
                  :alt="card.teacher?.image?.alt"
                  class="teacher-image"
                />
              </span>
              <span class="card-name">{{ card.teacher?.name }}</span>
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



.card-footer {
    .card-icon 
    {
    .teacher-image{
      max-width: 50px;
    }
  }

}
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
  margin-left: auto;
  margin-right: auto;
  justify-items: start; 
  direction: rtl;
}

@media(max-width:768px){
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media(max-width:500px){
  .cards-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.card {
  position: relative;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 320px;
  width: 100%; 
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
  font-size: 1.1rem;
  letter-spacing: 0%;
  text-align: right;
  color: #ffffff;
  margin: 0;
  font-family: "bold",serif;
}

.card-number {
  background: #ffb949;
  // width: 100px;
  border-radius: 20px;
  text-align: center;
  padding: 4px 5px;
  font-weight: 500;
  font-size: 14px;
  font-family: "regular",serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-text {
  color: #dde1e6;
  font-weight: 400;
  font-size: 1rem;
  text-align: right;
  border-bottom: 1px solid #dde1e6;
  font-family: "regular",serif;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 2em);
  line-height: var(--line-height);
  --line-height: 1.5;
  * {
    font-size: 1rem;
  }
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
  font-family: "bold",serif;
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
