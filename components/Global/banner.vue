<script setup lang="ts">
import bannerarrow from '~/public/icons/bannerarrow.vue'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const allRoutes = ref([
  { name: "الرئيسية", path: `/` },
  { name: "الكورسات", path: `/course` },
  { name: "نبذة عنا", path: `/aboutus` },
  { name: "بنك الاسئلة", path: `/questions` },
  { name: "المدونة", path: `/blogs` },
  {
    name: "تفاصيل الكورس",
    matcher: (path: string) => {
      const pattern = new RegExp(`^/course/([^/]+)$`);
      const match = path.match(pattern);
      return match ? { courseId: match[1] } : null;
    }
  },
  {
    name: "الامتحانات",
    matcher: (path: string) => {
      const pattern = new RegExp(`^/course/([^/]+)/([^/]+)$`);
      const match = path.match(pattern);
      return match ? { courseId: match[1], examId: match[2] } : null;
    }
  },
])

const breadcrumbRoutes = computed(() => {
  const currentPath = route.path
  const crumbs = []

  const homeRoute = allRoutes.value.find(r => r.path === `/`)
  if (homeRoute) {
    crumbs.push(homeRoute)
  }

  if (currentPath !== `/`) {
    const segments = currentPath.split('/').filter(Boolean)

    let buildPath = ''

    for (let i = 0; i < segments.length; i++) {
      buildPath += `/${segments[i]}`
      
      let matchedRoute = allRoutes.value.find(r => r.path === buildPath)

      if (!matchedRoute) {
        matchedRoute = allRoutes.value.find(r => r.matcher && r.matcher(buildPath))
      }

      if (matchedRoute) {
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