<script setup lang="ts">
type Stage = {
  id: 'first' | 'second' | 'third'
  index: string
  label: string
  yearId: number
}

const stages: Stage[] = [
  { id: 'first', index: '01', label: 'الصف الأول الثانوي', yearId: 9 },
  { id: 'second', index: '02', label: 'الصف الثاني الثانوي', yearId: 10 },
  { id: 'third', index: '03', label: 'الصف الثالث الثانوي', yearId: 11 },
]

type ApiImage = {
  img?: string | null
  alt?: string | null
}

type ApiCourse = {
  id: number
  title: string
  description?: string | null
  image?: ApiImage | null
  course_price?: number | null
  currency?: string | null
  course_videos?: number | null
  course_docs?: number | null
  subject?: {
    title?: string | null
  } | null
}

type CoursesResponse = {
  data: ApiCourse[]
}

const homeApiBaseUrl = 'https://saas.crazyidea.online/api/website'
const secondaryStageId = 4
const selectedStageId = ref<Stage['id'] | null>(null)
const selectedStage = computed(() => stages.find((stage) => stage.id === selectedStageId.value) ?? null)
const coursesByStage = ref<Partial<Record<Stage['id'], ApiCourse[]>>>({})
const loadingStageId = ref<Stage['id'] | null>(null)
const errorByStage = ref<Partial<Record<Stage['id'], string>>>({})

const getWebDomain = () => {
  const hostname = useRequestURL().hostname

  return hostname === 'localhost' || hostname === 'mr-eslamsalama.com'
    ? 'mr-eslamsalama.com'
    : hostname
}

const fetchCourses = async (stage: Stage) => {
  if (coursesByStage.value[stage.id] || loadingStageId.value === stage.id) {
    return
  }

  loadingStageId.value = stage.id
  errorByStage.value[stage.id] = undefined

  try {
    const response = await $fetch<CoursesResponse>(`${homeApiBaseUrl}/filter_courses`, {
      method: 'POST',
      headers: {
        'Accept-Language': 'ar',
        'web-domain': getWebDomain(),
      },
      body: {
        category_id: 1,
        type: 1,
        education_type_id: null,
        stage_id: secondaryStageId,
        year_id: stage.yearId,
        subject_id: null,
        university_id: null,
        college_id: null,
        department_id: null,
        division_id: null,
        university_subject_id: null,
      },
    })

    coursesByStage.value[stage.id] = response.data ?? []
  } catch {
    errorByStage.value[stage.id] = 'تعذر تحميل الكورسات الآن. حاول مرة أخرى.'
  } finally {
    if (loadingStageId.value === stage.id) {
      loadingStageId.value = null
    }
  }
}

const selectStage = (stage: Stage) => {
  selectedStageId.value = stage.id
  void fetchCourses(stage)
}
</script>

