<script lang="ts" setup>
import callIcon from "../../public/icons/callIcon.vue";
import LockIcon from "../../public/icons/LockIcon.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import EmailBuilder from "~/features/VerifyCodeFeature/presentation/builder/email_builder";
import {onMounted, ref} from "vue";
import VerifyCodeParams from "~/features/VerifyCodeFeature/Core/Params/verfiy_code_params";
import VerifyCodeUseCase from "~/features/VerifyCodeFeature/Domain/use_case/verify_code_use_case";
import VerifyCodeController from "~/features/VerifyCodeFeature/presentation/controllers/verify_code_controller";

const router = useRouter();

definePageMeta({
  layout: "login",
});

const firstnumber = ref();
const secondnumber = ref();
const thirdnumber = ref();
const fourthnumber = ref();
const optvalue = ref("");

const value = ref(null);
const items = ref(["ar", "en"]);


const CheckCode = ()=>{
  EmailBuilder.Instance.getEmail();
  // console.log(EmailBuilder.Instance.getEmail());
  // console.log(optvalue.value);
  const varifyCode = new VerifyCodeParams(EmailBuilder.Instance.getEmail() || "", optvalue.value , "AuthRegister");
  const verifyCodeUseCase = VerifyCodeController.getInstance();
  verifyCodeUseCase.verifyCode(varifyCode , router);
}


onMounted(() => {
  if(!EmailBuilder.Instance.getEmail()) {
    router.push("/Auth/register");
  }
});






</script>

<template>
  <div class="login-container pass-forgit">
    <div class="login-form">
<!--      <div class="side card flex justify-center">-->
<!--        <AutoComplete-->
<!--          v-model="value"-->
<!--          dropdown-->
<!--          :suggestions="items"-->
<!--          class="select"-->
<!--        />-->
<!--      </div>-->
      <!-- <img class="background-circle" src="../../public/images/Component15.png" alt=""> -->
      <!-- <img src="../../public/images/logo.png" alt=""> -->
      <h3>تأكيد رمز انشاء الحساب</h3>
      <p class="pass-code">
        ادخل الكود الذى تم ارساله اليك على بريدك الاكترونى
      </p>
      <P class="pass-code1"> {{ EmailBuilder.Instance.getEmail() }}</P>

      <div class="inputs inputs-pass">
        <div class="login-code">
          <div class="card flex justify-center">
            <InputOtp v-model="optvalue" :length="6">
              <template #default="{ attrs, events }">
                <input
                  type="text"
                  v-bind="attrs"
                  v-on="events"
                  class="code-number-box"
                  placeholder="0"
                />
              </template>
            </InputOtp>
          </div>
        </div>

        <div class="btns btns-home">
          <div class="resend-code">
            <p class="not-send">اعادة ارسال الكود</p>
            <p>لم تستلم الكود بعد؟</p>
          </div>
          <!-- @click="router.push('/login/newpass')" -->
        <button
            @click="CheckCode"
            class="login-btn pass-btn"
            >
            تأكيد
            <LeftArrowIcon class="left-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pass-code {
  width: 400px !important;
}
.pass-code1 {
  font-family: "regular";
  font-weight: 400;
  font-size: 18px;
  color: #0752ac !important;
  text-align: center;
}
.pass-forgit{

  background-image: url(../../public//images/background.png);
}
.login-container .login-form .btns.btns-home button {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}
.left-icon {
  width: 24px;
  height: 24px;
}
.login-form {
  width: 70%;
}
</style>
