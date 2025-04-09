    
<script lang="ts" setup>
    import callIcon from '../../public/icons/callIcon.vue';
    import LockIcon from '../../public/icons/LockIcon.vue';
    import { ref } from "vue";

    const router = useRouter();
    definePageMeta({
        layout: 'login' 
    });

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
<div class="login-container">
    <div class="login-image">
        <img src="../../public/images/login2.png" alt="login">
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
        <h3>مرحبا بك فى منصتنا التعليمية</h3>
        <p>تعطي صفحة تسجيل الدخول الأولوية لأمن المستخدم، وتقدم تجربة سلسة تضمن الوصول السريع والمريح إلى مجموعة من فوائد النظام.</p>

        <div class="inputs">
            <div class="login-input">
                <input type="text" placeholder="رقم الهاتف">
                <callIcon class="login-call-icon"/>
            </div>
            <div class="login-input">
                <input type="password" placeholder="كلمه المرور">
                <LockIcon class="login-call-icon"/>
            </div>
           
            <div class="login-or">
                <p @click="router.push('/login/forgitpass')">هل نسيت كلمه المرور..؟</p>
                <div class="remember-me">
                    <label for="remember">تذكرنى</label>
                    <input id="remember" type="checkbox" >
                </div>
            </div>

            <div class="btns btns-home">
                <button class="login-btn">تسجيل الدخول</button>
            </div>
        
        </div>

    </div>
</div>
</template>


<style scoped></style>                