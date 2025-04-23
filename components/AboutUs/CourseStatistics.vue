<script setup lang="ts">
import type ChildrenInterface from '~/types/children_interface';


const props = defineProps({
  sections: {
    type: Array as PropType<ChildrenInterface[]>,
  },

});

const Sections = ref(props.sections);


watch(() => props.sections, (newValue) => {
  Sections.value = newValue;
}, { immediate: true });





</script>

<template>
    <div class="course-statistics-container">
        <div class="course-statistics" v-for="(section, index) in Sections" :key="index">
            <div class="statistics">
                <p>{{section?.subtitle  }}</p>
                <p>{{ section?.title }}</p> 
            </div>
            <img :src="section?.icon" alt="icon1" class="statistics-icon" />
        </div> 
    </div>
</template>

<style scoped lang="scss"></style>