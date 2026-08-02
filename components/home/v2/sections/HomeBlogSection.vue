<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeBlogViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'
import type { HomeSectionState } from '~/features/HomePageFeature/types/homePage.types'

const props = defineProps<{
  blogs: HomeSectionState<HomeBlogViewModel[]>
}>()

const MAX_VISIBLE_BLOGS = 6
const visibleBlogs = computed(() =>
  props.blogs.data.slice(0, MAX_VISIBLE_BLOGS),
)
const blogSection = ref<HTMLElement | null>(null)
const blogGrid = ref<HTMLElement | null>(null)
const blogHasEntered = ref(false)
let blogAnimationContext: ReturnType<typeof gsap.context> | null = null
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

const shouldReduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const animateBlogCards = async () => {
  await nextTick()

  const grid = blogGrid.value
  if (!grid || !blogHasEntered.value || shouldReduceMotion()) return

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.home-v2-blog__card'))
  const markers = cards
    .map((card) => card.querySelector(':scope > a > strong'))
    .filter((marker): marker is Element => Boolean(marker))

  gsap.killTweensOf([...cards, ...markers])
  gsap.fromTo(
    cards,
    {
      autoAlpha: 0,
      x: (index) => (index % 2 === 0 ? 48 : -48),
      y: 42,
      rotationZ: (index) => (index % 2 === 0 ? 1.6 : -1.6),
      scale: 0.965,
    },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      rotationZ: 0,
      scale: 1,
      duration: 0.82,
      stagger: 0.11,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform',
    },
  )
  gsap.fromTo(
    markers,
    { scale: 0.62, rotation: -7, autoAlpha: 0 },
    {
      scale: 1,
      rotation: 0,
      autoAlpha: 1,
      duration: 0.7,
      stagger: 0.1,
      delay: 0.18,
      ease: 'back.out(1.7)',
      clearProps: 'opacity,visibility,transform',
    },
  )
}

const revealBlogSection = () => {
  const section = blogSection.value
  if (!section || blogHasEntered.value) return

  blogHasEntered.value = true
  if (shouldReduceMotion()) return

  blogAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    timeline
      .from('.home-v2-blog__heading .section-tag', {
        autoAlpha: 0,
        x: 30,
        duration: 0.55,
      })
      .from(
        '.home-v2-blog__heading h2',
        { autoAlpha: 0, y: 38, duration: 0.82, ease: 'expo.out' },
        0.12,
      )
      .from(
        '.home-v2-blog__heading > div:last-child > *',
        { autoAlpha: 0, y: 22, duration: 0.58, stagger: 0.1 },
        0.28,
      )

    const placeholder = section.querySelector('.home-v2-blog__placeholder')
    if (placeholder) {
      timeline.from(
        placeholder,
        { autoAlpha: 0, y: 32, scale: 0.98, duration: 0.72 },
        0.48,
      )
    }

    void animateBlogCards()
  }, section)
}

const trackBlogPointer = (event: PointerEvent) => {
  if (event.pointerType === 'touch' || shouldReduceMotion()) return

  const card = event.currentTarget as HTMLElement
  const bounds = card.getBoundingClientRect()
  card.style.setProperty('--blog-pointer-x', `${event.clientX - bounds.left}px`)
  card.style.setProperty('--blog-pointer-y', `${event.clientY - bounds.top}px`)
}

const focusBlogCard = (event: PointerEvent) => {
  if (event.pointerType === 'touch' || shouldReduceMotion()) return

  const card = event.currentTarget as HTMLElement
  const marker = card.querySelector(':scope > a > strong')
  if (!marker) return

  gsap.to(marker, {
    scale: 1.055,
    rotation: 1.4,
    duration: 0.5,
    ease: 'power3.out',
    overwrite: 'auto',
  })
}

const resetBlogCard = (event: PointerEvent) => {
  const card = event.currentTarget as HTMLElement
  const marker = card.querySelector(':scope > a > strong')
  if (!marker) return

  gsap.to(marker, {
    scale: 1,
    rotation: 0,
    duration: 0.65,
    ease: 'elastic.out(1, 0.6)',
    overwrite: 'auto',
    onComplete: () => gsap.set(marker, { clearProps: 'transform' }),
  })
}

watch(
  () => visibleBlogs.value.map((blog) => blog.id).join(','),
  animateBlogCards,
  { flush: 'post' },
)

useScrollTriggeredReveal(blogSection, revealBlogSection, {
  threshold: 0.16,
})

onBeforeUnmount(() => {
  blogAnimationContext?.revert()
  if (blogSection.value) {
    gsap.killTweensOf(blogSection.value.querySelectorAll('*'))
  }
})
</script>

<template>
  <section
    id="blog-preview"
    ref="blogSection"
    class="section home-v2-blog"
    aria-labelledby="home-v2-blog-title"
  >
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

      <div
        v-if="visibleBlogs.length"
        ref="blogGrid"
        class="home-v2-blog__grid"
      >
        <article
          v-for="(blog, index) in visibleBlogs"
          :key="blog.id"
          :class="['home-v2-blog__card', `home-v2-blog__card--${cardVariants[index % cardVariants.length]}`]"
          @pointerenter="focusBlogCard"
          @pointermove="trackBlogPointer"
          @pointerleave="resetBlogCard"
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
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--home-v2-blue);
  font-weight: 800;
  transition: color 0.22s ease, gap 0.22s ease;
}

.home-v2-blog__heading a:hover {
  gap: 15px;
  color: var(--home-v2-coral);
}

.home-v2-blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  perspective: 1200px;
}

.home-v2-blog__card {
  --blog-pointer-x: 50%;
  --blog-pointer-y: 50%;
  position: relative;
  isolation: isolate;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dfe7f3;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 30px -28px color-mix(in srgb, var(--home-v2-deep) 45%, transparent);
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s ease,
    box-shadow 0.28s ease;
}

.home-v2-blog__card::after {
  position: absolute;
  z-index: 3;
  inset: 0;
  background: radial-gradient(
    210px circle at var(--blog-pointer-x) var(--blog-pointer-y),
    rgb(255 255 255 / 48%),
    transparent 72%
  );
  content: '';
  mix-blend-mode: soft-light;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.home-v2-blog__card:hover::after,
.home-v2-blog__card:focus-within::after {
  opacity: 0.72;
}

.home-v2-blog__card:hover,
.home-v2-blog__card:focus-within {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--home-v2-blue) 30%, #dfe7f3);
  box-shadow: 0 26px 58px -38px color-mix(in srgb, var(--home-v2-deep) 65%, transparent);
}

.home-v2-blog__card > a {
  position: relative;
  z-index: 1;
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
  transform-origin: center;
  will-change: transform;
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

  .home-v2-blog__card,
  .home-v2-blog__card > a > strong {
    will-change: auto;
  }

  .home-v2-blog__card::after {
    display: none;
  }

  .home-v2-blog__card:hover,
  .home-v2-blog__card:focus-within,
  .home-v2-blog__card:active {
    transform: none;
  }
}
</style>
