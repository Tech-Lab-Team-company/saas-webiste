<script setup lang="ts">
import type TermsAndCondition from "~/types/terms_and_condition";

const props = defineProps<{ termsAndConditions: TermsAndCondition | null }>();
</script>

<template>
  <section class="terms-and-conditions">
    <ul>
      <li>
        <p v-html="termsAndConditions?.terms_and_condition"></p>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>
