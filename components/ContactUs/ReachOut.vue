<script setup lang="ts">

import type setting from "~/types/setting";

const props = defineProps<{ webSettings: setting }>();
</script>

<template>
  <h2 class="main-section-title">
    {{ $t("contact_us") }}
  </h2>
  <h4 class="sub-section-title">
    {{ $t("Reach_Out_to_Us_Anytime") }}
  </h4>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
    <div class="col-span-1 contact-us-card">
      <IconsLocation />
      <h6 class="contact-us-title">Address</h6>
      <p class="contact-us-text">{{ webSettings?.address }}</p>
    </div>
    <div class="col-span-1 contact-us-card">
      <IconsCall />
      <h6 class="contact-us-title">Phone</h6>
      <a href="tel:{{ webSettings?.phone }}" class="contact-us-text">{{ webSettings?.phone }}</a>
    </div>
    <div class="col-span-1 contact-us-card">
      <IconsSms />
      <h6 class="contact-us-title">Email</h6>
      <a href="mailto:{{ webSettings?.email }}" class="contact-us-text">{{ webSettings?.email }}</a>
    </div>
  </div>
</template>

<style scoped></style>
