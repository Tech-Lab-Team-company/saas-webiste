<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeBooksViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  books: HomeSectionState<HomeBooksViewModel>;
}>();

const booksSection = ref<HTMLElement | null>(null);
let booksAnimationContext: ReturnType<typeof gsap.context> | null = null;
let booksHasEntered = false;

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
    { id: "01", title: "مستقل عن الكورسات", description: null },
    {
      id: "02",
      title:
        book.bookTypes.map((type) => type.label).join(" · ") ||
        "نسخة تعليمية مستقلة",
      description: null,
    },
    {
      id: "03",
      title: book.numberOfPages
        ? `${book.numberOfPages} صفحة`
        : priceLabel.value,
      description: null,
    },
  ];
});

const revealBooksSection = () => {
  const section = booksSection.value;
  if (!section || booksHasEntered) return;

  booksHasEntered = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  booksAnimationContext = gsap.context(() => {
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(
        ".home-v2-books__feature",
        {
          autoAlpha: 0,
          y: 38,
          scale: 0.985,
          duration: 0.85,
          clearProps: "opacity,visibility,transform",
        },
        0,
      )
      .from(
        ".home-v2-books__cover",
        {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.85,
          ease: "expo.inOut",
          clearProps: "clip-path",
        },
        0.18,
      )
      .from(
        ".home-v2-books__copy > *",
        { autoAlpha: 0, y: 18, duration: 0.52, stagger: 0.075 },
        0.38,
      );
  }, section);
};

useScrollTriggeredReveal(booksSection, revealBooksSection, {
  threshold: 0.18,
});

onBeforeUnmount(() => booksAnimationContext?.revert());
</script>

<template>
  <section
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

      <article v-if="featuredBook" class="home-v2-books__feature">
        <div class="home-v2-books__cover">
          <img
            v-if="featuredBook.image"
            :src="featuredBook.image"
            :alt="featuredBook.title"
            loading="lazy"
            decoding="async"
          />
          <div class="home-v2-books__cover-overlay">
            <span class="home-v2-books__edition">
              GAMMA NOTES
              {{ String(featuredBook.bookType || 1).padStart(2, "0") }}
            </span>
            <div class="home-v2-books__cover-title">
              <strong>{{ featuredBook.bookTitle }}</strong>
              <small v-if="featuredBook.bookDescription">
                {{ featuredBook.bookDescription }}
              </small>
            </div>
            <span class="home-v2-books__pages">
              <b>{{ featuredBook.isFree ? "مجاني" : featuredBook.price }}</b>
              <small v-if="!featuredBook.isFree">
                {{ featuredBook.currency || "ج.م" }}
                <template v-if="featuredBook.priceTypeLabel">
                  {{ featuredBook.priceTypeLabel }}</template
                >
              </small>
            </span>
          </div>
        </div>

        <div class="home-v2-books__copy">
          <span>
            {{ featuredBook.subtitle || `كتاب مستقل · ${priceLabel}` }}
          </span>
          <h3>{{ featuredBook.title }}</h3>
          <p v-if="featuredBook.description">{{ featuredBook.description }}</p>
          <ul class="home-v2-books__features">
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
              :to="`/books/${featuredBook.bookId}`"
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

      <div v-else class="home-v2-books__empty" role="status">
        <strong v-if="books.status === 'error'"
          >تعذر تحميل الكتب في الوقت الحالي.</strong
        >
        <strong v-else>لا توجد كتب متاحة حاليًا.</strong>
        <p>يمكنك زيارة المكتبة لاحقًا للاطلاع على أحدث الكتب.</p>
        <NuxtLink to="/books">فتح مكتبة الكتب</NuxtLink>
      </div>
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
  background: var(--home-v2-coral);
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
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  opacity: 0.08;
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
  min-height: 52px;
  align-items: center;
  justify-content: center;
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
  min-width: auto;
  padding: 0;
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
    gap: 22px;
  }

  .home-v2-books__intro h2 {
    font-size: clamp(38px, 12vw, 56px);
  }

  .home-v2-books__feature {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .home-v2-books__cover {
    min-height: 420px;
  }

  .home-v2-books__cover-overlay {
    min-height: 420px;
  }

  .home-v2-books__features {
    grid-template-columns: 1fr;
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
