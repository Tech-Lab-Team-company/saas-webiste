<!-- <script setup lang="ts">
import Downarrow from '~/public/icons/downarrow.vue';

    const content = ref([
        'الوحدة الاولى',
        'الوحدة الاولى',
        'الوحدة الاولى',
        'الوحدة الاولى',
    ])
</script>

<template>
    <div class="course-content-container">
        <p class="course-content-title" v-for="item in content">
            <Downarrow class="content-icon" />
            {{ item }}
        </p>
    </div>
</template>

<style scoped lang="scss"></style> -->

<script setup lang="ts">
    // import Accordion from 'primevue/accordion';
    // import AccordionPanel from 'primevue/accordionpanel';
    // import AccordionHeader from 'primevue/accordionheader';
    // import AccordionContent from 'primevue/accordioncontent';

    const content = ref([
        {
            title: 'الوحدة الاولى',
            content: 'محتوى الوحدة الاولى'
        },
        {
            title: 'الوحدة الثانية',
            content: 'محتوى الوحدة الثانية'
        },
        {
            title: 'الوحدة الثالثة',
            content: 'محتوى الوحدة الثالثة'
        },
        {
            title: 'الوحدة الرابعة',
            content: 'محتوى الوحدة الرابعة'
        }
        
    ])
    const activeclass = ref('');

  
</script>

<template>
    <Accordion value="0" class="course-content-container1">
        <AccordionPanel @click="activeclass = 'active'" :class="activeclass" :value="index" class="course-content-panel" v-for="(item ,index) in content" :key="item.title" >
            <AccordionHeader class="course-content-header" >{{ item.title }}</AccordionHeader>
            <AccordionContent class="course-content-body" >
              {{ item.content }}
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<style scoped lang="scss">

.course-content-container1{
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

    .course-content-panel{
        display: flex;
        flex-direction: column;
        gap: 20px;
        background-color: white;
    }

}

.p-accordionheader {
    border:none; 
    
}
.p-accordionpanel{
    border:none; 
    padding:15px 10px;
    border-radius: 10px;
    direction: rtl; //////////////////
    &:not(:first-child){
        margin-top: 12px;
    }
}



</style>