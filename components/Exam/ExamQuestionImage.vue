<script setup lang="ts">
    import RightArrowIcon from '~/public/icons/RightArrowIcon.vue';
    import LeftArrowIcon from '~/public/icons/LeftArrowIcon.vue';

    const SelectedAnswer = ref<string[]>([]);
    const QuestionIndex = ref(0);

    const questions = ref([
        {
            questionNumber : 'السؤال الاول',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
                '../../public/images/background.png',
                '../../public/images/background.png',
                '../../public/images/background.png',
                '../../public/images/background.png',
               
            ]
        },
        {
            questionNumber : 'السؤال الثانى',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
            '../../public/images/background.png',
                '../../public/images/background.png',
                '../../public/images/background.png',
                '../../public/images/background.png',
            ]
        },
      
    ])


    const emit = defineEmits(['SendAnswerIndex'])
    const SendEmit =()=>[
        emit('SendAnswerIndex', QuestionIndex.value)
    ]

    const IncreaseIndex = ()=>{
        if(QuestionIndex.value < questions.value.length - 1){
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
            <p class="question-number">{{ questions[QuestionIndex].questionNumber }}</p>
            <p class="question-text"> {{ questions[QuestionIndex].questionText }}</p>
        </div>
        
        <form >
            <div class="questions questions-image ">
                <div class="question ">
                    <img  :src="questions[QuestionIndex].answers[0] " for="answer1" @click="SelectedAnswer[QuestionIndex] = 'answer1'" :class="SelectedAnswer[QuestionIndex] == 'answer1' ?`selected` :``" />
                    <input class="answer" type="radio" value="answer1" name="answer" id="answer1" >
                </div>
                <div class="question">
                    <img  :src="questions[QuestionIndex].answers[0] " for="answer2" @click="SelectedAnswer[QuestionIndex] = 'answer2'" :class="SelectedAnswer[QuestionIndex] == 'answer2' ?`selected` :``" />
                    <input class="answer" type="radio" value="answer2" name="answer" id="answer2">
                </div>
                <div class="question">
                    <img  :src="questions[QuestionIndex].answers[0] " for="answer3" @click="SelectedAnswer[QuestionIndex] = 'answer3'" :class="SelectedAnswer[QuestionIndex] == 'answer3' ?`selected` :``" />
                    <input class="answer" type="radio" value="answer3" name="answer" id="answer3">
                </div>
                <div class="question ">
                    <img  :src="questions[QuestionIndex].answers[0] " for="answer4" @click="SelectedAnswer[QuestionIndex] = 'answer4'" :class="SelectedAnswer[QuestionIndex] == 'answer4' ?`selected` :``" />
                    <input class="answer" type="radio" value="answer4" name="answer" id="answer4" >
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


