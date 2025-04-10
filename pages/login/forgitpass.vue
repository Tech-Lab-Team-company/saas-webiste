    
<script lang="ts" setup>
import callIcon from '../../public/icons/callIcon.vue';
import LockIcon from '../../public/icons/LockIcon.vue';
const router = useRouter();

definePageMeta({
    layout: 'login' 
});
import { ref } from "vue";

const value = ref(null);
const items = ref([
    'ar',
    'en',
]);

const search = (event) => {
    let _items = [...Array(10).keys()];

    items.value = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
}
</script>


<template>
<div class="login-container pass-forgit">
    <div class="login-image">
        <img src="../../public/images/forgetpass.png" alt="login">
    </div>
    <div class="login-form">
        <div class="side card flex justify-center">
                    <AutoComplete 
                        v-model="value" 
                        dropdown 
                        :suggestions="items" 
                        class="select"
                         />
                </div>
        <img class="background-circle" src="../../public/images/Component15.png" alt="">
        <img src="../../public/images/logo.png" alt="">
        <h3>نسيت كلمة المرور</h3>
        <p>ادخل البريد الالكترونى الذى سوف نرسل اليك كود استرجاع كلمه المرور عليه</p>

        <div class="inputs inputs-pass forgit-pass">
            <div class="login-input">
                <input type="text" placeholder="رقم الهاتف">
                <callIcon class="login-call-icon"/>
            </div>
         
            <div class="btns btns-home">
                <button class="login-btn" @click="router.push('/login/passwordcode')">ارسال الكود</button>
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