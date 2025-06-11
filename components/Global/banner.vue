<script setup lang="ts">
import bannerarrow from '~/public/icons/bannerarrow.vue'
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()


const allRoutes = ref([
  { name: "الرئيسية", path: "/" },
  { name: "الكورسات", path: "/course" },
  { name: "نبذة عنا", path: "/aboutus" },
  { name: "بنك الاسئلة", path: "/questions" },
  { name: "المدونة", path: "/blogs" },
  { 
    name: "تفاصيل الكورس", 
    path: `/course/${route.params.id}`,
    matcher: (path: string) => {
      const pattern = /^\/course\/([^/]+)$/;
      const match = path.match(pattern);
      return match ? { courseId: match[1] } : null;
    }
  },
  { 
    name: "الامتحانات", 
    path: "/course/:courseId/:id",
    matcher: (path: string) => {
      const pattern = /^\/course\/([^/]+)$\/([^/]+)$/;
      const match = path.match(pattern);
      return match ? { id: match[1] } : null;
    }
  },
])

const breadcrumbRoutes = computed(() => {
  const pathArray = route.path.split('/').filter(Boolean)
  const crumbs = []
  
  crumbs.push(allRoutes.value.find(r => r.path === '/') || { name: "الرئيسية", path: "/" })
  
  let currentPath = ''
  for (const segment of pathArray) {
    currentPath += `/${segment}`
    const matchedRoute = allRoutes.value.find(r => 
      r.path === currentPath || 
      (r.matcher && r.matcher(currentPath))
    )
    if (matchedRoute) {
      crumbs.push(matchedRoute)
    }
  }

  return crumbs
})

const navigateTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<template>
    <div class="banner">   
        <img src="../../public/images/Group.png" alt="logo" class="logo" />
        <ul class="banner-list">
                <li 
                    v-for="(route, index) in breadcrumbRoutes" 
                    :key="index"
                    class="banner-item"
                    :class="{ 'active': $route.path === route.path }"
                    @click="navigateTo(route.path)"
                >
                {{ route.name }}
                        <bannerarrow 
                        v-if="index !== breadcrumbRoutes.length - 1" 
                        class="arrow-icon" 
                        />
                </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
</style>