<script setup lang="ts">
import ProfileSidebar from "./ProfileSidebar.vue";
import SubjectInfoCard from "./SubjectInfoCard.vue";
</script>
<template>
  <div class="prfile-home profile-dashboard">
    <ProfileSidebar class="profile-dashboard-sidebar" />

    <div class="profile-dashboard-workspace">
      <header class="profile-dashboard-topbar">
        <div class="profile-topbar-copy">
          <strong>مساحة الطالب</strong>
          <span>إدارة بيانات حسابك ومعلوماتك الدراسية</span>
        </div>
        <div class="profile-topbar-status"><span></span>البيانات الدراسية</div>
      </header>

      <main class="profile-dashboard-main">
        <header class="profile-page-heading">
          <span>المعلومات الدراسية</span>
          <h1>بياناتك التعليمية</h1>
          <p>راجع بياناتك الدراسية واختر المرحلة والصف المناسبين.</p>
        </header>

        <section class="courses-container profile-section-card profile-subject-card">
          <SubjectInfoCard />
        </section>
      </main>
    </div>
  </div>
</template>
<style scoped lang="scss">
.prfile-home {
  margin-top: 50px;
  width: 100%;
  text-align: right;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 10px;
}

.courses-container {
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  background-color: #f6f6f6;
}
@media (max-width: 768px) {
  .courses-container {
    width: 100%;
  }
}
</style>
