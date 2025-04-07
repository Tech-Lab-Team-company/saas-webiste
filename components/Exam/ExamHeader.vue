<script setup lang="ts">
import blacknotes from '../../public/icons/blacknotes.vue'


// const props = defineProps({
//     title:{
//         type: String,
//         default: 'امتحان علي اساسيات النحو (لغه عربيه)'
//     }
// })

</script>

<template>
    <div class="exam-header">
        <div class="exam-btn">
            <button>انهاء الامتحان</button>
        </div>
        <div class="exam-header-container">
            <div class="exam-header-text">
                <p class="exam-title">امتحان علي اساسيات النحو (لغه عربيه)</p>
                <blacknotes /> 
            </div>
            <hr class="exam-title-hr" />
        </div>
    </div>

</template>


<style scoped >

</style>