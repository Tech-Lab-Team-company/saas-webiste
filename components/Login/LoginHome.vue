    
<script lang="ts" setup>
import googleIcon from '../../public/icons/googleIcon.vue'; 
import iphoneIcon from '../../public/icons/iphoneIcon.vue'; 
import { ref } from "vue";

const router = useRouter();



</script>


<template>

<div class="login-container">
    <div class="login-image">
        <img src="../../public/images/login.png" alt="login">
    </div>
    <div class="login-form">
            <img class="background-circle" src="../../public/images/Component15.png" alt="">
            <img src="../../public/images/logo.png" alt="">
            <h3>{{ $t('مرحبا بك فى منصتنا التعليمية') }}</h3>
            <p>{{ $t('تعطي صفحة تسجيل الدخول الأولوية لأمن المستخدم، وتقدم تجربة سلسة تضمن الوصول السريع والمريح إلى مجموعة من فوائد النظام.') }}</p>

            <div class="btns">
                <nuxt-link class="nuxt-link-btn" to="/login/loginhome"><button class="login-btn">{{ $t('تسجيل الدخول') }}</button></nuxt-link>
                <nuxt-link class="nuxt-link-btn" to="/auth/register"> <button class="create-account-btn">{{ $t('انشاء حساب') }}</button></nuxt-link>

<!--                <div class="btn-or">-->
<!--                    <hr class="login-hr" />-->
<!--                    <p>{{ $t('او سجل عن طريق') }}</p>-->
<!--                </div>-->
<!--                <div class="icon-btns">-->
<!--                    <button class="google-btn">-->
<!--                    <googleIcon />-->
<!--                    </button>-->
<!--                    <button class="iphone-btn">-->
<!--                    <iphoneIcon />-->
<!--                    </button>-->
<!--                </div>-->
<!--                <NuxtLink to="/"><p class="login-later-btn">{{ $t('التسجيل لاحقا..') }} <span> {{ $t('الدخول كزائر') }}</span></p></NuxtLink>-->
            </div>

        </div>
    </div>

</template>

<style scoped ></style>                


