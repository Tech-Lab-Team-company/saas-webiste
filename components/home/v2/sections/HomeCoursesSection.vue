<script setup lang="ts">
import { gsap } from "gsap";
import HomeCourseCard from "~/components/home/v2/HomeCourseCard.vue";
import type {
  HomeCoursePageViewModel,
  HomeCourseTabKey,
  HomeCoursesViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  courses: HomeSectionState<HomeCoursesViewModel>;
  catalog?: boolean;
  loadCoursesByYear: (
    stageId: number,
    yearId: number,
    page?: number,
    perPage?: number,
  ) => Promise<HomeSectionState<HomeCoursePageViewModel>>;
}>();

const route = useRoute();
const router = useRouter();

const selectedStageId = ref<number | null>(null);
const selectedTabKey = ref<HomeCourseTabKey | null>(null);
const coursesByTab = ref<
  Partial<Record<HomeCourseTabKey, HomeSectionState<HomeCoursePageViewModel>>>
>({});
const loadingTabKey = ref<HomeCourseTabKey | null>(null);
const requestIds = ref<Partial<Record<HomeCourseTabKey, number>>>({});
const coursesSection = ref<HTMLElement | null>(null);
const courseResults = ref<HTMLElement | null>(null);
const sectionHasEntered = ref(false);
let coursesAnimationContext: ReturnType<typeof gsap.context> | null = null;
const MAX_PREVIEW_COURSES = 6;
const CATALOG_COURSES_PER_PAGE = 9;

const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type QuickMotion = ReturnType<typeof gsap.quickTo>;
type CourseCardMotionController = {
  visual: Element | null;
  cardXRotation: QuickMotion;
  cardYRotation: QuickMotion;
  cardY: QuickMotion;
  visualX?: QuickMotion;
  visualY?: QuickMotion;
};

const cardMotionControllers = new WeakMap<
  HTMLElement,
  CourseCardMotionController
>();
const cardResetCalls = new Map<
  HTMLElement,
  ReturnType<typeof gsap.delayedCall>
>();

const getCardMotionController = (card: HTMLElement) => {
  const visual = card.querySelector(".course-cover img, .course-mark");
  const cached = cardMotionControllers.get(card);

  if (cached?.visual === visual) return cached;

  const cardSettings = { duration: 0.65, ease: "power2.out" };
  const controller: CourseCardMotionController = {
    visual,
    cardXRotation: gsap.quickTo(card, "rotationX", cardSettings),
    cardYRotation: gsap.quickTo(card, "rotationY", cardSettings),
    cardY: gsap.quickTo(card, "y", cardSettings),
  };

  if (visual) {
    const visualSettings = { duration: 0.72, ease: "power2.out" };
    controller.visualX = gsap.quickTo(visual, "x", visualSettings);
    controller.visualY = gsap.quickTo(visual, "y", visualSettings);
  }

  cardMotionControllers.set(card, controller);
  return controller;
};

const selectedTab = computed(
  () =>
    props.courses.data.tabs.find((tab) => tab.key === selectedTabKey.value) ??
    null,
);

const selectedStage = computed(
  () =>
    props.courses.data.stages.find(
      (stage) => stage.id === selectedStageId.value,
    ) ?? null,
);

const availableYearTabs = computed(() =>
  props.courses.data.tabs.filter(
    (tab) => tab.stageId === selectedStageId.value,
  ),
);

const selectedCourses = computed<HomeSectionState<HomeCoursePageViewModel> | null>(() => {
  if (!selectedTab.value) {
    return null;
  }

  return coursesByTab.value[selectedTab.value.key] ?? null;
});

const visibleCourses = computed(() =>
  props.catalog
    ? selectedCourses.value?.data.courses ?? []
    : selectedCourses.value?.data.courses.slice(0, MAX_PREVIEW_COURSES) ?? [],
);

const coursePagination = computed(
  () => selectedCourses.value?.data.pagination ?? null,
);

const paginationPages = computed(() => {
  const pagination = coursePagination.value;
  if (!pagination || pagination.lastPage <= 1) return [];

  const visibleCount = Math.min(5, pagination.lastPage);
  const firstPage = Math.max(
    1,
    Math.min(
      pagination.currentPage - Math.floor(visibleCount / 2),
      pagination.lastPage - visibleCount + 1,
    ),
  );

  return Array.from({ length: visibleCount }, (_, index) => firstPage + index);
});

