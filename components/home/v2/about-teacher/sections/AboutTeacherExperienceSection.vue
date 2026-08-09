<script setup lang="ts">
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapHomeCourseStages,
  mapHomeCourseYears,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import type {
  HomeCourseStageViewModel,
  HomeCourseTabViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

interface ExperienceStage extends HomeCourseStageViewModel {
  years: HomeCourseTabViewModel[];
}

const props = defineProps<{
  teacherRole: string;
}>();

const webDomain = getWebDomain();
const api = new HomePageApi(webDomain);
const {
  data: experienceStages,
  pending,
  error,
  refresh,
} = await useAsyncData<ExperienceStage[]>(
  `about-teacher-experience-taxonomy:${webDomain}`,
  async () => {
    const stages = mapHomeCourseStages(await api.fetchStages());
    const yearResults = await Promise.allSettled(
      stages.map(async (stage) => ({
        stage,
        years: mapHomeCourseYears(stage, await api.fetchStageYears(stage.id)),
      })),
    );

    if (
      stages.length &&
      yearResults.every((result) => result.status === "rejected")
    ) {
      const failedRequest = yearResults.find(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected",
      );
      if (failedRequest) throw failedRequest.reason;
    }

    return yearResults.flatMap((result, index) => {
      if (result.status === "fulfilled") {
        return [{ ...result.value.stage, years: result.value.years }];
      }

      const stage = stages[index];
      return stage ? [{ ...stage, years: [] }] : [];
    });
  },
  {
    default: () => [],
    dedupe: "defer",
  },
);

const selectedStageId = ref<number | null>(null);
const selectedStage = computed(
  () =>
    experienceStages.value.find(
      (stage) => stage.id === selectedStageId.value,
    ) ||
    experienceStages.value[0] ||
    null,
);
const totalYears = computed(() =>
  experienceStages.value.reduce(
    (total, stage) => total + stage.years.length,
    0,
  ),
);
const sectionDescription = computed(() => {
  const role = props.teacherRole.trim();
  return role
    ? `${role}، بخبرة تمتد عبر المراحل والسنوات الدراسية المتاحة على المنصة.`
    : "تغطية تعليمية منظمة تمتد عبر المراحل والسنوات الدراسية المتاحة على المنصة.";
});
const legacyDescription = computed(() => {
  const role = props.teacherRole.trim();
  return role
    ? `${role}، من تأسيس الفكرة إلى تحليل السؤال والوصول للحل بطريقة واضحة.`
    : "من تأسيس الفكرة إلى تحليل السؤال والوصول للحل بطريقة واضحة.";
});

watch(
  experienceStages,
  (stages) => {
    if (
      !stages.length ||
      stages.some((stage) => stage.id === selectedStageId.value)
    ) {
      return;
    }
    selectedStageId.value = stages[0]?.id ?? null;
  },
  { immediate: true },
);

const selectStage = (stageId: number) => {
  selectedStageId.value = stageId;
};

const focusStage = async (index: number) => {
  const stages = experienceStages.value;
  if (!stages.length) return;

  const normalizedIndex = (index + stages.length) % stages.length;
  const stage = stages[normalizedIndex];
  if (!stage) return;

  selectStage(stage.id);
  await nextTick();
  document.getElementById(`experience-stage-tab-${stage.id}`)?.focus();
};

const handleStageKeydown = (event: KeyboardEvent, index: number) => {
  const nextKeys = ["ArrowDown", "ArrowLeft"];
  const previousKeys = ["ArrowUp", "ArrowRight"];

  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    void focusStage(index + 1);
  } else if (previousKeys.includes(event.key)) {
    event.preventDefault();
    void focusStage(index - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    void focusStage(0);
  } else if (event.key === "End") {
    event.preventDefault();
    void focusStage(experienceStages.value.length - 1);
  }
};

const stageNumber = (index: number) =>
  String(index + 1).padStart(2, "0");
const yearNumber = (index: number) =>
  String(index + 1).padStart(2, "0");
const yearRoute = (year: HomeCourseTabViewModel) => ({
  path: "/course",
  query: {
    stage_id: String(year.stageId),
    year_id: String(year.yearId),
  },
});
</script>

<template>
  <section
    id="experience-legacy-preview"
    class="about-teacher-section about-teacher-experience about-teacher-experience--legacy"
    aria-labelledby="teacher-experience-legacy-title"
  >
    <div class="container">
      <header class="about-teacher-section__head" data-about-reveal>
        <div>
          <span>خبرة المدرس</span>
          <h2 id="teacher-experience-legacy-title">
            خبرة في تبسيط المعلومة وتحويلها لتطبيق.
          </h2>
        </div>
        <p>{{ legacyDescription }}</p>
      </header>

      <article class="about-teacher-stage-card" data-about-reveal>
        <div class="about-teacher-stage-card__chips" aria-label="المراحل الدراسية">
          <span>أولى ثانوي</span>
          <span>ثانية ثانوي</span>
          <span>ثالثة ثانوي</span>
        </div>
        <div class="about-teacher-stage-card__content">
          <span aria-hidden="true">✦</span>
          <h3>محتوى مناسب لكل مرحلة دراسية</h3>
          <p>
            كل صف له مساره المنظم، ومحاضراته، وتدريباته التي تناسب أهدافه خلال
            العام الدراسي.
          </p>
        </div>
      </article>
    </div>
  </section>

  <section
    id="experience"
    class="about-teacher-section about-teacher-experience"
    aria-labelledby="teacher-experience-title"
  >
    <div class="container">
      <header class="about-teacher-section__head" data-about-reveal>
        <div>
          <span>خبرة المدرس</span>
          <h2 id="teacher-experience-title">
            خبرة تتحول إلى <em>مسار واضح</em> لكل طالب.
          </h2>
        </div>
        <p>{{ sectionDescription }}</p>
      </header>

      <div
        v-if="pending"
        class="about-teacher-experience-state"
        role="status"
        aria-live="polite"
        data-about-reveal
      >
        <span class="about-teacher-experience-state__pulse" aria-hidden="true" />
        <div>
          <strong>نبني خريطة المراحل…</strong>
          <p>جاري تحميل المراحل والسنوات الدراسية.</p>
        </div>
      </div>

      <div
        v-else-if="error"
        class="about-teacher-experience-state about-teacher-experience-state--error"
        role="alert"
        data-about-reveal
      >
        <span aria-hidden="true">!</span>
        <div>
          <strong>تعذر تحميل خريطة المراحل</strong>
          <p>يمكنك إعادة المحاولة لجلب المراحل والسنوات من المنصة.</p>
        </div>
        <button type="button" @click="refresh()">إعادة المحاولة</button>
      </div>

      <HomeSectionEmptyState
        v-else-if="!experienceStages.length"
        label="خبرة المدرس"
        title="أضف المراحل والسنوات الدراسية"
        description="عند إضافة المراحل والسنوات من لوحة التحكم ستظهر هنا كخريطة تعليمية تفاعلية."
      />

      <div v-else class="about-teacher-experience-map" data-about-reveal>
        <aside
          class="about-teacher-experience-nav"
          aria-label="اختر المرحلة الدراسية"
        >
          <header>
            <div>
              <span>خريطة التغطية</span>
              <strong>{{ experienceStages.length }} مراحل</strong>
            </div>
            <b>{{ totalYears }}</b>
          </header>

          <div role="tablist" aria-orientation="vertical">
            <button
              v-for="(stage, index) in experienceStages"
              :id="`experience-stage-tab-${stage.id}`"
              :key="stage.id"
              type="button"
              role="tab"
              class="about-teacher-experience-nav__item"
              :class="{
                active: selectedStage?.id === stage.id,
              }"
              :aria-selected="selectedStage?.id === stage.id"
              :aria-controls="`experience-stage-panel-${stage.id}`"
              :tabindex="selectedStage?.id === stage.id ? 0 : -1"
              @click="selectStage(stage.id)"
              @keydown="handleStageKeydown($event, index)"
            >
              <span>{{ stageNumber(index) }}</span>
              <div>
                <strong>{{ stage.label }}</strong>
                <small>{{ stage.years.length }} سنوات متاحة</small>
              </div>
              <i aria-hidden="true">←</i>
            </button>
          </div>
        </aside>

        <Transition name="about-experience-panel" mode="out-in">
          <article
            v-if="selectedStage"
            :id="`experience-stage-panel-${selectedStage.id}`"
            :key="selectedStage.id"
            class="about-teacher-experience-panel"
            role="tabpanel"
            :aria-labelledby="`experience-stage-tab-${selectedStage.id}`"
          >
            <span class="about-teacher-experience-panel__orb" aria-hidden="true" />

            <header>
              <div>
                <span>المسار التعليمي</span>
                <h3>{{ selectedStage.label }}</h3>
                <p>اختر السنة الدراسية وانتقل مباشرة إلى الكورسات المناسبة.</p>
              </div>
              <div class="about-teacher-experience-panel__metric">
                <strong>{{ selectedStage.years.length }}</strong>
                <span>سنوات<br />دراسية</span>
              </div>
            </header>

            <ol v-if="selectedStage.years.length" class="about-teacher-experience-years">
              <li
                v-for="(year, index) in selectedStage.years"
                :key="year.key"
                class="about-teacher-experience-year"
              >
                <NuxtLink :to="yearRoute(year)">
                  <span>{{ yearNumber(index) }}</span>
                  <div>
                    <small>الخطوة {{ index + 1 }}</small>
                    <h4>{{ year.label }}</h4>
                    <p>استكشف المحتوى والكورسات المتاحة لهذه السنة.</p>
                  </div>
                  <i aria-hidden="true">↗</i>
                </NuxtLink>
              </li>
            </ol>

            <div v-else class="about-teacher-experience-panel__empty">
              <span aria-hidden="true">—</span>
              <div>
                <strong>لا توجد سنوات مضافة لهذه المرحلة</strong>
                <p>ستظهر السنوات هنا تلقائيًا بعد إضافتها من لوحة التحكم.</p>
              </div>
            </div>
          </article>
        </Transition>
      </div>
    </div>
  </section>
</template>
