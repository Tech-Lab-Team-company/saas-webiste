<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeBlogViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

const props = defineProps<{
  blogs: HomeSectionState<HomeBlogViewModel[]>;
}>();

const MAX_VISIBLE_BLOGS = 6;
const visibleBlogs = computed(() =>
  props.blogs.data.slice(0, MAX_VISIBLE_BLOGS),
);
const blogSection = ref<HTMLElement | null>(null);
const blogGrid = ref<HTMLElement | null>(null);
const blogHasEntered = ref(false);
let blogAnimationContext: ReturnType<typeof gsap.context> | null = null;
let blogHeadingHasRevealed = false;
const cardVariants = ["navy", "blue", "coral"] as const;

const emptyStateTitle = computed(() =>
  props.blogs.status === "error"
    ? "تعذر تحميل مقالات المدونة"
    : "أضف مقالات المدونة",
);
const emptyStateDescription = computed(() =>
  props.blogs.status === "error"
    ? "تعذر جلب المقالات في الوقت الحالي. حاول مرة أخرى بعد التأكد من الخدمة."
    : "أضف أول مقال من لوحة التحكم ليظهر محتوى المدونة هنا.",
);

const blogNumber = (index: number): string =>
  String(index + 1).padStart(2, "0");

const formatBlogDate = (date: string | null): string => {
  if (!date) return "";

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : new Intl.DateTimeFormat("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(parsedDate);
};

const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateBlogCards = async () => {
  await nextTick();

  const grid = blogGrid.value;
  if (
    !grid ||
    !blogHasEntered.value ||
    !blogHeadingHasRevealed ||
    shouldReduceMotion()
  ) return;

  const cards = Array.from(
    grid.querySelectorAll<HTMLElement>(".home-v2-blog__card"),
  );
  const markers = cards
    .map((card) => card.querySelector(":scope > a > strong"))
    .filter((marker): marker is Element => Boolean(marker));

  gsap.killTweensOf([...cards, ...markers]);
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
      duration: 0.76,
      stagger: { amount: 0.42 },
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
    },
  );
  gsap.fromTo(
    markers,
    { scale: 0.62, rotation: -7, autoAlpha: 0 },
    {
      scale: 1,
      rotation: 0,
      autoAlpha: 1,
      duration: 0.54,
      stagger: { amount: 0.34 },
      delay: 0.16,
      ease: "back.out(1.35)",
      clearProps: "opacity,visibility,transform",
    },
  );
};

const revealBlogSection = () => {
  const section = blogSection.value;
  if (!section || blogHasEntered.value) return;

  blogHasEntered.value = true;
  if (shouldReduceMotion()) return;

  blogAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from(".home-v2-blog__heading .section-tag", {
        autoAlpha: 0,
        x: 30,
        duration: 0.5,
      })
      .from(
        ".home-v2-blog__heading h2",
        { autoAlpha: 0, y: 38, duration: 0.76, ease: "power3.out" },
        0.1,
      )
      .from(
        ".home-v2-blog__heading > div:last-child > *",
        { autoAlpha: 0, y: 22, duration: 0.54, stagger: 0.08 },
        0.24,
      );

    const placeholder = section.querySelector(".home-section-empty");
    if (placeholder) {
      timeline.from(
        placeholder,
        { autoAlpha: 0, y: 32, scale: 0.98, duration: 0.68 },
        0.56,
      );
    }

    timeline.call(() => {
      blogHeadingHasRevealed = true;
      void animateBlogCards();
    }, undefined, 0.78);
  }, section);
};

const trackBlogPointer = (event: PointerEvent) => {
  if (event.pointerType === "touch" || shouldReduceMotion()) return;

  const card = event.currentTarget as HTMLElement;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty(
    "--blog-pointer-x",
    `${event.clientX - bounds.left}px`,
  );
  card.style.setProperty("--blog-pointer-y", `${event.clientY - bounds.top}px`);
};

const focusBlogCard = (event: PointerEvent) => {
  if (event.pointerType === "touch" || shouldReduceMotion()) return;

  const card = event.currentTarget as HTMLElement;
  const marker = card.querySelector(":scope > a > strong");
  if (!marker) return;

  gsap.to(marker, {
    scale: 1.055,
    rotation: 1.4,
    duration: 0.38,
    ease: "power3.out",
    overwrite: "auto",
  });
};

