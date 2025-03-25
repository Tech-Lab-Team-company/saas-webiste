<script setup lang="ts">
const emit = defineEmits<{
  (e: "showMap", value: boolean): void;
}>();

function showOnMap() {
  console.log("show_on_map");
  emit("showMap", true);
}
</script>

<template>
  <section class="show-map">
    <button
      type="button"
      @click="showOnMap"
      aria-label="show_on_map"
      class="show-map-button"
    >
      <IconsMap />
      <span>{{ $t("show_on_map") }}</span>
    </button>
  </section>
</template>

<style scoped></style>
