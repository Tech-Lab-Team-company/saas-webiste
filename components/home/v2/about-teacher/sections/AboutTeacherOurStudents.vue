<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'


import { baseUrl } from '~/constant/baseUrl'
import type AboutUsInterface from '~/types/about_us_interface'
import { SectionTypeEnum } from '~/components/Home/home/enum/section_type_enum'
import { getWebDomain } from '~/constant/webDomain'


interface ApiResponse<T> {
  data: T[]
  message: string
  status: number
}



const { data: topStudents } = await useAsyncData(
  'TopStudents',
  async () => {
    const response = await $fetch<ApiResponse<AboutUsInterface>>(
      `${baseUrl}/fetch_website_sections`,
      {
        method: 'POST',
        headers: {
          'Accept-Language': 'ar',
          'web-domain': getWebDomain(),
        },
        body: {
          type: SectionTypeEnum.TopStudents,
        },
      },
    )

    return response?.data?.[response.data.length - 1] ?? null
  },
)



const { data: aboutusOpinions } = await useAsyncData(
  'AboutOpinions',
  async () => {
    const response = await $fetch<ApiResponse<AboutUsInterface>>(
      `${baseUrl}/fetch_website_sections`,
      {
        method: 'POST',
        headers: {
          'Accept-Language': 'ar',
          'web-domain': getWebDomain(),
        },
        body: {
          type: SectionTypeEnum.Opinions,
        },
      },
    )

    return response?.data?.[response.data.length - 1] ?? null
  },
)



const modules = [Navigation, Pagination, Autoplay]

const swiperOptions = {
  modules,

  slidesPerView: 3,

  spaceBetween: 24,

  loop: true,

  grabCursor: true,

  navigation: true,

  pagination: {
    clickable: true,
    dynamicBullets: true,
  },

  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 14,
    },

    640: {
      slidesPerView: 1.5,
      spaceBetween: 18,
    },

    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },

    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },

    1280: {
      slidesPerView: 3,
      spaceBetween: 26,
    },
  },
}


const getStudentImage = (student: any) => {
  return (
    student?.media?.[0]?.file ||
    student?.icon ||
    '/images/placeholder-user.webp'
  )
}

const getStudentAlt = (student: any) => {
  return (
    student?.media?.[0]?.alt ||
    student?.title ||
    'الطالب'
  )
}

const getStudentLink = (student: any) => {
  return student?.media?.[0]?.link || null
}

const getStudentMediaTitle = (student: any) => {
  return (
    student?.media?.[0]?.title ||
    student?.title ||
    ''
  )
}
</script>

