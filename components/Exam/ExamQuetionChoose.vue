<script setup lang="ts">
    import RightArrowIcon from '~/public/icons/RightArrowIcon.vue';
    import LeftArrowIcon from '~/public/icons/LeftArrowIcon.vue';

    const QuestionIndex = ref(0);

    const SelectedFirstAnswer = ref<number[]>([]);
    const SelectedSeconeAnswer = ref<number[]>([]);
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
      
        if(SelectedSeconeAnswer.value[QuestionIndex.value] == undefined){
            return;
        }

        else if(QuestionIndex.value < questions.value.length - 1){
            QuestionIndex.value++
            SelectedFirstAnswer.value =[ ];
            SelectedSeconeAnswer.value =[ ];
            AllSelectedAnswer.value =[ ];
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
        if(SelectedSeconeAnswer.value.length > SelectedFirstAnswer.value.length){
            const index = SelectedFirstAnswer.value.indexOf(ChooseId);
        
            if (index === -1) {
                SelectedFirstAnswer.value.push(ChooseId);
            } else {
                SelectedFirstAnswer.value.splice(index, 1);
                SelectedSeconeAnswer.value.splice(index, 1);
                removeelement(ChooseId);
            }
            updateAllSelected();
        }

    }

    const UpdateSecondChoose =(ChooseId:number)=>{

        const index = SelectedSeconeAnswer.value.indexOf(ChooseId);
    
        if (index === -1) {
            SelectedSeconeAnswer.value.push(ChooseId);
        } else {
            SelectedSeconeAnswer.value.splice(index, 1);
            SelectedFirstAnswer.value.splice(index, 1);
            removeelement(ChooseId);
        }

    }

    const updateAllSelected = ()=>{

        if(SelectedFirstAnswer.value[SelectedFirstAnswer.value.length - 1] !== undefined && SelectedSeconeAnswer.value[SelectedSeconeAnswer.value.length - 1] !== undefined){

            AllSelectedAnswer.value.push({
                SelectedSeconeAnswer: SelectedFirstAnswer.value[SelectedFirstAnswer.value.length - 1],
                SelectedFirstAnswer: SelectedSeconeAnswer.value[SelectedSeconeAnswer.value.length - 1],   
            })

        }

        // console.log(AllSelectedAnswer.value)

    }

    const removeelement = (number:number)=>{
        AllSelectedAnswer.value.map((el)=>{
            if(el.SelectedFirstAnswer == number){
                AllSelectedAnswer.value.splice(AllSelectedAnswer.value.indexOf(el), 1);
            }
        })
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
                    <label for="answer1"  @click="UpdateFirstChoose(questions[QuestionIndex].first_side[0].id)" :class="SelectedFirstAnswer.includes(1) ? `selected`:``">{{ questions[QuestionIndex].first_side[0].title }}</label>
                    <input id="answer1" type="radio"  :value="questions[QuestionIndex].first_side[0].id">
                </div>
                <div class="question question-choose">
                    <label for="answer2" @click="UpdateFirstChoose(questions[QuestionIndex].first_side[1].id)" :class="SelectedFirstAnswer.includes(2) ? `selected`:``">{{ questions[QuestionIndex].first_side[1].title }}</label>
                    <input id="answer2" type="radio"  :value="questions[QuestionIndex].first_side[1].id">
                </div>
                <div class="question question-choose">
                    <label for="answer3" @click="UpdateFirstChoose(questions[QuestionIndex].first_side[2].id)" :class="SelectedFirstAnswer.includes(3) ? `selected`:``">{{ questions[QuestionIndex].first_side[2].title }}</label>
                    <input id="answer3" type="radio" :value="questions[QuestionIndex].first_side[2].id">
                </div>
                <div class="question question-choose">
                    <label for="answer4" @click="UpdateFirstChoose(questions[QuestionIndex].first_side[3].id)" :class="SelectedFirstAnswer.includes(4)? `selected`:``">{{ questions[QuestionIndex].first_side[3].title }}</label>
                    <input id="answer4" type="radio"  :value="questions[QuestionIndex].first_side[3].id">
                </div>
            </div>
            <div class="questions">
                <div class="question question-choose">
                    <label for="answer5"  @click="UpdateSecondChoose(questions[QuestionIndex].second_side[0].id)" :class="SelectedSeconeAnswer.includes(1) ? `selected`:``">{{ questions[QuestionIndex].second_side[0].title }}</label>
                    <input id="answer5" type="radio"  :value="questions[QuestionIndex].second_side[0].id">
                </div>
                <div class="question question-choose">
                    <label for="answer6" @click="UpdateSecondChoose(questions[QuestionIndex].second_side[1].id)" :class="SelectedSeconeAnswer.includes(2) ? `selected`:``">{{ questions[QuestionIndex].second_side[1].title }}</label>
                    <input id="answer6" type="radio" :value="questions[QuestionIndex].second_side[1].id">
                </div>
                <div class="question question-choose">
                    <label for="answer7" @click="UpdateSecondChoose(questions[QuestionIndex].second_side[2].id)" :class="SelectedSeconeAnswer.includes(3) ? `selected`:``">{{ questions[QuestionIndex].second_side[2].title }}</label>
                    <input id="answer7" type="radio"  :value="questions[QuestionIndex].second_side[2].id">
                </div>
                <div class="question question-choose">
                    <label for="answer8" @click="UpdateSecondChoose(questions[QuestionIndex].second_side[3].id)" :class="SelectedSeconeAnswer .includes(4)? `selected`:``">{{ questions[QuestionIndex].second_side[3].title }}</label>
                    <input id="answer8" type="radio"  :value="questions[QuestionIndex].second_side[3].id">
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
.question-choose label{
    width: 330px !important;
    height: 55px !important;
}




</style>