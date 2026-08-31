<template>
  <div class="profile-layout">
    <LayoutsHeader />

    <div class="profile-layout__body">
      <main class="profile-layout__content">
        <slot />
      </main>

      <aside class="profile-layout__sidebar" aria-label="قائمة الحساب">
        <ProfileSidebar />
      </aside>
    </div>

    <LayoutsFooter />
  </div>
</template>

<script lang="ts" setup>
import "~/assets/style/main.min.css";
import ProfileSidebar from "~/components/Profile/ProfileSidebar.vue";
</script>

<style scoped lang="scss">
.profile-layout {
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.profile-layout__body {
  width: min(100% - 32px, 1440px);
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  align-items: start;
  gap: 24px;
  margin: 50px auto;
  text-align: right;
}

.profile-layout__content {
  min-width: 0;
}

.profile-layout__sidebar {
  min-width: 0;
  position: sticky;
  top: 16px;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

@media (max-width: 820px) {
  .profile-layout__body {
    width: 100%;
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    margin: 0;
  }

  .profile-layout__sidebar {
    grid-row: 1;
    position: static;
    max-height: none;
    overflow: visible;
  }
}
</style>
