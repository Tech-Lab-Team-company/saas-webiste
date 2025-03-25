<script setup lang="ts">
import type PaginationModel from "@/base/core/Models/pagination_model";

const emit = defineEmits(["changePage"]);
const props = defineProps<{
  pagination: PaginationModel | null;
}>();

const numberOfPages = computed(() => {
  return Array.from({ length: props.pagination?.last! }, (_, i) => i + 1);
});

// console.log(props.pagination, "pagination");
</script>

<template>
  <div class="pagination" v-if="pagination?.last > 1">
    <button
      class="arrow"
      :disabled="pagination?.current === 1"
      :class="{ disabled: pagination?.current === 1 }"
      type="button"
      @click="
        emit(
          'changePage',
          pagination?.current! > 1 ? pagination?.current! - 1 : 1
        )
      "
    >
      <IconsArrowLeft />
    </button>
    <button
      type="button"
      :class="['page', { active: i === pagination?.current }]"
      v-for="i in numberOfPages.slice(
        pagination?.current! > 2 ? pagination?.current! - 2 : 0,
        pagination?.current! + 2
      )"
      :key="i"
      @click="emit('changePage', i)"
    >
      {{ i }}
    </button>
    <button
      class="arrow"
      @click="
        emit(
          'changePage',
          pagination?.current! < pagination?.last!
            ? pagination?.current! + 1
            : pagination?.last!
        )
      "
      :disabled="pagination?.current === pagination?.last"
      :class="{ disabled: pagination?.current === pagination?.last }"
      type="button"
    >
      <IconsArrowRight />
    </button>
  </div>
</template>

<style scoped></style>
