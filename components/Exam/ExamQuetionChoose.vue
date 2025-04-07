<script setup lang="ts">
    import RightArrowIcon from '~/public/icons/RightArrowIcon.vue';
    import LeftArrowIcon from '~/public/icons/LeftArrowIcon.vue';

    const QuestionIndex = ref(0);

    const SelectedFirstAnswer = ref(0);
    const SelectedSeconeAnswer = ref(0);
    const AllSelectedAnswer = ref<{ SelectedFirstAnswer: number; SelectedSeconeAnswer: number }[]>([])

    const questions = ref([
        {
            questionNumber : 'السؤال الاول',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            first_side : [
                {id:1 , title:'مصر'},
                {id:2 , title:'اليابان'},
                {id:3 , title:'فرنسا'},
                {id:4 , title:'فلسطين'},
            ],
            second_side : [
                {id:1 , title:'جدة'},
                {id:2 , title:'الامارات'},
                {id:3 , title:'القاهرة'},
                {id:4 , title:'دبي'},

            ]
        },
        {
            questionNumber : 'السؤال الاول',
            questionText : 'اي من الجمل التالية تحتوي على خبر انّ؟',
            first_side : [
                {id:1 , title:'مصر'},
                {id:2 , title:'اليابان'},
                {id:3 , title:'فرنسا'},
                {id:4 , title:'فلسطين'},
            ],
            second_side : [
                {id:1 , title:'القاهرة'},
                {id:2 , title:'جدة'},
                {id:3 , title:'الامارات'},
                {id:4 , title:'دبي'},
            ]
        },
        

    ])


    const emit = defineEmits(['SendAnswerIndex'])
    const SendEmit =()=>{
        emit('SendAnswerIndex', QuestionIndex.value);

    }

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


    const UpdateFirstChoose =(ChooseId:number)=>{
        SelectedFirstAnswer.value = ChooseId;
        updateAllSelected();
    }
    const UpdateSecondChoose =(ChooseId:number)=>{
        SelectedSeconeAnswer.value = ChooseId;
        updateAllSelected();
    }

    const updateAllSelected = ()=>{
        AllSelectedAnswer.value.push({ SelectedFirstAnswer: SelectedFirstAnswer.value, SelectedSeconeAnswer: SelectedSeconeAnswer.value });
    }

</script>

