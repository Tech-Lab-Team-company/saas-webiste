<script setup lang="ts">
import {
  DataDump,
  DataFailed,
  DataInitial,
  DataLoading,
  DataEmpty,
  type DataState,
  DataSuccess,
  DataValid,
} from "~/base/core/networkStructure/Resources/dataState/data_state";

const props = defineProps({
  status: {
    type: Object as () => DataState<any>,
    default: {},
  },
});
</script>

<template>
  <div v-if="props.status instanceof DataSuccess || props.status instanceof DataDump">
    <div v-if="$slots.success">
      <slot name="success" />
    </div>
    <div v-else></div>
  </div>
  <div v-else-if="props.status instanceof DataValid">
    <div v-if="$slots.valid">
      <slot name="valid" />
    </div>
    <div v-else></div>
  </div>
  <div v-else-if="props.status instanceof DataEmpty">
    <div v-if="$slots.empty">
      <slot name="empty" />
    </div>
    <div v-else>empty</div>
  </div>
  <div v-else-if="props.status instanceof DataInitial" class="w-full">
    <div v-if="$slots.initial">
      <slot name="initial" />
    </div>
    <div v-else></div>
  </div>
  <div v-else-if="props.status instanceof DataFailed">
    <div v-if="$slots.failed">
      <slot name="failed" />
    </div>
    <div v-else>
      <div class="text-center">
        <p class="text-danger">{{ $t("error") }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="props.status instanceof DataLoading">
    <div v-if="$slots.loader">
      <slot name="loader" />
    </div>
    <div v-else>
<!--      <LoaderDefault />-->
      loader
    </div>
  </div>
</template>

<style scoped></style>
