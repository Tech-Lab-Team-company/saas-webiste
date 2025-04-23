<script setup lang="ts">
import { ref, watch } from 'vue'

const MainTitle = ref<string>("")
const Title = ref<string>("")
const SubTitle = ref<string>("")

const props = defineProps({
    maintitle: String,
    title: String,
    subtitle: String
})

// Immediate watchers to initialize values
watch(
    () => props.maintitle,
    (newValue) => {
        MainTitle.value = newValue || ""
    },
    { immediate: true }
)

watch(
    () => props.title,
    (newValue) => {
        Title.value = newValue || ""
    },
    { immediate: true }
)

watch(
    () => props.subtitle,
    (newValue) => {
        SubTitle.value = newValue || ""
    },
    { immediate: true }
)
</script>

<template>
        <div class="stages-container" >
            <p v-if="MainTitle" class="stages-main-title">{{ MainTitle }}</p>
            <p v-if="Title" class="stage-title">{{ Title }}</p>
            <p v-if="SubTitle" class="stages-subtitle">{{ SubTitle }}</p>  
        </div>
</template>

<style scoped lang="scss">



</style>