<script lang="ts" setup>
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

      <div class="auth-field-group">
        <label class="auth-field-label" for="existing-email-password">كلمة المرور</label>
        <div class="login-input password-container">
          <input
            id="existing-email-password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @input="validatePassword"
          />
        </div>
        <div class="error-message" v-if="passwordError">
          {{ passwordError }}
        </div>
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