<template>
  <section id="courses" class="section courses home-course-showcase">
    <div class="container">
      <div class="section-heading split-heading" data-motion-reveal="up">
        <div>
          <span class="section-tag">اختار نقطة البداية</span>
          <h2>
            ابدأ من صفك.<br />
            وكمل <em>بخطة واضحة.</em>
          </h2>
        </div>

        <p>
          كل صف له منهجه وسرعته. اختار مرحلتك الأول عشان تشوف الكورسات والمراجعات المناسبة
          ليك فقط.
        </p>
      </div>

      <div class="home-course-picker" data-motion-reveal="up" data-motion-order="1">
        <div>
          <span>خطوتك الأولى</span>
          <h3 id="home-course-audience-title">أنت في أنهي صف؟</h3>
          <p id="home-course-audience-help">اختار مرحلتك علشان نعرض لك مسارها فقط.</p>
        </div>

        <div
          class="home-course-audiences"
          role="group"
          aria-labelledby="home-course-audience-title"
          aria-describedby="home-course-audience-help"
        >
          <button
            v-for="stage in stages"
            :key="stage.id"
            type="button"
            :class="{ active: selectedStageId === stage.id }"
            :aria-pressed="selectedStageId === stage.id"
            aria-controls="home-course-results"
            @click="selectStage(stage)"
          >
            <span class="stage-option-index" aria-hidden="true">{{ stage.index }}</span>
            <span class="stage-option-label">{{ stage.label }}</span>
          </button>
        </div>
      </div>

      <div
        id="home-course-results"
        class="home-course-result"
        :class="{ 'has-selection': selectedStage }"
        data-motion-reveal="up"
        data-motion-order="2"
        aria-live="polite"
      >
        <div v-if="!selectedStage" class="home-course-empty" role="region" aria-labelledby="home-course-empty-title">
          <span class="home-course-empty-step" aria-hidden="true">01</span>
          <div>
            <span>البداية من هنا</span>
            <h3 id="home-course-empty-title">اختار صفك من فوق</h3>
            <p>هنظهر لك خطة الصف والكورسات المتاحة من غير ما نخلط لك مناهج باقي المراحل.</p>
          </div>
          <span class="home-course-empty-arrow" aria-hidden="true">↑</span>
        </div>

        <template v-else>
          <p class="home-course-status" role="status">
            {{ loadingStageId === selectedStage.id ? 'جاري تحميل' : 'تم عرض' }}
            {{ coursesByStage[selectedStage.id]?.length ?? 0 }} من كورسات {{ selectedStage.label }}
          </p>
          <div class="home-course-result-head">
            <h3>كورسات {{ selectedStage.label }}</h3>
            <span>{{ coursesByStage[selectedStage.id]?.length ?? 0 }} كورسات</span>
          </div>

          <div v-if="loadingStageId === selectedStage.id" class="home-stage-empty home-course-loading">
            <span>جاري التحميل</span>
            <h3>بنجهز كورسات {{ selectedStage.label }}</h3>
            <p>ثواني ونظهر لك الكورسات والمراجعات المتاحة لسنتك.</p>
          </div>

          <div v-else-if="errorByStage[selectedStage.id]" class="home-stage-empty">
            <span>حدث خطأ</span>
            <h3>لم نتمكن من تحميل الكورسات</h3>
            <p>{{ errorByStage[selectedStage.id] }}</p>
            <button type="button" class="stage-link" @click="fetchCourses(selectedStage)">حاول مرة أخرى</button>
          </div>

          <div v-else-if="!coursesByStage[selectedStage.id]?.length" class="home-stage-empty">
            <span>لا توجد كورسات</span>
            <h3>لا توجد كورسات متاحة لـ {{ selectedStage.label }} حاليًا</h3>
            <p>سنضيف الكورسات الجديدة هنا فور إتاحتها.</p>
          </div>

          <div v-else class="home-course-grid">
            <NuxtLink
              v-for="course in coursesByStage[selectedStage.id]"
              :key="course.id"
              :to="`/course/${course.id}`"
              class="home-course-card"
            >
              <div class="home-course-card-image">
                <NuxtImg
                  v-if="course.image?.img"
                  :src="course.image.img"
                  :alt="course.image.alt || course.title"
                  width="680"
                  height="360"
                  loading="lazy"
                />
                <span v-else aria-hidden="true">📚</span>
              </div>
              <div class="home-course-card-content">
                <span class="home-course-card-subject">{{ course.subject?.title || selectedStage.label }}</span>
                <h3>{{ course.title }}</h3>
                <p v-if="course.description">{{ course.description }}</p>
                <div class="home-course-card-meta">
                  <span>{{ course.course_videos ?? 0 }} درس</span>
                  <strong>{{ course.course_price ? `${course.course_price} ${course.currency || ''}` : 'مجاني' }}</strong>
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>

      <NuxtLink :to="selectedStage ? `/course?year_id=${selectedStage.yearId}` : '/course'" class="all-courses">
        {{ selectedStage ? `شاهد كل كورسات ${selectedStage.label}` : 'صفحة كل الكورسات' }}
        <span aria-hidden="true">←</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.courses {
  background: var(--paper);
}

.split-heading {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  align-items: end;
  gap: 56px;
}

.split-heading h2 {
  margin: 14px 0 0;
  font: 900 clamp(38px, 4.1vw, 58px) / 1.16 var(--heading);
  letter-spacing: -0.045em;
}

