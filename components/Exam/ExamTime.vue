<script setup lang="ts">
    import clockicon from '~/public/icons/clockicon.vue';

</script>

<template>
    <div class="exam-time-container">
        <div class="exam-totla-time">
            <clockicon />
            <p>50 min</p>
        </div>

        <div class="exam-time">
            <p>علي نهايه الامتحان</p>
            <span>100%</span>
        </div>
    </div>

    <div class="progress-bar">

    </div>

</template>


<style scoped lang="scss">

.exam-time-container{
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin:10px 20px;

    .exam-time{
        display:flex;
        align-items: center;
        gap:6px;

        p{
            color:#D38911;
            font-size:18px;
        }

        span{
            font-size:18px;
            font-weight:500;
        }
    }

    .exam-totla-time{
        display:flex;
        align-items: center;
        justify-content: center;
        gap:6px;

        p{
            color:#6F777B;
        }
    }
    
}

.progress-bar{
    width:97%;
    height:10px;
    margin:0 20px;
    border-radius:10px;
    background:#E0E0E0;
    margin-top:2px;
    margin-bottom:10px;
    position:relative;


    
}

</style>