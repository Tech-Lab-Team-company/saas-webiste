<script setup lang="ts">
import SetNewPasswordController from "~/features/SetNewPasswordFeature/presentation/controllers/set_new_password_controller";
import ResetPasswordBuilder from "~/features/ResetPasswordFeature/presentation/builders/reset_password_builder";
import SetNewPasswordParams from "~/features/SetNewPasswordFeature/Core/Params/set_new_password_params";
const setNewPasswordController = SetNewPasswordController.getInstance();
const password = ref<string>("");
const confirmPassword = ref<string>("");

const router = useRouter();

const setPassword = async () => {
  await setNewPasswordController.setNewPassword(
    new SetNewPasswordParams(
      ResetPasswordBuilder.Instance.build()!,
      password.value,
      confirmPassword.value
    ),
    router
  );
};
</script>

<template>
  <form @submit.prevent="setPassword" class="login-form">
    <NuxtLink to="/" class="back-link">
      <svg
        width="9"
        height="16"
        viewBox="0 0 9 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.75 14.75L1 8L7.75 1.25"
          stroke="#313131"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ $t("back_to_home") }}</span></NuxtLink
    >
    <h1 class="main-title">{{ $t("Set_a_password") }} ?</h1>
    <p class="mb-4">
      {{
        $t(
          "Your_previous_password_has_been_reseted_Please_set_a_new_password_for_your_account"
        )
      }}
    </p>
    <div class="input-wrapper">
      <label class="input-label" for="password">{{
        $t("Create_Password")
      }}</label>
      <input
        class="input"
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter your Password"
      />
    </div>
    <div class="input-wrapper">
      <label class="input-label" for="re_password">{{
        $t("Re_enter_Password")
      }}</label>
      <input
        class="input"
        type="password"
        id="re_password"
        v-model="confirmPassword"
        placeholder="Enter your Password"
      />
    </div>
    <div class="login-button-wrapper mb-6 mt-6">
      <button class="primary-button" aria-label="submit">
        {{ $t("Set_password") }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
