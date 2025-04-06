<script setup lang="ts">
    import bannerarrow from '~/public/icons/bannerarrow.vue'

    const routes  = ref([
        {
            name:"الكورسات",
            path:"/courses"
        },
        {
            name:"الرئيسيه",
            path:"/"
        },

    ])

</script>
<template>
    <div class="banner">   
        <img src="../../public/images/Group.png" alt="logo" class="logo" />
        <ul class="banner-list">
            <li class="banner-item" v-for="(route , index) in routes" :key="index" >
                {{ route.name }}
                <bannerarrow class="arrow-icon" v-if="index != routes.length - 1 " />
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">



</style>