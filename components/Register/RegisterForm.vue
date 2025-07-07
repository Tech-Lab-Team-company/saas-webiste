<script lang="ts" setup>
import callIcon from "../../public/icons/callIcon.vue";
// import MapIcon from "../../public/icons/map.vue";
// import city from "../../public/icons/city.vue";
// import national from "../../public/icons/national.vue";
import student from "../../public/icons/student.vue";
import LockIcon from "../../public/icons/LockIcon.vue";
import sms from "../../public/icons/sms.vue";
import eyeone from "../../public/icons/eyeone.vue";
import userEdit from "../../public/icons/userEdit.vue";
import { ref } from "vue";
import RegisterParams from "~/features/RegisterFeature/Core/Params/register_params";
import RegisterController from "~/features/RegisterFeature/presentation/controllers/register_controller";
// import FetchCountriesParams from "~/features/FetchCountriesFeature/Core/Params/fetch_countries_params";
// import FetchCountriesController from "~/features/FetchCountriesFeature/presentation/controllers/fetch_countries_controller";
import CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import { GenderEnum } from "~/features/RegisterFeature/Core/Enums/gender_enum";
import { StudentCategoryEnum } from "~/features/RegisterFeature/Core/Enums/education_type_enum";
import countries from "~/data/countries.json";

const UserSetting = useSettingStore();

const showTermsDialog = ref(false);
const isTermsAccepted = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const selectedCountry = ref(UserSetting?.setting?.country_code);


const router = useRouter();

