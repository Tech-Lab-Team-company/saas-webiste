
<script setup lang="ts">
const userStore = useUserStore();
const yearLabel = computed(() => {
    const info = userStore.user?.userInfo;
    return info?.year_title || info?.stage_title || info?.university_title || "مستواك الدراسي";
});
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
                <div class="profile-topbar-status"><span></span>مشترياتي</div>
            </header>

            <main class="profile-dashboard-main">
                <header class="profile-page-heading">
                    <span>{{ yearLabel }}</span>
                    <h1>مشترياتي</h1>
                    <p>الكورسات التي اشتريتها أو اشتركت بها، مع متابعة محتواها وتقدمك فيها.</p>
                </header>

                <section class="courses-container profile-courses-library">
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
        padding: 0;
        border: 0;
        border-radius: 0;
        background: transparent;

        @media (max-width: 768px) {
            width: 100%;
        }
    }
    // 64% 35%
}

</style>
