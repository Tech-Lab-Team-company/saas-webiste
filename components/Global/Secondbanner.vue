<script setup lang="ts">
    import logo1 from '~/public/images/logo1.png'
    import logo2 from '~/public/images/logo2.png'   
    import logo3 from '~/public/images/logo3.png'
    import logo4 from '~/public/images/logo4.png'


    const logos = ref(
        [
            logo2,
            logo3,
            logo4,
            logo2,
            logo1,
        ]
    )


    import 'swiper/css'

    const containerRef = ref(null)

</script>

<template>
    <div class="second-banner">
    
       
        <ClientOnly class="container" >
            <swiper-container 
                ref="containerRef"
                class="track"
                :slides-per-view="4"
                :space-between="10"
                :loop="true"
                :autoplay="{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    stopOnLastSlide: false
                }"
                :speed="1000"
                :free-mode="true"
                :free-mode-momentum="false"
            >
                <swiper-slide class="banner-logos" v-for="logo in logos" :key="logo">
                   <img :src="logo" alt="lgos" class="logo">
                </swiper-slide>
     
            </swiper-container>
        </ClientOnly>

    </div>
</template>

<style scoped lang="scss">


</style>