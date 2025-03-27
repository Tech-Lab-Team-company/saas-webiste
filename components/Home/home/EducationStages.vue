<script setup lang="ts">
import RightDots from '~/public/icons/RightDots.vue'
import LeftDots from '~/public/icons/LeftDots.vue'
import StagesTitle from './StagesTitle.vue'

</script>

<template>
    <div class="stage-container">
        <div class="stages-background">
            <LeftDots  class="background-icon" />
            <RightDots class="background-icon"/>
        </div>
        <div class="stages">
            <p class="stages-title">المراحل التعليميه</p>
            <p class="stages-details">اكتشف كل مرحلة في رحلتك التعليمية، من الأساسيات إلى التخصصات المتقدمة</p>
            
            <div class="stages-buttons">
                <button class="btn btn-secondary btn-stages">المرحله الجامعيه</button>
                <button class="btn btn-secondary btn-stages">المرحله الثانويه</button>
                <button class="btn btn-secondary btn-stages">المرحله الاعداديه</button>
                <button class="btn btn-secondary btn-stages">المرحله الابتدائيه</button>
            </div>
        </div>
  
    </div>

</template>

<style setup lang="scss">


</style>