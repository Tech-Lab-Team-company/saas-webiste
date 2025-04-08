
<script setup lang="ts">
    import { ref } from "vue";
    import MultiSelect from 'primevue/multiselect';


    const selectedCommerce = ref();
    const selectedCategory = ref();
    const cities = ref([
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ]);
</script>

<template>
    <div class="profile-home">

        <div class="profile-home-text">
            <p>البيانات الشخصيه</p>
            <p>هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين الآخرين</p>
        </div>
        <hr class="profile-text-hr">

        <div class="profile-home-information">
            <div class="profile-info-container">
                <label>الاسم بالكامل</label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="اسم المستخدم">
                </div>
            </div>
            <div class="profile-info-container">
                <label>البريد الالكتروني</label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="moro@user.com">
                </div>
            </div>
            <div class="profile-info-container">
                <label>رقم الهاتف  </label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="0101020304050">
                </div>
            </div>
        </div>

        <div class="hrs">
            <hr class="profile-first-hr">
            <hr class="profile-second-hr">
        </div>


        <div class="profile-home-text profile-home-text2 ">
            <p>البيانات الشخصيه</p>
            <p>هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين الآخرين</p>
        </div>
        <hr class="profile-text-hr">

        <div class="profile-home-information">
            <div class="profile-info-container">
                <label>نوع التعليم</label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="عام">
                </div>
            </div>
            <div class="profile-info-container">
                <label>مرحله التعليم</label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="المرحله الجامعيه">
                </div>
            </div>
            <div class="profile-info-container">
                <label>جامعه  </label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="جامعه المنصورة">
                </div>
            </div>
            <div class="profile-info-container">
                <label>الكليه</label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="كليه الحاسبات ونظم المعلومات">
                </div>
            </div>
            <div class="profile-info-container">
                <label>الفرقه  </label>
                <div class="profile-input-container">
                    <button>تعديل</button>
                    <input type="text" class="input" placeholder="الرابعه">
                </div>
            </div>
        </div>

        <div class="hrs">
            <hr class="profile-first-hr">
            <hr class="profile-second-hr">
        </div>


        <div class="profile-home-text profile-home-text2">
            <p>المجالات المهتم بيها</p>
            <p>هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين الآخرين</p>
        </div>
        <hr class="profile-text-hr">

        <div class="profile-home-information">
            <div class="profile-info-container">

                <label>متعلق بتخصصك ( Commerce )</label>
      
                    <div class="profile-multi  card flex justify-center">
                        <MultiSelect 
                            v-model="selectedCommerce" 
                            display="chip" 
                            :options="CommerceOptions" 
                            optionLabel="name" 
                            filter 
                            placeholder="Select Cities"
                            :maxSelectedLabels="3" 
                            class="w-full md:w-80" />
                
                </div>

            </div>
            <div class="profile-info-container">
                <label>المجالات الأكثر شهره</label>
     
                    <div class="profile-multi card flex justify-center">
                        <MultiSelect    
                            v-model="selectedCategory" 
                            display="chip" 
                            :options="cities" 
                            optionLabel="name" 
                            filter 
                            placeholder="Select Cities"
                            :maxSelectedLabels="3" 
                            class="w-full md:w-80" />
                  
                </div>
            </div>
        </div>



    </div>
</template>

<style scoped lang="scss">

.profile-home{
    background-color: #F6F6F6;
    margin-left: auto;
    margin-right: auto;
    grid-column: span 5;
    width: 95%;
    border-radius: 10px;
    padding-bottom: 30px;
    margin-bottom: 20px;

    .profile-home-text{
        text-align: right;
        padding: 20px 10px;

        &.profile-home-text2{
            margin-top: 30px;
        }

        p{
            &:first-child{
                font-size: 20px;
                font-weight: 500;
            }

            &:last-child{
                color: #6F777B;
            }
        }

    }

    .profile-text-hr{
        border: none;
        height: 2px;
        border-radius: 5px;
        margin: 4px 10px;
        background-image:linear-gradient(to left , #FFB949 0% 20%,  #E6E6E6 60%    ) ;
    }


    .profile-home-information{
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        gap: 15px;

        .profile-info-container{
            margin-top: 10px;


            label{
                margin-right: 5px;
            }

            .profile-multi{
                margin-left: auto;
                text-align: right;
                background-color: white;
            }

            .profile-input-container{
                display: flex;
                justify-content: space-between;
                align-items: center;
                input{
                    margin-top: 5px;
                    width: 90%;
                    border: none;
                    outline: none;
                    border-radius: 10px;
                    padding: 8px 10px;
                    text-align: right;   
                }

                button{
                    color:#FFB949 ;
                    text-decoration: underline;
                }

            }
    

        }
    }

    .hrs{
        margin-top: 25px;
        .profile-first-hr{
            border: none;
            height: 3px;
            border-radius: 5px;
            margin: 4px 10px;
            background-image:linear-gradient(to left , #FFB949 0% 20%,  #E6E6E6 60%    ) ;
        }
        .profile-second-hr{
            border: none;
            height: 2px;
            border-radius: 5px;
            margin: 4px 10px;
            background-image:linear-gradient(to right , #FFB949 0% 20%,  #E6E6E6 60%    ) ;
        }
    }

}

</style>


