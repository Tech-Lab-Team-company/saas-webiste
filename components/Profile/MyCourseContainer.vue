
<script setup lang="ts">

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
                <div class="profile-topbar-status"><span></span>كورساتي</div>
            </header>

            <main class="profile-dashboard-main">
                <header class="profile-page-heading">
                    <span>المحتوى التعليمي</span>
                    <h1>كورساتي</h1>
                    <p>تابع كورساتك ومحتواك الدراسي من مكان واحد.</p>
                </header>

                <section class="courses-container aa profile-section-card profile-courses-card">
                    <ProfileMyCourseCard />
                </section>
            </main>
        </div>
    </div>

</template>

<style scoped lang="scss">

.prfile-home{
    margin-top: 50px;
    width: 100%;
    text-align: right;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6 , 1fr) ;

    @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
        margin:0;
        padding: 0;
        display: flex;
        flex-direction: column-reverse;
    }

    .courses-container{
        grid-column: span 5;
        padding: 20px;
        border-radius: 20px;
        background-color: #f6f6f6;

        @media (max-width: 768px) {
            width: 100%;
        }
    }
    // 64% 35%
}

</style>
