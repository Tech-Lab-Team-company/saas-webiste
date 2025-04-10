    
<script lang="ts" setup>
    import LockIcon from '~/public/icons/LockIcon.vue';
    import { ref } from "vue";

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
        <img src="../../public/images/newpassword.png" alt="login">
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
        <h3>كلمه مرور جديده</h3>
        <p>ادخل كلمه مرور جديده و احرص على ان تكون تحتوى على اكثر من 8 حروف و علامات قويه مثل # @ &</p>

        <div class="inputs inputs-pass">
      
            <div class="login-input">
                <input type="password" placeholder="كلمه المرور الجديده">
                <LockIcon class="login-call-icon"/>
            </div>
            <div class="login-input">
                <input type="password" placeholder="تأكيد كلمه المرور الجديده">
                <LockIcon class="login-call-icon"/>
            </div>
           
        
            <div class="btns btns-home">
                <button class="login-btn">تأكيد</button>
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