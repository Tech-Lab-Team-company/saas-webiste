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
import RegisterParams from "~/features/RegisterFeature/Core/Params/register_params";
import RegisterController from "~/features/RegisterFeature/presentation/controllers/register_controller";

const showTermsDialog = ref(false);
const isTermsAccepted = ref(false);       
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

const router = useRouter();

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

  if (confirmPassword.value && confirmPassword.value !== password.value) {
    confirmPasswordError.value = "كلمة المرور غير متطابقة";
  } else {
    confirmPasswordError.value = "";
  }
};

const toggleTermsDialog = (event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  isTermsAccepted.value = checkbox.checked;
  showTermsDialog.value = checkbox.checked; // الـ dialog يظهر فقط عند تحديد الـ checkbox
};


const FullName = ref("");
const Email = ref("");
const phoneNumber = ref("");
const studentType = ref(0);
const nationality = ref(0);
const country = ref(0);
const license_accept = ref(0);

const CheckData = ()=>{
  
  // const registerParams = new RegisterParams(FullName.value , Email.value , phoneNumber.value  ,password.value , confirmPassword.value,studentType.value ,"+20",country.value,nationality.value);
  const registerParams = new RegisterParams(FullName.value , Email.value , phoneNumber.value  ,password.value , confirmPassword.value,1 ,"+20",2,1)
  const response =  RegisterController.getInstance().Register(registerParams,router);

}


</script>

<template>
    <div class="login-container">
      <div class="login-form">
        <h3>ادخل معلوماتك الشخصيه</h3>
        <p>
          مرحبا بك فى منصتنا ادخل معلوماتك الشخصيه التاليه و احرص على ادخال
          البياناتك الضروريه و المحاطه باللون الازرق وعلامه مميزه *
        </p>
  
        <div class="inputs">
          <div class="login-input">
            <input type="text" placeholder="الاسم بالكامل * " v-model="FullName"/>
            <userEdit class="login-call-icon" />
          </div>
          <div class="login-input">
            <input type="email" placeholder="البريد الالكترونى * "  v-model="Email"/>
            <sms class="login-call-icon" />
          </div>
          <div class="login-input">
            <input type="text" placeholder="رقم الهاتف" v-model="phoneNumber" />
            <callIcon class="login-call-icon" />
          </div>
          <div class="login-input">
            <select class="student-select" v-model="studentType">
              <option value="" disabled selected>نوع الطالب</option>
              <option value="student1">طالب</option>
              <option value="student2">طالب</option>
              <option value="student3">طالب</option>
            </select>
            <student class="login-call-icon" />
          </div>
  
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
  
          <div class="login-input password-container">
            <LockIcon class="login-call-icon lock-icon" />
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="تأكيد كلمه المرور * "
              v-model="confirmPassword"
              @input="validatePassword"
            />
            <eyeone
              class="login-call-aicon eye-icon"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </div>
          <div class="error-message" v-if="confirmPasswordError">
            {{ confirmPasswordError }}
          </div>
  
          <div class="login-input">
            <select class="natioal-select" v-model="nationality">
              <option value="" disabled selected>الجنسيه</option>
              <option value="national1">عربي</option>
              <option value="national2">عربي</option>
              <option value="national3">عربي</option>
            </select>
            <national class="login-call-icon" />
          </div>
          <div class="login-input">
            <div class="icon-container">
              <MapIcon />
            </div>
            <div class="login-input">
              <select class="city-select" v-model="country">
                <option value="" disabled selected>الدوله</option>
                <option value="city1">مصر</option>
                <option value="city2">مصر</option>
                <option value="city3">مصر</option>
              </select>
              <city class="login-call-icon" />
            </div>
          </div>
  
          <div class="remember-mee">
            <label for="rememberr">موافق على الشروط و الاحكام </label>
            <input id="rememberr" type="checkbox" @change="toggleTermsDialog" v-model="license_accept" />
          </div>
          <!-- <NuxtLink to="/Auth/emailcode" @click="CheckData"> -->
            <div class="btns btns-home" @click="CheckData">
            <button class="login-btn" > 
                التحقق من بريدك الإلكتروني  </button>
              </div>
          <!-- </NuxtLink> -->
          <NuxtLink to="/Auth/email" ><div class="btns btns-home">
            <button class="login-btn" > 
                التحقق من بريدك الإلكتروني  </button>
              </div>
          </NuxtLink>
         
        <!-- <div class="btns btns-home">
            <button class="login-btn" >  <NuxtLink to="/Auth/email" 
                >التحقق من بريدك الإلكتروني</NuxtLink>  </button>
         
        </div> -->
        </div>
      </div>
  
      <!--اDialog -->
      <div class="terms-dialog" v-if="showTermsDialog">
        <div class="dialog-content">
          <span class="close" @click="showTermsDialog = false">&times;</span>
          <h3>الشروط والأحكام</h3>
          <p>
            هنا يمكنك كتابة الشروط والأحكام الخاصة بالمنصة. على سبيل المثال: يجب
            أن تكون جميع البيانات المدخلة صحيحة ودقيقة، ويمنع استخدام المنصة
            لأغراض غير قانونية، ويلتزم المستخدم بحماية خصوصية حسابه.
          </p>
          <button @click="showTermsDialog = false">إغلاق</button>
        </div>
      </div>
    </div>
  </template>

<style scoped>
    
    
.remember-mee {
  display: flex;
  align-items: center;
}
.remember-mee label {
  text-align: end;
  width: 100%;
  text-decoration: underline;
  font-family: "regular";
  font-weight: 400;
  font-size: 14px;
  color: #909dad;
}
.remember-mee input {
  width: 30px;
}
.login-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
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

.icon-container {
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0f1f4;
  width: 50px;
  height: 40px;
}

.city-select {
  color: #a3adbb;
  text-align: right;
  padding: 10px 30px 10px 0;
  border-radius: 10px;
  font-size: 14px;
  direction: rtl;
  background: transparent;
  width: 320px;
}

@media(max-width: 767px) {
  .city-select {
    width: 200px;
  }
}
@media(max-width: 500px) {
  .city-select {
    width: 120px;
  }
}

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

.terms-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  position: relative;
  text-align: right;
  direction: rtl;
}

.dialog-content h3 {
  color: #032855;
  margin-bottom: 10px;
}

.dialog-content p {
  color: #333;
  font-size: 14px;
  margin-bottom: 20px;
}

.dialog-content button {
  background: #032855;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}


.close {
  position: absolute;
  left: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}
</style>
