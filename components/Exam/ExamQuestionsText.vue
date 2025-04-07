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
                '(1) انّ الطُلابَ مجتهدون',
                '(2) انّ في الحديقةِ شجرةً',
                '(3) انّ في الحديقةِ شجرةً',
                '(4) انّ في الحديقةِ شجرةً',
            ]
        },
        {
            questionNumber : 'السؤال الثانى',
            img:'../../public/images/background.png' ,
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
                '(1) انّ الطُلابَ مجتهدون',
                '(2) انّ في الحديقةِ شجرةً',
                '(3) انّ في الحديقةِ شجرةً',
                '(4) انّ في الحديقةِ شجرةً',
            ]
        },
        {
            questionNumber : 'السؤال الثانى',
            img:'../../public/images/background.png' ,
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
                '(1) انّ الطُلابَ مجتهدون',
                '(2) انّ في الحديقةِ شجرةً',
                '(3) انّ في الحديقةِ شجرةً',
                '(4) انّ في الحديقةِ شجرةً',
            ]
        },
        {
            questionNumber : 'السؤال الثانى',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
                '(1) انّ الطُلابَ مجتهدون',
                '(2) انّ في الحديقةِ شجرةً',
                '(3) انّ في الحديقةِ شجرةً',
                '(4) انّ في الحديقةِ شجرةً',
            ]
        },
        {
            questionNumber : 'السؤال الثانى',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
                '(1) انّ الطُلابَ مجتهدون',
                '(2) انّ في الحديقةِ شجرةً',
                '(3) انّ في الحديقةِ شجرةً',
                '(4) انّ في الحديقةِ شجرةً',
            ]
        },
        {
            questionNumber : 'السؤال الثانى',
            aduio:'ad',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
                '(1) انّ الطُلابَ مجتهدون',
                '(2) انّ في الحديقةِ شجرةً',
                '(3) انّ في الحديقةِ شجرةً',
                '(4) انّ في الحديقةِ شجرةً',
            ]
        },
        {
            questionNumber : 'السؤال الثانى',
            aduio:'ad',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            answers : [
                '(1) انّ الطُلابَ مجتهدون',
                '(2) انّ في الحديقةِ شجرةً',
                '(3) انّ في الحديقةِ شجرةً',
                '(4) انّ في الحديقةِ شجرةً',
            ]
        },
    ])


    const emit = defineEmits(['SendAnswerIndex'])
    const SendEmit =()=>{
        emit('SendAnswerIndex', QuestionIndex.value)
    }

    const selected = ref([])
    const IncreaseIndex = ()=>{
        
        if(selected.value[QuestionIndex.value] == undefined){
            return;
        }

        else if(QuestionIndex.value < questions.value.length - 1){
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
            <img v-if="questions[QuestionIndex].img" :src="questions[QuestionIndex].img" alt="image">
            <!-- <img class="aduio-image" v-if="questions[QuestionIndex].aduio" src="../../public/images/Aduio.png" alt="image"> -->
            <audio v-if="questions[QuestionIndex].aduio" controls >
                <source src="../../public/Aduio/aduio.mp3" type="audio/mpeg">
            </audio>
            <p class="question-text"> {{ questions[QuestionIndex].questionText }}</p>
        </div>
        
        <form >
            <div class="questions">
                <div class="question">
                    
                    <label for="answer1" @click="SelectedAnswer[QuestionIndex] = 'answer1'" :class="SelectedAnswer[QuestionIndex] == 'answer1' ?`selected` :``">{{ questions[QuestionIndex].answers[0] }}</label>
                    <input  class="answer" v-model="selected[QuestionIndex]" type="radio" value="answer1" name="answer" id="answer1" >
                </div>
                <div class="question">
                    <label for="answer2"  @click="SelectedAnswer[QuestionIndex] = 'answer2'" :class="SelectedAnswer[QuestionIndex] == 'answer2' ?`selected` :``">{{ questions[QuestionIndex].answers[1] }}</label>
                    <input class="answer" v-model="selected[QuestionIndex]" type="radio" value="answer2" name="answer" id="answer2">
                </div>
                <div class="question">
                    <label for="answer3"  @click="SelectedAnswer[QuestionIndex] = 'answer3'" :class="SelectedAnswer[QuestionIndex] == 'answer3' ?`selected` :``">{{ questions[QuestionIndex].answers[2] }}</label>
                    <input class="answer" v-model="selected[QuestionIndex]" type="radio" value="answer3" name="answer" id="answer3">
                </div>
                <div class="question">
                    <label for="answer4" @click="SelectedAnswer[QuestionIndex] = 'answer4'" :class="SelectedAnswer[QuestionIndex] == 'answer4' ?`selected` :``">{{ questions[QuestionIndex].answers[3] }}</label>
                    <input class="answer" v-model="selected[QuestionIndex]" type="radio" value="answer4" name="answer" id="answer4" >
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


