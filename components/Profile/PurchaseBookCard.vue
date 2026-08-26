<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

interface Props {
  title: string;
  to: RouteLocationRaw;
  image?: string | null;
  pageCount?: number | null;
  label?: string;
  order?: number;
  size?: "default" | "showcase";
}

const props = withDefaults(defineProps<Props>(), {
  image: null,
  pageCount: 0,
  label: "كتاب",
  order: 0,
  size: "default",
});
</script>

<template>
  <article
    class="purchase-card purchase-card--book"
    :class="{ 'purchase-card--book-showcase': props.size === 'showcase' }"
    :style="{ '--purchase-order': props.order }"
  >
    <NuxtLink
      class="purchase-card__book-link"
      :to="props.to"
      :aria-label="`تفاصيل الكتاب: ${props.title}، عدد الصفحات ${props.pageCount || 'غير محدد'}`"
    >
      <div class="purchase-card__book" aria-hidden="true">
        <div class="purchase-card__book-pages">
          <div class="purchase-card__book-page">
            <i class="pi pi-book" />
            <small>نسختك التعليمية</small>
            <strong class="purchase-card__book-page-title">{{ props.title }}</strong>
            <span class="purchase-card__book-page-rule" />
            <span class="purchase-card__book-length">
              <small>عدد الصفحات</small>
              <b>{{ props.pageCount || "غير محدد" }}</b>
              <em v-if="props.pageCount">صفحة</em>
            </span>
          </div>
        </div>

        <div class="purchase-card__book-cover">
          <img v-if="props.image" :src="props.image" alt="" />
          <span v-else class="purchase-card__book-cover-fallback">
            <i class="pi pi-book" />
            <strong>{{ props.title }}</strong>
          </span>
          <span class="purchase-card__book-spine" />
          <span class="purchase-card__book-label">
            <i class="pi pi-book" />
            {{ props.label }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.purchase-card.purchase-card--book {
  --purchase-order: 0;
  --purchase-book-primary: var(--profile-primary, var(--home-v2-deep, #061147));
  --purchase-book-secondary: var(--profile-secondary, var(--home-v2-blue, #1769aa));
  --purchase-book-secondary-soft: var(
    --profile-secondary-soft,
    color-mix(in srgb, var(--purchase-book-secondary) 18%, #fff)
  );
  position: relative;
  isolation: isolate;
  display: grid;
  min-width: 0;
  min-height: 390px;
  place-items: center;
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  animation: purchase-book-card-enter 520ms cubic-bezier(0.2, 0.8, 0.2, 1)
    backwards;
  animation-delay: calc(var(--purchase-order) * 55ms);
  transition: transform 200ms ease;
}

.purchase-card.purchase-card--book-showcase,
.purchase-card--book-showcase .purchase-card__book-link {
  min-height: 470px;
}

.purchase-card--book-showcase .purchase-card__book {
  width: 270px;
  height: 405px;
}

.purchase-card.purchase-card--book:hover,
.purchase-card.purchase-card--book:focus-within {
  border-color: transparent;
  box-shadow: none;
  transform: translateY(-3px);
}

.purchase-card__book-link {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 390px;
  padding: 24px 8px 42px;
  place-items: center;
  color: inherit;
  perspective: 1450px;
  text-decoration: none;
}

.purchase-card__book-link::before {
  position: absolute;
  right: 14%;
  bottom: 28px;
  left: 14%;
  height: 28px;
  border-radius: 50%;
  background: rgb(8 18 42 / 32%);
  filter: blur(12px);
  content: "";
  opacity: 0.72;
  transform: rotate(-1deg);
}

.purchase-card__book-link:focus-visible {
  border-radius: 12px;
  outline: 3px solid var(--purchase-book-secondary-soft);
  outline-offset: 4px;
}

.purchase-card__book {
  position: relative;
  z-index: 2;
  width: 220px;
  height: 330px;
  transform: rotate(-1.5deg) translateZ(0);
  transform-style: preserve-3d;
  transition: transform 650ms cubic-bezier(0.2, 0.78, 0.18, 1);
}

.purchase-card__book-pages {
  position: absolute;
  inset: 5px 4px 5px 1px;
  overflow: hidden;
  border: 1px solid rgb(194 183 157 / 65%);
  border-radius: 7px 3px 3px 7px;
  background: repeating-linear-gradient(90deg, #f8f3e7 0 3px, #e6dcc7 3px 4px);
  box-shadow: -6px 8px 0 -2px #d9ceb7, -11px 17px 28px rgb(0 0 0 / 38%);
}

.purchase-card__book-pages::after {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent 74%, rgb(94 75 42 / 13%));
  content: "";
  pointer-events: none;
}

.purchase-card__book-page {
  position: absolute;
  inset: 18px 17px 18px 13px;
  display: flex;
  padding: 20px 17px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgb(114 92 54 / 16%);
  color: #5d513d;
  text-align: center;
}

.purchase-card__book-page > i {
  color: color-mix(in srgb, var(--purchase-book-secondary) 76%, #303d52);
  font-size: 33px;
}

.purchase-card__book-page > small {
  color: #8a7a5f;
  font-size: 9px;
  font-weight: 800;
}

.purchase-card__book-page-title {
  display: -webkit-box;
  overflow: hidden;
  color: #3d3427;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.purchase-card__book-page-rule {
  width: 42px;
  height: 2px;
  margin-block: 2px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--purchase-book-secondary) 62%, #8a7655);
}

.purchase-card__book-length {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  justify-content: center;
  gap: 1px 5px;
  color: #5d513d;
}

.purchase-card__book-length small {
  grid-column: 1 / -1;
  color: #9a8869;
  font-size: 8px;
  font-weight: 700;
}

.purchase-card__book-length b {
  font-size: 18px;
  font-weight: 900;
}

.purchase-card__book-length em {
  font-size: 8px;
  font-style: normal;
  font-weight: 800;
}

.purchase-card__book-cover {
  position: absolute;
  z-index: 4;
  inset: 0;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 8px 3px 3px 8px;
  background:
    linear-gradient(150deg, rgb(255 255 255 / 12%), transparent 34%),
    var(--purchase-book-primary);
  box-shadow: -10px 14px 24px rgb(0 0 0 / 34%),
    inset 10px 0 18px rgb(255 255 255 / 7%);
  backface-visibility: hidden;
  transform: rotateY(0deg);
  transform-origin: right center;
  transform-style: preserve-3d;
  transition: transform 700ms cubic-bezier(0.18, 0.78, 0.16, 1),
    box-shadow 700ms ease;
}

.purchase-card__book-cover::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 62%, rgb(0 0 0 / 24%)),
    linear-gradient(180deg, transparent 45%, rgb(2 12 35 / 58%));
  content: "";
  pointer-events: none;
}

.purchase-card__book-cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.015);
  transition: transform 650ms ease, filter 650ms ease;
}

.purchase-card__book-cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  padding: 38px 28px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  color: #fff;
  text-align: center;
}

.purchase-card__book-cover-fallback > i {
  font-size: 46px;
  opacity: 0.86;
}

.purchase-card__book-cover-fallback > strong {
  display: -webkit-box;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.purchase-card__book-spine {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 0;
  width: 14px;
  border-left: 1px solid rgb(255 255 255 / 14%);
  background: linear-gradient(90deg, rgb(0 0 0 / 30%), rgb(255 255 255 / 9%));
  box-shadow: -3px 0 8px rgb(0 0 0 / 18%);
}

.purchase-card__book-label {
  position: absolute;
  z-index: 3;
  right: 22px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
}

.purchase-card--book:focus-within .purchase-card__book {
  transform: translateX(-28px) rotate(0.5deg) translateZ(0);
}

.purchase-card--book:focus-within .purchase-card__book-cover {
  box-shadow: -22px 20px 34px rgb(0 0 0 / 26%);
  transform: rotateY(88deg);
}

.purchase-card--book:focus-within .purchase-card__book-cover > img {
  filter: saturate(1.08) contrast(1.02);
  transform: scale(1.06);
}

@keyframes purchase-book-card-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (hover: hover) and (pointer: fine) {
  .purchase-card--book:hover .purchase-card__book {
    transform: translateX(-28px) rotate(0.5deg) translateZ(0);
  }

  .purchase-card--book:hover .purchase-card__book-cover {
    box-shadow: -22px 20px 34px rgb(0 0 0 / 26%);
    transform: rotateY(88deg);
  }

  .purchase-card--book:hover .purchase-card__book-cover > img {
    filter: saturate(1.08) contrast(1.02);
    transform: scale(1.06);
  }
}

@media (hover: none), (pointer: coarse) {
  .purchase-card__book-cover {
    transform: rotateY(9deg);
  }
}

@media (max-width: 560px) {
  .purchase-card--book,
  .purchase-card__book-link {
    min-height: 350px;
  }

  .purchase-card__book-link {
    padding: 20px 8px 38px;
  }

  .purchase-card__book {
    width: 190px;
    height: 285px;
  }

  .purchase-card.purchase-card--book-showcase,
  .purchase-card--book-showcase .purchase-card__book-link {
    min-height: 385px;
  }

  .purchase-card--book-showcase .purchase-card__book {
    width: 210px;
    height: 315px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .purchase-card--book,
  .purchase-card__book,
  .purchase-card__book-cover,
  .purchase-card__book-cover > img {
    animation: none;
    transition: none;
  }

  .purchase-card--book:hover .purchase-card__book,
  .purchase-card--book:focus-within .purchase-card__book,
  .purchase-card--book:hover .purchase-card__book-cover,
  .purchase-card--book:focus-within .purchase-card__book-cover {
    transform: none;
  }
}
</style>
