<script setup lang="ts">
    import clockicon from '~/public/icons/clockicon.vue';
    import progressIcon from '~/public/icons/progressIcon.vue';

    const questionIndex=ref(0);


</script>

<template>
    <div class="exam-time-container">
        <div class="exam-totla-time">
            <clockicon />
            <p>50 min</p>
        </div>

        <div class="exam-time">
            <p>علي نهايه الامتحان</p>
            <span>100%</span>
        </div>
    </div>

    <div class="progress-bar">
        <!-- <progressIcon class="progress-icon" /> -->
        <div class="active-bar" :style="`width:${questionIndex * 5.2}%`"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>

    <ExamQuestionsText 
        @SendAnswerIndex ="questionIndex = $event"/>

        <!-- <ExamQuestionImage 
            @SendAnswerIndex ="questionIndex = $event"/> -->

</template>


<style scoped lang="scss">

</style>

