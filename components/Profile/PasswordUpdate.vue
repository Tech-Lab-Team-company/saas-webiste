<script setup lang="ts">
import ChangePasswordController from "~/features/ChangePasswordFeature/presentation/controllers/change_password_controller";
import ChangePasswordParams from "~/features/ChangePasswordFeature/Core/Params/change_password_params";

const currentPassword = ref<string>("");
const newPassword = ref<string>("");
const newPasswordConfirmation = ref<string>("");
const changePasswordController = ChangePasswordController.getInstance();

const changePassword = async () => {
  await changePasswordController.changePassword(
    new ChangePasswordParams(
      currentPassword.value,
      newPassword.value,
      newPasswordConfirmation.value
    )
  );
};
</script>

<template>
  <div class="profile-home">
    <div class="profile-home-text">
      <p>{{ $t('تغيير كلمة المرور') }}</p>
      <p>
        {{ $t('قم بتغيير كلمة المرور الخاصة بك هنا للحفاظ على حسابك آمناً.') }}
      </p>
    </div>

    <hr class="profile-text-hr" />

    <form @submit.prevent="changePassword" class="profile-home-information mt-12">
      
      <div class="profile-info-container">
        <label class="input-label" for="current_password">{{ $t('كلمة المرور الحالية') }}</label>
        <div class="profile-input-container">
          <input
            id="current_password"
            type="password"
            class="input"
            v-model="currentPassword"
            placeholder="ادخل كلمة المرور الحالية"
          />
        </div>
      </div>

      <div class="profile-info-container">
        <label class="input-label" for="new_password">{{ $t('كلمة المرور الجديدة') }}</label>
        <div class="profile-input-container">
          <input
            id="new_password"
            type="password"
            class="input"
            v-model="newPassword"
            placeholder="ادخل كلمة المرور الجديدة"
          />
        </div>
      </div>

      <div class="profile-info-container">
        <label class="input-label" for="new_password_confirm">{{ $t('تأكيد كلمة المرور الجديدة') }}</label>
        <div class="profile-input-container">
          <input
            id="new_password_confirm"
            type="password"
            class="input"
            v-model="newPasswordConfirmation"
            placeholder="اعد كتابة كلمة المرور الجديدة"
          />
        </div>
      </div>

      <div class="profile-info-container">
        <div class="profile-input-container">
          <button
            class="primary-button-2 w-full md:w-auto"
            aria-label="submit"
            type="submit"
          >
            {{ $t('حفظ كلمة المرور') }}
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<style scoped></style>
