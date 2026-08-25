<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeBooksViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

const props = defineProps<{
  books: HomeSectionState<HomeBooksViewModel>;
}>();

const booksSection = ref<HTMLElement | null>(null);
let booksAnimationContext: ReturnType<typeof gsap.context> | null = null;
let booksHasEntered = false;

const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type QuickMotion = ReturnType<typeof gsap.quickTo>;
type BookMotionController = {
  image: Element | null;
  badge: Element | null;
  imageX?: QuickMotion;
  imageY?: QuickMotion;
  imageScale?: QuickMotion;
  badgeX?: QuickMotion;
  badgeY?: QuickMotion;
  badgeRotation?: QuickMotion;
};

const bookMotionControllers = new WeakMap<HTMLElement, BookMotionController>();
const bookResetCalls = new Map<
  HTMLElement,
  ReturnType<typeof gsap.delayedCall>
>();

const getBookMotionController = (card: HTMLElement) => {
  const image = card.querySelector(".home-v2-books__cover > img");
  const badge = card.querySelector(".home-v2-books__pages");
  const cached = bookMotionControllers.get(card);

  if (cached?.image === image && cached.badge === badge) return cached;

  const controller: BookMotionController = { image, badge };

  if (image) {
    const settings = { duration: 0.82, ease: "power3.out" };
    controller.imageX = gsap.quickTo(image, "x", settings);
    controller.imageY = gsap.quickTo(image, "y", settings);
    controller.imageScale = gsap.quickTo(image, "scale", settings);
  }

  if (badge) {
    const settings = { duration: 0.72, ease: "power3.out" };
    controller.badgeX = gsap.quickTo(badge, "x", settings);
    controller.badgeY = gsap.quickTo(badge, "y", settings);
    controller.badgeRotation = gsap.quickTo(badge, "rotation", settings);
  }

  bookMotionControllers.set(card, controller);
  return controller;
};

const featuredBook = computed(() => props.books.data.items[0] ?? null);

const priceLabel = computed(() => {
  const book = featuredBook.value;
  if (!book) return "";
  if (book.isFree || Number(book.price) === 0) return "مجاني";
  return `${book.price} ${book.currency}`.trim();
});

const bookFeatures = computed(() => {
  const book = featuredBook.value;
  if (!book) return [];

  if (book.steps.length > 0) {
    return book.steps.map((step, index) => ({
      id: String(step.order || index + 1).padStart(2, "0"),
      title: step.title,
      description: step.description,
    }));
  }

  return [
    ...(book.bookTypes.length
      ? [{ title: book.bookTypes.map((type) => type.label).join(" · "), description: null }]
      : []),
    ...(book.numberOfPages
      ? [{ title: `${book.numberOfPages} صفحة`, description: null }]
      : []),
    ...(priceLabel.value
      ? [{ title: priceLabel.value, description: null }]
      : []),
  ].map((feature, index) => ({
    ...feature,
    id: String(index + 1).padStart(2, "0"),
  }));
});

