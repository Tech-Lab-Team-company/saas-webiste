<script setup lang="ts">
import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
import Dashedicon from '~/public/icons/dashedicon.vue';
import PaymentDialog from './PaymentDialog.vue';
import CoursesPaymentParams from '~/features/CoursePayment/Core/Params/courses_payment_params';
import CoursesPaymentController from '~/features/CoursePayment/presentation/controllers/courses_payment_controller';

import microphone from "@/public/icons/microphone.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";

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

const userSetting = useSettingStore();

const router = useRouter();

const AddPayment = async () => {
    const coursePaymentParams = new CoursesPaymentParams(Number(router.currentRoute.value.params.id), 1, 1, null);
    const coursesPaymentController = CoursesPaymentController.getInstance();
    const state = await coursesPaymentController.CoursesPayment(coursePaymentParams);
    if (state.value.message) {
        status.value = 1;
    }

}
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
                <p class="salary" v-if="CardDetails?.CoursePrice != 0 && !(CardDetails?.is_subscribed)"> <span>{{
                    $t(`${CardDetails?.currency}`)}}</span><span>{{ CardDetails?.CoursePrice }} </span></p>
                <p class="salary" v-else-if="CardDetails?.is_subscribed">تم شراء الكورس</p>
                
                <p class="salary" v-else>{{ $t('مجانى') }} </p>
                   <div class="card-content">
                <p class="card-text1" v-if="CardDetails?.course_videos ">
                  <video1 />
                  {{ CardDetails?.course_videos }}
                  {{ $t('فيديو') }}
                </p>
                <p class="card-text1" v-if="CardDetails?.course_docs ">
                  <note />
                  {{ CardDetails?.course_docs }}
                  {{ $t('ملف ورقي') }}
                </p>
                <p class="card-text1" v-if="CardDetails?.course_records ">
                  <microphone />
                  {{ CardDetails?.course_records }}
                  {{ $t('ملف صوتى') }}
                </p>
              </div>
                <div class="card-profile">
                    <p>{{ CardDetails?.Teacher?.name || userSetting.setting?.name }}</p>
                    <img :src="CardDetails?.Teacher?.image?.img ||userSetting.setting?.image?.img ">
                </div>
            </div>


            <div class="btns btns-container">

                <!--  :class="{ 'multi-btn': userSetting.setting?.join_option_status == 1 }" -->
                <PaymentDialog :status="status" class="payment-dialog" v-if="CardDetails?.CoursePrice != 0"/>
                <!-- <button v-if="userSetting.setting?.join_option_status == 1" class="payment-btn" @click="AddPayment">
                        طلب الانضمام
                </button> -->
            </div>

        </div>
        <div class="card-video">
            <img :src="CardDetails?.Image?.img ||userSetting.setting?.image?.img " :alt="CardDetails?.Image?.image">
        </div>

    </div>
</template>

<style scoped lang="scss">
.card-text-footer{
    gap:50px;
}
.card-content{
    display: flex;
    flex-direction:row-reverse;
    justify-content: center;
    width:50%;
    margin-left:auto;
    gap:50px;
    flex-wrap: wrap;


    @media(max-width:1000px){
    gap: 5px;
        justify-content: flex-start;
    }

    
    .card-text1{
        display: flex;
        flex-direction:row-reverse;
        gap:6px;

    }

}
.btns-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .payment-dialog {
        width: 100%;

        &.multi-btn {
            width: 50%;
        }
    }

    button {
        width: 50%;
    }
}

.salary {
    display: flex;
    gap: 4px;

    align-items: center;
}

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


.card-text-description {
    max-height: 500px;
    height: fit-content;
    overflow-y: auto;
}
</style>