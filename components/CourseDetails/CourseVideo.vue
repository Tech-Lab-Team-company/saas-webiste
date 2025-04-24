<script setup lang="ts">

   const props = defineProps({
        CourseVideoLink:{
            type: Object as () => {
                videoLink:string,
                title:string,
                description:string
            } | null,
            default: ''
        }
    });

    const CourseVideoLink = ref(props.CourseVideoLink);


    watch(() => props.CourseVideoLink, (newValue) => {
        CourseVideoLink.value = newValue;
        if (CourseVideoLink.value && CourseVideoLink.value.videoLink) {
        if(CourseVideoLink.value.videoLink.includes('youtube') ){
            CourseVideoLink.value.videoLink =CourseVideoLink.value.videoLink.replace('watch?v=', 'embed/')
            CourseVideoLink.value.videoLink =CourseVideoLink.value.videoLink.replace('&' , '?')
        }
        else{
            CourseVideoLink.value.videoLink =CourseVideoLink.value.videoLink.replace('watch?v=', 'embed/')
            CourseVideoLink.value.videoLink =CourseVideoLink.value.videoLink.replace('&' , '?')
        }
   
    }
    }, { immediate: true });




    
    const playVideo = ref(false)
</script>
  


  

<template>
   <div class="course-video-container  " >
       <iframe
        width="560"
        height="315"
        :src="CourseVideoLink?.videoLink"
        frameborder="0"
        allowfullscreen
        ></iframe>
    </div>
      

    <div class="course-video-text">
        <p class="course-video-text-title">شرح {{CourseVideoLink?.title  }}</p> 
        <hr />
        <p class="course-video-text-description">{{ CourseVideoLink?.description }}</p>
        </div>

</template>
  
<style scoped>

</style>


