    
<script lang="ts" setup>
    import googleIcon from '../../public/icons/googleIcon.vue'; 
    import iphoneIcon from '../../public/icons/iphoneIcon.vue'; 
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
            <img src="../../public/images/login.png" alt="login">
        </div>
        <div class="login-form">
                <!-- <div class="side card flex justify-center">
                    <AutoComplete 
                        v-model="value" 
                        dropdown 
                        :suggestions="items" 
                        class="select"
                         />
                </div> -->
                <img class="background-circle" src="../../public/images/Component15.png" alt="">
                <img src="../../public/images/logo.png" alt="">
                <h3>مرحبا بك فى منصتنا التعليمية</h3>
                <p>تعطي صفحة تسجيل الدخول الأولوية لأمن المستخدم، وتقدم تجربة سلسة تضمن الوصول السريع والمريح إلى مجموعة من فوائد النظام.</p>

                <div class="btns">
                    <button class="login-btn" @click="router.push('/login/loginhome')">تسجيل الدخول</button>
                    <button class="create-account-btn">انشاء حساب</button>
                    <div class="btn-or">
                        <hr class="login-hr" />
                        <p>او سجل عن طريق</p>
                    </div>
                    <div class="icon-btns">
                        <button class="google-btn">
                        <googleIcon />
                        </button>
                        <button class="iphone-btn">
                        <iphoneIcon />
                        </button>
                    </div>
                    <p class="login-later-btn">التسجيل لاحقا.. <span> الدخول كزائر</span></p>
                </div>

            </div>
        </div>
  
</template>

<style scoped ></style>                


