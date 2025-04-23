<script setup lang="ts">
import Aboutusarrow from '~/public/icons/Aboutusarrow.vue';
import { ref, onMounted } from 'vue';

const headerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 }
  );

  if (headerRef.value) {
    observer.observe(headerRef.value);
  }
});

const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});






const HeaderTitle = ref(props.title);
const HeaderDesciption = ref(props.description);


watch(() => props.title, (newValue) => {
  HeaderTitle.value = newValue;
}, { immediate: true });

watch(() => props.description, (newValue) => {
  HeaderDesciption.value = newValue;
}, { immediate: true });



</script>

<template>
    <div class="aboutus-header" ref="headerRef">
        <div class="header-title">
            <h3 :class="{ 'animate': isVisible }">{{ HeaderTitle }}</h3>
        </div>
        <div class="header-description-container">
            <div class="header-description">
                <p :class="{ 'animate': isVisible }">{{ HeaderDesciption }}</p>
            </div>
            <img 
                src="../../public/images/handbg.png" 
                alt="hand image"
                :class="{ 'animate': isVisible }"
            >
        </div>
        <Aboutusarrow class="arrow-icon" :class="{ 'animate': isVisible }" />
    </div>
</template>

<style scoped></style>