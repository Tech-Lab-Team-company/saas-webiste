<script setup lang="ts">
const props = defineProps<{ author?: string; date?: string; comments?: number }>();
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="static flex gap-2 items-center">
      <IconsPerson />
      <span> {{ author }} </span>
    </div>
    <div class="static flex gap-2 items-center">
      <IconsCalendar />
      <span> {{ date }}</span>
    </div>
    <div class="static flex gap-2 items-center">
      <IconsComment />
      <span> {{ comments }} {{ $t("Comments") }} </span>
    </div>
  </div>
</template>

<style scoped></style>
