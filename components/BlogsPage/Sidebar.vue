<script setup lang="ts">

import type SidebarHashtag from '~/types/sidebarhashtag';


const props = defineProps<{
  hashtags: SidebarHashtag[]; 
}>();

const HashtagsContetnt = ref<SidebarHashtag[]>(props.hashtags);


watch(
  () => props.hashtags,
  (newValue) => {
    HashtagsContetnt.value = newValue;
  },
  { deep: true }
);

</script>

<template>
  <!-- sidebar -->
  <div class="sidebar" dir="rtl">
    <BlogsPageSidebarArticles />
    <BlogsPageSidebarButton 
    :hashtags="HashtagsContetnt ?? []"
    />
  </div>
  <!-- end sidebar -->
</template>
<style scoped>
/* sidebar style */
.sidebar {
  border-radius: 18px;
  /* width: 450px; */
  height: auto;
  padding: 24px;
  background: #f6f6f6;
  margin: 5px 10px;
  display: flex;
  flex-direction: column;
}

/* end sidebar style */
</style>
