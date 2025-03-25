<script setup lang="ts">
import RegisterController from "~/features/RegisterFeature/presentation/controllers/register_controller";
import RegisterParams from "~/features/RegisterFeature/Core/Params/register_params";

// const userType = ref<string>("");
const firstName = ref<string>("");
const lastName = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");

const router = useRouter();

const registerController = RegisterController.Instance;

const register = async () => {
  const params = new RegisterParams(
    firstName.value,
    lastName.value,
    email.value,
    phone.value,
    password.value,
    confirmPassword.value,
    1
  );
  await registerController.Register(params, router);
};
</script>

<template>
  <form @submit.prevent="register" class="login-form">
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
    <!--    <div v-if="!userType">-->
    <!--      <p class="mb-4">-->
    <!--        {{-->
    <!--          $t(-->
    <!--            "Dont_worry_happens_to_all_of_us_Enter_your_email_below_to_recover_your_password",-->
    <!--          )-->
    <!--        }}-->
    <!--      </p>-->
    <!--      <div class="user-type flex gap-4 items-center mb-4">-->
    <!--        <div class="user-type-item">-->
    <!--          <input-->
    <!--            type="radio"-->
    <!--            name="user-type"-->
    <!--            id="user-type-1"-->
    <!--            value="user"-->
    <!--            v-model="userType"-->
    <!--          />-->
    <!--          <label for="user-type-1">-->
    <!--            <NuxtImg src="/owner.png" alt="guest" format="webp" />-->
    <!--            <span>{{ $t("owner") }}</span>-->
    <!--          </label>-->
    <!--        </div>-->
    <!--        <div class="user-type-item">-->
    <!--          <input-->
    <!--            type="radio"-->
    <!--            name="user-type"-->
    <!--            id="user-type-2"-->
    <!--            value="business"-->
    <!--            v-model="userType"-->
    <!--          />-->
    <!--          <label for="user-type-2">-->
    <!--            <NuxtImg src="/guest.png" alt="guest" format="webp" />-->
    <!--            <span>{{ $t("guest") }}</span>-->
    <!--          </label>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div>
      <!--      v-else-->
      <p class="mb-4">
        {{
          $t("Lets_get_you_all_set_up_so_you_can_access_your_personal_account")
        }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-14">
        <div class="input-wrapper col-span-1">
          <label class="input-label" for="first_name">{{
            $t("first_name")
          }}</label>
          <input
            class="input"
            type="text"
            id="first_name"
            v-model="firstName"
            placeholder="Enter your First Name"
            required
            pattern="^[a-zA-Z\s]+$"
          />
        </div>
        <div class="input-wrapper col-span-1">
          <label class="input-label" for="last_name">{{
            $t("last_name")
          }}</label>
          <input
            class="input"
            type="text"
            id="last_name"
            v-model="lastName"
            placeholder="Enter your Last Name"
            required
            pattern="^[a-zA-Z\s]+$"
          />
        </div>
        <div class="input-wrapper col-span-1">
          <label class="input-label" for="email">Email</label>
          <input
            class="input"
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </div>
        <div class="input-wrapper col-span-1">
          <label class="input-label" for="phone_number">{{
            $t("phone_number")
          }}</label>
          <input
            class="input"
            type="text"
            inputmode="numeric"
            id="phone_number"
            v-model="phone"
            placeholder="(xxx) xxx-xxxx "
            pattern="[0-9]{10}"
            required
          />
<!--          <GlobalInputphone @update:phoneNumber="phone = $event" />-->
        </div>
        <div class="input-wrapper col-span-1 md:col-span-2">
          <label class="input-label" for="password">{{ $t("password") }}</label>
          <input
            class="input"
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            required
          />
        </div>
        <div class="input-wrapper col-span-1 md:col-span-2">
          <label class="input-label" for="confirm_password">{{
            $t("confirm_password")
          }}</label>
          <input
            class="input"
            type="password"
            id="confirm_password"
            v-model="confirmPassword"
            placeholder="Enter your confirm password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            required
          />
        </div>
      </div>
    </div>

    <div class="login-button-wrapper mb-6 mt-6">
      <button type="submit" class="primary-button" aria-label="submit">
        {{ $t("submit") }}
      </button>
    </div>
    <div class="sign-up-link-wrapper text-center">
      <p class="sign-up-info justify-center">
        {{ $t("Already_have_an_account") }} ?
        <NuxtLink to="/auth/login" class="sign-up-link">
          {{ $t("login") }}
        </NuxtLink>
      </p>
    </div>
  </form>
</template>

<style scoped></style>
