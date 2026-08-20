<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import RegisterParams from "~/features/RegisterFeature/Core/Params/register_params";
import RegisterController from "~/features/RegisterFeature/presentation/controllers/register_controller";
import { GenderEnum } from "~/features/RegisterFeature/Core/Enums/gender_enum";
import { CategoryIdEnum } from "~/features/RegisterFeature/Core/Enums/education_type_enum";
import countries from "~/data/countries.json";

const settingStore = useSettingStore();
const router = useRouter();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const formError = ref("");
const isSubmitting = ref(false);

const FirstName = ref("");
const SecondName = ref("");
const Email = ref("");
const StudentAddress = ref("");
const FirstphoneNumber = ref("");
const SecondphoneNumber = ref("");
const studentType = ref(0);
const Education_Type = ref(0);

type CountryOption = (typeof countries)[number];
const selectedCountry = ref<CountryOption | string | undefined>(
  settingStore.setting?.country_code,
);
const isEmailRequired = computed(() =>
  Boolean(settingStore.setting?.email_required),
);

const educationTypeOptions = [
  { value: CategoryIdEnum.BASIC, label: "أساسي" },
  { value: CategoryIdEnum.UNIVERSITY, label: "جامعي" },
  { value: CategoryIdEnum.GENERAL, label: "عام" },
] as const;

const availableEducationTypeOptions = computed(() => {
  const enabledCategoryIds = new Set(
    (settingStore.setting?.categories ?? []).map(Number),
  );

  return educationTypeOptions.filter(({ value }) =>
    enabledCategoryIds.has(value),
  );
});

watch(
  availableEducationTypeOptions,
  (options) => {
    if (!options.some(({ value }) => value === Education_Type.value)) {
      Education_Type.value = options[0]?.value ?? 0;
    }
  },
  { immediate: true },
);

watch(
  () => settingStore.setting?.country_code,
  (countryCode) => {
    if (!countryCode || typeof selectedCountry.value === "object") return;

    selectedCountry.value =
      countries.find(({ dial_code }) => dial_code === countryCode) || countryCode;
  },
  { immediate: true },
);

const selectedCountryCode = computed(() => {
  const country = selectedCountry.value as
    | string
    | { dial_code?: string }
    | null
    | undefined;

  if (country && typeof country === "object") {
    return country.dial_code || "";
  }

  return country || settingStore.setting?.country_code || "";
});