const revealBooksSection = () => {
  const section = booksSection.value;
  if (!section || booksHasEntered) return;

  booksHasEntered = true;
  if (shouldReduceMotion()) return;

  booksAnimationContext = gsap.context(() => {
    const timeline = gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .from(".home-v2-books__heading > span", {
        autoAlpha: 0,
        x: 28,
        duration: 0.68,
        clearProps: "opacity,visibility,transform",
      })
      .from(
        ".home-v2-books__heading h2",
        {
          autoAlpha: 0,
          y: 38,
          duration: 1.05,
          clearProps: "opacity,visibility,transform",
        },
        0.12,
      )
      .from(
        ".home-v2-books__intro > p",
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.82,
          clearProps: "opacity,visibility,transform",
        },
        0.34,
      );

    if (featuredBook.value) {
      timeline
        .from(
          ".home-v2-books__feature",
          {
            autoAlpha: 0,
            y: 32,
            scale: 0.99,
            duration: 1.1,
            clearProps: "opacity,visibility,transform",
          },
          0.52,
        )
        .from(
          ".home-v2-books__cover",
          {
            clipPath: "inset(0 100% 0 0)",
            duration: 1.15,
            ease: "power3.inOut",
            clearProps: "clip-path",
          },
          0.68,
        )
        .from(
          ".home-v2-books__pages",
          {
            autoAlpha: 0,
            scale: 0.72,
            rotate: -6,
            duration: 0.82,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
          1.08,
        )
        .from(
          ".home-v2-books__copy > *",
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.72,
            stagger: 0.1,
            clearProps: "opacity,visibility,transform",
          },
          0.92,
        )
        .from(
          ".home-v2-books__features li",
          {
            autoAlpha: 0,
            y: 12,
            duration: 0.62,
            stagger: 0.11,
            clearProps: "opacity,visibility,transform",
          },
          1.28,
        )
        .fromTo(
          ".home-v2-books__sheen",
          { xPercent: 150, autoAlpha: 0 },
          {
            xPercent: -260,
            autoAlpha: 0.72,
            duration: 1.5,
            ease: "power2.inOut",
          },
          1.1,
        )
        .to(
          ".home-v2-books__sheen",
          {
            autoAlpha: 0,
            duration: 0.32,
            clearProps: "opacity,visibility,transform",
          },
          2.35,
        );
    } else {
      timeline.from(
        ".home-section-empty",
        {
          autoAlpha: 0,
          y: 28,
          duration: 0.85,
          clearProps: "opacity,visibility,transform",
        },
        0.5,
      );
    }
  }, section);
};

const moveBookVisual = (event: PointerEvent) => {
  if (event.pointerType === "touch" || shouldReduceMotion()) return;

  const card = event.currentTarget as HTMLElement;
  const bounds = card.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
  const controller = getBookMotionController(card);

  bookResetCalls.get(card)?.kill();
  bookResetCalls.delete(card);
  controller.imageX?.(horizontal * 14);
  controller.imageY?.(vertical * 10);
  controller.imageScale?.(1.025);
  controller.badgeX?.(horizontal * -8);
  controller.badgeY?.(vertical * -8);
  controller.badgeRotation?.(horizontal * -4);
};

const resetBookVisual = (event: PointerEvent) => {
  const card = event.currentTarget as HTMLElement;
  const controller = getBookMotionController(card);

  controller.imageX?.(0);
  controller.imageY?.(0);
  controller.imageScale?.(1);
  controller.badgeX?.(0);
  controller.badgeY?.(0);
  controller.badgeRotation?.(0);

  bookResetCalls.get(card)?.kill();
  const resetCall = gsap.delayedCall(0.92, () => {
    if (!card.matches(":hover")) {
      const targets = [controller.image, controller.badge].filter(Boolean);
      gsap.set(targets, { clearProps: "transform" });
    }
    bookResetCalls.delete(card);
  });
  bookResetCalls.set(card, resetCall);
};

useScrollTriggeredReveal(booksSection, revealBooksSection, {
  threshold: 0.12,
});

onBeforeUnmount(() => {
  booksAnimationContext?.revert();
  bookResetCalls.forEach((call) => call.kill());
  bookResetCalls.clear();
  if (booksSection.value) {
    gsap.killTweensOf(booksSection.value.querySelectorAll("*"));
  }
});
</script>

