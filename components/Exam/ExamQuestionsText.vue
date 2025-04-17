<script setup lang="ts">
    import RightArrowIcon from '~/public/icons/RightArrowIcon.vue';
    import LeftArrowIcon from '~/public/icons/LeftArrowIcon.vue';
    import type ExamDetailsModel from '~/features/FetchExams/Data/models/exam_details_model';
    import QuestionAnswerController from '~/features/SubmitQuestionAnswer/presentation/controllers/submit_question_answer_controller';
    import QuestionAnswerParams from '~/features/SubmitQuestionAnswer/Core/Params/submit_question_answer_params';

    const SelectedAnswer = ref<string[]>([]);
    const QuestionIndex = ref(0);

  

    const props = defineProps({
        QuestionDetails: {
            type: Object as () => ExamDetailsModel | null,
            default: null
        }
    });

    const questionDetails = ref(props.QuestionDetails);

    watch(() => props.QuestionDetails, (newValue) => {
        questionDetails.value = newValue;
    }, { immediate: true });

    const emit = defineEmits(['SendAnswerIndex'])
    const SendEmit =()=>{
        emit('SendAnswerIndex', QuestionIndex.value)
    }

    const selected = ref([])
 

    const sendData= async() =>{
        console.log(selected.value[QuestionIndex.value]  )
        const questionAnswerParams = new QuestionAnswerParams(
            questionDetails?.value?.id , 
            questionDetails?.value?.questions[QuestionIndex.value]?.id, 
            selected.value[QuestionIndex.value]  
        );
        const questionAnswerController = QuestionAnswerController.getInstance()
        const state = await questionAnswerController.SubmitQuestionAnswer(questionAnswerParams);
    }

    
    
    
    const IncreaseIndex = ()=>{

        sendData();
        if(selected.value[QuestionIndex.value] == undefined){
            return;
        }

        else if(QuestionIndex.value < (questionDetails.value?.questions?.length ?? 0) - 1){
            QuestionIndex.value++
        }

  
        SendEmit();
    }
    
    
    const DeacreseIndes =()=>{
        if(QuestionIndex.value > 0 ){
            if(QuestionIndex.value > -1 ){

                QuestionIndex.value--; 
            }
        }
        SendEmit();
    }

</script>

<template>
    <div class="question-container">

        <div class="question-title">
            <p class="question-number">{{ `السؤال ${QuestionIndex +1}`}}</p>
            
            <img v-if="questionDetails?.questions[QuestionIndex].image" :src="questionDetails?.questions[QuestionIndex].image" alt="image">
      
            <p class="question-text" v-html="questionDetails?.questions[QuestionIndex].question"> </p>
        </div>
        <form >
            <div class="questions">
                <div class="question" v-for="(answer, index) in questionDetails?.questions[QuestionIndex].answers" :key="index">
                    <label :for="`answer-${answer.id}`" @click="SelectedAnswer[QuestionIndex] = `${answer.id}`" :class="SelectedAnswer[QuestionIndex] == `${answer.id}` ?`selected` :``" v-html="answer?.answer"></label>
                    <input  class="answer" v-model="selected[QuestionIndex]" type="radio" :value="answer.id" name="answer" :id="`answer-${answer.id}`" >
                </div>
            </div>
        </form>

        <div class="next-btn" v-if="QuestionIndex == 0">
            <button @click="IncreaseIndex">التالي </button>
        </div>

        <div class="btns" v-if="QuestionIndex > 0">
            <button @click="DeacreseIndes">
                <LeftArrowIcon />
                السابق 
            </button>
            <button @click="IncreaseIndex">
                التالي 
                <RightArrowIcon />
            </button>
        </div>
    </div>
</template>


<style scoped></style>


