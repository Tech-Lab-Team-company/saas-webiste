<script setup lang="ts">
import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
import Dashedicon from '~/public/icons/dashedicon.vue';
import PaymentDialog from './PaymentDialog.vue';



const props = defineProps({
    CourseData: {
        type: Object as () => CourseDetailsModel | null,
        default: null
    },
    status: {
        type: Number,
        default: 0
    }
});

const CardDetails = ref(props.CourseData);
const status = ref(props.status);

watch(() => props.CourseData, (newValue) => {
    CardDetails.value = newValue;
}, { immediate: true });
watch(() => props.status, (newValue) => {
    status.value = newValue;
}, { immediate: true });

</script>

<template>

    <div class="card-container">
        <div class="card-text">

            <div class="card-text-title">
                <p class="card-text-subject-title">{{ CardDetails?.Subject?.title }}</p>
                <p class="card-text-main-title">{{ CardDetails?.title }}</p>
            </div>

            <div class="card-text-description">
                <p v-html="CardDetails?.description"></p>
            </div>
            <hr />
            <div class="card-text-footer">
                <p class="salary" v-if="CardDetails?.CoursePrice != 0">{{ CardDetails?.CoursePrice }} <span>{{ $t('جنيه')
                        }}</span> </p>
                <p class="salary" v-else>{{ $t('مجانى') }} </p>
                <div class="card-profile">
                    <p>{{ CardDetails?.Teacher?.name }}</p>
                    <img :src="CardDetails?.Teacher?.image?.img">
                </div>
            </div>


            <PaymentDialog :status="status" />

        </div>
        <div class="card-video">
            <img :src="CardDetails?.Image?.img" :alt="CardDetails?.Image?.image">
        </div>

    </div>
</template>

<style scoped lang="scss">
.icon {
    position: absolute;
}

.card-container {
    @media (max-width:768px) {
        flex-direction: column;
    }

    .card-video {
        img {

            height: 100%;
        }

        @media (max-width:768px) {
            width: 100%;
        }
    }
}


.card-text-description{
    max-height: 500px;
    height: fit-content;
    overflow-y: auto;
}
</style>