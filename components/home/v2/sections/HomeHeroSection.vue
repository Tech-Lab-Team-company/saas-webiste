<script setup lang="ts">
import type { HomeHeroViewModel, HomeSiteViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'
import type { HomeSectionState } from '~/features/HomePageFeature/types/homePage.types'

const props = defineProps<{
  hero: HomeSectionState<HomeHeroViewModel | null>
  site: HomeSiteViewModel
}>()

const heroData = computed(() => props.hero.data)
const heroImage = computed(() => heroData.value?.image || props.site.cover || props.site.logo)
</script>

<template>
  <section id="top" class="home-v2-hero" aria-labelledby="home-v2-hero-title">
    <div class="container home-v2-hero__layout">
      <div class="home-v2-hero__copy">
        <p class="home-v2-hero__kicker">{{ site.brandName || 'EduHub' }} · {{ site.description || 'تجربة تعليمية أوضح' }}</p>
        <h1 id="home-v2-hero-title">
          {{ heroData?.title || 'تعلّم بخطوات مرتبة،' }}<br />
          <em>{{ heroData?.subtitle || 'وكمّل بثقة.' }}</em>
        </h1>
        <p>
          {{ heroData?.description || site.description || 'تعلّم من محتوى منظم ومصمم لمساعدتك على التقدم بثقة.' }}
        </p>
        <div class="home-v2-hero__actions">
          <a class="button" :href="heroData?.link || '#courses'">استكشف الكورسات <span aria-hidden="true">←</span></a>
          <NuxtLink class="home-v2-hero__secondary" to="/aboutus">تعرّف على المنصة <span aria-hidden="true">↗</span></NuxtLink>
        </div>
      </div>

      <figure :class="['home-v2-hero__visual', { 'home-v2-temporary-asset': !heroImage }]" :aria-label="heroImage?.alt || 'صورة المنصة'">
        <img v-if="heroImage" class="home-v2-hero__image" :src="heroImage.src" :alt="heroImage.alt" />
        <div v-else class="home-v2-hero__placeholder">
          <span aria-hidden="true">EDU</span>
          <strong>صورة المدرّس</strong>
          <small>سيتم استبدالها بالأصل المعتمد</small>
        </div>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.home-v2-hero {
  position: relative;
  overflow: hidden;
  padding-top: 86px;
  background:
    radial-gradient(circle at 12% 24%, color-mix(in srgb, var(--home-v2-blue) 12%, transparent), transparent 33%),
    linear-gradient(135deg, #fbfcff, #eef5ff);
}

.home-v2-hero__layout {
  display: grid;
  min-height: 630px;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  align-items: center;
  gap: clamp(42px, 6vw, 84px);
}

.home-v2-hero__copy {
  max-width: 680px;
  padding-block: 78px;
}

.home-v2-hero__kicker {
  width: fit-content;
  margin: 0 0 18px;
  padding: 7px 12px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 22%, transparent);
  border-radius: 999px;
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 800;
}

.home-v2-hero h1 {
  margin: 0;
  font: 900 clamp(46px, 5vw, 72px) / 1.18 var(--home-v2-heading);
  letter-spacing: -0.035em;
}

.home-v2-hero h1 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-hero__copy > p:not(.home-v2-hero__kicker) {
  max-width: 620px;
  color: var(--home-v2-muted);
  font-size: 17px;
  line-height: 1.95;
}

.home-v2-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.home-v2-hero__secondary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  gap: 9px;
  border-bottom: 1px solid var(--home-v2-ink);
  font-weight: 800;
}

.home-v2-hero__visual {
  width: min(100%, 440px);
  justify-self: center;
  overflow: hidden;
  border-radius: 20px 20px 120px 20px;
  background: #cfe0ff;
  box-shadow: 24px 28px 0 color-mix(in srgb, var(--home-v2-blue) 10%, transparent);
}

.home-v2-hero__image {
  width: 100%;
  aspect-ratio: 1086 / 1448;
  object-fit: cover;
}

.home-v2-hero__placeholder {
  display: grid;
  aspect-ratio: 1086 / 1448;
  place-content: center;
  gap: 8px;
  padding: 32px;
  text-align: center;
  background:
    radial-gradient(circle at 50% 30%, #fff 0 12%, transparent 12.5%),
    linear-gradient(155deg, #ddebff, #7fb6f7);
  color: var(--home-v2-deep);
}

.home-v2-hero__placeholder span {
  font: 900 clamp(65px, 11vw, 120px) / 0.8 var(--home-v2-heading);
  letter-spacing: -0.1em;
  opacity: 0.18;
}

.home-v2-hero__placeholder strong {
  font: 900 22px var(--home-v2-heading);
}

.home-v2-hero__placeholder small {
  font-size: 13px;
}

@media (max-width: 780px) {
  .home-v2-hero__layout {
    min-height: 0;
    grid-template-columns: 1fr;
    padding-top: 25px;
  }

  .home-v2-hero__copy {
    padding-bottom: 20px;
  }

  .home-v2-hero__visual {
    width: min(84%, 350px);
    margin-bottom: 48px;
  }
}
</style>