const resetBlogCard = (event: PointerEvent) => {
  const card = event.currentTarget as HTMLElement;
  const marker = card.querySelector(":scope > a > strong");
  if (!marker) return;

  gsap.to(marker, {
    scale: 1,
    rotation: 0,
    duration: 0.44,
    ease: "power3.out",
    overwrite: "auto",
    onComplete: () => gsap.set(marker, { clearProps: "transform" }),
  });
};

watch(
  () => visibleBlogs.value.map((blog) => blog.id).join(","),
  animateBlogCards,
  { flush: "post" },
);

useScrollTriggeredReveal(blogSection, revealBlogSection, {
  threshold: 0.18,
  rootMargin: "0px 0px -22% 0px",
});

onBeforeUnmount(() => {
  blogAnimationContext?.revert();
  if (blogSection.value) {
    gsap.killTweensOf(blogSection.value.querySelectorAll("*"));
  }
});
</script>

<template>
  <section
    v-if="blogs.status === 'success' && visibleBlogs.length"
    id="blog-preview"
    ref="blogSection"
    class="section home-v2-blog"
    aria-labelledby="home-v2-blog-title"
  >
    <div class="container">
      <div class="home-v2-blog__heading">
        <div>
          <span class="section-tag">من المدونة</span>
          <h2 id="home-v2-blog-title">أحدث المقالات.<br />محتوى <em>متجدد.</em></h2>
        </div>
        <div>
          <p>تصفّح أحدث المقالات المنشورة على المنصة واختر ما يناسبك.</p>
          <NuxtLink to="/blogs"
            >كل مقالات المدونة <span aria-hidden="true">←</span></NuxtLink
          >
        </div>
      </div>

      <div v-if="visibleBlogs.length" ref="blogGrid" class="home-v2-blog__grid">
        <article
          v-for="(blog, index) in visibleBlogs"
          :key="blog.id"
          :class="[
            'home-v2-blog__card',
            `home-v2-blog__card--${cardVariants[index % cardVariants.length]}`,
          ]"
          @pointerenter="focusBlogCard"
          @pointermove="trackBlogPointer"
          @pointerleave="resetBlogCard"
        >
          <NuxtLink :to="blog.route">
            <header>
              <span v-if="blog.subtitle">{{ blog.subtitle }}</span>
              <b>{{ blogNumber(index) }}</b>
            </header>
            <strong aria-hidden="true">{{ blogNumber(index) }}</strong>
            <div>
              <small v-if="blog.date">{{ formatBlogDate(blog.date) }}</small>
              <h3>{{ blog.title }}</h3>
              <p v-if="blog.description || blog.subtitle">
                {{ blog.description || blog.subtitle }}
              </p>
              <span class="home-v2-blog__read"
                >اقرأ المقال
                <span class="home-v2-blog__read-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M19 12H5m6-6-6 6 6 6" />
                  </svg>
                </span></span
              >
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Backup empty state: uncomment if empty sections should be visible again.
      <HomeSectionEmptyState
        v-else
        label="قسم المدونة"
        :title="emptyStateTitle"
        :description="emptyStateDescription"
      />
      -->
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
  color: var(--home-v2-deep);
  font-weight: 800;
  transition: color 0.22s ease, gap 0.22s ease;
}

.home-v2-blog__heading a:hover {
  gap: 15px;
  color: color-mix(in srgb, var(--home-v2-deep) 78%, #071020);
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
    border-color 0.24s ease, box-shadow 0.28s ease;
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
  content: "";
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
  background: var(--home-v2-blue);
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
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 22px;
  color: var(--home-v2-deep);
  font-size: 13px;
  font-weight: 900;
  transition: color 0.22s ease;
}

.home-v2-blog__read-icon {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--home-v2-deep) 28%, transparent);
  border-radius: 7px;
  background: var(--home-v2-blue);
  color: var(--home-v2-deep);
  box-shadow: 0 7px 16px color-mix(in srgb, var(--home-v2-blue) 22%, transparent);
  transition: background-color 0.22s ease, box-shadow 0.22s ease,
    transform 0.22s ease;
}

.home-v2-blog__read-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.home-v2-blog__card:hover .home-v2-blog__read-icon,
.home-v2-blog__card:focus-within .home-v2-blog__read-icon {
  box-shadow: 0 9px 20px color-mix(in srgb, var(--home-v2-blue) 34%, transparent);
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
