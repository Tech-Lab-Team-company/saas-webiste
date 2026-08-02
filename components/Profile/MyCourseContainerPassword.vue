<script setup lang="ts"></script>

<template>
    <div class="prfile-home profile-dashboard">
        <ProfileSidebar class="profile-dashboard-sidebar" />

        <div class="profile-dashboard-workspace">
            <header class="profile-dashboard-topbar">
                <div class="profile-topbar-copy">
                    <strong>مساحة الطالب</strong>
                    <span>إدارة بيانات حسابك ومعلوماتك الدراسية</span>
                </div>
                <div class="profile-topbar-status"><span></span>أمان الحساب</div>
            </header>

            <main class="profile-dashboard-main">
                <header class="profile-page-heading">
                    <span>أمان الحساب</span>
                    <h1>تغيير كلمة المرور</h1>
                    <p>حدّث كلمة المرور من هنا للحفاظ على أمان حسابك.</p>
                </header>

                <section class="profile-section-card profile-password-card">
                    <ProfilePasswordUpdate />
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
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column-reverse;
        gap: 0;
        padding-left: 20px;
        padding-right: 20px;
    }
}
</style>