.split-heading h2 em {
  color: var(--coral);
  font-style: normal;
}

.split-heading > p {
  margin: 0 0 8px;
  color: var(--muted-copy);
  font-size: 16px;
  line-height: 1.9;
}

.home-course-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 32px;
  padding: 24px 28px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #eef4ff;
}

.home-course-picker > div:first-child {
  min-width: 270px;
}

.home-course-picker > div:first-child > span {
  color: var(--coral);
  font-size: 12px;
  font-weight: 800;
}

.home-course-picker h3 {
  margin: 5px 0 0;
  font: 800 20px/1.5 var(--heading);
}

.home-course-picker p {
  margin: 5px 0 0;
  color: var(--muted-copy);
  font-size: 14px;
  line-height: 1.75;
}

.home-course-audiences {
  display: grid;
  grid-template-columns: repeat(3, minmax(132px, 1fr));
  gap: 8px;
}

.home-course-audiences button {
  display: grid;
  min-height: 74px;
  grid-template-columns: 48px minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 2px 12px;
  padding: 7px;
  border: 1px solid #12313929;
  border-radius: 4px;
  background: #fff;
  color: #61777c;
  cursor: pointer;
  font: 800 14px var(--heading);
  text-align: right;
  transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.2s;
}

.home-course-audiences button:hover {
  transform: translateY(-2px);
  border-color: var(--teal);
  color: var(--ink);
}

.home-course-audiences button.active {
  border-color: var(--deep);
  background: var(--deep);
  color: #fff;
  box-shadow: inset 0 -3px var(--coral);
}

.stage-option-index {
  display: grid;
  width: 48px;
  height: 48px;
  grid-row: 1 / 3;
  place-items: center;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--teal);
  font: 900 13px var(--heading);
}

.home-course-audiences button.active .stage-option-index {
  border-color: #ffffff47;
  background: #ffffff24;
  color: #fff;
}

.stage-option-label {
  font: inherit;
}

.home-course-empty {
  position: relative;
  display: grid;
  min-height: 180px;
  grid-template-columns: auto minmax(0, 560px) auto;
  align-items: center;
  justify-content: center;
  gap: 28px;
  overflow: hidden;
  padding: 34px;
  border: 1px dashed #1231393d;
  border-radius: 8px;
  background: linear-gradient(110deg, #dbe9ffb8, #ffffffe6), #f7faff;
  text-align: right;
}

.home-course-empty::before {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 6px;
  background: var(--coral);
  content: '';
}

.home-course-empty-step {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border: 1px solid #12313924;
  background: #fff;
  color: var(--deep);
  box-shadow: 8px 8px #bedbd6b3;
  font: 800 16px var(--heading);
}

.home-course-empty div > span,
.home-stage-empty > span {
  color: var(--coral);
  font-size: 12px;
  font-weight: 800;
}

.home-course-empty h3,
.home-stage-empty h3 {
  margin: 6px 0 8px;
  color: var(--ink);
  font: 800 clamp(22px, 3vw, 34px) / 1.35 var(--heading);
}

.home-course-empty p,
.home-stage-empty p {
  max-width: 620px;
  margin: 0;
  color: var(--muted-copy);
  font-size: 15px;
  line-height: 1.9;
}

.home-course-empty-arrow {
  color: var(--coral);
  font: 700 34px/1 var(--heading);
}

.home-stage-empty {
  padding: 46px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: linear-gradient(135deg, #f4f8ff, #fff);
  text-align: center;
}

.home-course-status {
  margin: 0 0 12px;
  color: var(--muted-meta);
  font-size: 13px;
  font-weight: 700;
}

.home-course-result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.home-course-result-head h3 {
  margin: 0;
  font: 800 clamp(21px, 2.5vw, 28px) / 1.4 var(--heading);
}

.home-course-result-head > span {
  flex: 0 0 auto;
  padding: 5px 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--teal);
  font-size: 12px;
  font-weight: 800;
}

.home-course-loading {
  position: relative;
  overflow: hidden;
}

.home-course-loading::after {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--coral), transparent);
  animation: course-loading 1.2s ease-in-out infinite;
  content: '';
}

