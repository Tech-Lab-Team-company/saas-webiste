<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'


import { baseUrl } from '~/constant/baseUrl'
import type AboutUsInterface from '~/types/about_us_interface'
import { SectionTypeEnum } from '~/components/Home/home/enum/section_type_enum'
import { getWebDomain } from '~/constant/webDomain'
import { HomePageApi } from '~/features/HomePageFeature/api/homePageApi'
import {
  mapHomeCourseStages,
  mapHomeCourseYears,
} from '~/features/HomePageFeature/mappers/homePageMapper'
import type {
  HomeCourseStageViewModel,
  HomeCourseTabViewModel,
} from '~/features/HomePageFeature/models/HomePageViewModel'


interface ApiResponse<T> {
  data: T[]
  message: string
  status: number
}

interface TopStudentMedia {
  id: number
  file: string
  alt: string
}

interface TopStudent {
  id: number
  title: string
  subtitle: string
  description: string
  order: number
  year_id: number
  media: TopStudentMedia[]
}

interface TopStudentsStage extends HomeCourseStageViewModel {
  years: HomeCourseTabViewModel[]
}

const webDomain = getWebDomain()
const homeApi = new HomePageApi(webDomain)
const { isDark } = useAppTheme()

const {
  data: topStudentsStages,
  pending: topStudentsFiltersPending,
  error: topStudentsFiltersError,
  refresh: refreshTopStudentsFilters,
} = await useAsyncData<TopStudentsStage[]>(
  `top-students-taxonomy:${webDomain}`,
  async () => {
    const stages = mapHomeCourseStages(await homeApi.fetchStages())
    const yearResults = await Promise.allSettled(
      stages.map(async (stage) => ({
        stage,
        years: mapHomeCourseYears(stage, await homeApi.fetchStageYears(stage.id)),
      })),
    )

    if (stages.length && yearResults.every((result) => result.status === 'rejected')) {
      const failure = yearResults.find(
        (result): result is PromiseRejectedResult => result.status === 'rejected',
      )
      if (failure) throw failure.reason
    }

    return yearResults.flatMap((result, index) => {
      if (result.status === 'fulfilled') {
        return [{ ...result.value.stage, years: result.value.years }]
      }

      const stage = stages[index]
      return stage ? [{ ...stage, years: [] }] : []
    })
  },
  { default: () => [], dedupe: 'defer' },
)

const selectedTopStudentsStageId = ref<number | null>(null)
const selectedTopStudentsYearId = ref<number | null>(null)
const selectedTopStudentsStage = computed(() =>
  topStudentsStages.value.find(
    (stage) => stage.id === selectedTopStudentsStageId.value,
  ) ?? null,
)

const selectedTopStudentsYear = computed(() =>
  selectedTopStudentsStage.value?.years.find(
    (year) => year.yearId === selectedTopStudentsYearId.value,
  ) ?? null,
)

const currentTopStudentsFilterLabel = computed(() => {
  if (selectedTopStudentsYear.value) return selectedTopStudentsYear.value.label
  if (selectedTopStudentsStage.value) return selectedTopStudentsStage.value.label
  return 'جميع المراحل والصفوف'
})

watch(
  topStudentsStages,
  (stages) => {
    if (!stages.length) {
      selectedTopStudentsStageId.value = null
      selectedTopStudentsYearId.value = null
      return
    }

    const currentStage = stages.find(
      (stage) => stage.id === selectedTopStudentsStageId.value,
    ) ?? stages.find((stage) => stage.years.length) ?? stages[0]
    selectedTopStudentsStageId.value = currentStage?.id ?? null

    const currentYearIsValid = currentStage?.years.some(
      (year) => year.yearId === selectedTopStudentsYearId.value,
    )
    if (!currentYearIsValid) {
      selectedTopStudentsYearId.value = currentStage?.years[0]?.yearId ?? null
    }
  },
  { immediate: true },
)

const selectTopStudentsStage = (stage: TopStudentsStage) => {
  if (!stage.years.length) return
  if (
    selectedTopStudentsStageId.value === stage.id &&
    selectedTopStudentsYearId.value !== null
  ) return
  selectedTopStudentsStageId.value = stage.id
  selectedTopStudentsYearId.value = stage.years[0]?.yearId ?? null
}

const selectTopStudentsYear = (yearId: number | null) => {
  selectedTopStudentsYearId.value = yearId
}

const showAllTopStudents = () => {
  selectedTopStudentsStageId.value = null
  selectedTopStudentsYearId.value = null
}

const topStudentsYearLabels = computed(() => {
  const labels = new Map<number, string>()
  topStudentsStages.value.forEach((stage) => {
    stage.years.forEach((year) => labels.set(year.yearId, year.label))
  })
  return labels
})

const getStudentYearLabel = (student: TopStudent) =>
  topStudentsYearLabels.value.get(student.year_id) || `المستوى ${student.year_id}`

