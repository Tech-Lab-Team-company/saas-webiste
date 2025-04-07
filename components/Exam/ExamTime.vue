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
         <!--  -->
        <div class="active-bar" :style="`width:${questionIndex  * 10.5}%`"></div>
            <div class="dots">
                <!-- {{ console.log(questionIndex) }} -->
             <div class="dot" :class="questionIndex == 10 ? 'white' : ''"  ></div>
             <div class="dot" :class="questionIndex == 9 ? 'white' : ''"  ></div>
             <div class="dot" :class="questionIndex == 8 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 7 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 6 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 5 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 4 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 3 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 2 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 1 ? 'white' : ''"></div>
             <div class="dot" :class="questionIndex == 0 ? 'white' : ''"></div>
        </div>
    </div>

    <!-- <ExamQuestionsText 
        @SendAnswerIndex ="questionIndex = $event"/> -->

        <!-- <ExamQuestionImage 
            @SendAnswerIndex ="questionIndex = $event"/> -->

            <ExamQuetionChoose 
             @SendAnswerIndex ="questionIndex = $event"/>

</template>


<style scoped lang="scss">


.exam-time-container{
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin:10px 20px;

    .exam-time{
        display:flex;
        align-items: center;
        gap:6px;

        p{
            color:#D38911;
            font-size:18px;
        }

        span{
            font-size:18px;
            font-weight:500;
        }
    }

    .exam-totla-time{
        display:flex;
        align-items: center;
        justify-content: center;
        gap:6px;

        p{
            color:#6F777B;
        }
    }
    
}

.progress-bar{
    width:96%;
    height:10px;
    margin:0 20px;
    border-radius:10px;
    background:#E0E0E0;
    margin-top:2px;
    margin-bottom:10px;
    position:relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: -1;

    .dots{
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 5px;

       
        
        .dot{
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: black;
            z-index: 10;
    

            &.white{
            background-color: white !important;
         }
        
        

            &:last-child{
                // background-color: white;
            }
        }
    }

    .active-bar{
        position: absolute;
        background-image: linear-gradient(to left ,#D38911 ,#FFB949);
        right: 0;
        width: 10.5%;
        height: 100%;
        border-radius: 10px;
        z-index: 0;
       
    }

    
}

</style>
<!-- <div class="active-bar" :style="`width:${questionIndex * 5.2}%`"></div> -->

