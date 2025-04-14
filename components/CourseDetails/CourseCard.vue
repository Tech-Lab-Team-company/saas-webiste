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

<style scoped lang="scss" >

.card-container{
    @media (max-width:768px) {
        flex-direction: column;
    }

    .card-video{
        @media (max-width:768px) {
           width: 100%;
        }
    }
}
</style>