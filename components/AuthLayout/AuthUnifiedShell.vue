<script setup lang="ts">
const UserSettingStore = useSettingStore();
const route = useRoute();
const { isDark } = useAppTheme();
</script>

<template>
  <div
    class="login-home-redesign auth-unified-shell"
    :class="{
      'auth-unified-shell--register': route.path.toLowerCase() === '/auth/register',
      'auth-unified-shell--dark': isDark,
    }"
    dir="rtl"
  >
    <section class="login-home-form-panel">
      <div class="login-home-form-wrap auth-unified-content">
        <span class="login-home-kicker">{{ $t("مساحة الطالب") }}</span>
        <slot />
      </div>
    </section>

    <aside class="login-home-visual" aria-label="مميزات مساحة الطالب">
      <NuxtLink
        to="/"
        class="login-home-brand"
        aria-label="العودة إلى الصفحة الرئيسية"
      >
        <img
          v-if="UserSettingStore.setting?.image?.img"
          :src="UserSettingStore.setting?.image?.img"
          :alt="UserSettingStore.setting?.name || 'logo'"
          width="52"
          height="52"
        >
        <div>
          <strong>{{ UserSettingStore.setting?.name }}</strong>
          <small>{{ UserSettingStore.setting?.description }}</small>
        </div>
      </NuxtLink>

      <div class="login-home-visual-copy">
        <span>{{ $t("مساحة الطالب") }}</span>
        <h2>
          {{ $t("راجع دروسك،") }}
          <strong>{{ $t("واختبر فهمك.") }}</strong>
        </h2>
        <p>
          {{
            $t(
              "مكان واحد لكورساتك ومتابعتها، منظمة حسب الصف الدراسي من غير خلط.",
            )
          }}
        </p>

        <div class="login-home-stage-count">
          <strong>{{ $t("3 صفوف") }}</strong>
          <span>{{ $t("أولى · ثانية") }}<br>{{ $t("ثالثة ثانوي") }}</span>
        </div>
      </div>

      <span class="login-home-ring login-home-ring-one" aria-hidden="true" />
      <span class="login-home-ring login-home-ring-two" aria-hidden="true" />
    </aside>
  </div>
</template>

<style scoped src="~/assets/style/login-home-redesign/login-home.css"></style>

<style>
html[data-theme="dark"] .auth-unified-shell--register .login-home-form-panel {
  background: #f8faff !important;
  background-image: none !important;
  color: #0b1d3b !important;
}

html[data-theme="dark"]
  .auth-unified-shell--register
  .auth-unified-content
  .login-form > h3 {
  color: #28366c !important;
}

html[data-theme="dark"]
  .auth-unified-shell--register
  .auth-unified-content
  .login-form > p {
  color: #71809a !important;
}

html[data-theme="dark"]
  .auth-unified-shell--register
  .auth-unified-content
  .auth-field-label {
  color: #28366c !important;
}

html[data-theme="dark"]
  .auth-unified-shell--register
  .auth-unified-content
  .login-input input,
html[data-theme="dark"]
  .auth-unified-shell--register
  .auth-unified-content
  .login-input select,
html[data-theme="dark"]
  .auth-unified-shell--register
  .auth-unified-content
  .student-select {
  border-color: #cdd8e8 !important;
  background: #fff !important;
  color: #28366c !important;
  color-scheme: light;
}

.auth-unified-shell--register.auth-unified-shell--dark
  .login-home-form-panel {
  background: #f8faff !important;
  background-image: none !important;
}

.auth-unified-shell--register.auth-unified-shell--dark
  .auth-unified-content
  .login-form > h3,
.auth-unified-shell--register.auth-unified-shell--dark
  .auth-unified-content
  .auth-field-label {
  color: #28366c !important;
}

.auth-unified-shell--register.auth-unified-shell--dark
  .auth-unified-content
  .login-form > p {
  color: #71809a !important;
}

.auth-unified-shell--register.auth-unified-shell--dark
  .auth-unified-content
  .login-input input,
.auth-unified-shell--register.auth-unified-shell--dark
  .auth-unified-content
  .login-input select,
.auth-unified-shell--register.auth-unified-shell--dark
  .auth-unified-content
  .student-select {
  border-color: #cdd8e8 !important;
  background: #fff !important;
  color: #28366c !important;
  color-scheme: light;
}
</style>