const normalizePage = (value: unknown) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

const selectStage = async (stageId: number) => {
  if (selectedStageId.value === stageId) return;

  selectedStageId.value = stageId;
  selectedTabKey.value = null;

  if (props.catalog) {
    const firstYear = props.courses.data.tabs.find(
      (tab) => tab.stageId === stageId,
    );

    if (firstYear) {
      await selectTab(firstYear.key, undefined, 1);
    } else {
      const { year_id: _yearId, page: _page, ...query } = route.query;
      await router.replace({
        query: { ...query, stage_id: String(stageId) },
      });
    }
  }
};

const selectTab = async (
  tabKey: HomeCourseTabKey,
  event?: Event,
  requestedPage = 1,
) => {
  const tab = props.courses.data.tabs.find((item) => item.key === tabKey);
  const page = normalizePage(requestedPage);

  if (!tab || loadingTabKey.value === tab.key) {
    return;
  }

  if (
    selectedTabKey.value === tab.key &&
    coursesByTab.value[tab.key]?.status !== "error" &&
    coursesByTab.value[tab.key]?.data.pagination.currentPage === page
  ) {
    return;
  }

  const selectedButton = event?.currentTarget as HTMLElement | null;
  if (selectedButton && !shouldReduceMotion()) {
    const indexBadge = selectedButton.querySelector(".stage-option-index");
    gsap.fromTo(
      indexBadge,
      { scale: 0.82, rotate: -4 },
      { scale: 1, rotate: 0, duration: 0.7, ease: "power3.out" },
    );
  }

  selectedStageId.value = tab.stageId;
  selectedTabKey.value = tab.key;
  loadingTabKey.value = tab.key;
  const requestId = (requestIds.value[tab.key] ?? 0) + 1;
  requestIds.value[tab.key] = requestId;

  if (
    props.catalog &&
    (String(route.query.stage_id ?? "") !== String(tab.stageId) ||
      String(route.query.year_id ?? "") !== String(tab.yearId) ||
      normalizePage(route.query.page) !== page)
  ) {
    await router.replace({
      query: {
        ...route.query,
        stage_id: String(tab.stageId),
        year_id: String(tab.yearId),
        page: String(page),
      },
    });
  }

  const result = await props.loadCoursesByYear(
    tab.stageId,
    tab.yearId,
    page,
    CATALOG_COURSES_PER_PAGE,
  );

  if (requestIds.value[tab.key] !== requestId) {
    return;
  }

  coursesByTab.value[tab.key] = result;

  const resolvedPage = result.data.pagination.currentPage;
  if (props.catalog && resolvedPage !== page) {
    await router.replace({
      query: {
        ...route.query,
        stage_id: String(tab.stageId),
        year_id: String(tab.yearId),
        page: String(resolvedPage),
      },
    });
  }

  if (loadingTabKey.value === tab.key) {
    loadingTabKey.value = null;
  }
};

const selectCatalogYearFromRoute = () => {
  if (!props.catalog || props.courses.data.tabs.length === 0) return;

  const requestedYearId = Number(route.query.year_id);
  const requestedStageId = Number(route.query.stage_id);
  const tab = props.courses.data.tabs.find(
    (item) => item.yearId === requestedYearId,
  ) ?? props.courses.data.tabs.find(
    (item) => item.stageId === requestedStageId,
  ) ?? props.courses.data.tabs[0];

  if (tab) void selectTab(tab.key, undefined, normalizePage(route.query.page));
};

onMounted(selectCatalogYearFromRoute);

watch(
  () => [
    route.query.stage_id,
    route.query.year_id,
    route.query.page,
    props.courses.data.tabs.map((tab) => tab.key).join(","),
  ],
  () => {
    if (!props.catalog) return;
    const requestedYearId = Number(route.query.year_id);
    const requestedStageId = Number(route.query.stage_id);
    const requestedPage = normalizePage(route.query.page);
    const tab = props.courses.data.tabs.find(
      (item) => item.yearId === requestedYearId,
    ) ?? props.courses.data.tabs.find(
      (item) => item.stageId === requestedStageId,
    );
    const loadedPage = tab
      ? coursesByTab.value[tab.key]?.data.pagination.currentPage
      : null;
    if (
      tab &&
      (tab.key !== selectedTabKey.value || loadedPage !== requestedPage)
    ) {
      void selectTab(tab.key, undefined, requestedPage);
    }
    else if (!selectedTabKey.value) selectCatalogYearFromRoute();
  },
);

