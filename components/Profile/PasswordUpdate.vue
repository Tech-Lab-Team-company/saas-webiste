<script setup lang="ts">
import ChangePasswordController
  from "~/features/ChangePasswordFeature/presentation/controllers/change_password_controller";
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
          newPasswordConfirmation.value,
      ),
  );
};
</script>

<template>
  <div class="profile-home">

    <div class="profile-home-text">
      <p>البيانات الشخصيه</p>
      <p>
        هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين
        الآخرين
      </p>
    </div>
    <form @submit.prevent="changePassword" class="grid grid-cols-1 gap-4 mt-12">
      <div class="col-span-1">
        <div class="profile-input-container">
          <label class="input-label" for="current_password">
            كلمة المرور الحاليه
          </label>
          <input
              class="input"
              type="password"
              id="current_password"
              v-model="currentPassword"
              placeholder="Enter your Current password"
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="profile-input-container">
          <label class="input-label" for="new_password">
            كلمة المرور الجديده
          </label>
          <input
              class="input"
              type="password"
              id="new_password"
              v-model="newPassword"
              placeholder="Enter your new password"
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="profile-input-container">
          <label class="input-label" for="new_password_confirm">
            تاكيد كلمة المرور
          </label>
          <input
              class="input"
              type="password"
              id="new_password_confirm"
              v-model="newPasswordConfirmation"
              placeholder="Enter your new password confirmation"
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
              class="primary-button-2 col-span-1 md:col-span-2"
              aria-label="submit"
              type="submit"
          >
            حفظ
          </button>

        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
