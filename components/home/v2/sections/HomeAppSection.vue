<script setup lang="ts">
import type { HomeSiteViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'

defineProps<{
  site: HomeSiteViewModel
}>()
</script>

<template>
  <section id="app-status" class="section home-v2-app" aria-labelledby="home-v2-app-title">
    <div class="container home-v2-app__grid">
      <div>
        <span class="section-tag">تطبيق المنصة</span>
        <h2 id="home-v2-app-title">تابع من الويب،<br /><em>وكمّل من التطبيق.</em></h2>
        <p>
          ستستخدم روابط Android وiPhone المعتمدة من إعدادات الموقع عند ربط بيانات V2 في
          المرحلة التالية.
        </p>
        <div class="home-v2-app__actions">
          <span class="home-v2-disabled-action" aria-disabled="true">رابط Android قيد الربط</span>
          <span class="home-v2-disabled-action" aria-disabled="true">رابط iPhone قيد الربط</span>
        </div>
      </div>

      <figure class="home-v2-app__phone home-v2-temporary-asset" aria-label="مساحة مؤقتة للقطّة شاشة التطبيق">
        <div>
          <span aria-hidden="true">APP</span>
          <strong>لقطة التطبيق</strong>
          <small>مورد بصري مؤقت</small>
        </div>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.home-v2-app {
  overflow: hidden;
  background: var(--home-v2-deep);
  color: #fff;
}

.home-v2-app__grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  align-items: center;
  gap: clamp(48px, 8vw, 100px);
}

.home-v2-app .section-tag {
  color: #b6d6ff;
}

.home-v2-app h2 {
  margin: 13px 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.25 var(--home-v2-heading);
}

.home-v2-app h2 em {
  color: #8fc6ff;
  font-style: normal;
}

.home-v2-app p {
  max-width: 650px;
  color: #ffffffc4;
  line-height: 1.9;
}

.home-v2-app__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 24px;
}

.home-v2-app .home-v2-disabled-action {
  color: #fff;
  border-bottom: 1px solid #ffffff8c;
}

.home-v2-app__phone {
  width: 270px;
  justify-self: center;
  overflow: hidden;
  border: 8px solid #ffffff36;
  border-radius: 34px;
  background: #fff;
  box-shadow: 26px 30px #02061747;
}

.home-v2-app__phone > div {
  display: grid;
  aspect-ratio: 380 / 675;
  place-content: center;
  gap: 8px;
  padding: 28px;
  background: linear-gradient(160deg, #ecf5ff, #8fc6ff);
  color: var(--home-v2-deep);
  text-align: center;
}

.home-v2-app__phone span {
  font: 900 58px/1 var(--home-v2-heading);
  opacity: 0.25;
}

.home-v2-app__phone strong {
  font: 900 19px var(--home-v2-heading);
}

@media (max-width: 760px) {
  .home-v2-app__grid {
    grid-template-columns: 1fr;
  }

  .home-v2-app__phone {
    margin-top: 10px;
  }
}
</style>
