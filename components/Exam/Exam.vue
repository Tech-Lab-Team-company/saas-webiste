<script setup lang="ts">
import ExamDetailsParams from '~/features/FetchExams/Core/Params/exam_details_params';
import type ExamDetailsModel from '~/features/FetchExams/Data/models/exam_details_model';
import ExamDetailsController from '~/features/FetchExams/presentation/controllers/exam_details_controller';


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
    <div class="Exam-contariner">
        <ExamHeader :CourseDataHeader="ExamDetails" />
        <ExamTime  />
    </div>
</template>


<style scoped lang="scss">

.Exam-contariner{
    margin-top:20px;
    width: 100%;
    background-image: url('../../public/images/background.png');
    background-repeat: repeat-y;
}

</style>