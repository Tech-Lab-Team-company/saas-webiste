<script setup lang="ts">
const close = () => {
  (document.querySelector('.dialog') as HTMLDialogElement | null)?.close()
}
</script>

<template>
  <dialog class="dialog" @click.self="close">
    <div class="dialog-container">
      <img src="" alt="" class="dialog-icon" />
      <h4 class="dialog-title"></h4>
      <p class="dialog-message"></p>
    </div>
  </dialog>
</template>

<style scoped></style>


