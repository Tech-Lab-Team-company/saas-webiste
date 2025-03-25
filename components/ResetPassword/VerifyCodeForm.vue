<script setup lang="ts">
const code = ref<string>("");

import VerifyCodeParams from "~/features/VerifyCodeFeature/Core/Params/verfiy_code_params";
import EmailBuilder from "~/features/VerifyCodeFeature/presentation/builder/email_builder";
import VerifyCodeController from "~/features/VerifyCodeFeature/presentation/controllers/verify_code_controller";

const verifyCodeController = VerifyCodeController.getInstance();
const router = useRouter();

const verifyCode = async () => {
  await verifyCodeController.verifyCode(
    new VerifyCodeParams(code.value, EmailBuilder.Instance.build()!),
    router
  );
};
</script>

<template>
  <form @submit.prevent="verifyCode" class="login-form">
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
    <h1 class="main-title">{{ $t("Verify_code") }} ?</h1>
    <p class="mb-4">
      {{ $t("An_authentication_code_has_been_sent_to_your_code") }}.
    </p>
    <div class="input-wrapper">
      <InputOtp v-model="code" :length="6">
        <template #default="{ attrs, events }">
          <input
            type="text"
            v-bind="attrs"
            v-on="events"
            class="custom-otp-input"
          />
        </template>
      </InputOtp>
    </div>
    <div class="sign-up-link-wrapper">
      <p class="sign-up-info">
        {{ $t("Didnt_receive_a_code") }}
        <NuxtLink to="/register" class="sign-up-link">
          {{ $t("resend") }}
        </NuxtLink>
      </p>
    </div>
    <div class="login-button-wrapper mb-6 mt-6">
      <button class="primary-button" aria-label="submit">
        {{ $t("submit") }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.p-inputotp {
  justify-content: center;
}
.custom-otp-input {
  width: 40px;
  font-size: 36px;
  border: 0 none;
  appearance: none;
  text-align: center;
  transition: all 0.2s;
  background: transparent;
  border-bottom: 2px solid var(--text-color);
}

.custom-otp-input:focus {
  outline: 0 none;
  border-bottom-color: var(--text-color);
}
</style>
