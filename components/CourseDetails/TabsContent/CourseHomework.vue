<script setup lang="ts">
import Downarrow from '~/public/icons/downarrow.vue';
import blacknotes from '~/public/icons/blacknotes.vue';
import clockicon from '~/public/icons/clockicon.vue';
import calendaricon from '~/public/icons/calendaricon.vue';

    const homeworks = ref([
        {
            title: 'واجب النحو والبلاغه',
            date: '9 -5-2025',
            subject:'لغة عربية',
        },
        {
            title: 'واجب النحو والبلاغه',
            date: '9 -5-2025',
            subject:'لغة عربية',
        },
        {
            title: 'واجب النحو والبلاغه',
            date: '9 -5-2025',
            subject:'لغة عربية',
        },
    ])
</script>

<template>
    <div class="course-homework-container" v-for="homework in homeworks" :key="homework.title">


        <div  class="homework-rate">
           <p class="details">اعرض تفاصيل الامتحان</p>
        </div>

        <div class="course-homework-content">
            <div class="homework-title">
                <p>{{ homework.title }}</p>
            </div>

            <div class="homework-date-container">
                <div class="homework-title homework-date">
                    <p>{{ homework.date }} </p>
                    <calendaricon class="homework-icon" />
                </div>
                <div class="homework-title homework-date">
                    <p>{{ homework.subject }} </p>
                </div>
            </div>

        </div>

     
    </div>
</template>

<style scoped lang="scss">
    .course-homework-container{
        margin-top: 40px;
        display: flex;
        width: 100%;
        align-items: center;
        border: 1px solid black;
        width: 70%;
        margin-left: auto;
        margin-right: auto;
        justify-content: space-between;
        padding: 10px;
        border-radius: 10px;
        

        .btns{
            button{
                background-color: #FFB949;
                color:white;
                padding: 10px;
                border-radius: 10px;
            }
        }

        .homework-rate{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;

            .details{
                text-decoration: underline;
                cursor: pointer;
                padding-left: 20px;
            }

        }
        .course-homework-content{
            display: flex;
            flex-direction: column;
            justify-content: end;
            gap: 6px;
            width: 40%;

            .homework-title{
                display: flex;
                align-items: center;
                justify-content: end;
                gap: 10px;
                font-size: 20px;

                &.homework-date{
                    color: #6F777B;
                    font-size: 12px;
                    gap:5px;

                    .homework-icon{
                        width: 13px;
                    }
                }
            }

            .homework-date-container{
            
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                margin-right: 5px;
                
            }
        }
    }
</style>