.home-course-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.home-course-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.home-course-card:hover {
  border-color: var(--teal);
  box-shadow: 0 12px 28px #1231391a;
  transform: translateY(-4px);
}

.home-course-card-image {
  display: grid;
  aspect-ratio: 1.85;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #dbe9ff, #eef4ff);
  color: var(--teal);
  font-size: 34px;
}

.home-course-card-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-course-card-content {
  display: flex;
  min-height: 176px;
  flex-direction: column;
  padding: 18px;
}

.home-course-card-subject {
  color: var(--coral);
  font-size: 12px;
  font-weight: 800;
}

.home-course-card h3 {
  display: -webkit-box;
  margin: 8px 0 7px;
  overflow: hidden;
  font: 800 18px/1.55 var(--heading);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-course-card p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--muted-copy);
  font-size: 13px;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-course-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  color: var(--muted-meta);
  font-size: 12px;
}

.home-course-card-meta strong {
  color: var(--deep);
  font: 800 13px var(--heading);
}

@keyframes course-loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.home-stage-empty p {
  margin-inline: auto;
  margin-bottom: 20px;
}

.stage-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: var(--coral);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.all-courses {
  display: flex;
  width: max-content;
  gap: 18px;
  margin: 36px auto 0;
  padding-bottom: 7px;
  border-bottom: 1px solid;
  font-size: 13px;
  font-weight: 800;
}

:global(html[data-theme='dark']) .home-course-picker,
:global(html[data-theme='dark']) .home-stage-empty,
:global(html[data-theme='dark']) .home-course-card {
  border-color: var(--dark-line);
  background: var(--dark-surface-2);
}

:global(html[data-theme='dark']) .home-course-audiences button {
  border-color: var(--dark-line);
  background: var(--dark-surface);
  color: var(--dark-muted);
}

:global(html[data-theme='dark']) .home-course-audiences button.active {
  border-color: var(--teal);
  background: var(--teal);
  color: #071215;
}

:global(html[data-theme='dark']) .home-course-card-image {
  background: linear-gradient(135deg, #163b43, #0d2227);
}

:global(html[data-theme='dark']) .home-course-card-meta {
  border-color: var(--dark-line);
}

:global(html[data-theme='dark']) .home-course-card-meta strong {
  color: var(--dark-text);
}

:global(html[data-theme='dark']) .home-course-result-head > span {
  border-color: var(--dark-line);
  color: var(--dark-muted);
}

:global(html[data-theme='dark']) .home-course-empty {
  border-color: var(--dark-line);
  background: linear-gradient(110deg, #2c625947, #0d2227d6), var(--dark-surface);
}

:global(html[data-theme='dark']) .home-course-empty-step {
  border-color: var(--dark-line);
  background: var(--dark-surface-2);
  color: var(--dark-text);
  box-shadow: 8px 8px #2c625973;
}

@media (max-width: 820px) {
  .split-heading {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .home-course-picker {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .home-course-picker > div:first-child {
    min-width: 0;
  }

  .home-course-audiences {
    width: 100%;
  }

  .home-course-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-course-empty {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .home-course-empty-arrow {
    display: none;
  }
}

@media (max-width: 620px) {
  .split-heading h2 {
    font-size: 38px;
  }

  .home-course-picker {
    margin-bottom: 26px;
    padding: 20px;
  }

  .home-course-picker h3 {
    font-size: 17px;
  }

  .home-course-audiences {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .home-course-audiences button {
    display: flex;
    min-width: 0;
    min-height: 48px;
    justify-content: center;
    padding-inline: 8px;
    text-align: center;
  }

  .stage-option-index {
    display: none;
  }

  .home-course-empty {
    min-height: 0;
    grid-template-columns: 1fr;
    justify-items: start;
    padding: 26px 22px;
  }

  .home-course-empty-step {
    display: none;
  }

  .home-stage-empty {
    padding: 32px 20px;
  }

  .home-course-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 430px) {
  .home-course-audiences {
    grid-template-columns: 1fr;
  }
}
</style>
