<script setup lang="ts">
import type { HomeBlogViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'
import type { HomeSectionState } from '~/features/HomePageFeature/types/homePage.types'

const props = defineProps<{
  blogs: HomeSectionState<HomeBlogViewModel[]>
}>()

const visibleBlogs = computed(() => props.blogs.data.slice(0, 6))
const cardVariants = ['navy', 'blue', 'coral'] as const
const cardMarkers = ['فهم', '05', '7D', 'قوة', 'وقت', 'دقة'] as const

const blogNumber = (index: number): string => String(index + 1).padStart(2, '0')

const formatBlogDate = (date: string | null): string => {
  if (!date) return ''

  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? date
    : new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsedDate)
}
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
          <p>مقالات ونصائح تساعدك تفهم الفيزياء، تنظم مذاكرتك، وتدخل الامتحان بثقة.</p>
          <NuxtLink to="/blogs">كل مقالات المدونة <span aria-hidden="true">←</span></NuxtLink>
        </div>
      </div>

      <div v-if="visibleBlogs.length" class="home-v2-blog__grid">
        <article
          v-for="(blog, index) in visibleBlogs"
          :key="blog.id"
          :class="['home-v2-blog__card', `home-v2-blog__card--${cardVariants[index % cardVariants.length]}`]"
        >
          <NuxtLink :to="blog.route" :aria-label="blog.title">
            <header>
              <span>{{ blog.subtitle || 'مدونة الفيزياء' }}</span>
              <b>{{ blogNumber(index) }}</b>
            </header>
            <strong aria-hidden="true">{{ cardMarkers[index] || blogNumber(index) }}</strong>
            <div>
              <small v-if="blog.date">{{ formatBlogDate(blog.date) }}</small>
              <h3>{{ blog.title }}</h3>
              <p>{{ blog.description || blog.subtitle }}</p>
              <span class="home-v2-blog__read">اقرأ المقال <i aria-hidden="true">←</i></span>
            </div>
          </NuxtLink>
        </article>
      </div>

      <div v-else class="home-v2-blog__placeholder" role="status">
        <strong>لا توجد مقالات متاحة حاليًا.</strong>
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

.home-v2-blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.home-v2-blog__card {
  position: relative;
  isolation: isolate;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dfe7f3;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 30px -28px color-mix(in srgb, var(--home-v2-deep) 45%, transparent);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s ease,
    box-shadow 0.28s ease;
}

.home-v2-blog__card:hover,
.home-v2-blog__card:focus-within {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--home-v2-blue) 30%, #dfe7f3);
  box-shadow: 0 26px 58px -38px color-mix(in srgb, var(--home-v2-deep) 65%, transparent);
}

.home-v2-blog__card > a {
  display: flex;
  min-height: 420px;
  flex-direction: column;
  color: var(--home-v2-ink);
}

.home-v2-blog__card > a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--home-v2-blue) 60%, white);
  outline-offset: -3px;
}

.home-v2-blog__card header {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 22px;
  color: #fff;
  background: var(--home-v2-deep);
  transition: filter 0.24s ease;
}

.home-v2-blog__card header span {
  overflow: hidden;
  font-size: 12px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-v2-blog__card header b {
  flex: 0 0 auto;
  font-size: 12px;
}

.home-v2-blog__card > a > strong {
  display: flex;
  min-height: 142px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 25px;
  color: var(--home-v2-blue);
  background: var(--home-v2-blue-light);
  font: 900 62px var(--home-v2-heading);
  transition: filter 0.28s ease, letter-spacing 0.28s ease;
}

.home-v2-blog__card--blue > a > strong {
  color: #fff;
  background: var(--home-v2-blue);
}

.home-v2-blog__card--coral > a > strong {
  color: #fff;
  background: var(--home-v2-coral);
}

.home-v2-blog__card > a > div {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px;
}

.home-v2-blog__card small {
  color: #60718c;
  font-size: 12px;
}

.home-v2-blog__card h3 {
  margin: 8px 0;
  font: 900 21px/1.5 var(--home-v2-heading);
  transition: color 0.22s ease;
}

.home-v2-blog__card p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 14px;
  line-height: 1.8;
}

.home-v2-blog__read {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 22px;
  color: var(--home-v2-blue);
  font-size: 13px;
  font-weight: 900;
  transition: color 0.22s ease;
}

.home-v2-blog__read i {
  font-size: 19px;
  font-style: normal;
  transition: transform 0.22s ease;
}

.home-v2-blog__card:hover .home-v2-blog__read i {
  transform: translateX(-5px);
}

.home-v2-blog__card:hover header,
.home-v2-blog__card:focus-within header {
  filter: brightness(1.08);
}

.home-v2-blog__card:hover > a > strong,
.home-v2-blog__card:focus-within > a > strong {
  filter: saturate(1.08) brightness(1.02);
  letter-spacing: 0.025em;
}

.home-v2-blog__card:hover h3,
.home-v2-blog__card:focus-within h3 {
  color: var(--home-v2-blue);
}

.home-v2-blog__card:active {
  transform: translateY(-2px);
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

@media (max-width: 900px) {
  .home-v2-blog__grid {
    grid-template-columns: 1fr 1fr;
  }

  .home-v2-blog__card:first-child {
    grid-column: 1 / -1;
  }

  .home-v2-blog__card:first-child > a {
    display: grid;
    grid-template-columns: 0.65fr 1.35fr;
  }

  .home-v2-blog__card:first-child header,
  .home-v2-blog__card:first-child > a > strong {
    grid-column: 1;
  }

  .home-v2-blog__card:first-child > a > strong {
    min-height: 240px;
  }

  .home-v2-blog__card:first-child > a > div {
    grid-area: 1 / 2 / 3;
  }
}

@media (max-width: 680px) {
  .home-v2-blog__grid {
    grid-template-columns: 1fr;
  }

  .home-v2-blog__card:first-child {
    grid-column: auto;
  }

  .home-v2-blog__card:first-child > a {
    display: flex;
  }

  .home-v2-blog__card:first-child header,
  .home-v2-blog__card:first-child > a > strong,
  .home-v2-blog__card:first-child > a > div {
    grid-area: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-blog__card,
  .home-v2-blog__card header,
  .home-v2-blog__card > a > strong,
  .home-v2-blog__card h3,
  .home-v2-blog__read,
  .home-v2-blog__read i {
    transition: none;
  }

  .home-v2-blog__card:hover,
  .home-v2-blog__card:focus-within,
  .home-v2-blog__card:active {
    transform: none;
  }
}
</style>