<template>
    <div class="question-container">

        <div class="question-title">
            <p class="question-number">{{ questions[QuestionIndex].questionNumber }}</p>
            <p class="question-text"> {{ questions[QuestionIndex].questionText }}</p>
        </div>
        
        <form class="form">
            <div class="questions">
                <div class="question question-choose">
                    <label for="answer1"  @click="UpdateFirstChoose(questions[QuestionIndex].first_side[0].id)" :class="SelectedFirstAnswer == 1 ? `selected`:``">{{ questions[QuestionIndex].first_side[0].title }}</label>
                    <input id="answer1" type="radio" name="first-choose" :value="questions[QuestionIndex].first_side[0].id">
                </div>
                <div class="question question-choose">
                    <label for="answer2" @click="UpdateFirstChoose(questions[QuestionIndex].first_side[1].id)" :class="SelectedFirstAnswer == 2 ? `selected`:``">{{ questions[QuestionIndex].first_side[1].title }}</label>
                    <input id="answer2" type="radio" name="first-choose" :value="questions[QuestionIndex].first_side[1].id">
                </div>
                <div class="question question-choose">
                    <label for="answer3" @click="UpdateFirstChoose(questions[QuestionIndex].first_side[2].id)" :class="SelectedFirstAnswer == 3 ? `selected`:``">{{ questions[QuestionIndex].first_side[2].title }}</label>
                    <input id="answer3" type="radio" name="first-choose" :value="questions[QuestionIndex].first_side[2].id">
                </div>
                <div class="question question-choose">
                    <label for="answer4" @click="UpdateFirstChoose(questions[QuestionIndex].first_side[3].id)" :class="SelectedFirstAnswer ==4 ? `selected`:``">{{ questions[QuestionIndex].first_side[3].title }}</label>
                    <input id="answer4" type="radio" name="first-choose" :value="questions[QuestionIndex].first_side[3].id">
                </div>
            </div>
            <div class="questions">
                <div class="question question-choose">
                    <label for="answer5"  @click="UpdateSecondChoose(questions[QuestionIndex].second_side[0].id)" :class="SelectedSeconeAnswer == 1 ? `selected`:``">{{ questions[QuestionIndex].second_side[0].title }}</label>
                    <input id="answer5" type="radio" name="second-choose" :value="questions[QuestionIndex].second_side[0].id">
                </div>
                <div class="question question-choose">
                    <label for="answer6" @click="UpdateSecondChoose(questions[QuestionIndex].second_side[1].id)" :class="SelectedSeconeAnswer == 2 ? `selected`:``">{{ questions[QuestionIndex].second_side[1].title }}</label>
                    <input id="answer6" type="radio" name="second-choose" :value="questions[QuestionIndex].second_side[1].id">
                </div>
                <div class="question question-choose">
                    <label for="answer7" @click="UpdateSecondChoose(questions[QuestionIndex].second_side[2].id)" :class="SelectedSeconeAnswer == 3 ? `selected`:``">{{ questions[QuestionIndex].second_side[2].title }}</label>
                    <input id="answer7" type="radio" name="second-choose" :value="questions[QuestionIndex].second_side[2].id">
                </div>
                <div class="question question-choose">
                    <label for="answer8" @click="UpdateSecondChoose(questions[QuestionIndex].second_side[3].id)" :class="SelectedSeconeAnswer == 4 ? `selected`:``">{{ questions[QuestionIndex].second_side[3].title }}</label>
                    <input id="answer8" type="radio" name="second-choose" :value="questions[QuestionIndex].second_side[3].id">
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
.form{
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .questions{
        .question{
            &.question-choose{
                width: 90%;
                    label{
                        text-align: center;
                    }
                }
            }
    }
}





</style>
<!-- 

<div class="question question-choose">
    <label  for="answer1" @click="SelectedAnswer[QuestionIndex].first = 'answer1' " :class="SelectedAnswer[QuestionIndex].first == 'answer1' ?`selected` :``">{{ questions[QuestionIndex].first_side[0].title }}</label>
    <input class="answer" v-model="selected[QuestionIndex].first" type="radio" :value="questions[QuestionIndex].first_side[0].id" name="answer" id="answer1" >
</div>
<div class="question question-choose">
    <label for="answer2"  @click="SelectedAnswer[QuestionIndex].first = 'answer2'" :class="SelectedAnswer[QuestionIndex].first == 'answer2' ?`selected` :``">{{ questions[QuestionIndex].first_side[1].title }}</label>
    <input class="answer" type="radio" :value="questions[QuestionIndex].first_side[2].id" name="answer" id="answer2">
</div>
<div class="question question-choose">
    <label for="answer3"  @click="SelectedAnswer[QuestionIndex].first = 'answer3'" :class="SelectedAnswer[QuestionIndex].first == 'answer3' ?`selected` :``">{{questions[QuestionIndex].first_side[2].title }}</label>
    <input class="answer"  type="radio" :value="questions[QuestionIndex].first_side[2].id" name="answer" id="answer3">
</div>
<div class="question question-choose">
    <label for="answer4" @click="SelectedAnswer[QuestionIndex].first = 'answer4'" :class="SelectedAnswer[QuestionIndex].first == 'answer4' ?`selected` :``">{{ questions[QuestionIndex].first_side[3].title }}</label>
    <input class="answer"type="radio" :value="questions[QuestionIndex].first_side[3].id" name="answer" id="answer4" >
</div> -->