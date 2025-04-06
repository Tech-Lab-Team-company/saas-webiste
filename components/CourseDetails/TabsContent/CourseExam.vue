<script setup lang="ts">
import Downarrow from '~/public/icons/downarrow.vue';
import blacknotes from '~/public/icons/blacknotes.vue';
import clockicon from '~/public/icons/clockicon.vue';
import calendaricon from '~/public/icons/calendaricon.vue';

    const exams = ref([
        {
            title: 'امتحان علي اساسيات النحو (لغه عربيه)',
            date: '9 -5-2025',
            time: 'من 2 م  الي  3م',
            state:'not entered',
            rate:0,
        },
        {
            title: 'امتحان علي اساسيات النحو (لغه عربيه)',
            date: '9 -5-2025',
            time: 'من 2 م  الي  3م',
            state:'enterd',
            rate:9,
        },
        {
            title: 'امتحان علي اساسيات النحو (لغه عربيه)',
            date: '9 -5-2025',
            time: 'من 2 م  الي  3م',
            state:'enterd',
            rate:0,
        },
    ])
</script>

<template>
    <div class="course-exam-container" v-for="exam in exams" :key="exam.title">


        <div v-if="exam.state === 'enterd'" class="exam-rate">
           <p class="rating" :class="exam.rate < 6 ? 'failed' : ''"> {{ exam.rate }} / 10</p>
           <p class="details">اعرض تفاصيل الامتحان</p>
        </div>

        <div class="btns" v-else="" >
            <button>ابدأ الامتحان</button>
        </div>


        <div class="course-exam-content">
            <div class="exam-title">
                <p>{{ exam.title }}</p>
                <blacknotes />
            </div>

            <div class="exam-date-container">
                <div class="exam-title exam-date">
                    <p>{{ exam.date }} </p>
                    <calendaricon class="exam-icon" />
                </div>
                <div class="exam-title exam-date">
                    <p>{{ exam.time }} </p>
                    <clockicon class="exam-icon" />
                </div>
            </div>

        </div>

     
    </div>
</template>

<style scoped ></style>