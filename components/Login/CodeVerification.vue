    
<script lang="ts" setup>

import VerifyCodeParams from "~/features/VerifyCodeFeature/Core/Params/verfiy_code_params";
import VerifyCodeController from "~/features/VerifyCodeFeature/presentation/controllers/verify_code_controller";
import ResetPasswordBuilder from "~/features/ResetPasswordFeature/presentation/builders/reset_password_builder";

const router = useRouter();

definePageMeta({
    layout: 'login' 
});



const OtpValue = ref("");
    

import { ref } from 'vue';

const CheckCode = ()=>{
  ResetPasswordBuilder.Instance.getEmail();
  const varifyCode = new VerifyCodeParams(ResetPasswordBuilder.Instance.getEmail() || "", OtpValue.value ,"ResetPassword");
  const verifyCodeUseCase = VerifyCodeController.getInstance();
  verifyCodeUseCase.verifyCode(varifyCode , router);
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
        <h3>نسيت كلمة المرور</h3>
        <p class="pass-code">ادخل الكود الذى تم ارساله اليك على بريدك الاكترونى sarael*****@gmail.com</p>

        <div class="inputs inputs-pass ">


            <div class="login-code">
                <div class="card flex justify-center">
                    <InputOtp v-model="OtpValue" :length=6 >
                        <template #default="{ attrs, events }">
                            <input type="text" v-bind="attrs" v-on="events" class="code-number-box" placeholder="0" />
                        </template>
                    </InputOtp>
                </div>
               
            </div>

            
            <div class="btns btns-home">
                <div class="resend-code">
                    <p class="not-send">اعادة ارسال الكود</p>
                    <p >لم تستلم الكود بعد؟</p>
                </div>
                <button class="login-btn pass-btn" @click="CheckCode">تأكيد</button>
            </div>
        
        </div>

    </div>
</div>
</template>
             

<style scoped>
.login-image img{
    width: 90%;
}</style>
