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

const { locale } = useI18n();

</script>
<template>
  <!-- sidebar -->
   
  <div class="sidebar-buttons" dir="rtl">
    <div class="sidebar-page-articles-buttons pt-lg">
      <h2 class="sidebar-title">{{ $t('encyclopedia') }}</h2>
      <div class="grid grid-cols-3 gap-md pt-md hashtags-container">
        <NuxtLink
          v-for="(item, index) in HashtagsContetnt"
          :key="'btn-' + index"
          :to="`/blogs/hashtag/${item.id}`" 
        >
          <button class="sidebar-button">
            {{ item.title }}
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
  <!-- end sidebar -->
</template>

<style scoped>
/* sidebar-button style */
.sidebar-title {
  font-family: "regular";
  font-weight: 500;
  font-size: 25px;
  text-align: right;
  color: #000000;
}

.sidebar-page-articles-buttons {
  margin-top: 20px;
}
.sidebar-page-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.sidebar-button {
  width: 85px;
  height: fit-content;
  border-radius: 5px;
  padding: 10px;
  gap: 10px;
  background: #ffffff;
  font-family: "regular";
  font-weight: 400;
  font-size: 19px;
  text-align: center;
  color: #605b6c;
}

.hashtags-container{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
/* end sidebar-button style */
</style>
