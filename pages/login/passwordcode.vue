    
<script lang="ts" setup>
import callIcon from '../../public/icons/callIcon.vue';
import LockIcon from '../../public/icons/LockIcon.vue';
const router = useRouter();

definePageMeta({
    layout: 'login' 
});

const firstnumber = ref();
const secondnumber = ref();
const thirdnumber = ref();
const fourthnumber = ref();



const value = ref(null);
const items = ref([
    'ar',
    'en',
]);

// const search = (event) => {
//     let _items = [...Array(10).keys()];

//     items.value = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
// }      


import { ref } from 'vue';


                    
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
        <p class="pass-code">ادخل الكود الذى تم ارساله اليك على بريدك الاكترونى sarael*****@gmail.com</p>

        <div class="inputs inputs-pass ">


            <div class="login-code">
                <div class="card flex justify-center">
                    <InputOtp v-model="value">
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
                <button class="login-btn pass-btn" @click="router.push('/login/newpass')">تأكيد</button>
            </div>
        
        </div>

    </div>
</div>
</template>
             

<style scoped></style>
