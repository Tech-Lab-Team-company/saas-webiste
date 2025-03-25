<script setup lang="ts">
import SentCodeController from "~/features/ResetPasswordFeature/presentation/controllers/sent_code_controller";
import SentCodeParams from "~/features/ResetPasswordFeature/Core/Params/sent_code_params";

const email = ref<string>("");

const sentCodeController = SentCodeController.getInstance();

const router = useRouter();

const sentCode = async () => {
  await sentCodeController.sentCode(new SentCodeParams(email.value), router);
};
</script>

<template>
  <form @submit.prevent="sentCode" class="login-form">
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
    <h1 class="main-title">{{ $t("forget_your_password") }} ?</h1>
    <p class="mb-4">
      {{
        $t(
          "Dont_worry_happens_to_all_of_us_Enter_your_email_below_to_recover_your_password"
        )
      }}
    </p>
    <div class="input-wrapper">
      <label class="input-label" for="email">Email</label>
      <input
        class="input"
        type="email"
        id="email"
        v-model="email"
        placeholder="Enter your email"
      />
    </div>
    <div class="login-button-wrapper mb-6 mt-6">
      <button class="primary-button" aria-label="submit">
        {{ $t("submit") }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
