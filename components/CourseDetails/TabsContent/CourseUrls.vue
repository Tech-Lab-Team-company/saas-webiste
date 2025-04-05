<script setup lang="ts">
import discoverbtnIcon from '~/public/icons/discoverbtnIcon.vue';


    const urls = ref([
        {
            title: 'امتحان علي اساسيات النحو (لغه عربيه)',
            description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

        },
        {
            title: 'امتحان علي اساسيات النحو (لغه عربيه)',
            description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

        },
        {
            title: 'امتحان علي اساسيات النحو (لغه عربيه)',
            description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

        },
        {
            title: 'امتحان علي اساسيات النحو (لغه عربيه)',
            description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

        },
 
    ])
</script>

<template>
    <div class="course-url-container" v-for="url in urls" :key="url.title">

        <div class="btns" >
            <button>
                <discoverbtnIcon />
                استكشف الان
            </button>
            
        </div>


        <div class="course-url-content">
            <div class="url-title">
                <p>{{ url.title }}</p>
            </div>
            <p class="url-description">{{ url.description }}</p>
        </div>
    </div>

</template>

<style scoped lang="scss">


</style>