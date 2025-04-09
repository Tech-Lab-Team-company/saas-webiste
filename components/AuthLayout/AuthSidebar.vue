<script setup lang="ts">
    import AuthProfile from '~/public/icons/AuthProfile.vue'
    import AuthMail from '~/public/icons/AuthMail.vue'
    import AuthStage from '~/public/icons/AuthStage.vue'
    import AuthRight from '~/public/icons/AuthRight.vue'
    import AutoComplete from 'primevue/autocomplete';

    import { ref } from "vue";

    const value = ref(null);
    const items = ref(['ar' , 'en']);

    const search = (event: any) => {
        let _items = [...Array(10).keys()];

        items.value = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
    }


    const route = useRoute();
    console.log(route.path)

  


</script>




<template>
    <div class="auth-sidebar">
        <div class="auth-lang">
            <AutoComplete 
                v-model="value" 
                dropdown 
                :suggestions="['ar', 'en']"
                @complete="search"
                class="auth-input" 
          
                />
        </div>
  
        <div class="auth-info-container" 
            :class="route.path == '/Auth/mail' || route.path == '/Auth/stage' ||  route.path == '/Auth/success' ? 'entered' : ''">

            <div class="auth-text">
                <p>معلوماتك الشخصيه</p>
                <p>يرجى تقديم معلوماتك التفصيلية</p>
            </div>
            <AuthProfile class="auth-icon" />
        </div>
        
        <div class="auth-info-container" 
            :class="[
                route.path === '/Auth/mail' ? 'active' : '',
                route.path === '/Auth/stage' || route.path === '/Auth/success' ? 'entered': ``,
            ]"
        >
        
            <div class="auth-text">
                <p>تحقق من صندوق الوارد الخاص بك</p>
                <p>تحقق من الرموز المرسلة إلى صندوق الوارد الخاص بك</p>
            </div>
            <AuthMail class="auth-icon" />
        </div>
        <div class="auth-info-container" 
            :class="[
                route.path === '/Auth/stage' ? 'active' : '',
                route.path === '/Auth/success' ? 'entered': ``,
            ]">
            
            <div class="auth-text">
                <p>مرحلتك التعليمية</p>
                <p>يرجى تقديم معلومات دراستك التفصيلية</p>
            </div>
            <AuthStage class="auth-icon" />
        </div>
        <div class="auth-info-container" 
            :class="[
                route.path === '/Auth/success' ? 'active' : '',
            ]">

            <div class="auth-text">
                <p>بنجاح</p>
                <p>يمكنك متابعه رحلتك فى منصتنا الان</p>
            </div>
            <AuthRight class="auth-icon" />
        </div>
    </div>

</template>

<style scoped lang="scss">


</style>