<template>
  <div class="home-sections">



    <section
      v-if="topStudents"
      class="top-students-section"
      dir="rtl"
    >
      <!-- Section Header -->
      <div class="section-container">

        <div class="section-heading">

          <div class="section-heading__content">

            <span class="section-eyebrow">
              {{ topStudents?.subtitle || 'نماذج متميزة' }}
            </span>

            <h2 class="section-title">
              {{ topStudents?.title }}
            </h2>

            <p
              v-if="topStudents?.description"
              class="section-description"
            >
              {{ topStudents.description }}
            </p>

          </div>

          <div class="section-heading__decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </div>

      <div class="students-slider-container">

        <Swiper
          v-if="topStudents?.children?.length"
          v-bind="swiperOptions"
          class="students-swiper"
        >

          <SwiperSlide
            v-for="(student, index) in topStudents.children"
            :key="student.id"
            class="student-slide"
          >

            <article class="student-card">

              <div class="student-card__media">

                <img
                  :src="getStudentImage(student)"
                  :alt="getStudentAlt(student)"
                  class="student-card__image"
                  loading="lazy"
                />

                <div class="student-card__overlay"></div>

                <div class="student-card__number">
                  <span>
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                </div>

                <div
                  v-if="getStudentLink(student)"
                  class="student-card__media-badge"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M8 5v14l11-7z"
                    />
                  </svg>

                  <span>فيديو</span>
                </div>

              </div>

              <div class="student-card__content">

                <div class="student-card__meta">

                  <span class="student-card__category">
                    {{ student?.type ? `طالب ${student.type}` : 'طالب متميز' }}
                  </span>

                  <span class="student-card__line"></span>

                </div>

                <h3 class="student-card__title">
                  {{ student?.title }}
                </h3>

                <p
                  v-if="student?.subtitle"
                  class="student-card__subtitle"
                >
                  {{ student.subtitle }}
                </p>

                <p
                  v-if="student?.description"
                  class="student-card__description"
                >
                  {{ student.description }}
                </p>

                <div class="student-card__footer">

                  <span
                    v-if="getStudentMediaTitle(student)"
                    class="student-card__media-title"
                  >
                    {{ getStudentMediaTitle(student) }}
                  </span>

                  <a
                    v-if="getStudentLink(student)"
                    :href="getStudentLink(student)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="student-card__link"
                  >
                    <span>شاهد القصة</span>

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </a>

                </div>

              </div>

            </article>

          </SwiperSlide>

        </Swiper>


        <div
          v-else
          class="students-empty"
        >
          <div class="students-empty__icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
            </svg>
          </div>

          <h3>لا توجد بيانات حالياً</h3>

          <p>
            سيتم عرض الطلاب المتميزين هنا.
          </p>
        </div>

      </div>
    </section>




    <section
      v-if="aboutusOpinions"
      class="opinions-section"
      dir="rtl"
    >

      <div class="section-container">

        <div class="section-heading">

          <div class="section-heading__content">

            <span class="section-eyebrow">
              آراء وتجارب
            </span>

            <h2 class="section-title">
              {{ aboutusOpinions?.title }}
            </h2>

            <p
              v-if="aboutusOpinions?.description"
              class="section-description"
            >
              {{ aboutusOpinions.description }}
            </p>

          </div>

          <div class="section-heading__decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </div>

      <div class="students-slider-container">

        <Swiper
          v-if="aboutusOpinions?.children?.length"
          v-bind="swiperOptions"
          class="opinions-swiper"
        >

          <SwiperSlide
            v-for="opinion in aboutusOpinions.children"
            :key="opinion.id"
          >

            <article class="opinion-card">

              <div class="opinion-card__top">

                <div class="opinion-card__avatar-wrapper">

                  <img
                    :src="
                      opinion?.icon ||
                      opinion?.media?.[0]?.file ||
                      '/images/placeholder-user.webp'
                    "
                    :alt="opinion?.title || 'رأي'"
                    class="opinion-card__avatar"
                    loading="lazy"
                  />

                </div>

                <div class="opinion-card__identity">

                  <h3>
                    {{ opinion?.title }}
                  </h3>

                  <span>
                    {{ opinion?.subtitle }}
                  </span>

                </div>

                <div class="opinion-card__quote">
                  “
                </div>

              </div>

              <div class="opinion-card__body">

                <p>
                  {{ opinion?.description }}
                </p>

              </div>

              <div class="opinion-card__bottom">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </article>

          </SwiperSlide>

        </Swiper>

      </div>
    </section>

  </div>
</template>

<style scoped>


