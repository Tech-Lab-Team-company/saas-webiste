<script lang="ts" setup>
import student from "../../public/icons/student.vue";
import RegisterBook from "../../public/icons/RegisterBook.vue";
import RegisterBookOne from "../../public/icons/RegisterBookOne.vue";
import Award from "../../public/icons/Award.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";

import { ref } from "vue";
</script>

<template>
  <div class="login-container pass-forgit">
    <div class="login-form">
      <h3>بياناتك التعليمية</h3>
      <p>
        مرحبا بك فى منصتنا ادخل معلوماتك الشخصيه التاليه و احرص على ادخال
        البياناتك الضروريه و المحاطه باللون الازرق وعلامه مميزه *
      </p>

      <div class="inputs">
        <div class="login-input">
          <select class="student-select">
            <option value="" disabled selected>نوع التعليم</option>
            <option value="student1">طالب</option>
            <option value="student2">طالب</option>
            <option value="student3">طالب</option>
          </select>
          <Award class="login-call-icon" />
        </div>
      </div>

      <div class="inputs">
        <div class="login-input">
          <select class="student-select">
            <option value="" disabled selected>مرحله التعليم</option>
            <option value="student1">طالب</option>
            <option value="student2">طالب</option>
            <option value="student3">طالب</option>
          </select>
          <RegisterBook class="login-call-icon" />
        </div>
      </div>
      <div class="inputs">
        <div class="login-input">
          <select class="student-select">
            <option value="" disabled selected>السنه الدراسيه</option>
            <option value="student1">طالب</option>
            <option value="student2">طالب</option>
            <option value="student3">طالب</option>
          </select>
          <RegisterBookOne class="login-call-icon" />
        </div>
      </div>

 
      <div class="btns btns-home">
        <NuxtLink to="/Auth/categories" ><button class="login-btn" > 
                 اختر  فئاتك المفضله
                <LeftArrowIcon class="left-icon" />
              </button></NuxtLink>
         
        </div>
    </div>
  </div>
</template>

<style scoped>
select {
  color: #a3adbb;
  text-align: right;
  padding: 10px 30px 10px 0;
  border-radius: 10px;
  border: 1px solid #dde1e6;
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
  direction: rtl;
}

select:focus {
  outline: none;
  border: 1px solid #b2bbc6;
}

input {
  width: 100%;
  padding: 10px 60px 10px 10px;
  border: 1px solid #dde1e6;
  border-radius: 10px;
  direction: rtl;
}

input:focus {
  outline: none;
  border: 1px solid #b2bbc6;
}

.login-container .login-form .btns.btns-home button {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}
.left-icon {
  width: 24px;
  height: 24px;
}
.login-container .login-form .btns.btns-home button {
  width: 51% !important;
}
</style>
