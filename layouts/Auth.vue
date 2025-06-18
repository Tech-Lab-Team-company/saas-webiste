

<template>
    <div class="auth-layout">
         <AuthSidebar class="auth-sidebar" />
          <div>
            <slot class="auth-sidebar-home"></slot>
            <!-- <GlobalMainDialog /> -->
          </div>
    </div>
  </template>
  
  <script lang="ts" setup>
import AuthSidebar from '~/components/AuthLayout/AuthSidebar.vue';


  </script>
  
  <style scoped lang="scss">
  .auth-layout{
    width: 100%;
    display: grid;
    grid-template-columns: 74% 26%;

    .auth-sidebar{
        order: 1;
    }

    .auth-sidebar-home{
      
        text-align: right;
    }
  }
  
  </style>                