const validatePassword = () => {
  const passwordRegex = /^(?=.*[/*#@]).{8,}$/;

  if (!password.value) {
    passwordError.value = "كلمة المرور مطلوبة";
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value = ""
    // "كلمة المرور يجب أن تكون أكثر من 8 أحرف وتحتوي على رموز مثل (/*#@)";
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


const FirstName = ref("");
const SecondName = ref("");
const Email = ref("");
const StudentAddress = ref("");
const FirstphoneNumber = ref("");
const SecondphoneNumber = ref("");
const studentType = ref(0);
const license_accept = ref(0);
const Education_Type = ref(0)

const PhoneCode = ref(UserSetting?.setting?.country_code);


const CheckData = async () => {
console.log(selectedCountry?.value , "code")
  const registerParams = new RegisterParams(FirstName.value,
    SecondName.value || null,
    StudentAddress.value || null,
    Email.value || null,
    FirstphoneNumber.value,
    SecondphoneNumber.value || null,
    password.value,
    confirmPassword.value,
    Education_Type.value,
    selectedCountry?.value,
    studentType.value)

  const registerController = RegisterController.getInstance();
  const state = await registerController.Register(registerParams, router);

}

const data = ref<CountryModel[]>([])
const cities = ref<CountryModel[]>([]);

// const ftechData =async ()=>{
//   const countriesparams = new FetchCountriesParams(1,0) ;
//   const state = await FetchCountriesController.getInstance().fetchCountries(countriesparams);
//   data.value = state.value.data ?? [];

//   if (state.value.data) {
//     cities.value.push(...state.value.data);
//   }
// }

// onMounted(() => {
//   ftechData();
// });





watch(
  () => data.value,
  (newValue) => {
    data.value = newValue;
  });

  


// const validatePhoneNumber = (number: Event) => {
//   if (number.target) {
//       const PhoneNumberMatch = /^\d{11}$/;
//       if((number.target as HTMLInputElement).value.match(PhoneNumberMatch)){
//         phoneNumber.value =(number.target as HTMLInputElement).value ;
//       }
//       else{
//         console.log("رقم الهاتف غير صحيح");
//       }
//   }
//
// }

const settingStore = useSettingStore();

</script>

<template>
  <div class="login-container auth-register-container">
    <div class="login-form">
      <h3>ادخل معلوماتك الشخصيه</h3>
      <p>
        مرحبا بك فى منصتنا ادخل معلوماتك الشخصيه التاليه و احرص على ادخال
        البياناتك الضروريه و المحاطه باللون الازرق وعلامه مميزه *
      </p>

      <div class="inputs">
        <div class="login-input">
          <input type="text" placeholder="الاسم الاول * " v-model="FirstName" />
          <userEdit class="login-call-icon" />
        </div>
        <div class="login-input" v-if="settingStore?.setting?.allow_parent_name">
          <input type="text" placeholder="الاسم الثانى * " v-model="SecondName" />
          <userEdit class="login-call-icon" />
        </div>
        <div class="login-input" v-if="settingStore?.setting?.address_required">
          <input type="text" placeholder="العنوان * " v-model="StudentAddress" />
          <sms class="login-call-icon" />
        </div>
        <div class="login-input" v-if="settingStore?.setting?.email_required">
          <input type="email" placeholder="البريد الالكترونى * " v-model="Email" />
          <sms class="login-call-icon" />
        </div>


        <div class="login-input login-input-phone-code">
          <div class="phone-number">
            <input type="tel" placeholder="رقم الهاتف" v-model="FirstphoneNumber" />
            <callIcon class="login-call-icon" />
          </div>
          <div class="phone-code" v-if="settingStore?.setting?.country_code_required">

            <Select :defaultValue="{ dial_code: `${UserSetting?.setting?.country_code}` }" v-model="selectedCountry" :options="countries" filter optionLabel="name"
              placeholder="Select a Country" class="w-full md:w-56">

              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <div>{{ slotProps.value.dial_code }} {{ slotProps.value.flag }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>

              <template #option="slotProps">
                <div class="flex items-center "  >
                  <span>{{ slotProps.option.flag }}</span>
                  <span>{{ slotProps.option.name }}</span>
                  <div>({{ slotProps.option.dial_code }})</div>
                </div>
              </template>

            </Select>
          </div>
        </div>


        <div class="login-input" v-if="settingStore?.setting?.allow_parent_phone">
          <input type="tel" placeholder=" رقم الهاتف الثانى" v-model="SecondphoneNumber" />
          <callIcon class="login-call-icon" />
        </div>

        <div class="login-input">
          <label :class="{ 'select-placeholder': !studentType, 'hidden': studentType }">نوع الطالب</label>
          <select class="student-select" v-model="studentType" required>
            <option :value="GenderEnum?.male">ذكر</option>
            <option :value="GenderEnum?.female">انثى</option>
          </select>
          <student class="login-call-icon" />
        </div>
        <div class="login-input">
          <label :class="{ 'select-placeholder': !Education_Type, 'hidden': Education_Type }">نوع التعليم</label>
          <select class="student-select" v-model="Education_Type" required>
            <option v-if="settingStore?.setting?.categories.includes(1)" :value="StudentCategoryEnum.base">اساسى
            </option>
            <option v-if="settingStore?.setting?.categories.includes(2)" :value="StudentCategoryEnum.university">جامعى
            </option>
            <option v-if="settingStore?.setting?.has_general" :value="StudentCategoryEnum.general">عام</option>
          </select>
          <student class="login-call-icon" />
        </div>

        <div class="login-input password-container">
          <LockIcon class="login-call-icon lock-icon" />
          <input :type="showPassword ? 'text' : 'password'" placeholder="كلمه المرور" v-model="password"
            @input="validatePassword" />
          <eyeone class="login-call-aicon eye-icon" @click="showPassword = !showPassword" />
        </div>
        <div class="error-message" v-if="passwordError">
          {{ passwordError }}
        </div>

        <div class="login-input password-container">
          <LockIcon class="login-call-icon lock-icon" />
          <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="تأكيد كلمه المرور * "
            v-model="confirmPassword" @input="validatePassword" />
          <eyeone class="login-call-aicon eye-icon" @click="showConfirmPassword = !showConfirmPassword" />
        </div>
        <div class="error-message" v-if="confirmPasswordError">
          {{ confirmPasswordError }}
        </div>

        <!-- <div class="login-input">
           <label :class="{'select-placeholder': !nationality , 'hidden':nationality}">الجنسيه</label>
            <select class="natioal-select" v-model="nationality" >
              <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.title }}</option>
            </select>
          </div>
          <div class="login-input">
            <div class="icon-container">
              <MapIcon />
            </div>
            <div class="login-input">
              <label :class="{'select-placeholder': !country , 'hidden':country}">الدوله</label>
              <select class="city-select" v-model="country">
                <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.title }}</option> 
              </select>
              <city class="login-call-icon" />
            </div>
          </div> -->

        <div class="remember-mee">
          <label for="rememberr">موافق على الشروط و الاحكام </label>
          <input id="rememberr" type="checkbox" @change="toggleTermsDialog" v-model="license_accept" />
        </div>
        <!-- <NuxtLink to="/Auth/emailcode" @click="CheckData"> -->
        <div class="btns btns-home" @click="CheckData">
          <button class="login-btn">
            التحقق من بريدك الإلكتروني </button>
        </div>
        <!-- </NuxtLink> -->
        <!-- <NuxtLink to="/Auth/email" ><div class="btns btns-home">
            <button class="login-btn" > 
                التحقق من بريدك الإلكتروني  </button>
              </div>
          </NuxtLink> -->

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

<style scoped lang="scss">
.hidden {
  display: none;
}

.login-input {
  position: relative;
}

.select-placeholder {
  position: absolute;
  top: 50%;
  right: 7%;
  transform: translateY(-50%);
  color: #909dad;
  pointer-events: none;
  transition: 0.2s;
}

/*  */


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

  &.login-input-phone-code {
    display: flex;
    width: 100%;
    gap: 20px;
    flex-direction: row-reverse;

    .phone-number {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .phone-code {
      width: 130px;

      select {
        option {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-direction: row-reverse;
        }
      }
    }
  }

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