const changePage = async (page: number) => {
  const tab = selectedTab.value;
  const pagination = coursePagination.value;
  if (
    !props.catalog ||
    !tab ||
    !pagination ||
    loadingTabKey.value === tab.key
  ) {
    return;
  }

  const nextPage = Math.min(pagination.lastPage, Math.max(1, page));
  if (nextPage === pagination.currentPage) return;

  await selectTab(tab.key, undefined, nextPage);
  await nextTick();
  courseResults.value?.scrollIntoView({
    behavior: shouldReduceMotion() ? "auto" : "smooth",
    block: "start",
  });
};

const animateCourseResults = async () => {
  await nextTick();

  const results = courseResults.value;
  if (!results || !sectionHasEntered.value || shouldReduceMotion()) return;

  const header = results.querySelector(".home-course-result-head");
  const cards = Array.from(results.querySelectorAll(".course-card"));
  const message = results.querySelector(
    ".home-course-message, .home-course-empty",
  );
  const targets = [header, message, ...cards].filter(
    (target): target is Element => Boolean(target),
  );

  gsap.killTweensOf(targets);
  gsap.fromTo(
    targets,
    {
      autoAlpha: 0,
      y: 30,
      scale: 0.98,
      rotationX: 3,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.92,
      stagger: targets.length > 1
        ? Math.min(0.1, 0.7 / (targets.length - 1))
        : 0,
      ease: "power2.out",
      clearProps: "opacity,visibility,transform",
    },
  );
};

