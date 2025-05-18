<script setup lang="ts">
import type ChildrenInterface from '~/types/children_interface';
import statisticsIcon from '~/public/icons/statisticsIcon.vue';
import CentersIcons from '~/public/icons/CentersIcons.vue';
import ProfileIcon from '~/public/icons/ProfileIcon.vue';
import LikeIcon from '~/public/icons/LikeIcon.vue';


const props = defineProps({
  sections: {
    type: Array as PropType<ChildrenInterface[]>,
  },

});

const Sections = ref(props.sections);


watch(() => props.sections, (newValue) => {
  Sections.value = newValue;
}, { immediate: true });

const icons = [
  statisticsIcon,
  ProfileIcon,
  CentersIcons,
  LikeIcon
]
const subtitle = [
  'انطلاقتنا',
  'كم مدرس لدينا',
  'كم سنتر لدينا',
  'اجمالي التقييمات'
]





</script>

<template>
    <div class="course-statistics-container">
      {{ console.log(Sections , "about sectionssss") }}
        <div class="course-statistics" v-for="(section, index) in Sections" :key="index">
            <div class="statistics">
                <p>{{ subtitle[index] }}</p>
                <p>{{ section?.title }}</p> 
            </div>
            <!-- <img :src="section?.icon" alt="icon1" class="statistics-icon" /> 
             -->
            <component :is="icons[index]" class="statistics-icon" />
        </div> 
    </div>
</template>

<style scoped lang="scss"></style>