<template>
  <AuthUnifiedShell>
    <slot />
  </AuthUnifiedShell>
</template>

<script lang="ts" setup>
import "~/assets/style/main.min.css";
import AuthUnifiedShell from "~/components/AuthLayout/AuthUnifiedShell.vue";
</script>
