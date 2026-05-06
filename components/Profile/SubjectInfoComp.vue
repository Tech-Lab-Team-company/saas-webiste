<script setup lang="ts">
import ProfileSidebar from "./ProfileSidebar.vue";
import SubjectInfoCard from "./SubjectInfoCard.vue";
</script>
<template>
  <div class="prfile-home">
    <SubjectInfoCard class="courses-container" />
    <ProfileSidebar />
  </div>
</template>
<style scoped lang="scss">
.prfile-home {
  margin-top: 50px;
  width: 100%;
  text-align: right;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 10px;
}

.courses-container {
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  background-color: #f6f6f6;
}
@media (max-width: 768px) {
  .courses-container {
    width: 100%;
  }
}
</style>
