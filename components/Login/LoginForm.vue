<script setup lang="ts">
import LoginParams from "~/features/LoginFeature/Core/Params/login_params";
import LoginController from "~/features/LoginFeature/presentation/controllers/login_controller";


const router = useRouter()
const email = ref<string>("");
const password = ref<string>("");

const loginController = LoginController.getInstance();

const login = async () => {
  await loginController.login(
      new LoginParams(email.value, password.value, ""), router
  );
};
</script>

<template>
  <form @submit.prevent="login" class="login-form">
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
    <h1 class="main-title">
      {{ $t("welcome_in") }} <span class="rakwa">Rakwa</span> !
    </h1>
    <p class="mb-4">{{ $t("Login_to_access_your_account") }}</p>
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
    <div class="input-wrapper">
      <label class="input-label" for="password">Password</label>
      <input
        class="input"
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter your password"
      />
    </div>
    <div class="flex justify-between items-center mb-8">
      <div class="check-box">
        <input type="checkbox" id="remember-me" />
        <label for="remember-me">
          {{ $t("remember_me") }}
        </label>
      </div>
      <NuxtLink to="/auth/forget-password" class="forget-password-link"
        >{{ $t("forget_password") }}
      </NuxtLink>
    </div>
    <div class="login-button-wrapper mb-6">
      <button class="primary-button">{{ $t("login") }}</button>
    </div>
    <div class="sign-up-link-wrapper text-center">
      <p class="sign-up-info justify-center">
        {{ $t("dont_have_account") }}
        <NuxtLink to="/auth/register" class="sign-up-link">
          {{ $t("sign_up") }}
        </NuxtLink>
      </p>
    </div>
  </form>
</template>

<style scoped></style>
