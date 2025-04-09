<script setup lang="ts">
    definePageMeta({
        layout: 'auth' 
    });
    
    import LeftArrowIconbtn from '~/public/icons/LeftArrowIconbtn.vue'
const value = ref(null);
const items = ref([
    'ar',
    'en',
]);
</script>

<template>
    <!-- <div class="auth-mail-home"> -->
        <div class="login-container auth-container">

      
        <div class="login-form">
            <h3>تأكيد رمز انشاء الحساب</h3>
            <p class="pass-code">ادخل الكود الذى تم ارساله اليك على بريدك الاكترونى <span>sarael*****@gmail.com</span></p>

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
                <button class="login-btn pass-btn ">
                    <LeftArrowIconbtn class="left-icon" />
                    <p>تأكيد</p>
                </button>
            </div>
        
        </div>

    </div>
</div>
    <!-- </div> -->
</template>

<style scoped lang="scss">
.code-number-box{
    margin-right: 10px;
    border-color:#F0F1F4 ;
}

.btns{
    .resend-code{
        p{
            cursor: pointer;
        }
    }
}



</style>