.home-sections {
  --section-blue: var(--home-v2-blue, #155eef);
  --section-blue-dark: #1047b8;
  --section-blue-light: var(--home-v2-blue-light, #eef4ff);

  --section-ink: var(--home-v2-ink, #10213f);
  --section-muted: var(--home-v2-muted, #667085);
  --section-line: var(--home-v2-line, #e7ebf3);

  width: 100%;
  overflow: hidden;
  background: #fff;
}




.top-students-section,
.opinions-section {
  position: relative;
  padding: 90px 0;
}

.top-students-section {
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(21, 94, 239, 0.07),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #f9fbff 0%,
      #ffffff 100%
    );
}

.opinions-section {
  background: #fff;
}



.section-container,
.students-slider-container {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
}



.section-heading {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 30px;

  margin-bottom: 45px;
}

.section-heading__content {
  max-width: 720px;
}

.section-eyebrow {
  display: inline-flex;
  align-items: center;

  min-height: 30px;

  margin-bottom: 12px;
  padding: 6px 13px;

  border: 1px solid rgba(21, 94, 239, 0.12);
  border-radius: 999px;

  background: var(--section-blue-light);

  color: var(--section-blue);

  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.section-title {
  margin: 0;

  color: var(--section-ink);

  font-family: var(--home-v2-heading, inherit);
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.section-description {
  max-width: 650px;

  margin: 14px 0 0;

  color: var(--section-muted);

  font-size: 15px;
  line-height: 1.9;
}

.section-heading__decoration {
  display: flex;
  align-items: center;
  gap: 6px;

  padding-bottom: 8px;
}

.section-heading__decoration span {
  display: block;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: var(--section-blue);

  opacity: 0.25;
}

.section-heading__decoration span:nth-child(2) {
  width: 28px;
  border-radius: 999px;
  opacity: 0.65;
}

.section-heading__decoration span:nth-child(3) {
  opacity: 1;
}



.students-swiper,
.opinions-swiper {
  width: 100%;
  overflow: visible;

  padding: 10px 4px 65px;
}

.student-slide {
  height: auto;
}




.student-card {
  position: relative;

  height: 100%;

  overflow: hidden;

  border: 1px solid var(--section-line);
  border-radius: 20px;

  background: #fff;

  box-shadow:
    0 8px 30px rgba(16, 33, 63, 0.055),
    0 2px 8px rgba(16, 33, 63, 0.025);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.student-card:hover {
  border-color: rgba(21, 94, 239, 0.2);

  box-shadow:
    0 22px 55px rgba(16, 33, 63, 0.12),
    0 5px 15px rgba(21, 94, 239, 0.07);

  transform: translateY(-7px);
}




.student-card__media {
  position: relative;

  height: 265px;

  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      #eef4ff,
      #dfe9fb
    );
}

.student-card__image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.5s ease;
}

.student-card:hover .student-card__image {
  transform: scale(1.045);
}

.student-card__overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      180deg,
      rgba(16, 33, 63, 0.02) 35%,
      rgba(16, 33, 63, 0.5) 100%
    );

  pointer-events: none;
}




.student-card__number {
  position: absolute;

  top: 16px;
  right: 16px;

  display: grid;

  width: 42px;
  height: 42px;

  place-items: center;

  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.9);

  color: var(--section-blue);

  box-shadow: 0 7px 20px rgba(16, 33, 63, 0.12);

  backdrop-filter: blur(10px);
}

.student-card__number span {
  font-size: 12px;
  font-weight: 900;
}



.student-card__media-badge {
  position: absolute;

  bottom: 15px;
  right: 15px;

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 7px 11px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;

  background: rgba(16, 33, 63, 0.78);

  color: #fff;

  font-size: 10px;
  font-weight: 800;

  backdrop-filter: blur(8px);
}



.student-card__content {
  display: flex;
  flex-direction: column;

  min-height: 245px;

  padding: 22px;
}

.student-card__meta {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 10px;
}

.student-card__category {
  color: var(--section-blue);

  font-size: 10px;
  font-weight: 900;
}

.student-card__line {
  width: 28px;
  height: 2px;

  border-radius: 999px;

  background: var(--section-blue);

  opacity: 0.3;
}

.student-card__title {
  margin: 0;

  color: var(--section-ink);

  font-size: 21px;
  font-weight: 900;
  line-height: 1.35;
}

.student-card__subtitle {
  margin: 5px 0 0;

  color: var(--section-blue);

  font-size: 13px;
  font-weight: 800;
}

.student-card__description {
  display: -webkit-box;

  overflow: hidden;

  margin: 12px 0 20px;

  color: var(--section-muted);

  font-size: 13px;
  line-height: 1.9;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}



.student-card__footer {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-top: auto;
  padding-top: 16px;

  border-top: 1px solid #eef1f6;
}

.student-card__media-title {
  max-width: 45%;

  overflow: hidden;

  color: #8a94a6;

  font-size: 10px;
  font-weight: 700;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-card__link {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  min-height: 38px;

  padding: 8px 14px;

  border-radius: 10px;

  background: var(--section-blue);

  color: #fff;

  box-shadow:
    0 7px 18px rgba(21, 94, 239, 0.18);

  font-size: 11px;
  font-weight: 900;

  text-decoration: none;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.student-card__link svg {
  transition: transform 0.2s ease;
}

.student-card__link:hover {
  background: var(--section-blue-dark);

  box-shadow:
    0 10px 25px rgba(21, 94, 239, 0.25);

  transform: translateY(-2px);
}

.student-card__link:hover svg {
  transform: translateX(-3px);
}



:deep(.students-swiper .swiper-button-next),
:deep(.students-swiper .swiper-button-prev),
:deep(.opinions-swiper .swiper-button-next),
:deep(.opinions-swiper .swiper-button-prev) {
  width: 44px;
  height: 44px;

  margin-top: 0;

  border: 1px solid rgba(21, 94, 239, 0.12);
  border-radius: 12px;

  background: #fff;

  color: var(--section-blue);

  box-shadow:
    0 8px 25px rgba(16, 33, 63, 0.1);

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

:deep(.students-swiper .swiper-button-next:hover),
:deep(.students-swiper .swiper-button-prev:hover),
:deep(.opinions-swiper .swiper-button-next:hover),
:deep(.opinions-swiper .swiper-button-prev:hover) {
  background: var(--section-blue);
  color: #fff;

  transform: translateY(-2px);
}

:deep(.students-swiper .swiper-button-next::after),
:deep(.students-swiper .swiper-button-prev::after),
:deep(.opinions-swiper .swiper-button-next::after),
:deep(.opinions-swiper .swiper-button-prev::after) {
  font-size: 15px;
  font-weight: 900;
}




:deep(.swiper-pagination) {
  bottom: 15px;
}

:deep(.swiper-pagination-bullet) {
  width: 7px;
  height: 7px;

  background: #cfd6e2;

  opacity: 1;

  transition:
    width 0.2s ease,
    background-color 0.2s ease;
}

:deep(.swiper-pagination-bullet-active) {
  width: 24px;

  border-radius: 999px;

  background: var(--section-blue);
}



.students-empty {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-height: 280px;

  padding: 40px;

  border: 1px dashed #d9e0ec;
  border-radius: 20px;

  background: #fafcff;

  text-align: center;
}

.students-empty__icon {
  display: grid;

  width: 70px;
  height: 70px;

  margin-bottom: 15px;

  place-items: center;

  border-radius: 18px;

  background: var(--section-blue-light);

  color: var(--section-blue);
}

.students-empty h3 {
  margin: 0;

  color: var(--section-ink);

  font-size: 18px;
  font-weight: 900;
}

.students-empty p {
  margin: 7px 0 0;

  color: var(--section-muted);

  font-size: 13px;
}




.opinion-card {
  position: relative;

  min-height: 275px;

  padding: 25px;

  overflow: hidden;

  border: 1px solid var(--section-line);
  border-radius: 20px;

  background: #fff;

  box-shadow:
    0 8px 30px rgba(16, 33, 63, 0.05);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.opinion-card:hover {
  border-color: rgba(21, 94, 239, 0.18);

  box-shadow:
    0 20px 50px rgba(16, 33, 63, 0.1);

  transform: translateY(-6px);
}

.opinion-card::before {
  position: absolute;

  top: 0;
  right: 0;

  width: 100%;
  height: 4px;

  background: var(--section-blue);

  content: "";
}

.opinion-card__top {
  display: flex;

  align-items: center;

  gap: 13px;

  margin-bottom: 24px;
}

.opinion-card__avatar-wrapper {
  width: 56px;
  height: 56px;

  flex: 0 0 56px;

  padding: 3px;

  border-radius: 50%;

  background: var(--section-blue-light);
}

.opinion-card__avatar {
  width: 100%;
  height: 100%;

  border: 2px solid #fff;
  border-radius: 50%;

  object-fit: cover;
}

.opinion-card__identity {
  flex: 1;
  min-width: 0;
}

.opinion-card__identity h3 {
  overflow: hidden;

  margin: 0;

  color: var(--section-ink);

  font-size: 15px;
  font-weight: 900;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.opinion-card__identity span {
  display: block;

  margin-top: 4px;

  color: var(--section-blue);

  font-size: 11px;
  font-weight: 700;
}

.opinion-card__quote {
  color: var(--section-blue);

  font-family: Georgia, serif;

  font-size: 55px;
  font-weight: 900;

  line-height: 0.8;

  opacity: 0.15;
}

.opinion-card__body {
  position: relative;

  padding-right: 12px;

  border-right: 3px solid var(--section-blue);
}

.opinion-card__body p {
  margin: 0;

  color: var(--section-muted);

  font-size: 13px;
  line-height: 2;
}

.opinion-card__bottom {
  position: absolute;

  right: 25px;
  bottom: 22px;

  display: flex;

  gap: 5px;
}

.opinion-card__bottom span {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: var(--section-blue);

  opacity: 0.25;
}

.opinion-card__bottom span:nth-child(2) {
  opacity: 0.55;
}

.opinion-card__bottom span:nth-child(3) {
  opacity: 1;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 768px) {
  .top-students-section,
  .opinions-section {
    padding: 65px 0;
  }

  .section-container,
  .students-slider-container {
    width: min(100% - 28px, 1180px);
  }

  .section-heading {
    align-items: flex-start;

    margin-bottom: 30px;
  }

  .section-heading__decoration {
    display: none;
  }

  .section-title {
    font-size: 28px;
  }

  .section-description {
    font-size: 13px;
  }

  .student-card__media {
    height: 240px;
  }

  .student-card__content {
    min-height: 230px;
    padding: 18px;
  }

  :deep(.students-swiper .swiper-button-next),
  :deep(.students-swiper .swiper-button-prev),
  :deep(.opinions-swiper .swiper-button-next),
  :deep(.opinions-swiper .swiper-button-prev) {
    display: none;
  }
}

@media (max-width: 480px) {
  .top-students-section,
  .opinions-section {
    padding: 50px 0;
  }

  .section-title {
    font-size: 24px;
  }

  .section-eyebrow {
    font-size: 10px;
  }

  .student-card__media {
    height: 230px;
  }

  .student-card {
    border-radius: 16px;
  }

  .student-card__content {
    min-height: 220px;
  }

  .student-card__title {
    font-size: 19px;
  }

  .student-card__description {
    font-size: 12px;
  }

  .opinion-card {
    min-height: 260px;
    padding: 20px;
  }
}



@media (prefers-reduced-motion: reduce) {
  .student-card,
  .student-card__image,
  .student-card__link,
  .student-card__link svg,
  .opinion-card {
    transition: none;
  }
}
</style>