const validatePassword = (requireConfirmation = false) => {
  const passwordRegex = /^(?=.*[/*#@]).{8,}$/;

  if (!password.value) {
    passwordError.value = "كلمة المرور مطلوبة";
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value =
      "استخدم 8 أحرف على الأقل، مع رمز واحد مثل @ أو # أو *";
  } else {
    passwordError.value = "";
  }

  if (!confirmPassword.value && requireConfirmation) {
    confirmPasswordError.value = "تأكيد كلمة المرور مطلوب";
  } else if (
    confirmPassword.value &&
    confirmPassword.value !== password.value
  ) {
    confirmPasswordError.value = "كلمتا المرور غير متطابقتين";
  } else {
    confirmPasswordError.value = "";
  }

  return !passwordError.value && !confirmPasswordError.value;
};

const CheckData = async () => {
  formError.value = "";
  const passwordsAreValid = validatePassword(true);

  if (!FirstName.value.trim() || !FirstphoneNumber.value.trim()) {
    formError.value = "أكمل الاسم ورقم الموبايل للمتابعة.";
    return;
  }

  if (settingStore.setting?.allow_parent_name && !SecondName.value.trim()) {
    formError.value = "أدخل اسم ولي الأمر للمتابعة.";
    return;
  }

  if (settingStore.setting?.address_required && !StudentAddress.value.trim()) {
    formError.value = "أدخل العنوان للمتابعة.";
    return;
  }

  if (isEmailRequired.value && !Email.value.trim()) {
    formError.value = "أدخل البريد الإلكتروني للمتابعة.";
    return;
  }

  if (
    Email.value.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email.value.trim())
  ) {
    formError.value = "أدخل بريدًا إلكترونيًا صحيحًا.";
    return;
  }

  if (!studentType.value || !Education_Type.value) {
    formError.value = "اختر النوع والصف الدراسي للمتابعة.";
    return;
  }

  if (
    settingStore.setting?.country_code_required &&
    !selectedCountryCode.value
  ) {
    formError.value = "اختر كود الدولة للمتابعة.";
    return;
  }

  if (!passwordsAreValid) {
    formError.value = "راجع بيانات كلمة المرور الموضحة أسفل الحقول.";
    return;
  }

  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const registerParams = new RegisterParams(
    FirstName.value.trim(),
    SecondName.value.trim() || null,
    StudentAddress.value.trim() || null,
    Email.value.trim() || null,
    FirstphoneNumber.value.trim(),
    SecondphoneNumber.value.trim() || null,
    password.value,
    confirmPassword.value,
    Education_Type.value,
    selectedCountryCode.value,
    studentType.value,
  );

  try {
    const registerController = RegisterController.getInstance();
    await registerController.Register(registerParams, router);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="login-container auth-register-container">
    <form class="login-form auth-register-form" novalidate @submit.prevent="CheckData">
      <h3>إنشاء حساب</h3>
      <p>أكمل البيانات واختر الصف الدراسي المناسب.</p>

      <div class="register-intro">
        <div class="register-notice">
          <span class="register-notice__icon" aria-hidden="true">i</span>
          <span>
            <strong>معاينة إنشاء الحساب</strong>
            <small>لن تُرسل أو تُحفظ أي بيانات قبل الضغط على متابعة.</small>
          </span>
        </div>

        <!-- <NuxtLink class="register-preview" to="/">
          <span>
            <strong>افتح معاينة مساحة الطالب</strong>
            <small>تخطَّ النموذج وشاهد تنظيم المحتوى قبل إنشاء الحساب.</small>
          </span>
          <span aria-hidden="true">←</span>
        </NuxtLink> -->

        <!-- <div class="register-divider">
          <span>أو جرّب نموذج إنشاء الحساب</span>
        </div> -->
      </div>

      <div v-if="formError" class="register-alert" role="alert" aria-live="polite">
        <span class="pi pi-exclamation-circle" aria-hidden="true" />
        <span>{{ formError }}</span>
      </div>

      <div class="inputs register-fields">
        <div class="auth-field-group register-field--wide">
          <label class="auth-field-label" for="register-first-name">
            الاسم بالكامل <span class="required-mark">*</span>
          </label>
          <div class="login-input">
            <input
              id="register-first-name"
              v-model="FirstName"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="اكتب اسم الطالب"
              required
            >
          </div>
        </div>

        <div
          v-if="settingStore.setting?.allow_parent_name"
          class="auth-field-group register-field--wide"
        >
          <label class="auth-field-label" for="register-parent-name">
            اسم ولي الأمر <span class="required-mark">*</span>
          </label>
          <div class="login-input">
            <input
              id="register-parent-name"
              v-model="SecondName"
              type="text"
              name="parent-name"
              autocomplete="off"
              placeholder="اكتب اسم ولي الأمر"
              required
            >
          </div>
        </div>

        <div
          v-if="settingStore.setting?.address_required"
          class="auth-field-group register-field--wide"
        >
          <label class="auth-field-label" for="register-address">
            العنوان <span class="required-mark">*</span>
          </label>
          <div class="login-input">
            <input
              id="register-address"
              v-model="StudentAddress"
              type="text"
              name="street-address"
              autocomplete="street-address"
              placeholder="اكتب العنوان بالتفصيل"
              required
            >
          </div>
        </div>

        <div class="auth-field-group register-field--wide">
          <label class="auth-field-label" for="register-email">
            البريد الإلكتروني
            <span v-if="isEmailRequired" class="required-mark">*</span>
            <span v-else class="optional-mark">(اختياري)</span>
          </label>
          <div class="login-input">
            <input
              id="register-email"
              v-model="Email"
              type="email"
              name="email"
              autocomplete="email"
              inputmode="email"
              placeholder="name@example.com"
              :required="isEmailRequired"
            >
          </div>
        </div>

        <div class="auth-field-group register-field--wide">
          <label class="auth-field-label" for="register-phone">
            رقم الموبايل <span class="required-mark">*</span>
          </label>
          <div class="login-input login-input-phone-code">
            <div class="phone-number">
              <input
                id="register-phone"
                v-model="FirstphoneNumber"
                type="tel"
                name="tel"
                autocomplete="tel"
                inputmode="tel"
                placeholder="اكتب رقم الموبايل"
                required
              >
            </div>
            <div
              v-if="settingStore.setting?.country_code_required"
              class="phone-code"
            >
              <Select
                v-model="selectedCountry"
                :options="countries"
                filter
                option-label="name"
                aria-label="كود الدولة"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="country-value">
                    <span>{{ slotProps.value.flag }}</span>
                    <span>{{ slotProps.value.dial_code || slotProps.value }}</span>
                  </div>
                </template>
                <template #option="slotProps">
                  <div class="country-option">
                    <span>{{ slotProps.option.flag }}</span>
                    <span>{{ slotProps.option.name }}</span>
                    <span>({{ slotProps.option.dial_code }})</span>
                  </div>
                </template>
              </Select>
            </div>
          </div>
        </div>

        <div
          v-if="settingStore.setting?.allow_parent_phone"
          class="auth-field-group register-field--wide"
        >
          <label class="auth-field-label" for="register-parent-phone">
            رقم موبايل ولي الأمر
          </label>
          <div class="login-input">
            <input
              id="register-parent-phone"
              v-model="SecondphoneNumber"
              type="tel"
              name="parent-tel"
              autocomplete="tel"
              inputmode="tel"
              placeholder="رقم بديل للتواصل"
            >
          </div>
        </div>

        <div class="register-fields-grid register-fields-grid--passwords">
          <div class="auth-field-group">
            <label class="auth-field-label" for="register-password">
              كلمة المرور <span class="required-mark">*</span>
            </label>
            <div class="login-input password-container">
              <input
                id="register-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="new-password"
                autocomplete="new-password"
                placeholder="8 أحرف على الأقل"
                :aria-invalid="Boolean(passwordError)"
                required
                @input="validatePassword(false)"
              >
              <button
                type="button"
                class="register-password-toggle"
                :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                <span :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" aria-hidden="true" />
              </button>
            </div>
            <div v-if="passwordError" class="error-message" role="alert">
              {{ passwordError }}
            </div>
          </div>

          <div class="auth-field-group">
            <label class="auth-field-label" for="register-confirm-password">
              تأكيد كلمة المرور <span class="required-mark">*</span>
            </label>
            <div class="login-input password-container">
              <input
                id="register-confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirm-password"
                autocomplete="new-password"
                placeholder="أعد كتابة كلمة المرور"
                :aria-invalid="Boolean(confirmPasswordError)"
                required
                @input="validatePassword(true)"
              >
              <button
                type="button"
                class="register-password-toggle"
                :aria-label="showConfirmPassword ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'"
                :aria-pressed="showConfirmPassword"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <span :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" aria-hidden="true" />
              </button>
            </div>
            <div v-if="confirmPasswordError" class="error-message" role="alert">
              {{ confirmPasswordError }}
            </div>
          </div>
        </div>

        <div class="register-fields-grid register-fields-grid--study">
          <div class="auth-field-group">
            <label class="auth-field-label" for="register-student-type">
              النوع <span class="required-mark">*</span>
            </label>
            <div class="login-input">
              <select
                id="register-student-type"
                v-model="studentType"
                class="student-select"
                name="gender"
                required
              >
                <option :value="0" disabled>اختر النوع</option>
                <option :value="GenderEnum.male">ذكر</option>
                <option :value="GenderEnum.female">أنثى</option>
              </select>
            </div>
          </div>

          <div class="auth-field-group">
            <label class="auth-field-label" for="register-education-type">
              الصف الدراسي <span class="required-mark">*</span>
            </label>
            <div class="login-input">
              <select
                id="register-education-type"
                v-model="Education_Type"
                class="student-select"
                name="education-type"
                required
              >
                <option
                  v-if="availableEducationTypeOptions.length === 0"
                  :value="0"
                  disabled
                >
                  لا توجد صفوف متاحة
                </option>
                <option
                  v-for="option in availableEducationTypeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="btns btns-home register-actions">
          <button
            class="login-btn"
            type="submit"
            :disabled="isSubmitting || availableEducationTypeOptions.length === 0"
          >
            <span>{{ isSubmitting ? "جارٍ إنشاء الحساب..." : "متابعة" }}</span>
            <span v-if="!isSubmitting" aria-hidden="true">←</span>
          </button>
        </div>

        <div class="register-login-link">
          <span class="register-login-link__copy">
            <strong>لديك حساب بالفعل؟</strong>
            <small>سجّل دخولك وانتقل مباشرة إلى مساحة الطالب.</small>
          </span>
          <NuxtLink to="/loginhome">
            <span>تسجيل الدخول</span>
            <span aria-hidden="true">←</span>
          </NuxtLink>
        </div>
      </div>
    </form>

  </div>
</template>

<style scoped lang="scss">
.required-mark {
  color: color-mix(in srgb, var(--app-accent) 55%, #ff6178);
  font-weight: 900;
}

.optional-mark {
  margin-inline-start: 4px;
  color: var(--app-muted);
  font-size: 9px;
  font-weight: 700;
}

.register-intro {
  margin-bottom: 22px;
}

.register-notice,
.register-preview {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 15px 16px;
  border-radius: 0;
}

.register-notice {
  gap: 14px;
  border: 1px solid color-mix(in srgb, var(--app-accent) 38%, var(--app-line));
  background: color-mix(in srgb, var(--app-accent) 12%, var(--app-surface));
}

.register-notice__icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 50%;
  background: var(--app-accent);
  color: #fff;
  font-family: Georgia, serif;
  font-weight: 900;
}

.register-notice > span:last-child,
.register-preview > span:first-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.register-notice strong,
.register-preview strong {
  color: var(--app-text);
  font-size: 13px;
  font-weight: 900;
}

.register-notice small,
.register-preview small {
  color: var(--app-muted);
  font-size: 10px;
  line-height: 1.7;
}

.register-preview {
  justify-content: space-between;
  gap: 20px;
  margin-top: 16px;
  border: 1px solid color-mix(in srgb, var(--app-accent-secondary) 34%, transparent);
  background: color-mix(in srgb, var(--app-accent-secondary) 28%, var(--app-bg));
  color: var(--app-accent);
  text-decoration: none;
  transition: border-color 160ms ease, transform 160ms ease;
}

.register-preview:hover,
.register-preview:focus-visible {
  border-color: var(--app-accent);
  transform: translateY(-1px);
}

.register-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  color: var(--app-muted);
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.register-divider::before,
.register-divider::after {
  width: 100%;
  height: 1px;
  background: var(--app-line);
  content: "";
}

.register-alert {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 18px;
  padding: 11px 13px;
  border: 1px solid color-mix(in srgb, #e04f63 40%, var(--app-line));
  background: color-mix(in srgb, #e04f63 10%, var(--app-surface));
  color: color-mix(in srgb, #e04f63 70%, var(--app-text));
  font-size: 11px;
  font-weight: 800;
  line-height: 1.7;
}

.register-fields {
  gap: 17px !important;
}

.register-fields-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.country-value,
.country-option {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
}

.country-option {
  direction: rtl;
}

.password-container input {
  padding-inline-end: 48px !important;
}

.register-password-toggle {
  position: absolute;
  z-index: 2;
  top: 50%;
  inset-inline-end: 7px;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--app-muted);
  cursor: pointer;
  transform: translateY(-50%);
}

.register-password-toggle:hover,
.register-password-toggle:focus-visible {
  color: var(--app-accent);
}

.register-actions {
  margin-top: 0 !important;
}

.register-actions .login-btn {
  border-radius: 0 !important;
}

.register-actions .login-btn:disabled {
  cursor: not-allowed !important;
  opacity: 0.62;
}

.register-login-link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  margin: 5px 0 0 !important;
  padding: 13px 14px;
  border: 1px solid var(--app-line);
  background: color-mix(in srgb, var(--app-accent) 5%, var(--app-surface));
  text-align: right;
}

.register-login-link__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.register-login-link__copy strong {
  color: var(--app-text);
  font-size: 12px;
  font-weight: 900;
}

.register-login-link__copy small {
  color: var(--app-muted);
  font-size: 9px;
  line-height: 1.7;
}

.register-login-link a {
  display: inline-flex;
  min-width: 146px;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 9px 16px;
  background: var(--secondary-color, #3a3e7e);
  color: #fff !important;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
  transition: background-color 160ms ease, transform 160ms ease,
    box-shadow 160ms ease;
}

.register-login-link a:hover,
.register-login-link a:focus-visible {
  background: var(--primary-color, #28366c);
  box-shadow: 0 12px 24px -16px var(--app-shadow);
  transform: translateY(-1px);
}

.register-login-link a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--app-accent) 28%, transparent);
  outline-offset: 3px;
}

@media (max-width: 560px) {
  .register-fields-grid {
    grid-template-columns: 1fr;
  }

  .register-preview,
  .register-notice {
    padding-inline: 13px;
  }

  .register-login-link {
    grid-template-columns: 1fr;
  }

  .register-login-link a {
    width: 100%;
  }
}
</style>