<template>
  <section
    v-if="books.status === 'success' && featuredBook"
    id="books"
    ref="booksSection"
    class="section home-v2-books"
    aria-label="مكتبة الكتب"
  >
    <div class="container">
      <header class="home-v2-books__intro">
        <div class="home-v2-books__heading">
          <span>مكتبة مستقلة</span>
          <h2>اختار مذكرتك.<br />على حسب <em>احتياجك.</em></h2>
        </div>
        <p>
          كل مذكرة منتج مستقل عن الكورسات؛ شوف محتواها، اختار النوع المتاح، وخد
          فقط اللي محتاجه.
        </p>
      </header>

      <article
        v-if="featuredBook"
        class="home-v2-books__feature"
        @pointermove="moveBookVisual"
        @pointerleave="resetBookVisual"
      >
        <div class="home-v2-books__cover">
          <NuxtImg
            v-if="featuredBook.image"
            :src="featuredBook.image"
            :alt="featuredBook.title"
            width="720"
            height="960"
            sizes="375:100vw md:42vw lg:480px"
            format="webp"
            quality="78"
            loading="lazy"
            decoding="async"
          />
          <div class="home-v2-books__cover-overlay">
            <span class="home-v2-books__sheen" aria-hidden="true" />
            <span class="home-v2-books__edition">
              كتاب رقم {{ featuredBook.bookId }}
            </span>
            <div class="home-v2-books__cover-title">
              <strong>{{ featuredBook.bookTitle }}</strong>
              <small v-if="featuredBook.bookDescription">
                {{ featuredBook.bookDescription }}
              </small>
            </div>
            <span class="home-v2-books__pages">
              <b>{{ featuredBook.isFree ? "مجاني" : featuredBook.price }}</b>
              <small
                v-if="
                  !featuredBook.isFree &&
                  (featuredBook.currency || featuredBook.priceTypeLabel)
                "
              >
                {{ featuredBook.currency }}
                <template v-if="featuredBook.priceTypeLabel">
                  {{ featuredBook.priceTypeLabel }}</template
                >
              </small>
            </span>
          </div>
        </div>

        <div class="home-v2-books__copy">
          <span>
            {{ featuredBook.subtitle || priceLabel }}
          </span>
          <h3>{{ featuredBook.title }}</h3>
          <p v-if="featuredBook.description">{{ featuredBook.description }}</p>
          <ul v-if="bookFeatures.length" class="home-v2-books__features">
            <li v-for="feature in bookFeatures" :key="feature.id">
              <small>{{ feature.id }}</small>
              <span>
                <strong>{{ feature.title }}</strong>
                <p v-if="feature.description">{{ feature.description }}</p>
              </span>
            </li>
          </ul>
          <div class="home-v2-books__actions">
            <NuxtLink
              :to="{
                path: `/books/${featuredBook.bookId}`,
                query: { source: 'home' },
              }"
              class="home-v2-books__primary"
            >
              تفاصيل الكتاب
              <span aria-hidden="true">←</span>
            </NuxtLink>
            <NuxtLink to="/books" class="home-v2-books__secondary"
              >كل الكتب</NuxtLink
            >
          </div>
        </div>
      </article>

      <!-- Backup empty state: uncomment if empty sections should be visible again.
      <HomeSectionEmptyState
        v-else
        label="قسم الكتب"
        :title="books.status === 'error' ? 'تعذر تحميل الكتب' : 'أضف كتب المنصة'"
        :description="
          books.status === 'error'
            ? 'تعذر جلب الكتب في الوقت الحالي. حاول مرة أخرى بعد التأكد من الخدمة.'
            : 'أضف أول كتاب من لوحة التحكم ليظهر هذا القسم هنا.'
        "
      />
      -->
    </div>
  </section>
</template>

<style scoped>
.home-v2-books {
  background: #edf3ff;
}

.home-v2-books__intro {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  align-items: end;
  gap: clamp(42px, 8vw, 130px);
  margin-bottom: clamp(38px, 5vw, 64px);
}

.home-v2-books__heading > span {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}

