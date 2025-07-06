<script lang="ts" setup>
import LoginParams from '~/features/LoginFeature/Core/Params/login_params';
import callIcon from '../../public/icons/callIcon.vue';
import LockIcon from '../../public/icons/LockIcon.vue';
import LoginController from '~/features/LoginFeature/presentation/controllers/login_controller';

const router = useRouter();
definePageMeta({
    layout: 'login' 
});

const Credential = ref('');
const LoginPassword = ref('');

const LoginData = () => {
    const loginParams = new LoginParams(Credential.value, LoginPassword.value);
    const loginController = LoginController.getInstance();
    loginController.login(loginParams, router);
}

// Handle Enter key press
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        LoginData();
    }
}

const UserSettingStore = useSettingStore();
</script>

<template>
<div class="login-container">
<div class="login-image">
    <img src="../../public/images/login2.png" alt="login">
</div>
<div class="login-form">
    <img class="background-circle" src="../../public/images/Component15.png" alt="">

    <img :src="UserSettingStore.setting.image.img" width="150px" alt="logo">
    <h3>{{ $t('مرحبا بك فى منصتنا التعليمية') }}</h3>
    <p>{{ $t('تعطي صفحة تسجيل الدخول الأولوية لأمن المستخدم، وتقدم تجربة سلسة تضمن الوصول السريع والمريح إلى مجموعة من فوائد النظام.') }}</p>

    <div class="inputs">
        <div class="login-input">
            <input 
                type="text" 
                placeholder="رقم الهاتف" 
                v-model="Credential"
                @keydown="handleKeyPress"
            >
            <callIcon class="login-call-icon"/>
        </div>
        <div class="login-input">
            <input 
                type="password" 
                placeholder="كلمه المرور" 
                v-model="LoginPassword"
                @keydown="handleKeyPress"
            >
            <LockIcon class="login-call-icon"/>
        </div>
       
        <div class="login-or">
            <nuxt-link to="/login/resetpassword"><p>{{ $t('هل نسيت كلمه المرور..؟') }}</p></nuxt-link>
            <div class="remember-me">
                <label for="remember">{{ $t('تذكرنى') }}</label>
                <input id="remember" type="checkbox" >
            </div>
        </div>

        <div class="btns btns-home">
            <button class="login-btn" @click="LoginData">{{ $t('تسجيل الدخول') }}</button>
        </div>
    
    </div>

</div>
</div>
</template>

<style scoped></style>