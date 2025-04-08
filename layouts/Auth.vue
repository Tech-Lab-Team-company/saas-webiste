

<template>
    <div class="auth-layout">
        <p class="auth-sidebar">sidebar</p>
        <slot />
    </div>
  </template>
  
  <script lang="ts" setup>
  
  </script>
  
  <style scoped lang="scss">
  .auth-layout{
    display: grid;
    grid-template-columns: 80% 20%;

    .auth-sidebar{
        order: 1;
    }
  }
  
  </style>                