.home-v2-books__heading > span::before {
  width: 28px;
  height: 2px;
  background: color-mix(in srgb, var(--home-v2-coral) 58%, #5f160e);
  content: "";
}

.home-v2-books__intro h2 {
  max-width: 760px;
  margin: 0;
  color: var(--home-v2-ink);
  font: 900 clamp(44px, 5.4vw, 76px) / 1.18 var(--home-v2-heading);
  letter-spacing: -0.035em;
}

.home-v2-books__intro h2 em {
  color: var(--home-v2-coral);
  font-style: normal;
}

.home-v2-books__intro > p {
  max-width: 430px;
  margin: 0 0 8px;
  color: var(--home-v2-muted);
  font-size: 16px;
  line-height: 2;
}

.home-v2-books__copy p,
.home-v2-books__empty p {
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-v2-books__feature {
  display: grid;
  min-height: 576px;
  grid-template-columns: minmax(360px, 0.72fr) minmax(0, 1.28fr);
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 30px 80px -62px #06114799;
  transition: border-color 0.35s ease, box-shadow 0.35s ease,
    transform 0.35s ease;
}

.home-v2-books__feature:hover {
  border-color: color-mix(
    in srgb,
    var(--home-v2-blue) 24%,
    var(--home-v2-line)
  );
  box-shadow: 0 38px 90px -58px #06114780;
  transform: translateY(-4px);
}

.home-v2-books__cover {
  position: relative;
  min-height: 576px;
  overflow: hidden;
  background: #071247;
}

.home-v2-books__cover > img {
  position: absolute;
  inset: 0;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  object-fit: contain;
  object-position: center bottom;
  opacity: 0.8;
  filter: saturate(0.82) contrast(1.08);
}

.home-v2-books__cover-overlay {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  min-height: 576px;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 36px 34px;
  background: linear-gradient(180deg, rgb(7 18 71 / 15%), rgb(7 18 71 / 96%));
  color: #fff;
}

.home-v2-books__sheen {
  position: absolute;
  z-index: 3;
  inset-block: -25%;
  inset-inline-end: -22%;
  width: 28%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 28%),
    transparent
  );
  opacity: 0;
  filter: blur(2px);
  pointer-events: none;
  transform: skewX(-18deg);
}

.home-v2-books__cover-overlay::before,
.home-v2-books__cover-overlay::after {
  position: absolute;
  top: -72px;
  inset-inline-end: -42px;
  width: 190px;
  height: 190px;
  border: 1px solid rgb(255 255 255 / 17%);
  border-radius: 50%;
  content: "";
}

.home-v2-books__cover-overlay::after {
  top: -120px;
  inset-inline-end: -92px;
  width: 290px;
  height: 290px;
}

.home-v2-books__edition,
.home-v2-books__copy > span {
  position: relative;
  z-index: 1;
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.home-v2-books__edition {
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-align: right;
}

.home-v2-books__cover-title {
  position: relative;
  z-index: 1;
  max-width: 88%;
  padding-inline-end: 76px;
  margin-top: auto;
  margin-bottom: 4px;
}

.home-v2-books__cover-title strong {
  display: -webkit-box;
  overflow: hidden;
  font: 900 clamp(30px, 3vw, 43px) / 1.3 var(--home-v2-heading);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.home-v2-books__cover-title small {
  display: block;
  margin-top: 8px;
  color: #ffffffb8;
  font-size: 14px;
  line-height: 1.7;
}

.home-v2-books__pages {
  position: absolute;
  z-index: 2;
  bottom: 28px;
  inset-inline-end: 26px;
  display: grid;
  width: 82px;
  height: 82px;
  place-items: center;
  align-content: center;
  border-radius: 50%;
  background: var(--home-v2-coral);
  color: #fff;
  line-height: 1;
}

.home-v2-books__pages b {
  font: 900 24px/1 var(--home-v2-heading);
}

.home-v2-books__pages small {
  /* margin-top: 7px; */
  padding-inline: 5px;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
}

.home-v2-books__copy {
  display: grid;
  align-content: center;
  gap: 20px;
  padding: clamp(42px, 6vw, 76px);
}

.home-v2-books h3 {
  max-width: 650px;
  margin: 0;
  font: 900 clamp(34px, 4vw, 52px) / 1.28 var(--home-v2-heading);
}

.home-v2-books__features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 12px 0 8px;
  padding: 0;
  border-block: 1px solid var(--home-v2-line);
  list-style: none;
}

.home-v2-books__features li {
  display: grid;
  min-height: 88px;
  align-content: center;
  gap: 8px;
  padding: 14px 20px;
}

.home-v2-books__features li + li {
  border-inline-start: 1px solid var(--home-v2-line);
}

.home-v2-books__features small {
  color: var(--home-v2-coral);
  font-size: 10px;
  font-weight: 900;
}

.home-v2-books__features strong {
  display: block;
  color: var(--home-v2-ink);
  font-size: 14px;
  line-height: 1.65;
}

.home-v2-books__features p {
  margin-top: 5px;
  color: var(--home-v2-muted);
  font-size: 11px;
  line-height: 1.65;
}

.home-v2-books__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
  margin-top: 2px;
}

