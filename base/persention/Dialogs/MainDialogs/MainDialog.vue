<script setup lang="ts">
import { ref } from 'vue'

const dialogRef = ref<HTMLDialogElement | null>(null)

const close = () => {
  dialogRef.value?.close()
}

const show = () => {
  dialogRef.value?.showModal()
}

defineExpose({
  show,
  close
})
</script>

<template>
  <dialog ref="dialogRef" class="dialog" @click.self="close">
    <div class="dialog-container">
      <img src="" alt="" class="dialog-icon" />
      <h4 class="dialog-title"></h4>
      <p class="dialog-message"></p>
    </div>
  </dialog>
</template>