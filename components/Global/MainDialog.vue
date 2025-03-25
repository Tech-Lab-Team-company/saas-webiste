<script setup lang="ts">
const close = () => {
  // console.log('close')
  document.querySelector('.dialog')?.close()
}
</script>

<template>
  <dialog class="dialog" @click.self="close">
    <div class="dialog-container">
      <img src="" alt="" class="dialog-icon" />
      <h4 class="dialog-title"></h4>
      <p class="dialog-message"></p>
<!--      <button class="dialog-close-btn">Ok</button>-->
    </div>
  </dialog>
</template>

<style scoped></style>
