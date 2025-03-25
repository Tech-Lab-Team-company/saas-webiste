<script setup lang="ts">
      import Logo from '~/public/icons/Logo.vue'
      import PhoneIcon from '~/public/icons/PhoneIcon.vue'
      import Location from '~/public/icons/Location.vue'
      import FcaebookIcon from '~/public/icons/FcaebookIcon.vue'
      import instagramIcon from '~/public/icons/instagramIcon.vue'
      import linkedInIcon from '~/public/icons/linkedInIcon.vue'
      import twitterIcon from '~/public/icons/twitterIcon.vue'

</script>

<template>
    <div class="grid gris-cols-1 md:grid-cols-4 footer-container">
        <div class="col">
           
            <p class="col-title">وسائل التواصل</p>
    
            <div class="col-description">

                <div class="col-details">
                    <div>
                        <p>رقم الهاتف</p>
                        <p>+966543042000</p>
                    </div>
                    <PhoneIcon />
                </div>

                <div class="col-details">
                    <div>
                        <p>موقعنا</p>
                        <p>706 Campfire Ave. Meriden, CT 06450</p>
                    </div>
                    <Location />
                </div>
            </div>
               
        
        </div>
        <div class="col">
            <div class="col-title">
                <p>صفحات اخرى</p>
            </div>
            <div class="col-data-details">
                <p>سياسه الخصوصيه</p>
                <p>شروط الاستخدام</p>
                <p>الاسئله الشائعه</p>
                <p>المدونه</p>
            </div>


        </div>
        <div class="col">
            <div class="col-title">
                <p>عن منصتنا  </p>
            </div>

            <div class="col-data-details">
                <p>الرئيسيه</p>
                <p>كورساتي</p>
                <p>من نحن </p>
                <p>تواصل معنا</p>
            </div>                     
        </div>
     
        <div class="col">
            <Logo class="col-logo" />
            <div class="col-data-details">
                <p>منصة شاملة تضم كورساتك و آلاف الأسئلة والتدريبات لمساعدتك على الاستعداد لأي اختبار ..ذاكر كورساتك ، اختبر مستواك ، حسّن مهاراتك، وكن مستعدًا للنجاح!</p>
                <div class="col-icons">
                    <FcaebookIcon />
                    <instagramIcon />
                    <linkedInIcon />
                    <twitterIcon />

                </div>  
            </div>  
        </div>
        

    </div>
</template>


<style scoped lang="scss">
.footer-container{
    background-color: #f3f3f3;
    padding: 20px;
    color: #333;
    font-size: 1.2rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    // gap: 20px;
    justify-items: center;
    // align-items: center;
    text-align: end;
    padding-left:30px;
    padding-right:30px;

    .col{
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 40px;
        // justify-content: space-between;
        .col-title{
            position:relative;
            font-family: "bold";
            &::after{
                content: '';
                position:absolute;
                right: 0;
                top:100%;
                width: 80px;
                height: 4px;
                border-radius: 5px;
                background-image:linear-gradient(to right, #049DBF, #2525AD);
                margin-top: 15px ;
            }
        }
        .col-description{
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 10px;
                align-items:end;
                font-size:15px;

                .col-details{
                    display:flex;
                    align-items:center;
                    justify-content: center ;
                    gap:10px;
                    font-size:15px;
                    
                }
            }

            .col-data-details{
                    display:flex;
                    flex-direction: column;
                    align-items:end;
                    justify-content: end ;
                    gap:20px;
                    font-size:15px;
                    
                    .col-icons{
                        display:flex;
                        gap:10px;
                    }
                }

        .col-logo{
            margin-left:auto;
            margin-right:15px;
      
        }
    }


    
}

</style>