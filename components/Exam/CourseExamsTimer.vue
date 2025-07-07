<script setup lang="ts">
// /course/${router.currentRoute.value.params.id}/${exam.id}
const router = useRouter();
const route = useRoute()
const examId = route.query.id
const Starttime = route.query.time

// console.log(examId, Starttime , "examId, Starttime")



const starttime = new Date(Starttime as string); 
const currentTime = new Date(); 
const diffInMs = starttime.getTime() - currentTime.getTime();

const diffInSeconds = Math.floor(diffInMs / 1000);
const hours = Math.floor(diffInSeconds / 3600);
const minutes = Math.floor((diffInSeconds % 3600) / 60);
const seconds = diffInSeconds % 60;
const totalRemainingSeconds = hours * 3600 + minutes * 60 + seconds;


setTimeout(() => {
    router.push(`/course/${router.currentRoute.value.params.id}/${examId}`)
} , totalRemainingSeconds * 1000)

 
</script>

<template>
    <div class="exams-timer-container">
        <div class="timer-container">
            <img src="../../public/images/timer.gif" alt="timer">
        </div>

        <div class="exams-timer-text">
            <p class="main-title"> <span>العد التنازلي بدأ ! </span>جاهز  للامتحان</p>
            <p class="second-title"> دقائق بسيطة وتبدأ التحدي الحقيقي! حضّر نفسك وورّينا مستواك!</p>
        </div>

    </div>
</template>

<style scoped lang="scss" >

.exams-timer-text{
    @media (max-width:768px) {
        width: 100%;
    }
    
    .main-title{
        @media (max-width:768px) {
            width: 100%;
        }
        text-align: center;
        
    }

    .second-title{
        @media (max-width:768px) {
            width: 100%;
        }
        text-align: center;
    }
}

</style>


