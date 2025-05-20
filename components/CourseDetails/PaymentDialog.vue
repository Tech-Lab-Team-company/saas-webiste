<script setup lang="ts">
import { ref, watch } from "vue";
import Dialog from 'primevue/dialog';
import AddMedia from "../helper/AddMedia.vue";
import MediaInterfaceParams from "~/features/CoursesFilter/Core/Params/media_interface_params";
import CoursesPaymentParams from "~/features/CoursePayment/Core/Params/courses_payment_params";
import CoursesPaymentController from "~/features/CoursePayment/presentation/controllers/courses_payment_controller";


const visible = ref(false);
const title = ref('');
const subtitle = ref('');
const descriptoin = ref('');
const router =useRouter()
console.log(router.currentRoute.value.params.id)


    const Image = ref<File | null>(null)

    const updateFiles = async (files: File) => {
        Image.value = files[0];
    };

    const AddPayment = async ()=>{
        const coursePaymentParams = new CoursesPaymentParams( Number(router.currentRoute.value.params.id) , 1 ,1, Image.value);
        const coursesPaymentController = CoursesPaymentController.getInstance();
        const state = await coursesPaymentController.CoursesPayment(coursePaymentParams);
        if(state.value.data){
            console.log(state.value.data , "state.value.data")
        }
        visible.value = false;
    }

</script>

<template>
    <div class="edit-dialog-container">
            <div class="btns" @click="visible = true">
                <button>شراء الكورس</button>
            </div>
            <Dialog v-model:visible="visible" class="dialog"  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <AddMedia
                    class="add-media"
                    :index="0"
                        @update:images="updateFiles"
                    />
                    <button @click="AddPayment" class=" btn-buy">شراء</button>
            </Dialog>
    </div>
</template>

<style scoped lang="scss">
.dialog{

    .add-media{
         display: flex;
         flex-direction: column;
         align-self: center;
         width: 100%;
         height: 100%;
    
     }

     .btn-buy{
        width: 50%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        border-radius: 10px;
        padding: 12px;
        font-size: 20px;
        font-weight: 600;
        color: white;
        background-color: #FFB949;
     }
}


</style>



