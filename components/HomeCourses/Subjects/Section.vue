<script setup lang="ts">
import FetchGeneralSubjectParams from '~/features/FetchGenralSubjects/Core/Params/fetch_genral_subjects_params';
import type GeneralSubjectsModel from '~/features/FetchGenralSubjects/Data/models/general_subjects_model';
import FetchGeneralSubjectController from '~/features/FetchGenralSubjects/presentation/controllers/fetch_general_subjects_controller';


const Subjects = ref<GeneralSubjectsModel[]>()
const GetGenralSubjects = async () => {
    const fetchGeneralSubjectParams = new FetchGeneralSubjectParams();
    const fetchGeneralSubjectController = FetchGeneralSubjectController.getInstance();
    const state = await fetchGeneralSubjectController.fetchGeneralSubject(fetchGeneralSubjectParams);
    if(state.value.data){
        Subjects.value = state.value.data
    }
}

onMounted(() => {
    GetGenralSubjects();
})

</script>

<template>
    <div class="home-subjects">
        <home-courses-subjects-card v-for="(subject , index) in Subjects" :key="index" :title="subject.title" :image="subject.image" />
    </div>
</template>