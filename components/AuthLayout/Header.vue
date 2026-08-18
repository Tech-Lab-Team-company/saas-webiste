<script setup lang="ts">
const settingStore = useSettingStore();
</script>

<template>
  <header class="header">
    <nav class="container mx-auto px-8">
      <NuxtLink to="/" class="logo">
        <img
          v-if="settingStore.setting?.image?.img"
          :src="settingStore.setting.image.img"
          :alt="settingStore.setting?.name || 'شعار الموقع'"
          class="logo-img"
          width="163"
          height="52"
        />
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.logo,
.logo-img {
  display: block;
  width: 163px;
  height: 52px;
}

.logo-img {
  object-fit: contain;
}
</style>
