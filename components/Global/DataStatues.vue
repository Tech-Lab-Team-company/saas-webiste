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

defineProps({
  status: {
    type: Object as () => DataState<any>,
    default: {},
  },
  successComponent: {
    default: () => null,
  },
});
</script>

<template>
  <div>
    <div v-if="status instanceof DataSuccess || status instanceof DataDump">
      <div v-if="$slots.success">
        <slot name="success" />
      </div>
      <div v-else></div>
    </div>
    <div v-else-if="status instanceof DataValid">
      <div v-if="$slots.valid">
        <slot name="valid" />
      </div>
      <div v-else></div>
    </div>
    <div v-else-if="status instanceof DataEmpty">
      <div v-if="$slots.empty">
        <slot name="empty" />
      </div>
      <div v-else>empty</div>
    </div>
    <div v-else-if="status instanceof DataInitial" class="w-full">
      <div v-if="$slots.initial">
        <slot name="initial" />
      </div>
      <div v-else></div>
    </div>
    <div v-else-if="status instanceof DataFailed">
      <div v-if="$slots.failed">
        <slot name="failed" />
      </div>
      <div v-else>
        <div class="text-center">
          <p class="text-danger">{{ ("error") }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="$slots.loader">
        <slot name="loader" />
      </div>
      <div v-else>
<!--        <LoaderDefault />-->
        loader
      </div>
    </div>
  </div>
</template>
