<script setup lang="ts">
import RightDots from '~/public/icons/RightDots.vue';
import {ref} from 'vue';
import ContentIcon from '~/public/icons/contentIcon.vue';
import examsicon from '~/public/icons/examsicon.vue';
import exterinalurls from '~/public/icons/exterinalurls.vue';
import wifiIcon from '~/public/icons/wifiIcon.vue';
import homeworkicon from '~/public/icons/homeworkicon.vue';
import CourseDetailsParams from '~/features/FetchCourseDetails/Core/Params/course_details_params';
import CourseDetailsController from '~/features/FetchCourseDetails/presentation/controllers/course_details_controller';
import type CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';

const value = ref('0');
const route = useRoute()
const tab_value = ref('content');
const activetab = ref({});
const videoLink = ref({
  videoLink: "",
  title: "",
  description: ""
})


// const id = ref<string>(<string>route.params.id)

const CardData = ref<CourseDetailsModel | null>(null);


const FetchCourseDetails = async () => {
  const courseDetailsParams = new CourseDetailsParams(route.params.id as string);
  const courseDetailsController = CourseDetailsController.getInstance();
  const state = await courseDetailsController.FetchCourseDetails(courseDetailsParams);

  if (state.value.data) {
    // console.log(state.value.data , "Course Details")
    CardData.value = state.value.data
  }

  // console.log(CardData.value)
}


onMounted(() => {
  FetchCourseDetails();
})


const Data = (data: { activetabvalue: number, link: string, title: string, description: string }) => {
  console.log(data, "data")
  activetab.value = data.activetabvalue;
  videoLink.value.videoLink = data.link;
  videoLink.value.title = data.title;
  videoLink.value.description = data.description;
}


</script>

<template>


  <div v-if="activetab==0">
    <CourseDetailsCourseVideo
        :CourseData="CardData"
        :CourseVideoLink="videoLink"
    />
  </div>

  <div v-if="activetab!=0">
    <CourseDetailsCourseCard
        :CourseData="CardData"
        :status="CardData?.allow_status"
    />

  </div>

  <div class="course-tabs">
    <RightDots class="right-dots"/>
    <RightDots class="left-dots"/>

    <div class="tabs-container">
      <div class="tabs-header">
        <div class="tab-title" v-if="CardData?.homeworks?.length" @click="tab_value = 'homework'" :class="tab_value === 'homework' ? 'active-tab' : ''">
          <homeworkicon/>
          <p>الواجب المنزلي</p>
        </div>
        <div class="tab-title" v-if="CardData?.lives?.length" @click="tab_value = 'live'" :class="tab_value === 'live' ? 'active-tab' : ''">
          <wifiIcon/>
          <p>بث مباشر </p>
        </div>
        <div class="tab-title" v-if="CardData?.externalLinks?.length" @click="tab_value = 'urls'" :class="tab_value === 'urls' ? 'active-tab' : ''">
          <exterinalurls/>
          <p>روابط خارجيه </p>
        </div>
        <div class="tab-title" v-if="CardData?.exams?.length" @click="tab_value = 'exams'" :class="tab_value === 'exams' ? 'active-tab' : ''">
          <examsicon/>
          <p>الامتحانات </p>
        </div>
        <div class="tab-title" v-if="CardData?.units" @click="tab_value = 'content'" :class="tab_value === 'content' ? 'active-tab' : ''">
          <ContentIcon/>
          <p>المحتوى</p>
        </div>


      </div>

      <hr/>

      <div class="tabs-content">
        <div v-if="tab_value === 'homework'">
          <CourseDetailsTabsContentCourseHomework
              :CourseData="CardData?.homeworks"
          />
        </div>
        <div v-if="tab_value === 'content'">
          <CourseDetailsTabsContentCourseContent
              @coursechanged="Data"
              :CourseData="CardData?.units"
          />
        </div>
        <div v-if="tab_value === 'urls'">
          <CourseDetailsTabsContentCourseUrls
              :CourseData="CardData?.externalLinks"
          />
        </div>
        <div v-if="tab_value === 'live'">
          <CourseDetailsTabsContentCourseLive
              :CourseData="CardData?.lives"
          />
        </div>
        <div v-if="tab_value === 'exams'">
          <CourseDetailsTabsContentCourseExam
              :CourseData="CardData?.exams"
          />
        </div>
      </div>

    </div>

  </div>

</template>

<style scoped></style>

