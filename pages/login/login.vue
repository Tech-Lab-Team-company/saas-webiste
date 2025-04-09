    
<script lang="ts" setup>
   definePageMeta({
        layout: 'login' 
    });

</script>


<template>
    <div class="login-container">
        <div class="login-image">
            <img src="../../public/images/login.png" alt="login">
        </div>
        <div class="login-form">
            <img src="../../public/images/logo.png" alt="">
            <h3>مرحبا بك فى منصتنا التعليمية</h3>
            <p>تعطي صفحة تسجيل الدخول الأولوية لأمن المستخدم، وتقدم تجربة سلسة تضمن الوصول السريع والمريح إلى مجموعة من فوائد النظام.</p>

            <div class="btns">
                <button class="login-btn">تسجيل الدخول</button>
                <button class="create-account-btn">انشاء حساب</button>
                <div class="btn-or">
                    <hr class="login-hr" />
                    <p>او سجل عن طريق</p>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped lang="scss">
.login-container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    // margin-top: auto;
    // margin-bottom: auto;
    .login-form{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        margin-top: auto;
        margin-bottom: auto;
        // background-image: url('../../public/images/circlebackground.png');

        p{
            color:#A3ADBB;
            max-width: 400px;
            text-align: center;
        }

        .btns{
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            margin-top: 25px;
            
            button{
                padding: 10px 20px;
                border-radius: 10px;
                width: 80%;
                margin-left: auto;
                margin-right: auto;
            }
            .login-btn{
                background-color: #032855;
                color: white;
            }

            .create-account-btn{
                color: #032855;
                border: 1px solid #032855;
            }
        }

        .btn-or{

            .login-hr{
                margin-top: 15px;
                border: none;
                height: 1px;
                background-color: #EDF1F3;
                width: 80%;
                margin-left: auto;
                margin-right: auto;
            }
        }

    }
}
</style>                