const revealCoursesSection = () => {
  const section = coursesSection.value;
  if (!section || sectionHasEntered.value) return;

  sectionHasEntered.value = true;
  if (shouldReduceMotion()) return;

  coursesAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    timeline
      .from(".split-heading .section-tag", {
        autoAlpha: 0,
        x: 30,
        duration: 0.68,
      })
      .from(
        ".split-heading h2",
        { autoAlpha: 0, y: 38, duration: 1.05 },
        0.14,
      )
      .from(
        ".split-heading > p",
        { autoAlpha: 0, y: 24, duration: 0.82 },
        0.38,
      )
      .from(
        ".home-course-picker",
        {
          autoAlpha: 0,
          clipPath: "inset(0 50% 0 50%)",
          y: 24,
          duration: 1.15,
          ease: "power3.inOut",
        },
        0.58,
      )
      .from(
        ".home-course-audiences button",
        {
          autoAlpha: 0,
          y: 16,
          scale: 0.96,
          duration: 0.68,
          stagger: 0.11,
        },
        0.92,
      )
      .from(
        ".home-course-result > *",
        { autoAlpha: 0, y: 28, duration: 0.82 },
        1.16,
      )
      .from(
        ".all-courses",
        { autoAlpha: 0, y: 14, duration: 0.66 },
        1.38,
      );

    gsap.to(".home-course-motion-orb--one", {
      x: 30,
      y: -24,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".home-course-motion-orb--two", {
      x: -26,
      y: 30,
      duration: 11,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, section);
};

const tiltCourseCard = (event: PointerEvent) => {
  if (event.pointerType === "touch" || shouldReduceMotion()) return;

  const card = event.currentTarget as HTMLElement;
  const bounds = card.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
  const controller = getCardMotionController(card);

  cardResetCalls.get(card)?.kill();
  cardResetCalls.delete(card);
  controller.cardYRotation(horizontal * 3.5);
  controller.cardXRotation(vertical * -3.5);
  controller.cardY(-6);
  controller.visualX?.(horizontal * 9);
  controller.visualY?.(vertical * 7);
};

const resetCourseCard = (event: PointerEvent) => {
  const card = event.currentTarget as HTMLElement;
  const controller = getCardMotionController(card);

  controller.cardXRotation(0);
  controller.cardYRotation(0);
  controller.cardY(0);
  controller.visualX?.(0);
  controller.visualY?.(0);

  cardResetCalls.get(card)?.kill();
  const resetCall = gsap.delayedCall(0.88, () => {
    if (!card.matches(":hover")) {
      gsap.set(card, { clearProps: "transform" });
      if (controller.visual) {
        gsap.set(controller.visual, { clearProps: "transform" });
      }
    }
    cardResetCalls.delete(card);
  });
  cardResetCalls.set(card, resetCall);
};

watch(
  () => [
    selectedTabKey.value,
    loadingTabKey.value,
    selectedCourses.value?.status,
    coursePagination.value?.currentPage,
    visibleCourses.value.map((course) => course.id).join(","),
  ],
  animateCourseResults,
  { flush: "post" },
);

useScrollTriggeredReveal(coursesSection, revealCoursesSection, {
  threshold: 0.12,
});

onBeforeUnmount(() => {
  coursesAnimationContext?.revert();
  cardResetCalls.forEach((call) => call.kill());
  cardResetCalls.clear();
  if (coursesSection.value) {
    gsap.killTweensOf(coursesSection.value.querySelectorAll("*"));
  }
});
</script>

<template>
  <section
    id="courses"
    ref="coursesSection"
    class="section courses home-course-showcase"
    :class="{ 'is-entered': sectionHasEntered }"
    aria-labelledby="home-v2-courses-title"
  >
    <div class="home-course-motion" aria-hidden="true">
      <span class="home-course-motion-orb home-course-motion-orb--one" />
      <span class="home-course-motion-orb home-course-motion-orb--two" />
    </div>
    <div class="container">
      <div class="section-heading split-heading">
        <div>
          <span class="section-tag">اختار نقطة البداية</span>
          <h2 id="home-v2-courses-title">
            ابدأ من مرحلتك.<br />وكمل <em>بخطة واضحة.</em>
          </h2>
        </div>
        <p>
          كل مرحلة لها سنواتها ومساراتها. اختار مرحلتك وسنتك علشان تشوف
          الكورسات المناسبة ليك فقط.
        </p>
      </div>

      <div class="home-course-picker">
        <div>
          <span>خطوتك الأولى</span>
          <h3 id="home-v2-stage-title">اختار مرحلتك التعليمية</h3>
          <p id="home-v2-stage-help">
            المراحل هنا بتتغير تلقائيًا حسب إعدادات المنصة.
          </p>
        </div>

        <div
          v-if="courses.data.taxonomyStatus === 'success'"
          class="home-course-audiences"
          role="group"
          aria-labelledby="home-v2-stage-title"
          aria-describedby="home-v2-stage-help"
        >
          <button
            v-for="(stage, index) in courses.data.stages"
            :key="stage.id"
            type="button"
            :class="{ active: selectedStageId === stage.id }"
            :aria-pressed="selectedStageId === stage.id"
            aria-controls="home-v2-course-results"
            @click="selectStage(stage.id)"
          >
            <span class="stage-option-index" aria-hidden="true">
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <span class="stage-option-label">{{ stage.label }}</span>
            <small>اختار</small>
          </button>
        </div>

        <div
          v-else
          class="home-course-taxonomy-state"
          :class="{ 'is-error': courses.data.taxonomyStatus === 'error' }"
          role="status"
        >
          <strong v-if="courses.data.taxonomyStatus === 'loading'">
            جاري تحميل المراحل والسنوات...
          </strong>
          <template v-else-if="courses.data.taxonomyStatus === 'error'">
            <strong>تعذر تحميل المراحل التعليمية</strong>
            <span>{{ courses.data.taxonomyError }}</span>
          </template>
          <strong v-else>لا توجد مراحل تعليمية متاحة حاليًا</strong>
        </div>
      </div>

      <div v-if="selectedStage" class="home-course-picker home-course-year-picker">
        <div>
          <span>خطوتك الثانية</span>
          <h3 id="home-v2-year-title">اختار السنة الدراسية</h3>
          <p>سنوات {{ selectedStage.label }} المتاحة على المنصة.</p>
        </div>

        <div
          v-if="availableYearTabs.length"
          class="home-course-audiences"
          role="group"
          aria-labelledby="home-v2-year-title"
        >
          <button
            v-for="(tab, index) in availableYearTabs"
            :key="tab.key"
            type="button"
            :class="{ active: selectedTabKey === tab.key }"
            :aria-pressed="selectedTabKey === tab.key"
            aria-controls="home-v2-course-results"
            @click="selectTab(tab.key, $event)"
          >
            <span class="stage-option-index" aria-hidden="true">
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <span class="stage-option-label">{{ tab.label }}</span>
            <small>{{ loadingTabKey === tab.key ? "جاري التحميل" : "اختار" }}</small>
          </button>
        </div>

        <div v-else class="home-course-taxonomy-state">
          <strong>لا توجد سنوات دراسية متاحة لهذه المرحلة</strong>
        </div>
      </div>

      <div
        id="home-v2-course-results"
        ref="courseResults"
        class="home-course-result"
        :class="{ 'is-empty': !selectedTab }"
        aria-live="polite"
      >
        <div v-if="!selectedTab" class="home-course-empty">
          <span class="home-course-empty-step" aria-hidden="true">
            {{ selectedStage ? "02" : "01" }}
          </span>
          <div>
            <span>البداية من هنا</span>
            <h3>
              {{ selectedStage ? "اختار السنة الدراسية" : "اختار مرحلتك من فوق" }}
            </h3>
            <p>
              هنظهر لك الكورسات المناسبة للمرحلة والسنة المختارتين فقط.
            </p>
          </div>
          <span class="home-course-empty-arrow" aria-hidden="true">↑</span>
        </div>

        <template v-else>
          <div class="home-course-result-head">
            <div>
              <span>المسار المختار</span>
              <h3>كورسات {{ selectedTab.label }}</h3>
            </div>
            <b v-if="coursePagination">{{ coursePagination.total }} كورس</b>
          </div>

          <div
            v-if="loadingTabKey === selectedTab.key"
            class="home-course-message"
            role="status"
          >
            <span>جاري التحميل</span>
            <h3>بنجهز لك كورسات {{ selectedTab.label }}</h3>
            <p>ثواني ونظهر لك المحتوى المتاح لسنتك.</p>
          </div>

          <div
            v-else-if="selectedCourses?.status === 'error'"
            class="home-course-message"
            role="alert"
          >
            <span>تعذر التحميل</span>
            <h3>لم نتمكن من عرض الكورسات الآن</h3>
            <p>{{ selectedCourses.error?.message }}</p>
            <button
              type="button"
              @click="selectTab(selectedTab.key, undefined, coursePagination?.currentPage ?? 1)"
            >
              حاول مرة أخرى
            </button>
          </div>

          <div
            v-else-if="selectedCourses?.status === 'empty'"
            class="home-course-message"
            role="status"
          >
            <span>لا توجد كورسات</span>
            <h3>لا توجد كورسات متاحة لـ {{ selectedTab.label }} حاليًا</h3>
            <p>ستظهر الكورسات والمراجعات هنا فور إتاحتها.</p>
          </div>

          <template v-else-if="selectedCourses">
            <div class="course-grid">
              <HomeCourseCard
                v-for="(course, index) in visibleCourses"
                :key="course.id"
                :course="course"
                :level-label="selectedTab.label"
                :index="index"
                :animate="false"
                :interactive="false"
                @pointermove="tiltCourseCard"
                @pointerleave="resetCourseCard"
              />
            </div>

            <nav
              v-if="catalog && coursePagination && coursePagination.lastPage > 1"
              class="home-course-pagination"
              aria-label="صفحات الكورسات"
            >
              <button
                type="button"
                class="home-course-pagination__arrow"
                :disabled="coursePagination.currentPage === 1 || loadingTabKey === selectedTab.key"
                aria-label="الصفحة السابقة"
                @click="changePage(coursePagination.currentPage - 1)"
              >
                <span aria-hidden="true">→</span>
              </button>

              <button
                v-for="page in paginationPages"
                :key="page"
                type="button"
                :class="{ active: page === coursePagination.currentPage }"
                :aria-current="page === coursePagination.currentPage ? 'page' : undefined"
                :aria-label="`الصفحة ${page}`"
                :disabled="loadingTabKey === selectedTab.key"
                @click="changePage(page)"
              >
                {{ page }}
              </button>

              <button
                type="button"
                class="home-course-pagination__arrow"
                :disabled="coursePagination.currentPage === coursePagination.lastPage || loadingTabKey === selectedTab.key"
                aria-label="الصفحة التالية"
                @click="changePage(coursePagination.currentPage + 1)"
              >
                <span aria-hidden="true">←</span>
              </button>
            </nav>

            <p
              v-if="catalog && coursePagination"
              class="home-course-pagination__summary"
            >
              صفحة {{ coursePagination.currentPage }} من {{ coursePagination.lastPage }}
              · إجمالي {{ coursePagination.total }} كورس
            </p>
          </template>
        </template>
      </div>

      <NuxtLink
        v-if="!catalog"
        :to="selectedTab ? `/course?stage_id=${selectedTab.stageId}&year_id=${selectedTab.yearId}` : '/course'"
        class="all-courses"
      >
        {{ selectedTab ? `كل كورسات ${selectedTab.label}` : "صفحة كل الكورسات" }}
        <span aria-hidden="true">←</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.home-course-showcase {
  --line: var(--home-v2-line);
  --paper: var(--home-v2-paper);
  --deep: var(--home-v2-deep);
  --teal: var(--home-v2-blue);
  --coral: var(--home-v2-coral);
  --ink: var(--home-v2-ink);
  --heading: var(--home-v2-heading);
  position: relative;
  overflow: hidden;
  background: var(--paper);
}

.home-course-showcase > .container {
  position: relative;
  z-index: 1;
}

.home-course-motion {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.home-course-motion-orb {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--teal) 10%, transparent);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--teal) 6%, transparent),
    transparent 68%
  );
}

