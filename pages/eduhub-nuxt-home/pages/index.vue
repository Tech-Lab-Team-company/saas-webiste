<script setup lang="ts">
import HomeHeader from '../components/home/HomeHeader.vue'
import HomeHero from '../components/home/HomeHero.vue'
import HomeCourses from '../components/home/HomeCourses.vue'
import HomeNotes from '../components/home/HomeNotes.vue'
import HomeBlog from '../components/home/HomeBlog.vue'
import HomeExperience from '../components/home/HomeExperience.vue'
import HomeStory from '../components/home/HomeStory.vue'
import HomeAppStatus from '../components/home/HomeAppStatus.vue'
import HomeFaq from '../components/home/HomeFaq.vue'
import HomeCta from '../components/home/HomeCta.vue'
import HomeFooter from '../components/home/HomeFooter.vue'

useSeoMeta({
  title: 'Gamma Physics | إسلام سلامة',
  description:
    'شرح فيزياء منظم لطلاب أولى وثانية وثالثة ثانوي، من فهم القانون إلى تحليل المسألة.',
  ogTitle: 'Gamma Physics | إسلام سلامة',
  ogDescription:
    'شرح منظم وتدريب متدرج لطلاب المرحلة الثانوية، من تأسيس الفكرة لحد تطبيقها في أسئلة الامتحان.',
})

useHead({
  htmlAttrs: {
    lang: 'ar',
    dir: 'rtl',
  },
})
</script>

<template>
  <main>
    <HomeHeader />
    <HomeHero />
    <HomeCourses />
    <HomeNotes />
    <HomeBlog />
    <HomeExperience />
    <HomeStory />
    <HomeAppStatus />
    <HomeFaq />
    <HomeCta />
    <HomeFooter />
  </main>
</template>
