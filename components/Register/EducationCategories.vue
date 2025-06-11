<script setup>
import { ref } from "vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import fire from "~/public/icons/fire.vue";

const skills = ref([
  "FrontEnd Developer",
  "BackEnd Developer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
]);

const popularSkills = ref([
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX ",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
  "UI/UX Designer",
]);

const selectedSkills = ref([]);

const toggleSkill = (skill) => {
  if (selectedSkills.value.includes(skill)) {
    selectedSkills.value = selectedSkills.value.filter((s) => s !== skill);
  } else {
    selectedSkills.value.push(skill);
  }
};
</script>
<template>
  <NuxtLink class="span-page" to="/">تخطي الان</NuxtLink>
  <div class="skills-container">
    <h3>تم انشاء حسابك بنجاح</h3>
    <p>
      اختر فئاتك المفضه التى تريد المعرفه عنها حتى نتمكن من تقديم افضل مساعده لك
    </p>
    <div class="skill">
      <div class="skills-section">
        <h4>متعلق بتخصصك <span>(Commerce)</span></h4>
        <div class="skills-list">
          <button
            v-for="skill in skills"
            :key="skill"
            :class="{ selected: selectedSkills.includes(skill) }"
            @click="toggleSkill(skill)"
          >
            {{ skill }}
          </button>
        </div>
      </div>

      <div class="skills-section">
        <h4>المجالات الأكثر شهره <fire /></h4>
        <div class="skills-list">
          <button
            v-for="popularSkill in popularSkills"
            :key="popularSkill"
            :class="{ selected: selectedSkills.includes(popularSkill) }"
            @click="toggleSkill(popularSkill)"
          >
            {{ popularSkill }}
          </button>
        </div>
      </div>

      <div class="login-container">
        <div class="login-form">
          <div class="btns btns-home">
            <NuxtLink to="/"> <button class="login-btn">
             ابدأ الان 
              <LeftArrowIcon class="left-icon" />
            </button></NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.span-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 10px 10px;
  font-family: "bold";
  font-weight: 700;
  font-size: 19px;
  text-decoration: underline;
  position: absolute;
  top: 6%;
  right: 30%;
  color: #032855;
}
.skills-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  direction: rtl;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h3 {
  font-family: "bold";
  font-weight: 700;
  font-size: 32px;
  line-height: 150%;
  letter-spacing: -1.8%;
  text-align: center;
}

p {
  font-family: "regular";
  font-weight: 400;
  font-size: 18px;
  color: #a3adbb;
  text-align: center;
  width: 85%;
}

.skills-section {
  padding: 10px;
  margin: 30px 0;
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 2px 2px 16px 0px #0000000a inset;
}

h4 {
  font-family: "regular";
  font-weight: 400;
  font-size: 18px;
  gap: 3px;
  display: flex;
  color: #546881;
  margin: 10px 5px;
}
h4 span {
  font-family: "regular";
  font-weight: 400;
  font-size: 18px;
  color: #1d242d;
}
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.skills-list button {
  background: #e9ecf8;
  border: 1px solid #d1d9ff;
  border-radius: 20px;
  padding: 8px 16px;
  font-family: "regular";
  font-weight: 400;
  font-size: 18px;
  color: #0752ac;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skills-list button.selected {
  background: #032855;
  color: #fff;
  border-color: #0752ac;
}
.skill-btn {
  background: #032855;
  display: flex;
}
.login-container .login-form .btns.btns-home button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-icon {
  width: 24px;
  height: 24px;
}

.btns-home .left-icon .left-arrow{
    transition: all 1s ease-in-out;
}
.btns-home:hover .left-icon .left-arrow {
    stroke: #032855;
  }
  


.login-container {
  width: 100%;
  height: 10%;
}
.login-container .login-form .btns.btns-home button {
  width: 450px !important;
  height: 50px;
  margin: 10px 10px;
}
</style>
