<script lang="ts" setup>
import callIcon from "../../public/icons/callIcon.vue";
import MapIcon from "../../public/icons/map.vue";
import city from "../../public/icons/city.vue";
import national from "../../public/icons/national.vue";
import student from "../../public/icons/student.vue";
import LockIcon from "../../public/icons/LockIcon.vue";
import sms from "../../public/icons/sms.vue";
import eyeone from "../../public/icons/eyeone.vue";
import userEdit from "../../public/icons/userEdit.vue";
import { ref } from "vue";

const showPassword = ref(false);
const password = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

const validatePassword = () => {
  const passwordRegex = /^(?=.*[/*#@]).{8,}$/;

  if (!password.value) {
    passwordError.value = "كلمة المرور مطلوبة";
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value =
      "كلمة المرور يجب أن تكون أكثر من 8 أحرف وتحتوي على رموز مثل (/*#@)";
  } else {
    passwordError.value = "";
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h3>هذا البريد مسجل من قبل</h3>
      <p>ادخل كلمه المرور الخاصه بك لاستكمال عمليه تسجيل الدخول</p>

      <div class="login-input password-container">
        <LockIcon class="login-call-icon lock-icon" />
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="كلمه المرور"
          v-model="password"
          @input="validatePassword"
        />
        <eyeone
          class="login-call-aicon eye-icon"
          @click="showPassword = !showPassword"
        />
      </div>
      <div class="error-message" v-if="passwordError">
        {{ passwordError }}
      </div>

      <div class="btns btns-home">
        <button class="login-btn">
          <NuxtLink to="/Auth/education">تسجيل دخول</NuxtLink>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container .login-form p {
  width: 100% !important;
}

.password-container {
  position: relative;
  width: 100%;
}

.login-call-icon,
.login-call-aicon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.login-call-icon.lock-icon {
  right: 10px;
}

.eye-icon {
  left: 10px;
  cursor: pointer;
  font-size: 18px;
}

.error-message {
  color: #0752ac;
  font-size: 12px;
  text-align: right;
  margin: 5px 0;
  direction: rtl;
}

input {
  padding: 10px 60px 10px 10px;
  border: 1px solid #dde1e6;
  border-radius: 10px;
  direction: rtl;
}

input:focus {
  outline: none;
  border: 1px solid #b2bbc6;
}
</style>