const {
  data: topStudents,
  pending: topStudentsPending,
  error: topStudentsError,
  refresh: refreshTopStudents,
} = await useAsyncData<TopStudent[]>(
  `top-students:${webDomain}`,
  async () => {
    const response = await $fetch<TopStudent[] | ApiResponse<TopStudent>>(
      `${baseUrl}/fetch_top_students`,
      {
        method: 'POST',
        headers: {
          'Accept-Language': 'ar',
          'web-domain': webDomain,
        },
        body: selectedTopStudentsYearId.value
          ? { year_id: selectedTopStudentsYearId.value }
          : {},
      },
    )

    const students = Array.isArray(response) ? response : response?.data ?? []
    return [...students].sort((first, second) => first.order - second.order)
  },
  {
    default: () => [],
    watch: [selectedTopStudentsYearId],
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

const studentSwiperOptions = computed(() => ({
  modules: [Navigation, Pagination],
  slidesPerView: 'auto',
  centeredSlides: topStudents.value.length > 5,
  centerInsufficientSlides: false,
  spaceBetween: 14,
  initialSlide: 0,
  loop: topStudents.value.length > 5,
  rewind: topStudents.value.length > 1 && topStudents.value.length <= 5,
  allowTouchMove: topStudents.value.length > 5,
  grabCursor: topStudents.value.length > 5,
  slideToClickedSlide: topStudents.value.length > 5,
  navigation: topStudents.value.length > 5,
  pagination: topStudents.value.length > 5
    ? { clickable: true, dynamicBullets: true }
    : false,
  watchOverflow: true,
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
  breakpoints: {
    320: { spaceBetween: 10 },
    640: { spaceBetween: 14 },
    1024: { spaceBetween: 18 },
  },
}))

const topStudentsSwiperKey = computed(() => [
  selectedTopStudentsStageId.value ?? 'stage',
  selectedTopStudentsYearId.value ?? 'all',
  topStudents.value.map((student) => student.id).join('-'),
].join(':'))

const getStudentRank = (_student: TopStudent, index: number) => index + 1

const getStudentRankLabel = (rank: number) => {
  if (rank === 1) return 'المركز الأول'
  if (rank === 2) return 'المركز الثاني'
  if (rank === 3) return 'المركز الثالث'
  return `المركز ${rank}`
}

const getStudentRankClass = (rank: number) =>
  `student-podium--rank-${Math.min(rank, 4)}`


const getStudentImage = (student: any) => {
  return (
    student?.media?.[0]?.file ||
    '/eduhub/assets/student profile-DGGWKr-W.png'
  )
}

const getStudentAlt = (student: any) => {
  return (
    student?.media?.[0]?.alt ||
    student?.title ||
    'الطالب'
  )
}

</script>

<template>
  <div :class="['home-sections', { 'home-sections--dark': isDark }]">



    <section class="top-students-section" dir="rtl" aria-labelledby="top-students-title">
      <div class="top-students-board">
        <span class="top-students-board__glow top-students-board__glow--right" aria-hidden="true" />
        <span class="top-students-board__glow top-students-board__glow--left" aria-hidden="true" />

        <header class="top-students-board__header">
          <div class="top-students-trophy" aria-hidden="true">
            <span class="pi pi-trophy" />
          </div>

          <div class="top-students-board__intro">
            <span class="top-students-board__eyebrow">
              <span class="pi pi-sparkles" aria-hidden="true" />
              لوحة الشرف
            </span>
            <h2 id="top-students-title">طلابنا المتفوقون</h2>
            <p>نفخر بطلابنا المتميزين الذين حققوا إنجازات رائعة في مسيرتهم التعليمية.</p>
          </div>

          <div v-if="topStudents.length" class="top-students-count" aria-label="عدد الطلاب المتفوقين">
            <span>طالب<br />معروض</span>
            <strong>{{ topStudents.length }}</strong>
          </div>
        </header>

        <div v-if="topStudentsFiltersPending" class="top-students-filters-loading" role="status">
          <span class="pi pi-spin pi-spinner" aria-hidden="true" />
          جاري تحميل المراحل والسنوات الدراسية...
        </div>

        <div v-else-if="topStudentsFiltersError" class="top-students-filters-error" role="alert">
          <span>تعذر تحميل فلاتر السنوات الدراسية.</span>
          <button type="button" @click="refreshTopStudentsFilters()">إعادة المحاولة</button>
        </div>

        <div v-else-if="topStudentsStages.length" class="top-students-filters">
          <div class="top-students-filters__header">
            <div class="top-students-filters__title">
              <span class="pi pi-filter" aria-hidden="true" />
              <span>
                <strong>فلترة لوحة الشرف</strong>
                <small>اختر المرحلة أولاً، ثم اختر الصف الدراسي.</small>
              </span>
            </div>

            <button
              type="button"
              class="top-students-filter-all"
              :class="{ active: selectedTopStudentsStageId === null }"
              :aria-pressed="selectedTopStudentsStageId === null"
              @click="showAllTopStudents"
            >
              <span class="pi pi-users" aria-hidden="true" />
              عرض جميع الطلاب
            </button>
          </div>

          <div class="top-students-filter-steps">
            <div class="top-students-filter-group">
              <div class="top-students-filter-label">
                <b>1</b>
                <span>
                  <strong>المرحلة التعليمية</strong>
                  <small>ابدأ باختيار المرحلة</small>
                </span>
              </div>

              <div class="top-students-filter-options" role="group" aria-label="اختر المرحلة التعليمية">
                <button
                  v-for="stage in topStudentsStages"
                  :key="stage.id"
                  type="button"
                  :class="{ active: selectedTopStudentsStage?.id === stage.id }"
                  :disabled="!stage.years.length"
                  :aria-pressed="selectedTopStudentsStage?.id === stage.id"
                  @click="selectTopStudentsStage(stage)"
                >
                  <!-- <span v-if="selectedTopStudentsStage?.id === stage.id" class="pi pi-check" aria-hidden="true" /> -->
                  <span>{{ stage.label }}</span>
                  <small>{{ stage.years.length }} صفوف</small>
                </button>
              </div>
            </div>

            <Transition name="students-filter-swap" mode="out-in">
              <div
                v-if="selectedTopStudentsStage"
                :key="selectedTopStudentsStage.id"
                class="top-students-filter-group"
              >
                <div class="top-students-filter-label">
                  <b>2</b>
                  <span>
                    <strong>الصف الدراسي</strong>
                    <small>حدد الصف لعرض المتفوقين</small>
                  </span>
                </div>

                <div class="top-students-filter-options" role="group" aria-label="اختر الصف الدراسي">
                  <button
                    v-for="year in selectedTopStudentsStage.years"
                    :key="year.key"
                    type="button"
                    :class="{ active: selectedTopStudentsYearId === year.yearId }"
                    :aria-pressed="selectedTopStudentsYearId === year.yearId"
                    @click="selectTopStudentsYear(year.yearId)"
                  >
                    <!-- <span v-if="selectedTopStudentsYearId === year.yearId" class="pi pi-check" aria-hidden="true" /> -->
                    {{ year.label }}
                  </button>
                </div>
              </div>

              <div v-else key="all-students" class="top-students-filter-group top-students-filter-group--hint">
                <div class="top-students-filter-label">
                  <b>2</b>
                  <span>
                    <strong>الصف الدراسي</strong>
                    <small>اختر مرحلة لتظهر الصفوف المتاحة</small>
                  </span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="top-students-filter-summary" role="status" aria-live="polite">
            <span class="pi pi-eye" aria-hidden="true" />
            <span>يتم الآن عرض:</span>
            <strong>{{ currentTopStudentsFilterLabel }}</strong>
            <span v-if="topStudentsPending" class="top-students-filter-summary__count">
              <span class="pi pi-spin pi-spinner" aria-hidden="true" />
              جاري التحديث
            </span>
            <span v-else class="top-students-filter-summary__count">
              {{ topStudents.length }} طالب
            </span>
          </div>
        </div>

        <div class="students-slider-container">
          <div v-if="topStudentsPending" class="students-loading" aria-label="جارٍ تحميل الطلاب المتفوقين">
            <span v-for="item in 5" :key="item" />
          </div>

          <div v-else-if="topStudentsError" class="students-empty students-empty--error" role="alert">
            <div class="students-empty__icon"><span class="pi pi-exclamation-circle" /></div>
            <h3>تعذر تحميل الطلاب المتفوقين</h3>
            <p>حدث خطأ مؤقت أثناء تحميل البيانات.</p>
            <button type="button" @click="refreshTopStudents">إعادة المحاولة</button>
          </div>

          <Swiper
            v-else-if="topStudents.length"
            :key="topStudentsSwiperKey"
            v-bind="studentSwiperOptions"
            :class="[
              'students-swiper',
              `students-swiper--count-${Math.min(topStudents.length, 5)}`,
              { 'students-swiper--few': topStudents.length <= 5 },
            ]"
          >
            <SwiperSlide
              v-for="(student, index) in topStudents"
              :key="student.id"
              class="student-slide"
            >
              <article
                :class="[
                  'student-podium',
                  getStudentRankClass(getStudentRank(student, index)),
                ]"
              >
                <span class="student-podium__rank" :aria-label="getStudentRankLabel(getStudentRank(student, index))">
                  {{ getStudentRank(student, index) }}
                </span>

                <div class="student-podium__portrait">
                  <img
                    :src="getStudentImage(student)"
                    :alt="getStudentAlt(student)"
                    loading="lazy"
                  />
                  <span class="student-podium__shine" aria-hidden="true" />
                </div>

                <span class="student-podium__position">
                  {{ getStudentRankLabel(getStudentRank(student, index)) }}
                </span>
                <h3 class="student-podium__title">{{ student.title }}</h3>
                <p v-if="student.subtitle" class="student-podium__subtitle">{{ student.subtitle }}</p>
                <p v-if="student.description" class="student-podium__description">
                  {{ student.description }}
                </p>

                <footer class="student-podium__footer">
                  <span class="student-podium__year">{{ getStudentYearLabel(student) }}</span>
                  <span class="student-podium__honor" aria-hidden="true">
                    <span class="pi pi-trophy" />
                  </span>
                </footer>
              </article>
            </SwiperSlide>
          </Swiper>

          <div v-else class="students-empty">
            <div class="students-empty__icon"><span class="pi pi-users" /></div>
            <h3>لا توجد بيانات حالياً</h3>
            <p>سيتم عرض الطلاب المتميزين هنا قريبًا.</p>
          </div>
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
  isolation: isolate;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(21, 94, 239, 0.11),
      transparent 32%
    ),
    linear-gradient(
      180deg,
      #f9fbff 0%,
      #ffffff 100%
    );
}

