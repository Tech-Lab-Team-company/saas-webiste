<script setup lang="ts">
    import AuthProfile from '~/public/icons/AuthProfile.vue'
    import AuthMail from '~/public/icons/AuthMail.vue'
    import AuthStage from '~/public/icons/AuthStage.vue'
    import AuthRight from '~/public/icons/AuthRight.vue'
</script>


<template>
    <div class="auth-sidebar">
        <div class="auth-info-container">
            <div class="auth-text">
                <p>معلوماتك الشخصيه</p>
                <p>يرجى تقديم معلوماتك التفصيلية</p>
            </div>
            <AuthProfile class="auth-icon" />
        </div>
        <div class="auth-info-container">
            <div class="auth-text">
                <p>تحقق من صندوق الوارد الخاص بك</p>
                <p>تحقق من الرموز المرسلة إلى صندوق الوارد الخاص بك</p>
            </div>
            <AuthMail class="auth-icon" />
        </div>
        <div class="auth-info-container">
            <div class="auth-text">
                <p>مرحلتك التعليمية</p>
                <p>يرجى تقديم معلومات دراستك التفصيلية</p>
            </div>
            <AuthStage class="auth-icon" />
        </div>
        <div class="auth-info-container">
            <div class="auth-text">
                <p>بنجاح</p>
                <p>يمكنك متابعه رحلتك فى منصتنا الان</p>
            </div>
            <AuthRight class="auth-icon" />
        </div>
    </div>

</template>

<style scoped lang="scss">
.auth-sidebar{
    background-color: #F4F5F7;
    display: flex;
    flex-direction: column;
    align-items: end;
    padding: 20px;
    gap: 30px;
    width: fit-content;
    margin-left: auto;


    .auth-info-container{

        display: flex;
        align-items: center;
        text-align: right;
        gap:10px;

        .auth-text{
            p{
                &:first-child{
                    color: #6F777B;
                }

                &:last-child{
                    color: #8C8896;
                }
            }
        }

        

        .auth-icon{
            position: relative;

        &::after{
            content: '';
            position: absolute;
            background-color: white;
            top: 10%;
            left: 50%;
            width: 20px;
            height: 20px;

        }
    }

    }



}

</style>