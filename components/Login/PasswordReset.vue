    
<script lang="ts" setup>
import callIcon from '../../public/icons/callIcon.vue';


import SentCodeController from '~/features/ResetPasswordFeature/presentation/controllers/sent_code_controller';
import SentCodeParams from '~/features/ResetPasswordFeature/Core/Params/sent_code_params';
import countries from "~/data/countries.json";

const UserSettingStore = useSettingStore();
const selectedCountry = ref(UserSettingStore?.setting?.country_code);

const router = useRouter();

definePageMeta({
    layout: 'login' 
});
import { ref } from "vue";



const phoneNumber = ref("");




const sendotp =()=>{
    const restpassparams = new SentCodeParams(phoneNumber.value)
    const sentCodeController = SentCodeController.getInstance();
    sentCodeController.sentCode(restpassparams,router);
}

</script>


<template>
<div class="login-container pass-forgit">
    <div class="login-image">
        <img src="../../public/images/forgetpass.png" alt="login">
    </div>
    <div class="login-form">
   
        <img class="background-circle" src="../../public/images/Component15.png" alt="">
        <img :src="UserSettingStore.setting.image.img" width="150px" alt="logo">
        <h3>{{ $t('نسيت كلمة المرور') }}</h3>
        <p>{{ $t('ادخل البريد الالكترونى الذى سوف نرسل اليك كود استرجاع كلمه المرور عليه') }}</p>

        <div class="inputs inputs-pass forgit-pass">
            <div class="phone">
                <div class="login-input">
                    <input type="text" placeholder="رقم الهاتف" v-model="phoneNumber">
                    <callIcon class="login-call-icon"/>
                </div>
                <div class="phone-code">

                    <Select :defaultValue="{ dial_code: `${UserSettingStore?.setting?.country_code}` }" v-model="selectedCountry" :options="countries" filter optionLabel="name"
                    placeholder="Select a Country" class="w-full md:w-56">

                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center">
                        <div>{{ slotProps.value.dial_code }} {{ slotProps.value.flag }}</div>
                        </div>
                        <span v-else>
                        {{ slotProps.placeholder }}
                        </span>
                    </template>

                    <template #option="slotProps">
                        <div class="flex items-center "  >
                        <span>{{ slotProps.option.flag }}</span>
                        <span>{{ slotProps.option.name }}</span>
                        <div>({{ slotProps.option.dial_code }})</div>
                        </div>
                    </template>

                    </Select>
                </div>
            </div>

         
            <div class="btns btns-home" >
                <button @click="sendotp" class="login-btn">{{ $t('ارسال الكود') }}</button>
            </div>
        </div>

    </div>
</div>
</template>


<style scoped lang="scss">
// .forgit-pass{
//     display: flex;
//     width: 100%;
//     align-items: center;
//     gap: 10px;
// }

.phone{
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    flex-direction: row-reverse;

    .login-input{
        width: 100%;
    }


}
.login-image img{
    width: 90%;
}

</style>                