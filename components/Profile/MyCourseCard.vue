<script setup lang="ts">
import arabic_three from "@/assets/images/arabic_three.png";
import note_one from "@/public/icons/note_one.vue";
import note_two from "@/public/icons/note_two.vue";
import user from "@/public/icons/user.vue";
import CoursesParams from "~/features/FetchCourses/Core/Params/courses_params";
import CoursesModel from "~/features/FetchCourses/Data/models/courses_model";
import CoursesController from "~/features/FetchCourses/presentation/controllers/courses_controller";

// const cards = [
//   {
//     id: 1,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 70,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 2,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 50,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 3,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 90,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 4,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 30,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 5,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 85,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 6,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 60,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 7,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 45,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 8,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 75,
//     name: "أحمد حوام",
//     icon: user,
//   },
//   {
//     id: 9,
//     title: "كورس مراجعه النحو مادة اللغه العربيه",
//     img: arabic_three,
//     text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
//     progress: 20,
//     name: "أحمد حوام",
//     icon: user,
//   },
// ];



const courseParams = new CoursesParams("2");
const coursesController = CoursesController.getInstance();
const state = await coursesController.FetchCourses(courseParams);


watch(
  () => coursesController.state.value,
  (newValue) => {
    state.value = newValue;
  },
  { deep: true },)

</script>

<template>
  <GlobalDataStatues :status="state">
  <template #initial>
    loader
  </template>
  <template #loader>
    loader
  </template>
  <template #success>
    <div class="profile-home">
    <div class="slider-wrapper">
      <div class="cards-container">
        <div class="card" v-for="(course, index) in state.data" :key="index">
          <div class="image-container">
            <img :src="course.img" alt="Card image" class="course-image" />
            
            <p class="overlay-text">{{ course.subject.title }}</p>
          </div>
          <div class="card-body" dir="rtl">
            <h5 class="card-title">{{ course.title }}</h5>
            <div class="card-content">
              <p class="card-text">{{ course.subtitle }}</p>
            </div>
            <div class="card-one_footer">
              <div class="card-text1">
                <p class="card-text1"><note_one />{{ course.videos_number }} فيديو</p>
                <p class="card-text1"><note_two />{{ course.docs_number }} ملف ورقي</p>
              </div>
              <div class="progress-container">
                <div class="progress-bar">
                  <div
                    class="progress"
                    :style="{ width: course.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-percentage">{{ course.progress }}%</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="card-icon flex">
                <!-- <component :is="card.icon" /> -->
                 <img :src="course.teacher.image.image" :alt="course.teacher.image.alt">
              </span>
              <span class="card-name">{{course.teacher.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>

</GlobalDataStatues>

 
</template>


<style scoped>
.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slider-heading {
  font-size: 35px;
  color: #222;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 800;
  line-height: 200%;
  letter-spacing: 0%;
  vertical-align: middle;
  font-family: "bold";
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 90%;
  gap: 10px;
  width: 90%;
  justify-items: center;
  align-items: center;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 97%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  width: 87%;
}

.card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.card-body {
  margin: 10px 10px;
}

.card-title {
  font-family: "bold";
  font-weight: 700;
  font-size: 19px;
  text-align: right;
}

.card-number {
  background: #ffb949;
  width: 100px;
  border-radius: 20px;
  text-align: center;
}

.image-container {
  position: relative;
  width: 100%;
  padding: 0;
}

.course-image {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.overlay-text {
  position: absolute;
  top: 15%;
  left: 18%;
  transform: translate(-50%, -50%);
  padding: 4px;
  border-radius: 20px;
  background: #ffb949;
  width: 95px;
  height: 35px;
  font-family: "bold";
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}

.card-content {
  display: flex;
  justify-content: space-between;
  margin: 5px 0px;
}

.card-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  color: #656b78;
  font-family: "regular";
}

.card-text1 {
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  display: flex;
  gap: 5px;
  font-family: "regular";
  color: #737e8a;
}

.card-one_footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 10px 0;
}
.card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #c2c2c2;
  padding: 10px 0;
}
.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  font-family: "bold";
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.progress-bar {
  flex-grow: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #ffb949;
  transition: width 0.3s ease;
}

.progress-percentage {
  font-weight: 400;
  font-size: 14px;
  color: #737e8a;
  font-family: "regular";
}

/* Responsive Design */
@media (max-width: 1440px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
    width: 80%;
  }
  .card {
    width: 100%;
  }
}
@media (max-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
    width: 70%;
  }
  .card {
    width: 90%;
  }
}

@media (max-width: 767px) {
  .cards-container {
    grid-template-columns: 1fr;
    width: 90%;
  }
  .card {
    width: 97%;
  }
}
</style>

<style>
@import "swiper/css";
@import "swiper/css/navigation";
</style>







