<script setup lang="ts">
    import RightArrowIcon from '~/public/icons/RightArrowIcon.vue';
    import LeftArrowIcon from '~/public/icons/LeftArrowIcon.vue';

    const SelectedAnswer = ref<string[]>([]);
    const QuestionIndex = ref(0);
    const completeText = ref('');

    const questions = ref([
        {
            questionNumber : 'السؤال الاول',
            hint:'اكمل الفراغ التالى',
            questionText : 'الارض تدور حول ...................كل 24 ساعه',
        
        },
        {
            questionNumber : 'السؤال الاول',
            hint:'اكمل الفراغ التالى',
            questionText : 'الارض تدور حول  ................... كل 24 ساعه',
            answers : [
                '(1) صح',
                '(1) غلط'
            ]
        },
      
    ])


    const emit = defineEmits(['SendAnswerIndex'])
    const SendEmit =()=>{
        emit('SendAnswerIndex', QuestionIndex.value)
    }

    const selected = ref('')
    const TextComplete = ref('')
    const IncreaseIndex = ()=>{

        if(questions.value[QuestionIndex.value].answers && selected.value[QuestionIndex.value] == undefined){
            return;
        }
        
        else if(QuestionIndex.value < questions.value.length - 1){
            QuestionIndex.value++
            // console.log(TextComplete.value)
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

    const startIndex = questions.value[0].questionText.indexOf(".");
    const endIndex = questions.value[0].questionText.lastIndexOf(".") + 1;

    const startText = questions.value[0].questionText.slice(0 , startIndex)
    const dots = questions.value[0].questionText.slice(startIndex, endIndex);
    const endText = questions.value[0].questionText.slice(endIndex , )

</script>

<template>
    <div class="question-container">

        <div class="question-title">
            <p class="question-number">{{ questions[QuestionIndex]?.questionNumber }}</p>
            <p v-if="questions[QuestionIndex]?.hint">{{ questions[QuestionIndex]?.hint }}</p>
            <div class="complete-text " >
                <p>{{ endText }}</p>
                <span >
                    {{ dots }}
                    <input type="text" v-model="TextComplete">
                </span>
                
                <p>{{ startText }}</p>
            </div>
        </div>
        
        <form >
            <div class="questions" v-if="questions[QuestionIndex].answers">
                <div class="question">
                    
                    <label for="answer1" class="correct" @click="SelectedAnswer[QuestionIndex] = 'answer1'" :class="SelectedAnswer[QuestionIndex] == 'answer1' ?`selected` :``">{{ questions[QuestionIndex]?.answers?.[0] ?? '' }}</label>
                    <input  class="answer" v-model="selected[QuestionIndex]" type="radio" value="answer1" name="answer" id="answer1" >
                </div>
                <div class="question">
                    <label for="answer2" class="correct" @click="SelectedAnswer[QuestionIndex] = 'answer2'" :class="SelectedAnswer[QuestionIndex] == 'answer2' ?`selected` :``">{{ questions[QuestionIndex]?.answers?.[1] ?? '' }}</label>
                    <input class="answer" v-model="selected[QuestionIndex]" type="radio" value="answer2" name="answer" id="answer2">
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


<style scoped lang="scss">

.complete-text{
    display: flex;
    gap: 3px;
    font-size: 20px;

    span{
        position: relative;
        input{
            border: none;
            outline: none;
            width: 60px;
            position: absolute;
            left: 0%;
            background-color: transparent;

    
            &:focus{
                border: none;
                outline: none;
            }
        }
    }

}



.question-container{
    .question-title{
        .question-text{
            &.question-text-complete{
                font-size: 20px;
              
                .complete{
                    width: 20px;
                }

            }
        }
    }
}
</style>


