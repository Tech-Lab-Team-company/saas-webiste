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
      newPasswordConfirmation.value,
    ),
  );
};
</script>

<template>
  <form @submit.prevent="changePassword" class="grid grid-cols-1 gap-4 mt-12">
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="current_password">{{
          $t("current_password")
        }}</label>
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
      <div class="input-wrapper">
        <label class="input-label" for="new_password">{{
          $t("new_password")
        }}</label>
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
      <div class="input-wrapper">
        <label class="input-label" for="new_password_confirm">{{
          $t("new_password_confirmation")
        }}</label>
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
          {{ $t("save") }}
        </button>
        <button
          class="secondary-button col-span-1"
          aria-label="cancel"
          type="button"
        >
          {{ $t("cancel") }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
