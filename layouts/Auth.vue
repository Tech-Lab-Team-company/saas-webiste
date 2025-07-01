

<template>
    <div class="auth-layout">
         <AuthSidebar class="auth-sidebar" />
          <div>
            <slot class="auth-sidebar-home"></slot>
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
     @media (max-width: 768px) {
           grid-template-columns:100%;
        }

    .auth-sidebar{
        order: 1;
        @media (max-width: 768px) {
          display: none;
        }
    }

    .auth-sidebar-home{
      
        text-align: right;
          @media (max-width: 768px) {
         width:100%
        }
    }
  }
  
  </style>                