<script setup lang="ts">
    import AuthProfile from '~/public/icons/AuthProfile.vue'
    import AuthMail from '~/public/icons/AuthMail.vue'
    import AuthStage from '~/public/icons/AuthStage.vue'
    import AuthRight from '~/public/icons/AuthRight.vue'
    import AutoComplete from 'primevue/autocomplete';

    import { ref } from "vue";
const { locale } = useI18n()
    const value = ref(null);
    const items = ref(['ar' , 'en']);

    const search = (event: any) => {
        let _items = [...Array(10).keys()];

        items.value = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
    }


    const route = useRoute();
    // console.log(route.path)

  


</script>




<template>
    <div class="auth-sidebar">
<!--        <div class="auth-lang">-->
<!--            <AutoComplete -->
<!--                v-model="value" -->
<!--                dropdown -->
<!--                :suggestions="['ar', 'en']"-->
<!--                @complete="search"-->
<!--                class="auth-input" -->
<!--          -->
<!--                />-->
<!--        </div>-->
  
        <div class="auth-info-container" 
            :class="[
                route.path == `/Auth/register` || route.path == `/auth/register` ? 'active' : '',
                route.path == `/Auth/varifyotp`   || route.path == `/Auth/categories` ||  route.path == `/Auth/education` ||
                route.path == `/auth/varifyotp`   || route.path == `/auth/categories` ||  route.path == `/auth/education`? 'entered' : '',
            ]">

            <div class="auth-text">
                <p>{{ $t('معلوماتك الشخصيه') }}</p>
                <p>{{ $t('يرجى تقديم معلوماتك التفصيلية') }}</p>
            </div>
            <AuthProfile class="auth-icon" />
        </div>
        
        <div class="auth-info-container" 
            :class="[
                route.path === `/Auth/varifyotp` || route.path === `/auth/varifyotp` ? 'active' : '',
                route.path === `/Auth/education` || route.path === `/Auth/categories` || route.path === `/auth/education` || route.path === `/auth/categories`? 'entered' : '' ,
            ]"
        >
        
            <div class="auth-text">
                <p>{{ $t('تحقق من صندوق الوارد الخاص بك') }}</p>
                <p>{{ $t('تحقق من الرموز المرسلة إلى صندوق الوارد الخاص بك') }}</p>
            </div>
            <AuthMail class="auth-icon" />
        </div>
        <div class="auth-info-container" 
            :class="[
                route.path === `/Auth/education` || route.path === `/auth/education` ? 'active' : '',
                route.path === `/Auth/categories` || route.path === `/auth/categories` ? 'entered' : '',
            ]">
            
            <div class="auth-text">
                <p>{{ $t('مرحلتك التعليمية') }}</p>
                <p>{{ $t('يرجى تقديم معلومات دراستك التفصيلية') }}</p>
            </div>
            <AuthStage class="auth-icon" />
        </div>
        <div class="auth-info-container" 
            :class="[
                route.path === `/Auth/categories` || route.path === `/auth/categories` ? 'active' : '',
                ]">

            <div class="auth-text">
                <p>{{ $t('بنجاح') }}</p>
                <p>{{ $t('يمكنك متابعه رحلتك فى منصتنا الان') }}</p>
            </div>
            <AuthRight class="auth-icon" />
        </div>
    </div>

</template>

<style scoped lang="scss">


</style>





