<script setup>
import { ref } from "vue";

import toggleone from "~/public/icons/toggleone.vue";
import toggletwo from "~/public/icons/toggletwo.vue";

const selectedToggle = ref("one"); 
</script>

<template>
  <div class="aa">
    <HomeHomeEducationStages />

    <div class="header-toggle">
      <p class="cards-heading">(6)جميع الكورسات</p>
      <div class="toggle">
        <div
          :class="['toggle-icon', selectedToggle === 'two' ? 'active' : '']"
          @click="selectedToggle = 'two'"
        >
          <toggletwo />
        </div>
        <div
          :class="['toggle-icon', selectedToggle === 'one' ? 'active' : '']"
          @click="selectedToggle = 'one'"
        >
          <toggleone />
        </div>
      </div>
    </div>

    <!-- عرض الكارد حسب الاختيار -->
    <div v-if="selectedToggle === 'two'">
      <CourseAllCourseOne />
    </div>
    <div v-else>
      <CourseAllCourseTwo />
    </div>
  </div>
</template>

<style scoped lang="scss">
.stages-container {
  background-color: #f6f6f6;
}
.stage-container .stages {
  background-color: #f6f6f6 !important;
}
.aa {
  background-color: #f6f6f6 !important;
}
.toggle-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: transparent;
  width: 43px;
  height: 43px;
 


  &.active {
    background-color: #ffb949;
    border: 2px solid #ffb949;
    width: 43px;
  height: 43px;
  }
}

.header-toggle {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
  // width: 90%;
}

.cards-heading {
  font-size: 25px;
  color: #222;
  font-weight: 400;
  font-family: "regular";
  margin: 0;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #222;
  font-weight: 400;
  font-family: "regular";
  // padding: 0 160px;
}
</style>