.home-v2-books__primary,
.home-v2-books__secondary {
  display: inline-flex;
  min-width: 48px;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
  font-weight: 800;
  transition: background-color 0.2s ease, color 0.2s ease,
    border-color 0.2s ease;
}

.home-v2-books__primary {
  min-width: 178px;
  padding: 0 22px;
  background: var(--home-v2-blue);
  color: #fff;
}

.home-v2-books__primary span {
  margin-inline-start: 18px;
}

.home-v2-books__secondary {
  padding: 12px 16px;
  border-bottom: 1px solid var(--home-v2-blue);
  color: var(--home-v2-blue);
}

.home-v2-books__primary:hover {
  background: color-mix(in srgb, var(--home-v2-blue) 84%, #000);
}

.home-v2-books__secondary:hover {
  border-color: var(--home-v2-coral);
  color: var(--home-v2-coral);
}

.home-v2-books__empty a {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border: 1px solid var(--home-v2-blue);
  border-radius: 8px;
  color: var(--home-v2-blue);
  font-weight: 800;
}

.home-v2-books__empty {
  display: grid;
  min-height: 260px;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 36px;
  border: 1px dashed color-mix(in srgb, var(--home-v2-blue) 36%, transparent);
  border-radius: 14px;
  background: #fff;
  text-align: center;
}

@media (max-width: 760px) {
  .home-v2-books__intro {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 28px;
  }

  .home-v2-books__intro h2 {
    font-size: clamp(30px, 8.8vw, 36px);
    line-height: 1.28;
  }

  .home-v2-books__heading > span {
    margin-bottom: 11px;
    font-size: 11px;
  }

  .home-v2-books__intro > p {
    margin: 0;
    font-size: 13px;
    line-height: 1.75;
  }

  .home-v2-books__feature {
    min-height: 0;
    grid-template-columns: 1fr;
    gap: 0;
    border-radius: 12px;
  }

  .home-v2-books__cover {
    min-height: 250px;
  }

  .home-v2-books__cover-overlay {
    min-height: 250px;
    padding: 18px 16px 14px;
  }

  .home-v2-books__cover-title {
    max-width: 100%;
    padding-inline-end: 62px;
  }

  .home-v2-books__cover-title strong {
    font-size: 24px;
  }

  .home-v2-books__cover-title small {
    font-size: 12px;
  }

  .home-v2-books__pages {
    width: 54px;
    height: 54px;
    right: auto;
    inset-inline-end: 16px;
    bottom: 16px;
  }

  .home-v2-books__pages b {
    font-size: 18px;
  }

  .home-v2-books__pages small {
    font-size: 10px;
  }

  .home-v2-books__copy {
    gap: 12px;
    padding: 18px 16px;
  }

  .home-v2-books h3 {
    font-size: 22px;
    line-height: 1.38;
  }

  .home-v2-books__copy > p {
    font-size: 13px;
    line-height: 1.75;
  }

  .home-v2-books__features {
    grid-template-columns: 1fr;
    margin: 4px 0;
  }

  .home-v2-books__features li {
    min-height: 58px;
    gap: 4px;
    padding: 10px 12px;
  }

  .home-v2-books__features p {
    margin-top: 2px;
  }

  .home-v2-books__actions {
    gap: 12px;
  }

  .home-v2-books__features li + li {
    border-block-start: 1px solid var(--home-v2-line);
    border-inline-start: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-books__feature {
    transition: none;
  }

  .home-v2-books__feature:hover {
    transform: none;
  }
}
</style>
