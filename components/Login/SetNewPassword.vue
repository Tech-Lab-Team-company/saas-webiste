    
<script lang="ts" setup>
import SetNewPasswordParams from "~/features/SetNewPasswordFeature/Core/Params/set_new_password_params";
import SetNewPasswordController from "~/features/SetNewPasswordFeature/presentation/controllers/set_new_password_controller";
import ResetPasswordBuilder from "~/features/ResetPasswordFeature/presentation/builders/reset_password_builder";

const router = useRouter();
definePageMeta({
    layout: 'login' 
});


const Password =ref("")
const confirmPassword=ref("")

const setNewPassword = ()=>{
    const NewPasswordParams = new SetNewPasswordParams(ResetPasswordBuilder.Instance.getEmail()|| "" , Password.value , confirmPassword.value);
    const NewPasswordController = SetNewPasswordController.getInstance();
    NewPasswordController.setNewPassword(NewPasswordParams , router);
}



const password = ref("");
const confirmedPassword = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

const validatePassword = () => {
  const passwordRegex = /^(?=.*[/*#@]).{8,}$/;

  if (!password.value) {
    passwordError.value = "كلمة المرور مطلوبة";
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value =
      "كلمة المرور يجب أن تكون أكثر من 8 أحرف وتحتوي على رموز مثل (/*#@)";
  } else {
    passwordError.value = "";
  }

  if (confirmedPassword.value && confirmedPassword.value !== password.value) {
    confirmPasswordError.value = "كلمة المرور غير متطابقة";
  } else {
    confirmedPassword.value = "";
  }
};


const UserSettingStore = useSettingStore();

</script>


<template>
<div class="login-container">
<div class="login-image">
    <img src="../../public/images/newpassword.png" alt="login">
</div>
<div class="login-form">

    <img class="background-circle" src="../../public/images/Component15.png" alt="">

    <NuxtLink to="/" aria-label="العودة إلى الصفحة الرئيسية">
      <img :src="UserSettingStore.setting.image.img" width="150" alt="شعار الموقع">
    </NuxtLink>
    <h3>{{ $t('كلمه مرور جديده') }}</h3>
    <p>{{ $t('ادخل كلمه مرور جديده و احرص على ان تكون تحتوى على اكثر من 8 حروف و علامات قويه مثل # @ &') }}</p>

    <div class="inputs inputs-pass">

        <div class="auth-field-group">
            <label class="auth-field-label" for="new-password">{{ $t('كلمة المرور الجديدة') }}</label>
            <div class="login-input">
                <input
                  id="new-password"
                  type="password"
                  v-model="Password"
                  @input="validatePassword"
                />
            </div>
        </div>

        <div class="auth-field-group">
            <label class="auth-field-label" for="confirm-new-password">{{ $t('تأكيد كلمة المرور الجديدة') }}</label>
            <div class="login-input">
                <input id="confirm-new-password" type="password" v-model="confirmPassword">
            </div>
        </div>
       
    
        <div class="btns btns-home">
            <button @click="setNewPassword" class="login-btn">{{ $t('تأكيد') }}</button>
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
