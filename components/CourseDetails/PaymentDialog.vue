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
const router = useRouter()
const props = defineProps(['status'])
const status = ref(props.status)
const Image = ref<File | null>(null)
const PhoneNumber = ref<string>()
const PaymentMethod = ref<number>()

const updateFiles = async (files: File[]) => {
  Image.value = files[0];
};

const AddPayment = async () => {
  const coursePaymentParams = new CoursesPaymentParams({
    CourseId: Number(router.currentRoute.value.params.id),
    PaymentMethod: PaymentMethod.value,
    Account: PhoneNumber.value,
    Receipt: Image.value
  });
  const coursesPaymentController = CoursesPaymentController.getInstance();
  const state = await coursesPaymentController.CoursesPayment(coursePaymentParams);
  if (state.value.message) {
    status.value = 1;
  }
  visible.value = false;
}


const userStore = useUserStore()
watch(
  () => props.status,
  (newValue) => {
    status.value = newValue;
  })

const UserSetting = useSettingStore();
const PaymentStore = usePaymentStore();
const SelectedPaymentMethod = ref();

const ChooseMethod = (method: Number) => {
  const SelectedMethod = PaymentStore.Payment?.filter((item) => {
    return item.id == method
  })

  if (SelectedMethod[0]?.type == 1) {
    SelectedPaymentMethod.value = true
  }
  else {
    SelectedPaymentMethod.value = false

  }
  // console.log(SelectedPaymentMethod.value)
}

watch(() => PaymentMethod.value,
  (Newvalue) => {
    ChooseMethod(Number(Newvalue))
  }
)

</script>

<template>
  <div class="edit-dialog-container">
    <div class="btns">
      <button @click="visible = true" v-if="status == 0 && userStore.user">شراء الكورس</button>
      <button @click="visible = false" v-if="status == 1 && userStore.user" disabled class="btn-disabled">فى انتظار قبول
        الطلب</button>
      <button @click="visible = false" v-if="status == 4 && userStore.user" disabled class="btn-disabled">تم رفض
        الطلب</button>
      <button @click="visible = false" v-if="!userStore.user" disabled class="btn-disabled">يجب تسجيل الدخول</button>
      <!-- <button @click="visible = false" v-if="UserSetting.setting?.join_option_status == 1"  >الانضمام الى الكروس</button> -->
    </div>
    <Dialog v-model:visible="visible" class="dialog" modal :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

      <div class="payment-method-container">

        <div class="payment-method" v-for="(method, index) in PaymentStore.Payment" :key="index">
          <img @click="PaymentMethod = method.id" :src="method.image" alt="payment" class="payment-img">
          <label class="payment-title" :for="`${method?.id}`">{{ method.title }}</label>
          <input :id="`${method?.id}`" type="radio" v-model="PaymentMethod" :value="method.id" name="payment"
          >
          <!-- @change="ChooseMethod(Number(method.id))" -->
        </div>
      </div>

      <input v-if="SelectedPaymentMethod" type="tel" placeholder="ادخل رقم الهاتف" class="input-data"
        v-model="PhoneNumber">
      <AddMedia v-if="SelectedPaymentMethod" class="add-media" :index="0" @update:images="updateFiles" />
      <button v-if="SelectedPaymentMethod" @click="AddPayment" class=" btn-buy">شراء</button>
      <button v-else class=" btn-buy">شراء</button>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.payment-method-container {
  display: flex;
  justify-content: flex-end;
  gap: 35px;

  .payment-method {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .payment-img {
      cursor: pointer;
    }

    .payment-title {
      cursor: pointer;

    }
  }
}

.input-data {
  border: 1px solid #8080802e;
  border-radius: 10px;
  padding: 10px;
  margin-block: 10px;
  text-align: right;

  &:focus {
    outline: none;

  }
}

.dialog {

  .add-media {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 100%;
    height: 100%;

  }

  .btn-buy {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    border-radius: 10px;
    padding: 12px;
    font-size: 20px;
    font-weight: 600;
    color: white;
    background-color: var(--secondary-color);
  }

}

.edit-dialog-container {
  .btns {
    button {
      &.btn-disabled {
        background-color: gainsboro;
      }
    }
  }
}
</style>
