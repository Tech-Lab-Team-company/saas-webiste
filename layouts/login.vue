<template>
  <slot v-if="isRedesignedLoginHome" />
  <AuthUnifiedShell v-else>
    <slot />
  </AuthUnifiedShell>
</template>

<script lang="ts" setup>
import "primeicons/primeicons.css";
import "~/assets/style/main.min.css";
import AuthUnifiedShell from "~/components/AuthLayout/AuthUnifiedShell.vue";

const route = useRoute();
const isRedesignedLoginHome = computed(
  () => route.path.toLowerCase() === "/loginhome",
);
</script>
