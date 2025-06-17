<script setup lang="ts">
import bannerarrow from '~/public/icons/bannerarrow.vue'
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const allRoutes = ref([
  { name: "الرئيسية", path: `/${locale.value}` },
  { name: "الكورسات", path: `/${locale.value}/course` },
  { name: "نبذة عنا", path: `/${locale.value}/aboutus` },
  { name: "بنك الاسئلة", path: `/${locale.value}/questions` },
  { name: "المدونة", path: `/${locale.value}/blogs` },
  {
    name: "تفاصيل الكورس",
    matcher: (path: string) => {
      const pattern = new RegExp(`^/${locale.value}/course/([^/]+)$`);
      const match = path.match(pattern);
      return match ? { courseId: match[1] } : null;
    }
  },
  {
    name: "الامتحانات",
    matcher: (path: string) => {
      const pattern = new RegExp(`^/${locale.value}/course/([^/]+)/([^/]+)$`);
      const match = path.match(pattern);
      return match ? { courseId: match[1], examId: match[2] } : null;
    }
  },
])

// Watch locale changes to update routes
watch(locale, () => {
  allRoutes.value = [
    { name: "الرئيسية", path: `/${locale.value}` },
    { name: "الكورسات", path: `/${locale.value}/course` },
    { name: "نبذة عنا", path: `/${locale.value}/aboutus` },
    { name: "بنك الاسئلة", path: `/${locale.value}/questions` },
    { name: "المدونة", path: `/${locale.value}/blogs` },
    {
      name: "تفاصيل الكورس",
      matcher: (path: string) => {
        const pattern = new RegExp(`^/${locale.value}/course/([^/]+)$`);
        const match = path.match(pattern);
        return match ? { courseId: match[1] } : null;
      }
    },
    {
      name: "الامتحانات",
      matcher: (path: string) => {
        const pattern = new RegExp(`^/${locale.value}/course/([^/]+)/([^/]+)$`);
        const match = path.match(pattern);
        return match ? { courseId: match[1], examId: match[2] } : null;
      }
    },
  ]
})

const breadcrumbRoutes = computed(() => {
  const currentPath = route.path
  const crumbs = []

  // Always add home route
  const homeRoute = allRoutes.value.find(r => r.path === `/${locale.value}`)
  if (homeRoute) {
    crumbs.push(homeRoute)
  }

  // If we're not on home page, build breadcrumb trail
  if (currentPath !== `/${locale.value}`) {
    // Split path into segments, removing locale and empty strings
    const pathWithoutLocale = currentPath.replace(`/${locale.value}`, '')
    const segments = pathWithoutLocale.split('/').filter(Boolean)
    
    let buildPath = `/${locale.value}`
    
    for (let i = 0; i < segments.length; i++) {
      buildPath += `/${segments[i]}`
      
      // Check for exact path match first
      let matchedRoute = allRoutes.value.find(r => r.path === buildPath)
      
      // If no exact match, check matchers
      if (!matchedRoute) {
        matchedRoute = allRoutes.value.find(r => 
          r.matcher && r.matcher(buildPath)
        )
      }
      
      if (matchedRoute) {
        // Create a new route object with the actual path for navigation
        crumbs.push({
          ...matchedRoute,
          path: buildPath
        })
      }
    }
  }

  return crumbs
})

const navigateTo = (path: string) => {
  if (path && route.path !== path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="banner">
    <img src="../../public/images/Group.png" alt="logo" class="logo" />
    <ul class="banner-list">
      <li 
        v-for="(breadcrumbRoute, index) in breadcrumbRoutes" 
        :key="index" 
        class="banner-item"
        :class="{ 'active': $route.path === breadcrumbRoute.path }" 
        @click="navigateTo(breadcrumbRoute.path)"
      >
        {{ breadcrumbRoute.name }}
        <bannerarrow v-if="index !== breadcrumbRoutes.length - 1" class="arrow-icon" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>