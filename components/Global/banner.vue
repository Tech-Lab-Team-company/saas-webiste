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
   .banner{
    display: flex;
    justify-content: end;
    align-items: center;
    background-image: linear-gradient(to left , #032855 , #0328550d  );
    padding: 12px;
    padding-top: 15px;
    padding-bottom: 15px;
    position: relative;

    .logo{
        position: absolute;
        left: 0;
        opacity: 0.2;
        
    }

    .banner-list{
        display: flex;
        gap: 10px;
        padding: 20px 10px;
        
        .banner-item{
            display: flex;
            color: #FFFFFF;
            font-family: 'regular';
            align-items: center;
            gap: 10px;
            .arrow-icon{
                width: 12px;
            }
        }
    }
}


</style>