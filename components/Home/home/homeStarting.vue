<script setup lang="ts">
    import BackgoundCircle from '~/public/icons/BackgoundCircle.vue'
    import {onUpdated} from 'vue'
    import EducationStages from './EducationStages.vue'
    import Students from './Students.vue'

    const containerRef = ref(null)
    const slides = ref(Array.from({ length: 2 }))

    const swiper = useSwiper(containerRef)

    onUpdated(() => {
        console.log("containerRef.value")
        console.log(containerRef.value)
    })

    const swiper_position = ref('next')
    
</script>

<template>
   

    <div class="main-container">
 
        <ClientOnly>
        <swiper-container ref="containerRef">
        <swiper-slide>
        <div class="container">
            <div class="image-container">
                <BackgoundCircle class="background" />
                <img src="../../../public/images/GirlBackground.png" alt="girl">
            </div>

            <div class="details">

                <div class="title">
                    <p class="main-title">جميع احتياجات مؤسستك التعليمية في نظام واحد </p>
                    <p class="sub-title">منصة شاملة تضم كورساتك و آلاف الأسئلة والتدريبات لمساعدتك على الاستعداد لأي اختبار ..ذاكر كورساتك ، اختبر مستواك ، حسّن مهاراتك، وكن مستعدًا للنجاح!</p>
                </div>
                
                <button class="btn btn-primary ">
                    ابــــدأ الآن
                </button>

            </div>

        </div>

        </swiper-slide>
        <swiper-slide>
            <div class=" vid-container">

                <div class="video">   
                    <div class="layer"></div> 
                    <video autoplay src="../../../public/videos/classvideo.mp4" ></video>
                </div>

                <div class=" vid-details">

                    
                    <div class=" vid-title">
                        <p class="title">مرحبا بك في كورساتي</p>
                        <p class=" vid-main-title">جميع احتياجات مؤسستك التعليمية في نظام واحد </p>
                        <p class=" vid-sub-title">منصة شاملة تضم كورساتك و آلاف الأسئلة والتدريبات لمساعدتك على الاستعداد لأي اختبار ..ذاكر كورساتك ، اختبر مستواك ، حسّن مهاراتك، وكن مستعدًا للنجاح!</p>
                    </div>
                    
                    <button class="btn btn-primary ">
                        ابــــدأ الآن
                    </button>

                </div>
            </div>

  

        </swiper-slide>

        </swiper-container>
        <div class="home-buttons">
            <button class="prev-btn " @click="
                swiper.prev();
                swiper_position='prev';
                "
                :class="swiper_position == 'prev' ? 'active' : ''"
                ></button>
            <button class="next-btn" @click="
                swiper.next()
                swiper_position='next';
                "
                :class="swiper_position == 'next' ? 'active' : ''"
                ></button>
        </div>
    </ClientOnly>
</div>

    <EducationStages />
    <Students />

</template>

<style scoped lang="scss">

.container{
    
}

</style>





