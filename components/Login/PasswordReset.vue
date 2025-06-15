    
<script lang="ts" setup>
import callIcon from '../../public/icons/callIcon.vue';


import SentCodeController from '~/features/ResetPasswordFeature/presentation/controllers/sent_code_controller';
import SentCodeParams from '~/features/ResetPasswordFeature/Core/Params/sent_code_params';


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
        <img src="../../public/images/logo.png" alt="">
        <h3>{{ $t('نسيت كلمة المرور') }}</h3>
        <p>{{ $t('ادخل البريد الالكترونى الذى سوف نرسل اليك كود استرجاع كلمه المرور عليه') }}</p>

        <div class="inputs inputs-pass forgit-pass">
            <div class="login-input">
                <input type="text" placeholder="رقم الهاتف" v-model="phoneNumber">
                
                <callIcon class="login-call-icon"/>
            </div>
         
            <div class="btns btns-home" >
                <button @click="sendotp" class="login-btn">{{ $t('ارسال الكود') }}</button>
            </div>
        </div>

    </div>
</div>
</template>


<style scoped>

.login-image img{
    width: 90%;
}

</style>                