.top-students-section::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image: radial-gradient(rgba(21, 94, 239, 0.14) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.32;
  mask-image: linear-gradient(90deg, transparent, #000 48%, transparent);
  content: "";
}

.top-students-section__orb {
  position: absolute;
  z-index: -1;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--section-blue) 11%, transparent);
  filter: blur(2px);
  pointer-events: none;
  animation: student-orb-drift 9s ease-in-out infinite alternate;
}

.top-students-section__orb--one { top: -180px; inset-inline-start: -80px; }
.top-students-section__orb--two { right: auto; bottom: -210px; inset-inline-end: -70px; animation-delay: -4s; }

@keyframes student-orb-drift {
  to { transform: translate3d(22px, 18px, 0) scale(1.08); }
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

.top-students-heading { align-items: center; }

.top-students-count {
  display: flex;
  min-width: 138px;
  min-height: 78px;
  align-items: center;
  gap: 11px;
  padding: 13px 16px;
  border: 1px solid color-mix(in srgb, var(--section-blue) 16%, transparent);
  border-radius: 18px;
  background: rgb(255 255 255 / 76%);
  box-shadow: 0 18px 45px -32px rgba(16, 33, 63, 0.5);
  backdrop-filter: blur(14px);
}

.top-students-count strong { color: var(--section-blue); font-size: 28px; line-height: 1; }
.top-students-count span { max-width: 54px; color: var(--section-muted); font-size: 10px; font-weight: 800; line-height: 1.5; }

.top-students-filters {
  display: grid;
  gap: 16px;
  margin: -18px 0 28px;
  padding: 18px;
  border: 1px solid var(--section-line);
  border-radius: 20px;
  background: rgb(255 255 255 / 72%);
  box-shadow: 0 22px 55px -44px rgba(16, 33, 63, 0.55);
  backdrop-filter: blur(14px);
}

.top-students-filter-group { display: grid; grid-template-columns: 118px minmax(0, 1fr); align-items: center; gap: 14px; }
.top-students-filter-label { color: var(--section-muted); font-size: 10px; font-weight: 900; }
.top-students-filter-options { display: flex; min-width: 0; flex-wrap: wrap; gap: 8px; }
.top-students-filter-options button {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid var(--section-line);
  border-radius: 11px;
  background: var(--home-v2-surface, #fff);
  color: var(--section-muted);
  font: 800 10px inherit;
  cursor: pointer;
  transition: color .2s ease, border-color .2s ease, background .2s ease, transform .2s ease;
}

.top-students-filter-options button:hover { border-color: color-mix(in srgb, var(--section-blue) 38%, var(--section-line)); color: var(--section-blue); transform: translateY(-1px); }
.top-students-filter-options button.active { border-color: var(--section-blue); background: var(--section-blue); color: #fff; box-shadow: 0 8px 22px -13px var(--section-blue); }
.top-students-filter-options small { display: grid; min-width: 20px; height: 20px; place-items: center; border-radius: 7px; background: color-mix(in srgb, currentColor 10%, transparent); color: inherit; font-size: 8px; }

.top-students-filters-loading,
.top-students-filters-error {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin: -18px 0 28px;
  padding: 14px;
  border: 1px dashed var(--section-line);
  border-radius: 16px;
  color: var(--section-muted);
  font-size: 11px;
  font-weight: 800;
}

.top-students-filters-error button { min-height: 34px; padding: 0 12px; border: 0; border-radius: 8px; background: var(--section-blue); color: #fff; font: 800 10px inherit; cursor: pointer; }
.students-filter-swap-enter-active, .students-filter-swap-leave-active { transition: opacity .18s ease, transform .18s ease; }
.students-filter-swap-enter-from { opacity: 0; transform: translateY(7px); }
.students-filter-swap-leave-to { opacity: 0; transform: translateY(-5px); }

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

.section-eyebrow .pi { margin-inline-end: 6px; font-size: 10px; }

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
  opacity: 0.4;
  transform: translateY(16px) scale(0.98);
  transition: opacity .5s ease, transform .5s cubic-bezier(.22, 1, .36, 1);
}

.student-slide.swiper-slide-visible { opacity: 1; transform: translateY(0) scale(1); }




.student-card {
  position: relative;

  height: 100%;

  overflow: hidden;

  border: 1px solid var(--section-line);
  border-radius: 24px;

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

  transform: translateY(-8px);
}




.student-card__media {
  position: relative;

  height: 285px;

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

  transition: transform 0.7s cubic-bezier(.22, 1, .36, 1), filter .4s ease;
}

.student-card:hover .student-card__image {
  filter: saturate(1.06);
  transform: scale(1.065);
}

.student-card__overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      180deg,
      rgba(16, 33, 63, 0.01) 30%,
      rgba(16, 33, 63, 0.68) 100%
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

.student-card__achievement {
  position: absolute;
  bottom: 16px;
  inset-inline-start: 16px;
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / 25%);
  border-radius: 999px;
  background: rgb(10 24 52 / 72%);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  backdrop-filter: blur(10px);
}

.student-card__achievement .pi { color: #ffd15c; font-size: 10px; }



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

.student-card__year {
  margin-inline-start: auto;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--section-blue-light);
  color: var(--section-blue);
  font-size: 9px;
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

  gap: 10px;

  margin-top: auto;
  padding-top: 16px;

  border-top: 1px solid #eef1f6;
}

.student-card__honor-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, #f5b82e 15%, transparent);
  color: #c58a00;
}

.student-card__honor-icon .pi { font-size: 15px; }
.student-card__footer > div { display: grid; gap: 1px; }
.student-card__footer small { color: var(--section-muted); font-size: 9px; }
.student-card__footer b { color: var(--section-ink); font-size: 11px; }

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

.students-empty button {
  min-height: 40px;
  margin-top: 16px;
  padding: 0 18px;
  border: 0;
  border-radius: 10px;
  background: var(--section-blue);
  color: #fff;
  font: 800 11px inherit;
  cursor: pointer;
}

.students-empty--error .students-empty__icon { color: #c43e3e; background: color-mix(in srgb, #dc4a4a 12%, #fff); }

.students-loading {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  padding-bottom: 65px;
}

.students-loading span {
  min-height: 520px;
  border: 1px solid var(--section-line);
  border-radius: 24px;
  background: linear-gradient(105deg, #f5f7fb 20%, #fff 38%, #f5f7fb 56%);
  background-size: 240% 100%;
  animation: students-shimmer 1.25s linear infinite;
}

@keyframes students-shimmer { to { background-position: -240% 0; } }




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
   TOP STUDENTS — HONOR BOARD
   ========================================================= */

.top-students-section {
  padding: 76px 0;
  background: #f2f5fa;
}

.top-students-section::before {
  display: none;
}

.top-students-board {
  position: relative;
  isolation: isolate;
  /* width: min(1280px, calc(100% - 40px)); */
  margin-inline: auto;
  overflow: hidden;
  padding: 34px 28px 18px;
  border: 1px solid rgb(104 164 255 / 32%);
  border-radius: 22px;
  background:
    radial-gradient(circle at 90% 4%, rgb(48 112 214 / 21%), transparent 28%),
    radial-gradient(circle at 10% 100%, rgb(30 92 187 / 13%), transparent 30%),
    linear-gradient(145deg, #071426 0%, #081a31 52%, #061222 100%);
  box-shadow:
    0 38px 90px -52px rgb(2 10 25 / 82%),
    inset 0 1px 0 rgb(255 255 255 / 5%);
  color: #f6f9ff;
}

/* .top-students-board::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  background-image:
    linear-gradient(rgb(116 168 255 / 3%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(116 168 255 / 3%) 1px, transparent 1px);
  background-size: 34px 34px;
  content: "";
  mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
} */

.top-students-board::after {
  position: absolute;
  z-index: -1;
  inset: 14px;
  border: 1px solid rgb(119 174 255 / 8%);
  border-radius: 15px;
  content: "";
  pointer-events: none;
}

.top-students-board__glow {
  position: absolute;
  z-index: -1;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgb(50 126 246 / 14%);
  filter: blur(35px);
  pointer-events: none;
}

.top-students-board__glow--right { top: -170px; inset-inline-start: -80px; }
.top-students-board__glow--left { bottom: -190px; inset-inline-end: -60px; }

.top-students-board__header {
  position: relative;
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 104px;
  align-items: center;
  gap: 20px;
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.top-students-board__intro {
  text-align: center;
}

.top-students-board__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 7px;
  color: #74acff;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .03em;
}

.top-students-board__intro h2 {
  margin: 0;
  color: #f8fbff;
  font: 900 clamp(29px, 3.4vw, 42px) / 1.25 var(--home-v2-heading, inherit);
  letter-spacing: -.025em;
  text-shadow: 0 8px 24px rgb(0 0 0 / 28%);
}

.top-students-board__intro p {
  margin: 6px 0 0;
  color: #aebbd0;
  font-size: 12px;
  font-weight: 600;
}

.top-students-trophy {
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  justify-self: start;
  border: 1px solid rgb(91 157 255 / 28%);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgb(59 135 255 / 24%), transparent 68%),
    rgb(17 43 76 / 72%);
  box-shadow: 0 16px 38px -20px rgb(60 137 255 / 72%);
  color: #69a7ff;
  animation: honor-trophy-float 4s ease-in-out infinite;
}

.top-students-trophy .pi {
  font-size: 31px;
  filter: drop-shadow(0 5px 12px rgb(47 123 246 / 55%));
}

.top-students-board .top-students-count {
  min-width: 92px;
  min-height: 64px;
  justify-self: end;
  justify-content: center;
  gap: 7px;
  padding: 9px 11px;
  border-color: rgb(93 153 244 / 24%);
  border-radius: 15px;
  background: rgb(19 44 80 / 62%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
}

.top-students-board .top-students-count strong {
  color: #70aaff;
  font-size: 27px;
}

.top-students-board .top-students-count span {
  max-width: 38px;
  color: #9fb0c8;
  font-size: 8px;
  line-height: 1.45;
}

.top-students-board .top-students-filters {
  display: grid;
  width: min(1080px, calc(100% - 64px));
  gap: 13px;
  margin: 26px auto 4px;
  padding: 16px;
  border: 1px solid rgb(119 163 224 / 18%);
  border-radius: 18px;
  background: rgb(9 24 44 / 88%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 4%),
    0 20px 44px -34px #000;
  backdrop-filter: blur(16px);
}

.top-students-filters__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 2px;
}

.top-students-filters__title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #edf4ff;
  text-align: start;
}

.top-students-filters__title > .pi {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  border: 1px solid rgb(103 164 255 / 24%);
  border-radius: 10px;
  background: rgb(75 139 236 / 13%);
  color: #70aaff;
  font-size: 14px;
}

.top-students-filters__title > span:last-child {
  display: grid;
  gap: 2px;
}

.top-students-filters__title strong {
  font-size: 13px;
  font-weight: 900;
}

.top-students-filters__title small {
  color: #8799b2;
  font-size: 9px;
  font-weight: 700;
}

.top-students-filter-all {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 7px;
  padding: 0 13px;
  border: 1px solid rgb(111 164 240 / 20%);
  border-radius: 10px;
  background: rgb(16 38 66 / 78%);
  color: #aebed4;
  font-size: 10px;
  font-weight: 850;
  cursor: pointer;
  transition: border-color .25s ease, background-color .25s ease, color .25s ease, transform .25s ease;
}

.top-students-filter-all:hover {
  border-color: rgb(108 166 255 / 48%);
  color: #fff;
  transform: translateY(-1px);
}

.top-students-filter-all.active {
  border-color: #68a4ff;
  background: rgb(78 142 238 / 18%);
  color: #8fbdff;
}

.top-students-filter-steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.top-students-board .top-students-filter-group {
  display: grid;
  align-content: start;
  gap: 11px;
  min-width: 0;
  padding: 12px;
  border: 1px solid rgb(115 162 228 / 12%);
  border-radius: 13px;
  background: rgb(14 31 55 / 66%);
}

.top-students-board .top-students-filter-group--hint {
  opacity: .68;
}

.top-students-board .top-students-filter-label {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #8fa0b8;
  text-align: start;
}

.top-students-board .top-students-filter-label b {
  display: grid;
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  place-items: center;
  border: 1px solid rgb(108 166 255 / 28%);
  border-radius: 50%;
  background: rgb(75 139 236 / 15%);
  color: #7caeff;
  font-size: 10px;
  font-weight: 950;
}

.top-students-board .top-students-filter-label > span {
  display: grid;
  gap: 1px;
}

.top-students-board .top-students-filter-label strong {
  color: #dce7f7;
  font-size: 11px;
  font-weight: 900;
}

.top-students-board .top-students-filter-label small {
  color: #7e90a9;
  font-size: 8px;
  font-weight: 700;
}

.top-students-board .top-students-filter-options {
  display: flex;
  flex-wrap: nowrap;
  gap: 7px;
  min-width: 0;
  overflow-x: auto;
  padding: 1px 1px 4px;
  scrollbar-color: rgb(105 159 238 / 28%) transparent;
  scrollbar-width: thin;
}

.top-students-board .top-students-filter-options button {
  display: inline-flex;
  min-height: 40px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 13px;
  border: 1px solid rgb(119 163 224 / 15%);
  border-radius: 10px;
  background: rgb(9 23 43 / 82%);
  color: #becbdd;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: border-color .25s ease, background-color .25s ease, color .25s ease, box-shadow .25s ease, transform .25s ease;
}

.top-students-board .top-students-filter-options button:hover {
  border-color: rgb(99 158 247 / 42%);
  background: #152b4a;
  color: #e9f2ff;
  transform: translateY(-1px);
}

.top-students-board .top-students-filter-options button.active {
  border-color: #64a0ff;
  background: linear-gradient(135deg, #4f8fee, #71abff);
  box-shadow: 0 10px 24px -13px rgb(79 143 238 / 95%);
  color: #061326;
}

.top-students-board .top-students-filter-options button small {
  padding: 3px 6px;
  border-radius: 999px;
  background: rgb(103 153 225 / 12%);
  color: #8197b5;
  font-size: 7px;
}

.top-students-board .top-students-filter-options button.active small {
  background: rgb(5 21 44 / 15%);
  color: #102a50;
}

.top-students-board .top-students-filter-options button:disabled {
  opacity: .42;
  cursor: not-allowed;
}

.top-students-board .top-students-filter-options button:disabled:hover {
  border-color: rgb(119 163 224 / 15%);
  background: rgb(9 23 43 / 82%);
  color: #becbdd;
  transform: none;
}

.top-students-filter-summary {
  display: flex;
  min-height: 36px;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border: 1px solid rgb(105 158 234 / 13%);
  border-radius: 10px;
  background: rgb(8 20 38 / 62%);
  color: #8394ac;
  font-size: 9px;
  font-weight: 700;
}

.top-students-filter-summary > .pi {
  color: #70aaff;
}

.top-students-filter-summary strong {
  color: #d7e6fa;
  font-size: 10px;
  font-weight: 900;
}

.top-students-filter-summary__count {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-inline-start: auto;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgb(88 148 238 / 12%);
  color: #91baff;
  white-space: nowrap;
}

.top-students-board .top-students-filters-loading,
.top-students-board .top-students-filters-error {
  width: min(1080px, calc(100% - 64px));
  margin: 24px auto 4px;
  border-color: rgb(119 163 224 / 16%);
  background: rgb(10 25 46 / 80%);
  color: #adbbce;
}

.top-students-board .students-slider-container {
  width: min(1340px, calc(100% - 4px));
}

.top-students-board .students-swiper {
  overflow: visible;
  padding: 60px 28px 72px;
}

.top-students-board .student-slide {
  width: 252px;
  height: auto;
  padding: 38px 0 14px;
  opacity: .3;
  filter: saturate(.65);
  transform: translateY(18px) scale(.87);
  transform-origin: center bottom;
  transition:
    opacity .45s ease,
    filter .45s ease,
    transform .55s cubic-bezier(.22, 1, .36, 1);
}

.top-students-board .student-slide.swiper-slide-visible {
  opacity: .72;
  filter: saturate(.88);
  transform: translateY(9px) scale(.94);
}

.top-students-board .student-slide.swiper-slide-active {
  z-index: 3;
  opacity: 1;
  filter: none;
  transform: translateY(-11px) scale(1.12);
}

.top-students-board .students-swiper--few :deep(.swiper-wrapper) {
  display: grid;
  width: 100% !important;
  grid-template-columns: repeat(5, 252px);
  align-items: end;
  justify-content: center;
  column-gap: 16px;
  transform: none !important;
}

.top-students-board .students-swiper--few .student-slide {
  grid-row: 1;
  margin: 0 !important;
}

.top-students-board .students-swiper--count-1 .student-slide:first-child,
.top-students-board .students-swiper--count-2 .student-slide:first-child,
.top-students-board .students-swiper--count-3 .student-slide:first-child,
.top-students-board .students-swiper--count-4 .student-slide:first-child,
.top-students-board .students-swiper--few.students-swiper--count-5 .student-slide:first-child {
  grid-column: 3;
}

.top-students-board .students-swiper--count-2 .student-slide:nth-child(2),
.top-students-board .students-swiper--count-3 .student-slide:nth-child(2),
.top-students-board .students-swiper--count-4 .student-slide:nth-child(2),
.top-students-board .students-swiper--few.students-swiper--count-5 .student-slide:nth-child(2) {
  grid-column: 4;
}

.top-students-board .students-swiper--count-3 .student-slide:nth-child(3),
.top-students-board .students-swiper--count-4 .student-slide:nth-child(3),
.top-students-board .students-swiper--few.students-swiper--count-5 .student-slide:nth-child(3) {
  grid-column: 2;
}

.top-students-board .students-swiper--count-4 .student-slide:nth-child(4),
.top-students-board .students-swiper--few.students-swiper--count-5 .student-slide:nth-child(4) {
  grid-column: 5;
}

.top-students-board .students-swiper--few.students-swiper--count-5 .student-slide:nth-child(5) {
  grid-column: 1;
}

.student-podium {
  position: relative;
  display: flex;
  min-height: 404px;
  flex-direction: column;
  align-items: center;
  padding: 56px 23px 21px;
  border: 1px solid rgb(125 164 218 / 22%);
  border-radius: 17px;
  background:
    radial-gradient(circle at 50% 14%, rgb(83 143 232 / 12%), transparent 29%),
    linear-gradient(160deg, rgb(18 38 65 / 96%), rgb(7 20 38 / 98%));
  box-shadow:
    0 24px 46px -34px rgb(0 0 0 / 95%),
    inset 0 1px 0 rgb(255 255 255 / 4%);
  color: #f6f9ff;
  text-align: center;
  animation: podium-card-reveal .8s both cubic-bezier(.16, 1, .3, 1);
  transition:
    min-height .45s ease,
    transform .4s cubic-bezier(.16, 1, .3, 1),
    border-color .35s ease,
    box-shadow .35s ease,
    background-color .35s ease;
}

.student-slide:nth-child(2) .student-podium { animation-delay: .08s; }
.student-slide:nth-child(3) .student-podium { animation-delay: .16s; }
.student-slide:nth-child(4) .student-podium { animation-delay: .24s; }
.student-slide:nth-child(5) .student-podium { animation-delay: .32s; }

.student-podium::before {
  position: absolute;
  z-index: 0;
  inset: -2px;
  border: 1px solid transparent;
  border-radius: 19px;
  box-shadow: 0 0 0 0 rgb(248 195 55 / 0%);
  content: "";
  opacity: 0;
  pointer-events: none;
}

.student-podium:hover {
  border-color: rgb(116 172 255 / 58%);
  box-shadow:
    0 34px 62px -34px rgb(0 0 0 / 98%),
    0 0 34px -22px rgb(87 151 248 / 75%),
    inset 0 1px 0 rgb(255 255 255 / 8%);
  transform: translateY(-8px);
}

.swiper-slide-active .student-podium {
  min-height: 460px;
  border-color: rgb(255 200 67 / 88%);
  background:
    radial-gradient(circle at 50% 12%, rgb(255 197 58 / 15%), transparent 34%),
    linear-gradient(160deg, rgb(24 43 69 / 98%), rgb(7 20 37 / 99%));
  box-shadow:
    0 24px 58px -30px rgb(0 0 0 / 95%),
    0 0 35px -18px rgb(255 195 52 / 78%),
    inset 0 1px 0 rgb(255 229 153 / 14%);
}

.swiper-slide-active .student-podium::before {
  border-color: rgb(255 207 78 / 55%);
  animation: champion-card-aura 3.2s ease-in-out infinite;
}

.student-podium__rank {
  position: absolute;
  z-index: 3;
  top: -28px;
  left: 50%;
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 22%);
  background: linear-gradient(145deg, #5f6f85, #2e3d51);
  box-shadow: 0 8px 18px rgb(0 0 0 / 34%);
  color: #fff;
  clip-path: polygon(50% 0, 88% 19%, 100% 58%, 72% 100%, 28% 100%, 0 58%, 12% 19%);
  font-size: 18px;
  font-weight: 950;
  transform: translateX(-50%);
}

.student-podium--rank-1 .student-podium__rank {
  border-color: #ffe38d;
  background: linear-gradient(145deg, #ffe27a, #e6a720 72%);
  box-shadow: 0 8px 22px rgb(240 175 29 / 44%);
  color: #352300;
}

.swiper-slide-active .student-podium--rank-1 .student-podium__rank {
  animation: honor-medal-glow 2.8s ease-in-out infinite;
}

.student-podium--rank-2 .student-podium__rank {
  background: linear-gradient(145deg, #f0f3f8, #9faabb 72%);
  color: #1f2a3a;
}

.student-podium--rank-3 .student-podium__rank {
  background: linear-gradient(145deg, #cf9265, #805036 72%);
  color: #211006;
}

.student-podium__portrait {
  position: relative;
  display: grid;
  width: 150px;
  height: 150px;
  flex: 0 0 150px;
  place-items: center;
  padding: 4px;
  overflow: hidden;
  border: 1px solid rgb(128 173 237 / 55%);
  border-radius: 50%;
  background: #152b47;
  box-shadow: 0 13px 28px -16px #000;
  animation: student-portrait-float 5s ease-in-out infinite;
  transition: width .45s ease, height .45s ease, flex-basis .45s ease, border-color .35s ease;
}

.student-slide:nth-child(even) .student-podium__portrait {
  animation-delay: -2.2s;
}

.swiper-slide-active .student-podium__portrait {
  width: 184px;
  height: 184px;
  flex-basis: 184px;
  border-color: #f3c443;
  box-shadow:
    0 16px 30px -16px #000,
    0 0 28px -12px rgb(247 194 54 / 72%);
  animation-name: champion-portrait-float;
  animation-duration: 3.6s;
}

.student-podium__portrait img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.student-podium__shine {
  position: absolute;
  inset: -50% 45% -50% -20%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 14%), transparent);
  pointer-events: none;
  transform: rotate(18deg) translateX(-180%);
  transition: transform .8s cubic-bezier(.22, 1, .36, 1);
}

.student-podium:hover .student-podium__shine,
.swiper-slide-active .student-podium__shine {
  transform: rotate(18deg) translateX(210%);
}

.swiper-slide-active .student-podium__shine {
  animation: champion-shine 3.8s 1s ease-in-out infinite;
}

.student-podium__position {
  margin-top: 18px;
  color: #75aaff;
  font-size: 10px;
  font-weight: 900;
}

.student-podium--rank-1 .student-podium__position {
  color: #f2c344;
}

.student-podium__title {
  max-width: 100%;
  margin: 5px 0 0;
  overflow: hidden;
  color: #f7f9fd;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swiper-slide-active .student-podium__title {
  font-size: 24px;
}

.student-podium__subtitle {
  max-width: 100%;
  margin: 4px 0 0;
  overflow: hidden;
  color: #8fb3ea;
  font-size: 11px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-podium__description {
  display: -webkit-box;
  margin: 8px 0 0;
  overflow: hidden;
  color: #91a0b5;
  font-size: 11px;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.student-podium__footer {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid rgb(132 166 213 / 12%);
}

.student-podium__year {
  overflow: hidden;
  color: #8da2be;
  font-size: 10px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-podium__honor {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid rgb(98 154 237 / 18%);
  border-radius: 7px;
  background: rgb(29 63 108 / 44%);
  color: #6fa8ff;
}

.student-podium--rank-1 .student-podium__honor {
  border-color: rgb(240 190 54 / 25%);
  background: rgb(119 84 13 / 23%);
  color: #f2c344;
}

.student-podium__honor .pi { font-size: 14px; }

.top-students-board :deep(.students-swiper .swiper-button-next),
.top-students-board :deep(.students-swiper .swiper-button-prev) {
  top: 52%;
  width: 38px;
  height: 38px;
  border-color: rgb(115 165 237 / 18%);
  border-radius: 50%;
  background: rgb(15 35 62 / 92%);
  box-shadow: 0 10px 25px -12px #000;
  color: #e1ecff;
}

.top-students-board :deep(.students-swiper .swiper-button-next:hover),
.top-students-board :deep(.students-swiper .swiper-button-prev:hover) {
  border-color: #68a3ff;
  background: #4f8fe9;
  color: #071426;
  transform: scale(1.06);
}

.top-students-board :deep(.students-swiper .swiper-button-next::after),
.top-students-board :deep(.students-swiper .swiper-button-prev::after) {
  font-size: 12px;
}

.top-students-board :deep(.students-swiper .swiper-pagination) {
  bottom: 10px;
}

.top-students-board :deep(.students-swiper .swiper-pagination-bullet) {
  width: 9px;
  height: 9px;
  background: #52647b;
}

.top-students-board :deep(.students-swiper .swiper-pagination-bullet-active) {
  width: 25px;
  background: #64a0ff;
  box-shadow: 0 0 12px rgb(83 150 255 / 55%);
}

.top-students-board .students-loading {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  padding: 42px 36px 54px;
}

.top-students-board .students-loading span {
  min-height: 310px;
  border-color: rgb(120 163 224 / 13%);
  border-radius: 17px;
  background: linear-gradient(105deg, #0d2039 20%, #183250 38%, #0d2039 56%);
  background-size: 240% 100%;
}

.top-students-board .students-empty {
  min-height: 290px;
  margin: 30px 36px 46px;
  border-color: rgb(118 162 224 / 18%);
  background: rgb(10 26 47 / 64%);
}

.top-students-board .students-empty h3 { color: #f3f7ff; }
.top-students-board .students-empty p { color: #98a8be; }

@keyframes honor-trophy-float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-6px) rotate(-3deg); }
}

@keyframes honor-medal-glow {
  0%, 100% { filter: drop-shadow(0 0 0 rgb(240 175 29 / 0%)); }
  50% { filter: drop-shadow(0 0 10px rgb(240 175 29 / 52%)); }
}

@keyframes podium-card-reveal {
  from {
    opacity: 0;
    filter: blur(8px) saturate(.6);
  }
  to {
    opacity: 1;
    filter: blur(0) saturate(1);
  }
}

@keyframes champion-card-aura {
  0%, 100% {
    opacity: .45;
    box-shadow: 0 0 0 0 rgb(248 195 55 / 0%);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 36px 3px rgb(248 195 55 / 22%);
  }
}

@keyframes student-portrait-float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-6px) rotate(.5deg); }
}

@keyframes champion-portrait-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-9px) scale(1.025); }
}

@keyframes champion-shine {
  0%, 55% { transform: rotate(18deg) translateX(-190%); opacity: 0; }
  65% { opacity: 1; }
  86%, 100% { transform: rotate(18deg) translateX(230%); opacity: 0; }
}

@media (max-width: 900px) {
  .top-students-board {
    width: min(100% - 24px, 1280px);
    padding-inline: 18px;
  }

  .top-students-board__header {
    grid-template-columns: 76px minmax(0, 1fr) 90px;
    width: 100%;
  }

  .top-students-trophy { width: 64px; height: 64px; }
  .top-students-trophy .pi { font-size: 25px; }

  .top-students-board .top-students-filters,
  .top-students-board .top-students-filters-loading,
  .top-students-board .top-students-filters-error {
    width: min(100% - 20px, 930px);
  }

  .top-students-board .students-loading {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .top-students-board .students-loading span:nth-child(n + 4) { display: none; }
}

@media (max-width: 640px) {
  .top-students-section { padding: 46px 0; }

  .top-students-board {
    width: calc(100% - 18px);
    padding: 25px 10px 10px;
    border-radius: 18px;
  }

  .top-students-board::after { inset: 8px; border-radius: 13px; }

  .top-students-board__header {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 12px;
  }

  .top-students-trophy {
    width: 54px;
    height: 54px;
  }

  .top-students-board__intro { text-align: start; }
  .top-students-board__intro h2 { font-size: 24px; }
  .top-students-board__intro p { font-size: 10px; line-height: 1.7; }
  .top-students-board__eyebrow { font-size: 8px; }

  .top-students-board .top-students-count {
    grid-column: 1 / -1;
    min-width: 0;
    min-height: 0;
    justify-self: center;
    padding: 7px 12px;
  }

  .top-students-board .top-students-count strong { font-size: 21px; }
  .top-students-board .top-students-count span { max-width: none; }

  .top-students-board .top-students-filters {
    display: grid;
    width: calc(100% - 10px);
    justify-content: stretch;
    padding: 10px;
  }

  .top-students-filters__header {
    align-items: stretch;
    flex-direction: column;
  }

  .top-students-filter-all {
    width: 100%;
    justify-content: center;
  }

  .top-students-filter-steps {
    grid-template-columns: 1fr;
  }

  .top-students-board .top-students-filter-group {
    display: grid;
    gap: 9px;
  }

  .top-students-board .top-students-filter-options {
    overflow-x: auto;
    padding-bottom: 3px;
    scrollbar-width: none;
  }

  .top-students-board .top-students-filter-options::-webkit-scrollbar { display: none; }
  .top-students-board .top-students-filter-options button { flex: 0 0 auto; }

  .top-students-filter-summary {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .top-students-filter-summary__count {
    margin-inline-start: 0;
  }

  .top-students-board .students-swiper {
    padding: 54px 12px 64px;
  }

  .top-students-board .student-slide {
    width: min(286px, calc(100vw - 66px));
  }

  .top-students-board .students-swiper--few :deep(.swiper-wrapper) {
    grid-template-columns: repeat(5, min(286px, calc(100vw - 66px)));
    column-gap: 14px;
  }

  .top-students-board .student-slide.swiper-slide-active {
    transform: translateY(-2px) scale(1);
  }

  .top-students-board .students-loading {
    grid-template-columns: 1fr;
    padding: 38px 22px 48px;
  }

  .top-students-board .students-loading span:nth-child(n + 2) { display: none; }
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

.home-sections--dark {
  --section-ink: #f5f8ff;
  --section-muted: #a9b7cc;
  --section-line: #2a3952;
  --section-blue: #70aaff;
  --section-blue-dark: #98c1ff;
  --section-blue-light: rgb(112 170 255 / 14%);
  background: #0b1220;
}

.home-sections--dark .top-students-section {
  background:
    radial-gradient(circle at 88% 8%, rgb(74 132 225 / 20%), transparent 34%),
    radial-gradient(circle at 8% 90%, rgb(80 112 190 / 11%), transparent 30%),
    linear-gradient(180deg, #0d1627 0%, #09111f 100%);
}

.home-sections--dark .opinions-section { background: #0b1220; }
.home-sections--dark .opinion-card { border-color: var(--section-line); background: #111c30; box-shadow: 0 18px 46px -34px rgb(0 0 0 / 85%); }

.home-sections--dark .top-students-section::before {
  background-image: radial-gradient(rgb(130 174 246 / 22%) 1px, transparent 1px);
  opacity: .22;
}

.home-sections--dark .top-students-section__orb { background: rgb(72 130 225 / 10%); }
.home-sections--dark .top-students-section .section-eyebrow { border-color: rgb(112 170 255 / 25%); background: rgb(112 170 255 / 11%); }

.home-sections--dark .top-students-count,
.home-sections--dark .top-students-filters,
.home-sections--dark .student-card,
.home-sections--dark .students-empty {
  border-color: var(--section-line);
  background: rgb(17 28 48 / 92%);
  box-shadow: 0 22px 55px -38px rgb(0 0 0 / 85%);
}

.home-sections--dark .top-students-count { background: rgb(20 33 56 / 76%); }
.home-sections--dark .top-students-count strong { text-shadow: 0 0 24px rgb(112 170 255 / 28%); }
.home-sections--dark .top-students-filter-label { color: #c4cee0; }

.home-sections--dark .top-students-filter-options button {
  border-color: var(--section-line);
  background: #152239;
  color: #bcc8da;
}

.home-sections--dark .top-students-filter-options button:hover { border-color: rgb(112 170 255 / 55%); background: #192a46; color: #dce9ff; }
.home-sections--dark .top-students-filter-options button.active { border-color: #70aaff; background: linear-gradient(135deg, #548fe8, #70aaff); color: #071426; box-shadow: 0 10px 28px -16px #70aaff; }
.home-sections--dark .top-students-filters-loading,
.home-sections--dark .top-students-filters-error { border-color: var(--section-line); background: rgb(17 28 48 / 68%); color: #b8c5d9; }

.home-sections--dark .student-card:hover { border-color: rgb(112 170 255 / 48%); box-shadow: 0 28px 64px -32px rgb(0 0 0 / 90%), 0 12px 32px -24px rgb(112 170 255 / 45%); }
.home-sections--dark .student-card__media { background: linear-gradient(135deg, #17253e, #223455); }
.home-sections--dark .student-card__overlay { background: linear-gradient(180deg, rgb(4 11 22 / 3%) 25%, rgb(4 11 22 / 84%) 100%); }
.home-sections--dark .student-card__number { border-color: rgb(255 255 255 / 16%); background: rgb(12 24 43 / 82%); color: #a9ccff; box-shadow: 0 10px 25px rgb(0 0 0 / 30%); }
.home-sections--dark .student-card__achievement { border-color: rgb(255 255 255 / 14%); background: rgb(7 17 33 / 78%); }
.home-sections--dark .student-card__year { background: rgb(112 170 255 / 12%); color: #a9ccff; }
.home-sections--dark .student-card__honor-icon { background: rgb(245 184 46 / 12%); color: #ffd36b; }

.home-sections--dark .student-card__footer { border-color: var(--section-line); }
.home-sections--dark .students-empty__icon { background: rgb(112 170 255 / 12%); color: #8ebaff; }
.home-sections--dark .students-empty--error .students-empty__icon { background: rgb(220 74 74 / 13%); color: #ff8b8b; }
.home-sections--dark .students-loading span {
  border-color: var(--section-line);
  background: linear-gradient(105deg, #111c30 20%, #21314e 38%, #111c30 56%);
  background-size: 240% 100%;
}

.home-sections--dark .top-students-section :deep(.students-swiper .swiper-button-next),
.home-sections--dark .top-students-section :deep(.students-swiper .swiper-button-prev) {
  border-color: #31445f;
  background: rgb(19 31 52 / 94%);
  color: #91bdff;
  box-shadow: 0 12px 30px rgb(0 0 0 / 30%);
}

.home-sections--dark .top-students-section :deep(.students-swiper .swiper-button-next:hover),
.home-sections--dark .top-students-section :deep(.students-swiper .swiper-button-prev:hover) { border-color: #70aaff; background: #70aaff; color: #071426; }
.home-sections--dark .top-students-section :deep(.swiper-pagination-bullet) { background: #41516b; }
.home-sections--dark .top-students-section :deep(.swiper-pagination-bullet-active) { background: #70aaff; box-shadow: 0 0 12px rgb(112 170 255 / 42%); }

.home-sections--dark .top-students-section button:focus-visible { outline: 3px solid rgb(112 170 255 / 38%); outline-offset: 3px; }

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

  .top-students-count { min-width: 120px; min-height: 68px; }
  .top-students-filter-group { grid-template-columns: 1fr; gap: 8px; }

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
    height: 265px;
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

  .students-loading { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .students-loading span:last-child { display: none; }
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

  .top-students-heading { align-items: flex-start; flex-direction: column; }
  .top-students-count { min-width: 0; min-height: 0; padding: 10px 13px; border-radius: 14px; }
  .top-students-count strong { font-size: 22px; }
  .top-students-count span { max-width: none; }
  .top-students-filters { margin-top: -10px; padding: 14px; border-radius: 16px; }
  .top-students-filter-options { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 3px; scrollbar-width: none; }
  .top-students-filter-options::-webkit-scrollbar { display: none; }
  .top-students-filter-options button { flex: 0 0 auto; }

  .student-card__media {
    height: 230px;
  }

  .student-card {
    border-radius: 20px;
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

  .students-loading { grid-template-columns: 1fr; }
  .students-loading span { min-height: 480px; }
  .students-loading span:nth-child(n + 2) { display: none; }
}



@media (prefers-reduced-motion: reduce) {
  .student-card,
  .student-card__image,
  .student-card__link,
  .student-card__link svg,
  .opinion-card {
    transition: none;
  }

  .top-students-section__orb,
  .top-students-trophy,
  .student-podium,
  .student-podium::before,
  .student-podium__portrait,
  .swiper-slide-active .student-podium__shine,
  .swiper-slide-active .student-podium--rank-1 .student-podium__rank,
  .students-loading span,
  .students-filter-swap-enter-active,
  .students-filter-swap-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
