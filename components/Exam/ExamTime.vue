<script setup lang="ts">
    import ExamDetailsParams from '~/features/FetchExams/Core/Params/exam_details_params';
import { QuestionTypeEnum } from '~/features/FetchExams/Core/questoin_type_enum';
import type ExamDetailsModel from '~/features/FetchExams/Data/models/exam_details_model';
import ExamDetailsController from '~/features/FetchExams/presentation/controllers/exam_details_controller';
import clockicon from '~/public/icons/clockicon.vue';
    import progressIcon from '~/public/icons/progressIcon.vue';

    const questionIndex=ref(0);

    const router = useRouter();
    

    const ExamDetails = ref<ExamDetailsModel | null>(null)
    const FetchExamQuestions = async ()=>{
        const ExamParams = new ExamDetailsParams(Number(router.currentRoute.value.params.exam));
        const examDetailsController = ExamDetailsController.getInstance();
        const state = await examDetailsController.FetchExamDetails(ExamParams);

        if( state.value.data){
            ExamDetails.value = state.value.data;
        }

    }

    onMounted(()=>{
        FetchExamQuestions();
    })


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
   
        <div class="active-bar" :style="`width:${(questionIndex + 1) * (100 / Number(ExamDetails?.questions.length))}%`"></div>
            <div class="dots">
             <div v-for="dot in ExamDetails?.questions.length" class="dot" :class="questionIndex == dot ? 'white' : ''"></div>
        </div>
    </div>

    
    <div>
      <ExamQuestionsText 
      :QuestionDetails ="ExamDetails"
      @SendAnswerIndex ="questionIndex = $event"/>
    </div>
    
    <!-- v-if="ExamDetails?.examType == QuestionTypeEnum.true_false" -->
    <!-- <div v-if="ExamDetails?.examType ==QuestionTypeEnum.mcq">
      <ExamQuestionsAudio 
      @SendAnswerIndex ="questionIndex = $event"/>
    </div>

    <div v-if="ExamDetails?.examType == QuestionTypeEnum.mcq">
      <ExamQuestionImage 
      @SendAnswerIndex ="questionIndex = $event"/> 
    </div>

    <div v-if="ExamDetails?.examType == QuestionTypeEnum.mcq">
      <ExamQuetionChoose 
      @SendAnswerIndex ="questionIndex = $event"/> 
    </div>
    <div v-if="ExamDetails?.examType == QuestionTypeEnum.article">
      <ExamQuestionComplete 
      @SendAnswerIndex ="questionIndex = $event"/>
    </div> -->


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
        // justify-content: space-between;
        padding: 0 5px;
        justify-content: space-between;

       
        
        .dot{
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: black;
            z-index: 10;

            &:last-child{

              background-color: white !important;
            }
    

        //     &.white{
        //     background-color: white !important;
        //  }
        
        

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