.home-course-motion-orb--one {
  top: 5%;
  inset-inline-end: -180px;
  width: 420px;
  height: 420px;
}

.home-course-motion-orb--two {
  bottom: 4%;
  inset-inline-start: -220px;
  width: 520px;
  height: 520px;
}

.split-heading {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: end;
  gap: 60px;
  margin-bottom: 38px;
}

.home-course-showcase h2 {
  margin: 14px 0 0;
  font: 900 clamp(38px, 4.1vw, 58px) / 1.18 var(--heading);
}

.home-course-showcase h2 em {
  color: var(--teal);
  font-style: normal;
}

.split-heading > p,
.home-course-picker p,
.home-course-empty p,
.home-course-message p {
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-course-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  margin-bottom: 32px;
  padding: 24px 28px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--teal) 6%, var(--paper));
}

.home-course-year-picker {
  margin-top: -18px;
  background: color-mix(in srgb, var(--deep) 5%, var(--paper));
}

.home-course-picker > div:first-child {
  min-width: 270px;
}

.home-course-picker > div:first-child > span,
.home-course-result-head span,
.home-course-message > span,
.home-course-empty > div > span,
.teacher {
  color: var(--coral);
  font-size: 11px;
  font-weight: 900;
}

.home-course-picker h3 {
  margin: 5px 0 3px;
  color: var(--ink);
  font: 900 20px/1.4 var(--heading);
}

