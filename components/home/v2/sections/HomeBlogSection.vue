<script setup lang="ts">
import type { HomeBlogViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'
import type { HomeSectionState } from '~/features/HomePageFeature/types/homePage.types'

defineProps<{
  blogs: HomeSectionState<HomeBlogViewModel[]>
}>()
</script>

<template>
  <section id="blog-preview" class="section home-v2-blog" aria-labelledby="home-v2-blog-title">
    <div class="container">
      <div class="home-v2-blog__heading">
        <div>
          <span class="section-tag">من المدونة</span>
          <h2 id="home-v2-blog-title">ذاكر بذكاء.<br />وحل <em>بهدوء.</em></h2>
        </div>
        <div>
          <p>سيتم عرض أحدث مقالات المنصة من API المدونة الحالي في مرحلة ربط البيانات.</p>
          <NuxtLink to="/blogs">كل مقالات المدونة <span aria-hidden="true">←</span></NuxtLink>
        </div>
      </div>

      <div class="home-v2-blog__placeholder" role="status">
        <span>مقالات المنصة</span>
        <strong>بطاقات المقالات ستكون هنا بعد ربط بيانات المدونة.</strong>
        <p>لم تُنسخ مقالات تجريبية إلى هذه المعاينة.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-blog {
  background: var(--home-v2-paper);
}

.home-v2-blog__heading {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: end;
  gap: 60px;
  margin-bottom: 38px;
}

.home-v2-blog h2 {
  margin: 12px 0 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.2 var(--home-v2-heading);
}

.home-v2-blog h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-blog__heading p {
  margin: 0 0 12px;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-v2-blog__heading a {
  color: var(--home-v2-blue);
  font-weight: 800;
}

.home-v2-blog__placeholder {
  display: grid;
  min-height: 260px;
  align-content: center;
  gap: 10px;
  padding: 34px;
  border: 1px dashed color-mix(in srgb, var(--home-v2-blue) 40%, transparent);
  border-radius: 14px;
  background: linear-gradient(135deg, #eef5ff, #fbfcff);
}

.home-v2-blog__placeholder span {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}

.home-v2-blog__placeholder strong {
  font: 900 clamp(24px, 3vw, 36px) / 1.35 var(--home-v2-heading);
}

.home-v2-blog__placeholder p {
  margin: 0;
  color: var(--home-v2-muted);
}

@media (max-width: 760px) {
  .home-v2-blog__heading {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
