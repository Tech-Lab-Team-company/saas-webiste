<script setup lang="ts">
import ChangePasswordController from "~/features/ChangePasswordFeature/presentation/controllers/change_password_controller";
import ChangePasswordParams from "~/features/ChangePasswordFeature/Core/Params/change_password_params";

const currentPassword = ref<string>("");
const newPassword = ref<string>("");
const newPasswordConfirmation = ref<string>("");
const visiblePasswords = reactive({
  current: false,
  new: false,
  confirmation: false,
});
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
      <p>{{ $t("تغيير كلمة المرور") }}</p>
      <p>
        {{ $t("قم بتغيير كلمة المرور الخاصة بك هنا للحفاظ على حسابك آمناً.") }}
      </p>
    </div>

    <hr class="profile-text-hr" />

    <form
      @submit.prevent="changePassword"
      class="profile-home-information mt-12"
    >
      <div class="profile-info-container">
        <label class="input-label" for="current_password">{{
          $t("كلمة المرور الحالية")
        }}</label>
        <div class="profile-input-container profile-password-field">
          <span class="profile-password-field__lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" stroke-width="1.8" />
              <path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <input
            id="current_password"
            :type="visiblePasswords.current ? 'text' : 'password'"
            class="input"
            v-model="currentPassword"
            placeholder="ادخل كلمة المرور الحالية"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="password-visibility-toggle"
            :aria-label="visiblePasswords.current ? 'إخفاء كلمة المرور الحالية' : 'إظهار كلمة المرور الحالية'"
            :aria-pressed="visiblePasswords.current"
            @click="visiblePasswords.current = !visiblePasswords.current"
          >
            <svg v-if="visiblePasswords.current" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.8 10.8 0 0 1 12 5c5.3 0 8.6 4.8 9 5.5a1 1 0 0 1 0 1c-.5.8-1.6 2.3-3.2 3.5M6.2 6.2C4.5 7.3 3.4 8.8 3 9.5a1 1 0 0 0 0 1C3.4 11.3 6.7 16 12 16c.7 0 1.4-.1 2-.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 11.5C3.5 10.7 6.7 6 12 6s8.5 4.7 9 5.5c.1.3.1.7 0 1-.5.8-3.7 5.5-9 5.5s-8.5-4.7-9-5.5a1 1 0 0 1 0-1Z" stroke="currentColor" stroke-width="1.8" />
              <circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </button>
        </div>
      </div>

      <div class="profile-info-container">
        <label class="input-label" for="new_password">{{
          $t("كلمة المرور الجديدة")
        }}</label>
        <div class="profile-input-container profile-password-field">
          <span class="profile-password-field__lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" stroke-width="1.8" />
              <path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <input
            id="new_password"
            :type="visiblePasswords.new ? 'text' : 'password'"
            class="input"
            v-model="newPassword"
            placeholder="ادخل كلمة المرور الجديدة"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="password-visibility-toggle"
            :aria-label="visiblePasswords.new ? 'إخفاء كلمة المرور الجديدة' : 'إظهار كلمة المرور الجديدة'"
            :aria-pressed="visiblePasswords.new"
            @click="visiblePasswords.new = !visiblePasswords.new"
          >
            <svg v-if="visiblePasswords.new" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.8 10.8 0 0 1 12 5c5.3 0 8.6 4.8 9 5.5a1 1 0 0 1 0 1c-.5.8-1.6 2.3-3.2 3.5M6.2 6.2C4.5 7.3 3.4 8.8 3 9.5a1 1 0 0 0 0 1C3.4 11.3 6.7 16 12 16c.7 0 1.4-.1 2-.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 11.5C3.5 10.7 6.7 6 12 6s8.5 4.7 9 5.5c.1.3.1.7 0 1-.5.8-3.7 5.5-9 5.5s-8.5-4.7-9-5.5a1 1 0 0 1 0-1Z" stroke="currentColor" stroke-width="1.8" />
              <circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </button>
        </div>
      </div>

      <div class="profile-info-container">
        <label class="input-label" for="new_password_confirm">{{
          $t("تأكيد كلمة المرور الجديدة")
        }}</label>
        <div class="profile-input-container profile-password-field">
          <span class="profile-password-field__lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" stroke-width="1.8" />
              <path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <input
            id="new_password_confirm"
            :type="visiblePasswords.confirmation ? 'text' : 'password'"
            class="input"
            v-model="newPasswordConfirmation"
            placeholder="اعد كتابة كلمة المرور الجديدة"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="password-visibility-toggle"
            :aria-label="visiblePasswords.confirmation ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'"
            :aria-pressed="visiblePasswords.confirmation"
            @click="visiblePasswords.confirmation = !visiblePasswords.confirmation"
          >
            <svg v-if="visiblePasswords.confirmation" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.8 10.8 0 0 1 12 5c5.3 0 8.6 4.8 9 5.5a1 1 0 0 1 0 1c-.5.8-1.6 2.3-3.2 3.5M6.2 6.2C4.5 7.3 3.4 8.8 3 9.5a1 1 0 0 0 0 1C3.4 11.3 6.7 16 12 16c.7 0 1.4-.1 2-.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 11.5C3.5 10.7 6.7 6 12 6s8.5 4.7 9 5.5c.1.3.1.7 0 1-.5.8-3.7 5.5-9 5.5s-8.5-4.7-9-5.5a1 1 0 0 1 0-1Z" stroke="currentColor" stroke-width="1.8" />
              <circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </button>
        </div>
      </div>

      <div class="profile-info-container">
        <div class="profile-input-container">
          <button
            class="primary-button-2 w-full md:w-auto"
            aria-label="submit"
            type="submit"
          >
            {{ $t("حفظ كلمة المرور") }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.input {
  width: 100% !important;
}

.profile-password-field {
  position: relative;
  display: block !important;
}

.profile-password-field .input {
  min-height: 52px;
  padding-inline: 46px 48px !important;
  border: 1px solid color-mix(in srgb, var(--profile-secondary) 28%, #cbd5e1) !important;
  background: color-mix(in srgb, var(--profile-secondary) 4%, var(--profile-surface-raised, #f8fafc)) !important;
  box-shadow: inset 0 1px 2px rgb(15 23 42 / 4%), 0 8px 22px rgb(15 23 42 / 4%);
  color: var(--profile-ink, #0f172a) !important;
  caret-color: var(--profile-secondary);
  transition: border-color 180ms ease, background-color 180ms ease,
    box-shadow 180ms ease, transform 180ms ease;
}

.profile-password-field .input::placeholder {
  color: color-mix(in srgb, var(--profile-muted, #64748b) 82%, transparent);
  opacity: 1;
}

.profile-password-field:hover .input {
  border-color: color-mix(in srgb, var(--profile-secondary) 58%, #cbd5e1) !important;
  background: var(--profile-surface, #fff) !important;
}

.profile-password-field .input:focus {
  border-color: var(--profile-secondary) !important;
  background: var(--profile-surface, #fff) !important;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--profile-secondary) 13%, transparent),
    0 12px 28px rgb(15 23 42 / 7%) !important;
  transform: translateY(-1px);
}

.profile-password-field__lock,
.password-visibility-toggle {
  position: absolute;
  z-index: 2;
  top: 50%;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 9px;
  transform: translateY(-50%);
}

.profile-password-field__lock {
  inset-inline-start: 8px;
  background: color-mix(in srgb, var(--profile-secondary) 10%, transparent);
  color: var(--profile-secondary);
  pointer-events: none;
}

.password-visibility-toggle {
  inset-inline-end: 8px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--profile-muted, #64748b) !important;
  cursor: pointer;
  text-decoration: none !important;
  transition: color 180ms ease, background-color 180ms ease,
    transform 180ms ease !important;
}

.profile-password-field__lock svg,
.password-visibility-toggle svg {
  width: 19px;
  height: 19px;
}

.password-visibility-toggle:hover,
.password-visibility-toggle:focus-visible {
  background: color-mix(in srgb, var(--profile-secondary) 11%, transparent) !important;
  color: var(--profile-secondary) !important;
  outline: none;
  transform: translateY(-50%) scale(1.06) !important;
}

.profile-password-field:focus-within .profile-password-field__lock {
  background: var(--profile-secondary);
  color: var(--profile-surface, #fff);
}
</style>