.home-course-picker > div:first-child > p {
  color: var(--home-v2-muted);
  font-weight: 600;
}

.home-course-audiences {
  display: grid;
  width: min(100%, 720px);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));
  gap: 8px;
}

.home-course-taxonomy-state {
  width: min(100%, 720px);
  display: flex;
  min-height: 74px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  border: 1px dashed color-mix(in srgb, var(--teal) 35%, transparent);
  background: var(--home-v2-surface);
  color: var(--home-v2-muted);
  text-align: center;
}

.home-course-taxonomy-state strong {
  color: var(--ink);
  font: 800 13px/1.5 var(--heading);
}

.home-course-taxonomy-state span {
  font-size: 11px;
}

.home-course-taxonomy-state.is-error {
  border-color: color-mix(in srgb, var(--coral) 55%, transparent);
}

.home-course-audiences button {
  display: grid;
  min-width: 0;
  min-height: 82px;
  grid-template-columns: 48px minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 2px 12px;
  overflow: hidden;
  padding: 7px;
  border: 1px solid #12313929;
  background: #fff;
  color: #61777c;
  cursor: pointer;
  text-align: right;
  transition: color 0.2s ease, border-color 0.2s ease,
    background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.home-course-audiences button:hover {
  border-color: var(--teal);
  color: var(--ink);
  box-shadow: 0 12px 24px -20px #12313999;
  transform: translateY(-2px);
}

.home-course-audiences button:focus-visible,
.course-card:focus-visible,
.all-courses:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--coral) 65%, transparent);
  outline-offset: 4px;
}

.home-course-audiences button.active {
  border-color: var(--deep);
  background: var(--deep);
  color: #fff;
  box-shadow: inset 0 -3px var(--coral), 0 14px 26px -22px var(--deep);
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
  transition: inherit;
}

