<script setup lang="ts">
import RightArrowIcon from '~/public/icons/RightArrowIcon.vue';
import LeftArrowIcon from '~/public/icons/LeftArrowIcon.vue';
import type ExamDetailsModel from '~/features/FetchExams/Data/models/exam_details_model';
import QuestionAnswerController from '~/features/SubmitQuestionAnswer/presentation/controllers/submit_question_answer_controller';
import QuestionAnswerParams from '~/features/SubmitQuestionAnswer/Core/Params/submit_question_answer_params';

const SelectedAnswer = ref<string[]>([]);
const QuestionIndex = ref(0);
const Answer = ref()



const props = defineProps({
    QuestionDetails: {
        type: Object as () => ExamDetailsModel | null,
        default: null
    },
    remainingTimeMinutes: {
        type: Number,
    }
});
const RemainingTimeMinutes = ref<Number>(props.remainingTimeMinutes ?? 0)

const questionDetails = ref(props.QuestionDetails);

watch(() => props.QuestionDetails, (newValue) => {
    questionDetails.value = newValue;
}, { immediate: true });



const emit = defineEmits(['SendAnswerIndex'])
const SendEmit = () => {
    emit('SendAnswerIndex', QuestionIndex.value)
}

const selected = ref([])

const router = useRouter()
console.log(Answer.value, "Answer")
const toast = useToast();

const sendData = async (status: string) => {
    console.log(selected.value[QuestionIndex.value])
    const questionAnswerParams = new QuestionAnswerParams(
        Number(router.currentRoute.value.params.exam),
        Number(questionDetails?.value?.questions[QuestionIndex.value]?.id),
        selected.value[QuestionIndex.value]
    );
    const questionAnswerController = QuestionAnswerController.getInstance()
    if (Number(RemainingTimeMinutes.value) > 0 && selected.value[QuestionIndex.value] !== undefined) {
        const state = await questionAnswerController.SubmitQuestionAnswer(questionAnswerParams || null, status || " " );
    }
    // if(!(selected.value[QuestionIndex.value])){
    //      toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب اختيار إجابة', life: 3000 });
    // }
}




const IncreaseIndex = () => {

    sendData('');
    if (selected.value[QuestionIndex.value] == undefined) {
        toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب اختيار إجابة', life: 3000 });

        return;
    }

    else if (QuestionIndex.value < (questionDetails.value?.questions?.length ?? 0) - 1) {
        QuestionIndex.value++
          
    
    }


    SendEmit();
}

const EndExam = () => {

    sendData("final");
    if (selected.value[QuestionIndex.value] == undefined) {
        toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب اختيار إجابة', life: 3000 });
    
        return;
    }

    else if (QuestionIndex.value < (questionDetails.value?.questions?.length ?? 0) - 1) {
        QuestionIndex.value++
           if(!(selected.value[QuestionIndex.value])){
         toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب اختيار إجابة', life: 3000 });
    }
    }
    SendEmit();
    // router.push(``)
}


const DeacreseIndes = () => {
    if (QuestionIndex.value > 0) {
        if (QuestionIndex.value > -1) {

            QuestionIndex.value--;
        }
    }
    SendEmit();
}


watch(() => props.remainingTimeMinutes,
    (NewValue) => {
        RemainingTimeMinutes.value = NewValue ?? 0;
    })
</script>

<template>
    <div class="question-container" v-if="QuestionDetails">

        <div class="question-title">
            <p class="question-number">{{ `السؤال ${QuestionIndex + 1}` }}</p>

            <img v-if="questionDetails?.questions[QuestionIndex].image"
                :src="questionDetails?.questions[QuestionIndex].image" alt="image">

            <p class="question-text" v-html="questionDetails?.questions[QuestionIndex].question"> </p>
        </div>
        <form>
            <div class="questions">
                <div class="question" v-for="(answer, index) in questionDetails?.questions[QuestionIndex].answers"
                    :key="index">
                    <label :for="`answer-${answer.id}`" @click="SelectedAnswer[QuestionIndex] = `${answer.id}`"
                        :class="SelectedAnswer[QuestionIndex] == `${answer.id}` ? `selected` : ``"
                        v-html="answer?.answer"></label>
                    <input class="answer" v-model="selected[QuestionIndex]" type="radio" :value="answer.id"
                        name="answer" :id="`answer-${answer.id}`">
                </div>
            </div>
        </form>

        <div class="next-btn" v-if="QuestionIndex == 0 && QuestionIndex != questionDetails?.questions.length - 1">
            <button @click="IncreaseIndex">{{ $t('التالي') }} </button>
        </div>

        <div class="btns" v-if="QuestionIndex > 0 && QuestionIndex < questionDetails?.questions.length - 1">
            <button v-if="QuestionDetails?.allow_shuffle == 1" @click="DeacreseIndes">
                <LeftArrowIcon />
                {{ $t('السابق') }}
            </button>
            <button :class="QuestionDetails?.allow_shuffle == 0 ?`w-50`:``" @click="IncreaseIndex">
                {{ $t('التالي') }}
                <RightArrowIcon />
            </button>
        </div>
        <div class="next-btn finish-btn" v-if="QuestionIndex == questionDetails?.questions.length - 1">
            <button v-if="QuestionDetails?.allow_shuffle" class="back-btn" @click="DeacreseIndes">
                <LeftArrowIcon />
                {{ $t('السابق') }}
            </button>
            <button :class="QuestionDetails?.allow_shuffle == 0 ?`w-full`:``" @click="EndExam">{{ $t('إنهاء الامتحان ') }}</button>
        
        </div>
    </div>

    <!-- <div class="no-content" v-else>
        <p>لايوجد استلة</p>
    </div> -->
</template>


<style scoped lang="scss">
.w-full{
    width: 100% !important ;
}
.w-50{
    width: 50% !important ;

}
.no-content{
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    p{
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
        font-size: 20px;
        font-weight: 600;
        color: #80808096;
    }

}

.finish-btn{
    display: flex;
    justify-content: center;
    align-items: center;
        width: 50%;
    margin-left: auto;
    margin-right: auto;
    gap: 10px;

    .back-btn{
        display: flex;
    }

    button{
        width: 50%;
    }
}
</style>
