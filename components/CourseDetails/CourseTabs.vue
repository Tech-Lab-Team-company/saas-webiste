<script setup lang="ts">    
    import RightDots from '~/public/icons/RightDots.vue';
    import { ref } from 'vue';
import ContentIcon from '~/public/icons/contentIcon.vue';
import examsicon from '~/public/icons/examsicon.vue';
import exterinalurls from '~/public/icons/exterinalurls.vue';
import wifiIcon from '~/public/icons/wifiIcon.vue';
import homeworkicon from '~/public/icons/homeworkicon.vue';

    const value = ref('0');

    const tab_value = ref('content');
    const activetab = ref(1);

</script>

<template>

    

    <div v-if="activetab==0">
        <CourseDetailsCourseVideo />
    </div>

    <div v-if="activetab!=0">
       <CourseDetailsCourseCard />
    </div>

    <div class="course-tabs">
        <RightDots class="right-dots" />
        <RightDots class="left-dots" />

        <div class="tabs-container">
            <div class="tabs-header">
           
                <div class="tab-title" @click="tab_value = 'homework'" :class="tab_value === 'homework' ? 'active-tab' : ''">
                    <homeworkicon />
                    <p>الواجب المنزلي</p>
                </div>
                <div class="tab-title" @click="tab_value = 'live'" :class="tab_value === 'live' ? 'active-tab' : ''">
                    <wifiIcon />
                    <p>بث مباشر </p>
                </div>
                <div class="tab-title" @click="tab_value = 'urls'" :class="tab_value === 'urls' ? 'active-tab' : ''">
                    <exterinalurls />
                    <p>روابط خارجيه </p>
                </div>
                <div class="tab-title" @click="tab_value = 'exams'" :class="tab_value === 'exams' ? 'active-tab' : ''">
                    <examsicon />
                    <p>الامتحانات </p>
                </div>
                <div class="tab-title " @click="tab_value = 'content'" :class="tab_value === 'content' ? 'active-tab' : ''">
                    <ContentIcon />
                    <p>المحتوى</p>
                </div>
               
           
               
            </div>

            <hr />

            <div class="tabs-content">
                <div v-if="tab_value === 'homework'">
                    <CourseDetailsTabsContentCourseHomework />
                </div>
                <div v-if="tab_value === 'content'">
                    <CourseDetailsTabsContentCourseContent
                            @coursechanged="activetab=$event" />
                </div>
                <div v-if="tab_value === 'urls'">
                    <CourseDetailsTabsContentCourseUrls />
                </div>
                <div v-if="tab_value === 'live'">
                    <CourseDetailsTabsContentCourseLive />
                </div>
                <div v-if="tab_value === 'exams'">
                    <CourseDetailsTabsContentCourseExam />
                </div>
            </div>

        </div>

    </div>

</template>

<style scoped ></style>