.home-course-audiences button.active .stage-option-index {
  border-color: #ffffff47;
  background: #ffffff24;
  color: #fff;
}

.stage-option-label {
  min-width: 0;
  display: -webkit-box;
  overflow: hidden;
  color: inherit;
  font: 800 14px/1.45 var(--heading);
  overflow-wrap: anywhere;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.home-course-audiences small {
  color: var(--home-v2-muted);
  font-size: 10px;
  font-weight: 800;
}

.home-course-audiences button.active small {
  color: #ffffffb8;
}

.home-course-result {
  min-height: 180px;
}

.home-course-result .course-grid {
  perspective: 1200px;
}

.home-course-empty,
.home-course-message {
  position: relative;
  overflow: hidden;
  min-height: 180px;
  border: 1px dashed color-mix(in srgb, var(--teal) 38%, transparent);
  background: linear-gradient(135deg, #e8f2ef, #f8fbfa);
}

.home-course-empty {
  display: grid;
  grid-template-columns: auto minmax(0, 560px) auto;
  place-content: center;
  align-items: center;
  gap: 28px;
  padding: 34px;
}

.home-course-empty::before,
.home-course-message::before {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 6px;
  background: var(--coral);
  content: "";
}

.home-course-empty-step {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--deep);
  box-shadow: 0 18px 34px -28px #12313999;
  font: 900 14px var(--heading);
}

.home-course-empty h3,
.home-course-message h3 {
  margin: 4px 0;
  font: 900 clamp(22px, 3vw, 31px) / 1.3 var(--heading);
}

.home-course-empty-arrow {
  color: var(--coral);
  font-size: 34px;
  font-weight: 900;
  animation: home-course-nudge 2.3s ease-in-out infinite;
  animation-play-state: paused;
}

.home-course-showcase.is-entered .home-course-empty-arrow {
  animation-play-state: running;
}

.home-course-result-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.home-course-result-head h3 {
  margin: 3px 0 0;
  font: 900 clamp(24px, 3vw, 34px) / 1.3 var(--heading);
}

.home-course-result-head > b {
  padding: 6px 11px;
  border: 1px solid var(--line);
  color: var(--teal);
  font-size: 12px;
}

.home-course-message {
  display: grid;
  align-content: center;
  gap: 5px;
  padding: clamp(28px, 4vw, 42px);
}

.home-course-message button {
  width: max-content;
  min-height: 42px;
  margin-top: 8px;
  padding: 0 17px;
  border: 0;
  background: var(--deep);
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.home-course-message button:hover {
  background: var(--teal);
  transform: translateY(-2px);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.home-course-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 34px;
}

.home-course-pagination button {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--line);
  background: var(--home-v2-surface);
  color: var(--ink);
  cursor: pointer;
  font: 900 13px var(--heading);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.home-course-pagination button:hover:not(:disabled) {
  border-color: var(--teal);
  color: var(--teal);
  transform: translateY(-2px);
}

.home-course-pagination button.active {
  border-color: var(--deep);
  background: var(--deep);
  color: #fff;
  box-shadow: inset 0 -3px var(--coral);
}

.home-course-pagination button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--coral) 55%, transparent);
  outline-offset: 3px;
}

.home-course-pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.home-course-pagination__arrow span {
  font-size: 18px;
  line-height: 1;
}

.home-course-pagination__summary {
  margin: 12px 0 0;
  color: var(--home-v2-muted);
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}

.course-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  box-shadow: 0 10px 28px -30px #12313966;
  transform-style: preserve-3d;
  transform-origin: center center;
  will-change: transform;
  transition: border-color 0.25s ease, transform 0.25s ease,
    box-shadow 0.25s ease;
}

.course-card:hover {
  border-color: color-mix(in srgb, var(--teal) 55%, var(--line));
  box-shadow: 0 24px 54px -34px #12313980;
  transform: translateY(-8px);
}

.course-cover {
  position: relative;
  /* height: 226px; */
  height: 300px;
  overflow: hidden;
  padding: 20px;
  background: #d8e9e5;
  transform: translateZ(1px);
}

.course-cover::before {
  position: absolute;
  bottom: -90px;
  left: -50px;
  width: 230px;
  height: 230px;
  border: 1px solid #1231392b;
  border-radius: 50%;
  content: "";
  transition: transform 0.45s ease;
}

.course-card:hover .course-cover::before {
  transform: scale(1.08) translate(5px, -4px);
}

