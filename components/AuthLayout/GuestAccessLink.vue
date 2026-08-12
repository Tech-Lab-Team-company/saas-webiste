<template>
  <NuxtLink class="login-home-guest" to="/">
    <span class="pi pi-globe" aria-hidden="true" />
    <span>
      <strong>{{ $t("المتابعة كزائر") }}</strong>
      <small>{{ $t("استكشف الموقع بدون تسجيل الدخول") }}</small>
    </span>
    <span class="pi pi-arrow-left" aria-hidden="true" />
  </NuxtLink>
</template>

<style scoped>
.login-home-guest {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 58px;
  margin-top: 11px;
  padding: 10px 15px;
  border: 1px solid #d3ddeb;
  background: #fff;
  color: var(--primary-color, #28366c);
  text-decoration: none;
  transition: border-color 180ms ease, background-color 180ms ease,
    box-shadow 180ms ease, transform 180ms ease;
}

.login-home-guest > .pi-globe {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 9px;
  background: color-mix(
    in srgb,
    var(--secondary-color, #3a3e7e) 10%,
    #fff
  );
  color: var(--secondary-color, #3a3e7e);
  font-size: 14px;
}

.login-home-guest > span:nth-child(2) {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.login-home-guest strong {
  font-size: 12px;
  font-weight: 900;
}

.login-home-guest small {
  color: #8190a6;
  font-size: 10px;
  font-weight: 600;
}

.login-home-guest > .pi-arrow-left {
  color: #9aa8bb;
  font-size: 12px;
  transition: transform 180ms ease;
}

.login-home-guest:hover {
  border-color: color-mix(
    in srgb,
    var(--secondary-color, #3a3e7e) 46%,
    #d3ddeb
  );
  background: color-mix(
    in srgb,
    var(--secondary-color, #3a3e7e) 4%,
    #fff
  );
  box-shadow: 0 10px 24px rgb(22 43 78 / 8%);
  transform: translateY(-1px);
}

.login-home-guest:hover > .pi-arrow-left {
  transform: translateX(-3px);
}

.login-home-guest:focus-visible {
  outline: 3px solid color-mix(
    in srgb,
    var(--secondary-color, #3a3e7e) 25%,
    transparent
  );
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .login-home-guest,
  .login-home-guest > .pi-arrow-left {
    transition: none;
  }
}
</style>
