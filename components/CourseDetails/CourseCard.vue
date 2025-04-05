<script scoped lang="ts">
    import Dashedicon from '~/public/icons/dashedicon.vue';

</script>

<template>
    <div class="card-container">
        <div class="card-text">

            <div class="card-text-title">
                <p class="card-text-subject-title">اللغه العربيه</p>
                <p class="card-text-main-title">تعلم العربية بطلاقة – من البداية إلى الإتقان</p>
                <Dashedicon class="icon" />
            </div>

            <div class="card-text-description">
                <p>اكتشف جمال اللغة العربية وتعلّم قواعدها بسهولة في هذا الكورس، ستتعلم أساسيات النحو والصرف، تحسين مهارات الكتابة، وتطوير الفهم والقراءة بطلاقة. من الأساسيات إلى الاحتراف، نأخذك في رحلة تعليمية شيّقة تساعدك على التعبير بثقة وإتقان.</p>
            </div>

            <hr />
            <div class="card-text-footer">
                <p class="salary">1500 <span>جنيه</span>  </p>
                <div class="card-profile">
                    <p>أحمد حوام</p>
                    <img src="../../public/images/profile.png" alt="img">
                </div>
            </div>

            <div class="btns">
                <button>شراء الكورس</button>
            </div>

        </div>

        <div class="card-video">
            <video src="../../public/Videos/courseVideo.mp4"></video>
        </div>
   
    </div>
</template>

<style scoped lang="scss">

    .card-container{
        background-color: #F6F6F6;
        margin-top: 20px;
        padding: 20px;
        display: flex;
        // justify-content: space-between;
        // align-items: center;
        gap: 10px;

        .card-text{
            display: flex;
            flex-direction: column;
            width: 100%;
            // justify-content: space-between;
            // gap: 20px;
            // align-items: flex-end;

            .card-text-title{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 10px;
                position: relative;

                .icon{
                    position: absolute;
                    left: 50%;
                    top: 100%;
                    transform: translateX(-50%);
                }

                .card-text-subject-title{
                    background-color: #FF931E0D;
                    color: #FFB949;
                    padding: 6px;
                    border-radius: 20px;
                    font-weight: 500;
                }

                .card-text-main-title{
                    font-weight: 700;
                    font-size: 18px;
                    text-align: right; 
                }
            }

            .card-text-description{

                text-align: right;
                margin-top: 15px;
                padding: 0 10px;
                color: #6F777B;
                font-weight: 500;
                // width: 600px;
                margin-left: auto;
                font-size: 18px;
                line-height: 150%;
                // max-width: 600px;




            }

            hr{
                border-color:  #d9dbde27;
                width: 50%;
                margin-left: auto;
                margin-right: 10px;
                margin-top: 10px;
                margin-bottom: 5px;
            }

            .card-text-footer{
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
          
                padding: 0 10px;
                font-weight: 800;
               
               
                .card-profile{
                    display: flex;
                    align-items: center;
                    gap: 10px;
            
                    
                    img{
                        width: 30px;
                    }
                }

                .salary{
                    color:#FFB949;
                    font-size: 23px;
                    
                    span{
                        font-size: 18px;
                        font-weight: 500;
                    }
                }
            }

            .btns{
                button{
                    width: 100%;
                    background-color: #FFB949;
                    color:white;
                    margin-top:20px;
                    padding: 10px;
                    border-radius: 15px;
                }
            }


        }



        .card-video{
            
            overflow: hidden;
            width: 1000px;
            border-radius: 20px;
            height: 250px;

            video{
                
            }
        }

    }
</style>