.course-card.violet .course-cover {
  background: #dcd8ed;
}

.course-card.sky .course-cover {
  background: #bcdadc;
}

.course-card.deep .course-cover {
  background: var(--deep);
  color: #fff;
}

.course-cover.has-image {
  padding: 0;
  background: #d8e9e5;
}

.course-cover.has-image::before {
  z-index: 1;
  border-color: #ffffff52;
}

.course-cover :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.2, 0.75, 0.25, 1);
}

.course-card:hover .course-cover :deep(img) {
  transform: scale(1.045);
}

.course-code {
  font: 800 10px var(--heading);
  letter-spacing: 0.15em;
}

.course-index {
  position: absolute;
  top: 18px;
  left: 20px;
  font: 700 11px var(--heading);
}

.course-mark {
  position: absolute;
  right: 26px;
  bottom: -25px;
  opacity: 0.16;
  font: 900 152px/1 var(--heading);
  transition: opacity 0.25s ease, transform 0.35s ease;
}

.course-card:hover .course-mark {
  opacity: 0.22;
  transform: translateY(-4px);
}

.level-pill {
  position: absolute;
  right: 20px;
  bottom: 18px;
  padding: 7px 11px;
  background: #ffffffe0;
  color: var(--ink);
  font-size: 10px;
  font-weight: 800;
}

.course-content {
  display: flex;
  min-height: 225px;
  flex: 1;
  flex-direction: column;
  padding: 25px;
}

.course-content h3 {
  display: -webkit-box;
  margin: 7px 0 10px;
  overflow: hidden;
  font: 800 21px/1.35 var(--heading);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.course-content p {
  display: -webkit-box;
  min-height: 68px;
  margin: 0;
  overflow: hidden;
  color: #6b7e82;
  font-size: 13px;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.course-footer {
  display: grid;
  grid-template-columns: 1fr auto 38px;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  font-size: 12px;
  font-weight: 800;
}

.course-footer > b {
  color: var(--deep);
  font: 900 13px var(--heading);
}

.course-arrow {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  background: var(--ink);
  color: #fff;
  font-size: 18px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.course-card:hover .course-arrow {
  background: var(--coral);
  transform: translateX(-2px);
}

.all-courses {
  display: flex;
  width: max-content;
  gap: 18px;
  margin: 36px auto 0;
  padding-bottom: 7px;
  border-bottom: 1px solid;
  color: var(--ink);
  font-size: 13px;
  font-weight: 800;
  transition: color 0.2s ease, gap 0.2s ease;
}

.all-courses:hover {
  gap: 23px;
  color: var(--coral);
}

@keyframes home-course-swap {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes home-course-nudge {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@media (max-width: 820px) {
  .split-heading {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .home-course-picker {
    align-items: stretch;
    flex-direction: column;
  }

  .home-course-picker > div:first-child,
  .home-course-audiences,
  .home-course-taxonomy-state {
    width: 100%;
    min-width: 0;
  }

  .course-grid {
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
  .home-course-picker {
    padding: 20px;
  }

  .home-course-audiences {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 130px), 1fr));
  }

  .home-course-audiences button {
    display: flex;
    min-height: 58px;
    justify-content: center;
    padding: 8px;
    text-align: center;
  }

  .stage-option-index,
  .home-course-audiences small {
    display: none;
  }

  .stage-option-label {
    display: block;
    font-size: 13px;
    -webkit-line-clamp: unset;
  }

  .course-grid {
    grid-template-columns: 1fr;
  }

  .home-course-result-head {
    align-items: start;
    flex-direction: column;
  }

  .home-course-empty {
    grid-template-columns: 1fr;
    padding: 26px;
  }

  .home-course-empty-step {
    display: none;
  }
}

@media (max-width: 430px) {
  .home-course-audiences {
    grid-template-columns: 1fr;
  }

  .home-course-pagination {
    gap: 5px;
  }

  .home-course-pagination button {
    width: 38px;
    height: 38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-course-result .course-grid,
  .home-course-empty-arrow {
    animation: none;
  }

  .course-card,
  .course-cover :deep(img),
  .course-mark,
  .course-arrow,
  .home-course-audiences button {
    transition: none;
  }

  .course-card {
    will-change: auto;
  }

  .home-course-motion {
    display: none;
  }
}
</style>
