<script setup lang="ts">
import {Splide, SplideSlide} from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import {baseUrl} from "~/constant/baseUrl";
import type HomeFirstSection from '~/types/home_first_section';
import {SectionTypeEnum} from "../Home/home/enum/section_type_enum";
import StagesTitle from '../Home/home/StagesTitle.vue'

const splideOptions = {
  perPage: 3,
  gap: "3px",
  pagination: false,
  perMove: 1,
  arrows: true,
  drag: true,
  cloneStatus: true,
  range: false,
};


const BlogsData = ref<HomeFirstSection[] | null>(null)

const {data: Blogs} = await useAsyncData("BlogsHome", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_blogs`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": "hrarabians.org",
    },
    // body:{
    //     type:SectionTypeEnum.Blog
    // }

  });

  console.log(response.data, "response.data inside blogs")

  return response.data;
});

</script>

<template>
  <div class="Blog" dir="rtl">
    <div class="slider-wrapper pt-md">

      <div class="stage-container">
        <div class="stages student-stages">

          <StagesTitle
              :maintitle="`المدونه`"
              :title="Blogs?.title"
              :subtitle="Blogs?.subtitle"
          />
        </div>
      </div>

      <Splide :options="splideOptions" class="splide-container">
        <!-- {{ console.log(Blogs) }} -->
        <SplideSlide v-for="(blog, index) in Blogs" :key="index">

          <NuxtLink :to="`/blogs/hashtag/${blog.id}`" class="card">
            <img :src="blog.attachments[0].file" alt="Card image" class="course-image"/>
            <div class="card-body">
              <div class="card-header">
                <hr/>
                <div class="flex">
                  <h5 class="card-title" v-html="blog.title"></h5>
                  <div class="card-date">
                    <p>{{ blog.date }}</p>
                  </div>
                </div>
              </div>
              <p class="card-text" v-html="blog.description"></p>
              <div class="card-footer">
                <P v-html="blog.subtitle"></P>
              </div>
            </div>
          </NuxtLink>

        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>


<style scoped>
/* heading */
.card {
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(10px);
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.card-header hr {
  width: 10%;
  height: 3px;
  border-radius: 4px;
  background: #ff931e;
  border: none;
}

.slider-heading {
  width: 227px;
  height: 25px;
  gap: 10px;
  padding-right: 10px;
  padding-left: 10px;
  background: linear-gradient(
      360deg,
      rgba(255, 185, 73, 0.5) -102%,
      #ffffff 48%
  );
  font-family: "medium";
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #ffb949;
}

.slider-heading1 {
  font-size: 35px;
  color: #222;
  text-align: center;
  margin-bottom: 2px;
  line-height: 200%;
  letter-spacing: 0%;
  vertical-align: middle;
  font-family: "medium";
  font-weight: 700;
}

.card-date {
  width: 40%;
}

.card-date p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a3adbb;
  direction: ltr;
  font-weight: 400;
  font-size: 14px;
  text-transform: capitalize;
  font-family: "regular";
}

.card-date p::after {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 8px;
  background: #a3adbb;
  border-radius: 50%;
}

.slider-text {
  font-weight: 400;
  font-size: 18px;
  vertical-align: middle;
  color: #737e8a;
  font-family: "regular";
  margin-bottom: 10px;
  font-family: "regular";
}

/* splide style */
.splide-container {
  width: 86%;
  height: 100%;
  padding-bottom: 30px;
}

.splide-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* card */
.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  width: 92%;
}

.card img {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-weight: 700;
  width: 60%;
  font-size: 1rem;
  text-align: right;
  margin: 0;
  font-family: "bold", serif;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 1em);
  line-height: var(--line-height);
  --line-height: 1.5;

}

.card-text {
  font-weight: 700;
  font-size: 0.8rem;
  color: #000000;
  font-family: "medium", serif;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 2em);
  line-height: var(--line-height);
  --line-height: 1.5;
}


.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-footer p {
  font-weight: 400;
  font-size: 14px;
  font-family: "regular";
  margin-top: 2px;
  color: #656B78;
  line-height: 170%;
}

.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
}

/* splide buttons */

.splide__arrow--prev {
  left: -30px;
}

.splide__arrow--next {
  right: -30px;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #ccc;
}
</style>
