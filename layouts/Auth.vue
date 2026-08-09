<template>
  <AuthUnifiedShell>
    <slot />
  </AuthUnifiedShell>
</template>

<script lang="ts" setup>
import "primeicons/primeicons.css";
import "~/assets/style/main.min.css";
import AuthUnifiedShell from "~/components/AuthLayout/AuthUnifiedShell.vue";
</script>
