<script setup lang="ts">
import type { HomeSiteViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

defineProps<{
  site: HomeSiteViewModel;
}>();
</script>

<template>
  <section
    id="app-status"
    class="section home-v2-app"
    aria-labelledby="home-v2-app-title"
  >
    <div class="container home-v2-app__grid">
      <div>
        <span class="section-tag">تطبيق المنصة</span>
        <h2 id="home-v2-app-title">
          تابع من الويب،<br /><em>وكمّل من التطبيق.</em>
        </h2>
        <p>
          حمّل تطبيق {{ site.brandName || "المنصة" }} وتابع محتواك من هاتفك
          في أي وقت.
        </p>
        <div class="home-v2-app__actions">
          <a
            v-if="site.app.androidUrl"
            :href="site.app.androidUrl"
            target="_blank"
            rel="noopener"
          >
            تحميل Android
          </a>
          <span v-else class="home-v2-disabled-action" aria-disabled="true">
            تطبيق Android غير متاح
          </span>
          <a
            v-if="site.app.iosUrl"
            :href="site.app.iosUrl"
            target="_blank"
            rel="noopener"
          >
            تحميل iPhone
          </a>
          <span v-else class="home-v2-disabled-action" aria-disabled="true">
            تطبيق iPhone غير متاح
          </span>
        </div>
      </div>

      <figure
        class="home-v2-app__phone"
        :aria-label="`تطبيق ${site.brandName || 'المنصة'}`"
      >
        <NuxtImg
          src="/images/eslam-salama-app-screen.webp"
          :alt="`واجهة تطبيق ${site.brandName || 'المنصة'}`"
          width="380"
          height="675"
          loading="lazy"
        />
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
  grid-template-columns: 1fr 380px;
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

.home-v2-app__actions a {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  padding: 0 2px 6px;
  border-bottom: 1px solid #ffffff8c;
  color: #fff;
  font-weight: 800;
  transition: color 0.2s ease, border-color 0.2s ease,
    transform 0.2s ease;
}

.home-v2-app__actions a:hover {
  border-color: var(--home-v2-coral);
  color: color-mix(in srgb, var(--home-v2-coral) 72%, white);
  transform: translateY(-3px);
}

.home-v2-app__actions a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--home-v2-coral) 65%, transparent);
  outline-offset: 5px;
}

.home-v2-app .home-v2-disabled-action {
  border-bottom: 1px solid #ffffff8c;
  color: #fff;
}

.home-v2-app__phone {
  position: relative;
  width: min(100%, 380px);
  margin: 0;
  justify-self: center;
  overflow: hidden;
  border: 1px solid #ffffff38;
  border-radius: 26px;
  background: #020b2a;
  box-shadow: 24px 30px 0 #02061735, 0 30px 70px -34px #000c;
  isolation: isolate;
  transition: border-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.35s cubic-bezier(0.2, 0.75, 0.25, 1);
}

.home-v2-app__phone::after {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 38%,
    #ffffff18 50%,
    transparent 62%
  );
  content: "";
  pointer-events: none;
  transform: translateX(115%);
  transition: transform 0.65s ease;
}

.home-v2-app__phone :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.55s cubic-bezier(0.2, 0.75, 0.25, 1);
}

.home-v2-app__phone:hover {
  border-color: #ffffff70;
  box-shadow: 30px 36px 0 #0206172e, 0 38px 84px -34px #000e;
  transform: translateY(-8px) rotate(-1deg);
}

.home-v2-app__phone:hover::after {
  transform: translateX(-115%);
}

.home-v2-app__phone:hover :deep(img) {
  transform: scale(1.025);
}

@media (max-width: 760px) {
  .home-v2-app__grid {
    grid-template-columns: 1fr;
  }

  .home-v2-app__phone {
    margin-top: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-app__actions a,
  .home-v2-app__phone,
  .home-v2-app__phone::after,
  .home-v2-app__phone :deep(img) {
    transition: none;
  }
}
</style>
