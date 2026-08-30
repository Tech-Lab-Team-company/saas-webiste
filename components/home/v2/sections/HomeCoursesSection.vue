<script setup lang="ts">
import { gsap } from "gsap";
import HomeCourseCard from "~/components/home/v2/HomeCourseCard.vue";
import type {
  HomeCoursePageViewModel,
  HomeCourseTabKey,
  HomeCoursesViewModel,
  HomeTeacherViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  courses: HomeSectionState<HomeCoursesViewModel>;
  teachers: HomeSectionState<HomeTeacherViewModel[]>;
  teacherFilterEnabled?: boolean;
  catalog?: boolean;
  initialTeacherId?: number | null;
  initialWord?: string;
  loadCoursesByYear: (
    stageId: number,
    yearId: number,
    page?: number,
    perPage?: number,
    teacherId?: number | null,
    word?: string,
  ) => Promise<HomeSectionState<HomeCoursePageViewModel>>;
  loadGeneralCourses: (
    page?: number,
    perPage?: number,
    teacherId?: number | null,
    word?: string,
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
let homepageAutoSelectionRunId = 0;
const MAX_PREVIEW_COURSES = 6;
const CATALOG_COURSES_PER_PAGE = 9;
const isGeneralMode = computed(
  () =>
    props.courses.data.mode === "general" &&
    props.courses.data.taxonomyStatus !== "success",
);
const generalCatalogState = ref<HomeSectionState<HomeCoursePageViewModel>>({
  data: props.courses.data.generalCatalog,
  status: props.courses.data.generalCatalogStatus === "loading"
    ? "empty"
    : props.courses.data.generalCatalogStatus,
  ...(props.courses.data.generalCatalogError
    ? {
        error: {
          type: "unknown" as const,
          message: props.courses.data.generalCatalogError,
        },
      }
    : {}),
});
const generalCatalogLoading = ref(false);
let generalCatalogRequestId = 0;
const courseSearchLoading = computed(() =>
  isGeneralMode.value
    ? generalCatalogLoading.value
    : loadingTabKey.value !== null,
);
const selectedTeacherId = ref<number | null>(
  props.teacherFilterEnabled ? props.initialTeacherId ?? null : null,
);
const loadedGeneralTeacherId = ref<number | null>(selectedTeacherId.value);
const normalizeWord = (value: unknown) =>
  typeof value === "string" ? value.trim().slice(0, 100) : "";
const searchWord = ref(
  props.catalog ? normalizeWord(route.query.word ?? props.initialWord) : "",
);
const loadedGeneralWord = ref(searchWord.value);
const loadedWordByTab = ref<Partial<Record<HomeCourseTabKey, string>>>({});
let courseSearchTimer: ReturnType<typeof setTimeout> | null = null;
const failedTeacherImages = ref<Set<number>>(new Set());

const selectedTeacher = computed(
  () =>
    props.teachers.data.find(
      (teacher) => teacher.id === selectedTeacherId.value,
    ) ?? null,
);

const teacherInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const markTeacherImageAsFailed = (teacherId: number) => {
  failedTeacherImages.value = new Set(failedTeacherImages.value).add(teacherId);
};

const cancelHomepageAutoSelection = () => {
  homepageAutoSelectionRunId += 1;
};

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
  isGeneralMode.value
    ? props.catalog
      ? generalCatalogState.value.data.courses
      : generalCatalogState.value.data.courses.slice(0, MAX_PREVIEW_COURSES)
    : props.catalog
    ? selectedCourses.value?.data.courses ?? []
    : selectedCourses.value?.data.courses.slice(0, MAX_PREVIEW_COURSES) ?? [],
);

const coursePagination = computed(
  () => isGeneralMode.value
    ? generalCatalogState.value.data.pagination
    : selectedCourses.value?.data.pagination ?? null,
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

const normalizeTeacherId = (value: unknown) => {
  const teacherId = Number(value);
  return Number.isInteger(teacherId) && teacherId > 0 ? teacherId : null;
};

watch(
  () => [
    props.courses.data.generalCatalog,
    props.courses.data.generalCatalogStatus,
    props.courses.data.generalCatalogError,
  ] as const,
  ([catalog, status, error]) => {
    if (!isGeneralMode.value || generalCatalogLoading.value) return;

    generalCatalogState.value = {
      data: catalog,
      status: status === "loading" ? "empty" : status,
      ...(error
        ? { error: { type: "unknown" as const, message: error } }
        : {}),
    };
  },
  { immediate: true },
);

const loadGeneralPage = async (
  requestedPage = 1,
  teacherId = selectedTeacherId.value,
  word = searchWord.value,
) => {
  if (!isGeneralMode.value) return;

  const page = normalizePage(requestedPage);
  const normalizedWord = normalizeWord(word);
  const requestId = ++generalCatalogRequestId;
  selectedTeacherId.value = teacherId;
  searchWord.value = normalizedWord;
  generalCatalogLoading.value = true;

  try {
    if (
      props.catalog &&
      (normalizePage(route.query.page) !== page ||
        normalizeTeacherId(route.query.teacher_id) !== teacherId ||
        normalizeWord(route.query.word) !== normalizedWord)
    ) {
      const {
        stage_id: _stageId,
        year_id: _yearId,
        teacher_id: _teacherId,
        word: _word,
        page: _page,
        ...query
      } = route.query;
      await router.replace({
        query: {
          ...query,
          ...(teacherId ? { teacher_id: String(teacherId) } : {}),
          ...(normalizedWord ? { word: normalizedWord } : {}),
          ...(page > 1 ? { page: String(page) } : {}),
        },
      });
    }

    const result = await props.loadGeneralCourses(
      page,
      CATALOG_COURSES_PER_PAGE,
      teacherId,
      normalizedWord,
    );

    if (requestId !== generalCatalogRequestId) return;

    generalCatalogState.value = result;
    loadedGeneralTeacherId.value = teacherId;
    loadedGeneralWord.value = normalizedWord;
  } finally {
    if (requestId === generalCatalogRequestId) {
      generalCatalogLoading.value = false;
    }
  }
};

const selectTeacher = async (teacherId: number | null) => {
  if (
    teacherId === selectedTeacherId.value &&
    generalCatalogState.value.status !== "error"
  ) {
    return;
  }

  if (isGeneralMode.value) {
    await loadGeneralPage(1, teacherId, searchWord.value);
    await animateCourseResults();
    return;
  }

  const currentTab = selectedTab.value;
  selectedTeacherId.value = teacherId;
  coursesByTab.value = {};
  loadedWordByTab.value = {};

  if (props.catalog) {
    const { teacher_id: _teacherId, page: _page, ...query } = route.query;
    await router.replace({
      query: {
        ...query,
        ...(teacherId ? { teacher_id: String(teacherId) } : {}),
      },
    });
  }

  if (currentTab) {
    await selectTab(currentTab.key, undefined, 1);
  }
  await animateCourseResults();
};

const selectStage = async (stageId: number) => {
  if (selectedStageId.value === stageId) return;

  if (!props.catalog) {
    cancelHomepageAutoSelection();
  }

  selectedStageId.value = stageId;
  selectedTabKey.value = null;

  if (props.catalog) {
    const { year_id: _yearId, page: _page, ...query } = route.query;
    await router.replace({
      query: { ...query, stage_id: String(stageId) },
    });
  }
};

const selectTab = async (
  tabKey: HomeCourseTabKey,
  event?: Event,
  requestedPage = 1,
  isHomepageAutoSelection = false,
) => {
  if (!props.catalog && !isHomepageAutoSelection) {
    cancelHomepageAutoSelection();
  }

  const tab = props.courses.data.tabs.find((item) => item.key === tabKey);
  const page = normalizePage(requestedPage);

  if (!tab || loadingTabKey.value === tab.key) {
    return;
  }

  if (
    selectedTabKey.value === tab.key &&
    coursesByTab.value[tab.key]?.status !== "error" &&
    coursesByTab.value[tab.key]?.data.pagination.currentPage === page &&
    loadedWordByTab.value[tab.key] === searchWord.value
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
      normalizePage(route.query.page) !== page ||
      normalizeWord(route.query.word) !== searchWord.value)
  ) {
    const { word: _word, ...query } = route.query;
    await router.replace({
      query: {
        ...query,
        stage_id: String(tab.stageId),
        year_id: String(tab.yearId),
        page: String(page),
        ...(searchWord.value ? { word: searchWord.value } : {}),
      },
    });
  }

  const result = await props.loadCoursesByYear(
    tab.stageId,
    tab.yearId,
    page,
    CATALOG_COURSES_PER_PAGE,
    selectedTeacherId.value,
    searchWord.value,
  );

  if (requestIds.value[tab.key] !== requestId) {
    return;
  }

  coursesByTab.value[tab.key] = result;
  loadedWordByTab.value[tab.key] = searchWord.value;

  const resolvedPage = result.data.pagination.currentPage;
  if (props.catalog && resolvedPage !== page) {
    const { word: _word, ...query } = route.query;
    await router.replace({
      query: {
        ...query,
        stage_id: String(tab.stageId),
        year_id: String(tab.yearId),
        page: String(resolvedPage),
        ...(searchWord.value ? { word: searchWord.value } : {}),
      },
    });
  }

  if (loadingTabKey.value === tab.key) {
    loadingTabKey.value = null;
  }
};

const autoSelectHomepageCourseTab = async () => {
  if (
    props.catalog ||
    isGeneralMode.value ||
    selectedTabKey.value !== null ||
    props.courses.data.tabs.length === 0
  ) {
    return;
  }

  const runId = ++homepageAutoSelectionRunId;
  const [fallbackTab] = props.courses.data.tabs;

  for (const tab of props.courses.data.tabs) {
    if (runId !== homepageAutoSelectionRunId) return;

    try {
      await selectTab(tab.key, undefined, 1, true);
    } catch {
      if (loadingTabKey.value === tab.key) {
        loadingTabKey.value = null;
      }
    }

    if (runId !== homepageAutoSelectionRunId) return;

    const result = coursesByTab.value[tab.key];
    if (result?.data.courses.length) {
      await animateCourseResults();
      return;
    }
  }

  if (fallbackTab && runId === homepageAutoSelectionRunId) {
    selectedStageId.value = fallbackTab.stageId;
    selectedTabKey.value = fallbackTab.key;
  }
};

const selectCatalogYearFromRoute = () => {
  if (!props.catalog || props.courses.data.tabs.length === 0) return;

  const requestedYearId = Number(route.query.year_id);
  const requestedStageId = Number(route.query.stage_id);
  const tab = props.courses.data.tabs.find(
    (item) => item.yearId === requestedYearId,
  );

  if (tab) {
    void selectTab(tab.key, undefined, normalizePage(route.query.page));
    return;
  }

  const stage = props.courses.data.stages.find(
    (item) => item.id === requestedStageId,
  );
  selectedStageId.value = stage?.id ?? null;
  selectedTabKey.value = null;
};

onMounted(() => {
  if (isGeneralMode.value) {
    const requestedPage = normalizePage(route.query.page);
    const requestedTeacherId = props.teacherFilterEnabled
      ? normalizeTeacherId(route.query.teacher_id)
      : null;
    const requestedWord = normalizeWord(route.query.word);
    if (
      props.catalog &&
      (requestedPage !== coursePagination.value?.currentPage ||
        requestedTeacherId !== loadedGeneralTeacherId.value ||
        requestedWord !== loadedGeneralWord.value)
    ) {
      void loadGeneralPage(requestedPage, requestedTeacherId, requestedWord);
    }
    return;
  }

  if (!props.catalog) {
    void autoSelectHomepageCourseTab();
    return;
  }

  selectCatalogYearFromRoute();
});

watch(
  () => props.courses.data.tabs.map((tab) => tab.key).join(","),
  () => {
    if (!props.catalog && selectedTabKey.value === null) {
      void autoSelectHomepageCourseTab();
    }
  },
  { flush: "post" },
);

watch(
  () => [
    route.query.stage_id,
    route.query.year_id,
    route.query.teacher_id,
    route.query.word,
    route.query.page,
    props.courses.data.tabs.map((tab) => tab.key).join(","),
  ],
  () => {
    if (!props.catalog) return;
    if (isGeneralMode.value) {
      const requestedPage = normalizePage(route.query.page);
      const requestedTeacherId = props.teacherFilterEnabled
        ? normalizeTeacherId(route.query.teacher_id)
        : null;
      const requestedWord = normalizeWord(route.query.word);
      if (
        (requestedPage !== generalCatalogState.value.data.pagination.currentPage ||
          requestedTeacherId !== loadedGeneralTeacherId.value ||
          requestedWord !== loadedGeneralWord.value) &&
        !generalCatalogLoading.value
      ) {
        void loadGeneralPage(requestedPage, requestedTeacherId, requestedWord);
      }
      return;
    }
    const requestedTeacherId = props.teacherFilterEnabled
      ? normalizeTeacherId(route.query.teacher_id)
      : null;
    if (requestedTeacherId !== selectedTeacherId.value) {
      selectedTeacherId.value = requestedTeacherId;
      coursesByTab.value = {};
      loadedWordByTab.value = {};
    }
    const requestedWord = normalizeWord(route.query.word);
    if (requestedWord !== searchWord.value) {
      searchWord.value = requestedWord;
      coursesByTab.value = {};
      loadedWordByTab.value = {};
    }
    const requestedYearId = Number(route.query.year_id);
    const requestedStageId = Number(route.query.stage_id);
    const requestedPage = normalizePage(route.query.page);
    const tab = props.courses.data.tabs.find(
      (item) => item.yearId === requestedYearId,
    );
    const loadedPage = tab
      ? coursesByTab.value[tab.key]?.data.pagination.currentPage
      : null;
    if (
      tab &&
      (tab.key !== selectedTabKey.value ||
        loadedPage !== requestedPage ||
        loadedWordByTab.value[tab.key] !== requestedWord)
    ) {
      void selectTab(tab.key, undefined, requestedPage);
    }
    else if (!tab) {
      const stage = props.courses.data.stages.find(
        (item) => item.id === requestedStageId,
      );
      selectedStageId.value = stage?.id ?? null;
      selectedTabKey.value = null;
    }
  },
);

const changePage = async (page: number) => {
  const pagination = coursePagination.value;
  if (isGeneralMode.value) {
    if (!props.catalog || !pagination || generalCatalogLoading.value) return;

    const nextPage = Math.min(pagination.lastPage, Math.max(1, page));
    if (nextPage === pagination.currentPage) return;
    await loadGeneralPage(nextPage);
    await nextTick();
    courseResults.value?.scrollIntoView({
      behavior: shouldReduceMotion() ? "auto" : "smooth",
      block: "start",
    });
    return;
  }

  const tab = selectedTab.value;
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
      y: 24,
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.72,
      stagger: targets.length > 1
        ? Math.min(0.075, 0.5 / (targets.length - 1))
        : 0,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
    },
  );
};

const applyCourseSearch = async () => {
  if (courseSearchTimer) {
    clearTimeout(courseSearchTimer);
    courseSearchTimer = null;
  }

  const normalizedWord = normalizeWord(searchWord.value);
  searchWord.value = normalizedWord;

  if (isGeneralMode.value) {
    await loadGeneralPage(1, selectedTeacherId.value, normalizedWord);
  } else {
    coursesByTab.value = {};
    loadedWordByTab.value = {};

    if (selectedTab.value) {
      await selectTab(selectedTab.value.key, undefined, 1);
    } else if (props.catalog) {
      const { word: _word, page: _page, ...query } = route.query;
      await router.replace({
        query: {
          ...query,
          ...(normalizedWord ? { word: normalizedWord } : {}),
        },
      });
    }
  }

  await animateCourseResults();
};

const requestCourseSearch = () => {
  if (courseSearchTimer) clearTimeout(courseSearchTimer);
  courseSearchTimer = setTimeout(() => {
    courseSearchTimer = null;
    void applyCourseSearch();
  }, 450);
};

const clearCourseSearch = () => {
  if (!searchWord.value) return;
  searchWord.value = "";
  void applyCourseSearch();
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
        x: 22,
        duration: 0.58,
      })
      .from(
        ".split-heading h2",
        { autoAlpha: 0, y: 28, duration: 0.72 },
        0.1,
      )
      .from(
        ".split-heading > p",
        { autoAlpha: 0, y: 18, duration: 0.6 },
        0.28,
      );

    const filterPanels = section.querySelectorAll(
      ".home-course-search, .home-course-teacher-filter, .home-course-picker",
    );
    const filterOptions = section.querySelectorAll(
      ".home-course-teacher-option, .home-course-audiences button",
    );
    const allCoursesLink = section.querySelector(".all-courses");

    if (filterPanels.length) {
      timeline.from(
        filterPanels,
        {
          autoAlpha: 0,
          clipPath: "inset(0 50% 0 50%)",
          y: 20,
          duration: 0.82,
          ease: "power3.out",
        },
        0.45,
      );
    }

    if (filterOptions.length) {
      timeline.from(
        filterOptions,
        {
          autoAlpha: 0,
          duration: 0.52,
          stagger: 0.075,
          clearProps: "opacity,visibility",
        },
        0.68,
      );
    }

    timeline.from(
      ".home-course-result > *",
      { autoAlpha: 0, y: 22, duration: 0.66 },
      0.86,
    );

    if (allCoursesLink) {
      timeline.from(
        allCoursesLink,
        { autoAlpha: 0, y: 12, duration: 0.52 },
        1.02,
      );
    }

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
  cancelHomepageAutoSelection();
  if (courseSearchTimer) clearTimeout(courseSearchTimer);
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
    :class="{
      'is-entered': sectionHasEntered,
      'is-home-preview': !catalog,
    }"
    aria-labelledby="home-v2-courses-title"
  >
    <div class="home-course-motion" aria-hidden="true">
      <span class="home-course-motion-orb home-course-motion-orb--one" />
      <span class="home-course-motion-orb home-course-motion-orb--two" />
    </div>
    <div class="container">
      <div class="section-heading split-heading">
        <div>
          <span class="section-tag">
            {{ isGeneralMode ? "اختار من خبرات متنوعة" : "اختار نقطة البداية" }}
          </span>
          <h2 v-if="isGeneralMode" id="home-v2-courses-title">
            مدرسون مختلفون.<br />ومحتوى <em>يناسب هدفك.</em>
          </h2>
          <h2 v-else id="home-v2-courses-title">
            ابدأ من مرحلتك.<br />وكمل <em>بخطة واضحة.</em>
          </h2>
        </div>
        <p v-if="isGeneralMode">
          تصفّح كل الكورسات المتاحة على المنصة، واعرف مدرس كل كورس قبل ما تبدأ
          من غير الحاجة لاختيار مرحلة أو سنة دراسية.
        </p>
        <p v-else>
          كل مرحلة لها سنواتها ومساراتها. اختار مرحلتك وسنتك علشان تشوف
          الكورسات المناسبة ليك فقط.
        </p>
      </div>

      <section
        v-if="catalog && teacherFilterEnabled"
        class="home-course-teacher-filter"
        aria-labelledby="home-v2-teacher-filter-title"
      >
        <div class="home-course-teacher-filter__head">
          <div>
            <span>فلترة سريعة</span>
            <h3 id="home-v2-teacher-filter-title">اختار المدرس</h3>
            <p>اعرض كورسات مدرس واحد، أو ارجع لكل كورسات المنصة.</p>
          </div>
          <button
            v-if="selectedTeacherId"
            type="button"
            class="home-course-teacher-filter__clear"
            :disabled="generalCatalogLoading"
            @click="selectTeacher(null)"
          >
            مسح الاختيار
          </button>
        </div>

        <div
          class="home-course-teacher-filter__options"
          role="group"
          aria-labelledby="home-v2-teacher-filter-title"
        >
          <button
            type="button"
            class="home-course-teacher-option home-course-teacher-option--all"
            :class="{ active: selectedTeacherId === null }"
            :aria-pressed="selectedTeacherId === null"
            :disabled="generalCatalogLoading"
            aria-controls="home-v2-course-results"
            @click="selectTeacher(null)"
          >
            <span aria-hidden="true">الكل</span>
            <strong>كل المدرسين</strong>
            <small>كل الكورسات المتاحة</small>
          </button>

          <button
            v-for="teacher in teachers.data"
            :key="teacher.id"
            type="button"
            class="home-course-teacher-option"
            :class="{ active: selectedTeacherId === teacher.id }"
            :aria-pressed="selectedTeacherId === teacher.id"
            :disabled="generalCatalogLoading"
            aria-controls="home-v2-course-results"
            @click="selectTeacher(teacher.id)"
          >
            <span class="home-course-teacher-option__avatar" aria-hidden="true">
              <img
                v-if="teacher.image && !failedTeacherImages.has(teacher.id)"
                :src="teacher.image.src"
                :alt="teacher.image.alt || ''"
                width="54"
                height="54"
                loading="lazy"
                @error="markTeacherImageAsFailed(teacher.id)"
              />
              <b v-else>{{ teacherInitials(teacher.name) }}</b>
            </span>
            <strong>{{ teacher.name }}</strong>
            <small>
              {{ teacher.coursesCount > 0 ? `${teacher.coursesCount} كورس` : "عرض الكورسات" }}
            </small>
          </button>
        </div>

        <p
          v-if="teachers.status === 'empty'"
          class="home-course-teacher-filter__empty"
        >
          لا توجد ملفات مدرسين متاحة للفلترة حاليًا؛ يمكنك تصفح كل الكورسات.
        </p>
      </section>

      <div v-if="!isGeneralMode" class="home-course-picker">
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

      <div v-if="!isGeneralMode && selectedStage" class="home-course-picker home-course-year-picker">
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

      <Transition name="home-course-search-reveal">
        <section
          v-if="catalog && (isGeneralMode || selectedTab)"
          class="home-course-search"
          aria-labelledby="home-v2-course-search-title"
        >
          <div class="home-course-search__copy">
            <span>{{ isGeneralMode ? "ابحث في كل الكورسات" : "آخر خطوة" }}</span>
            <h3 id="home-v2-course-search-title">ابحث باسم الكورس</h3>
            <p v-if="!isGeneralMode && selectedTab">
              البحث داخل كورسات {{ selectedTab.label }} فقط.
            </p>
          </div>

          <div class="home-course-search__controls">
            <label class="home-course-search__field">
              <span class="home-course-search__label">اسم الكورس</span>
              <span class="home-course-search__input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
                <input
                  v-model="searchWord"
                  type="search"
                  inputmode="search"
                  autocomplete="off"
                  maxlength="100"
                  placeholder="اكتب اسم الكورس..."
                  aria-controls="home-v2-course-results"
                  :aria-busy="courseSearchLoading"
                  :disabled="courseSearchLoading"
                  @input="requestCourseSearch"
                  @keydown.enter.prevent="applyCourseSearch"
                />
                <span
                  v-if="courseSearchLoading"
                  class="home-course-search__loader"
                  aria-hidden="true"
                />
              </span>
            </label>
            <button
              v-if="searchWord"
              type="button"
              class="home-course-search__clear"
              :disabled="courseSearchLoading"
              @click="clearCourseSearch"
            >
              مسح البحث
            </button>
          </div>
        </section>
      </Transition>

      <div
        id="home-v2-course-results"
        ref="courseResults"
        class="home-course-result"
        :class="{ 'is-empty': !isGeneralMode && !selectedTab }"
        aria-live="polite"
      >
        <template v-if="isGeneralMode">
          <div class="home-course-result-head">
            <div>
              <span>{{ searchWord ? "نتائج البحث" : selectedTeacher ? "المدرس المختار" : "كل محتوى المنصة" }}</span>
              <h3>
                {{ searchWord ? `نتائج «${searchWord}»` : selectedTeacher ? `كورسات ${selectedTeacher.name}` : "كورسات المدرسين" }}
              </h3>
            </div>
            <b v-if="coursePagination">{{ coursePagination.total }} كورس</b>
          </div>

          <div
            v-if="generalCatalogLoading || courses.data.generalCatalogStatus === 'loading'"
            class="home-course-message"
            role="status"
          >
            <span>جاري التحميل</span>
            <h3>
              {{ searchWord ? `بنبحث عن «${searchWord}»` : selectedTeacher ? `بنجهز كورسات ${selectedTeacher.name}` : "بنجهز لك كورسات المنصة" }}
            </h3>
            <p>
              {{ selectedTeacher ? "ثواني ونظهر لك كورسات المدرس المختار فقط." : "ثواني ونظهر لك المحتوى المتاح من كل المدرسين." }}
            </p>
          </div>

          <div
            v-else-if="generalCatalogState.status === 'error'"
            class="home-course-message"
            role="alert"
          >
            <span>تعذر التحميل</span>
            <h3>لم نتمكن من عرض الكورسات الآن</h3>
            <p>{{ generalCatalogState.error?.message }}</p>
            <button type="button" @click="loadGeneralPage(coursePagination?.currentPage ?? 1)">
              حاول مرة أخرى
            </button>
          </div>

          <div
            v-else-if="generalCatalogState.status === 'empty' || visibleCourses.length === 0"
            class="home-course-message"
            role="status"
          >
            <span>لا توجد كورسات</span>
            <h3>
              {{ searchWord ? `لا توجد نتائج لـ «${searchWord}»` : selectedTeacher ? `لا توجد كورسات متاحة لـ ${selectedTeacher.name}` : "لم يضف المدرسون كورسات متاحة حتى الآن" }}
            </h3>
            <p>
              {{ searchWord ? "جرّب كلمة أقصر أو امسح البحث لعرض كل الكورسات." : selectedTeacher ? "جرّب مدرسًا آخر أو اعرض كل كورسات المنصة." : "ستظهر كورسات المدرسين هنا فور نشرها على المنصة." }}
            </p>
            <button
              v-if="searchWord"
              type="button"
              @click="clearCourseSearch"
            >
              مسح البحث
            </button>
            <button
              v-else-if="selectedTeacher"
              type="button"
              @click="selectTeacher(null)"
            >
              عرض كل الكورسات
            </button>
          </div>

          <template v-else>
            <div class="course-grid">
              <HomeCourseCard
                v-for="(course, index) in visibleCourses"
                :key="course.id"
                :course="course"
                level-label="كورس عام"
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
                :disabled="coursePagination.currentPage === 1 || generalCatalogLoading"
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
                :disabled="generalCatalogLoading"
                @click="changePage(page)"
              >
                {{ page }}
              </button>

              <button
                type="button"
                class="home-course-pagination__arrow"
                :disabled="coursePagination.currentPage === coursePagination.lastPage || generalCatalogLoading"
                aria-label="الصفحة التالية"
                @click="changePage(coursePagination.currentPage + 1)"
              >
                <span aria-hidden="true">←</span>
              </button>
            </nav>

            <p v-if="catalog && coursePagination" class="home-course-pagination__summary">
              صفحة {{ coursePagination.currentPage }} من {{ coursePagination.lastPage }}
              · إجمالي {{ coursePagination.total }} كورس
            </p>
          </template>
        </template>

        <div v-else-if="!selectedTab" class="home-course-empty">
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
              <span>{{ searchWord ? "نتائج البحث" : "المسار المختار" }}</span>
              <h3>
                {{ searchWord ? `نتائج «${searchWord}» في ${selectedTab.label}` : `كورسات ${selectedTab.label}` }}
                <template v-if="selectedTeacher">مع {{ selectedTeacher.name }}</template>
              </h3>
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
            <h3>
              {{ searchWord ? `لا توجد نتائج لـ «${searchWord}» في ${selectedTab.label}` : `لا توجد كورسات متاحة لـ ${selectedTab.label}` }}
              <template v-if="selectedTeacher">مع {{ selectedTeacher.name }}</template>
              حاليًا
            </h3>
            <p>
              {{ searchWord ? "جرّب كلمة أقصر أو امسح البحث لعرض كل الكورسات." : selectedTeacher ? "جرّب مدرسًا آخر أو امسح فلتر المدرس." : "ستظهر الكورسات والمراجعات هنا فور إتاحتها." }}
            </p>
            <button v-if="searchWord" type="button" @click="clearCourseSearch">
              مسح البحث
            </button>
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
        :to="!isGeneralMode && selectedTab ? `/course?stage_id=${selectedTab.stageId}&year_id=${selectedTab.yearId}` : '/course'"
        class="all-courses"
      >
        {{ !isGeneralMode && selectedTab ? `كل كورسات ${selectedTab.label}` : "صفحة كل الكورسات" }}
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
.home-course-search p,
.home-course-teacher-filter p,
.home-course-picker p,
.home-course-empty p,
.home-course-message p {
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-course-search {
  display: grid;
  grid-template-columns: minmax(180px, 0.55fr) minmax(320px, 1.45fr);
  align-items: center;
  gap: clamp(20px, 3vw, 36px);
  margin: 30px 0 34px;
  padding: 16px 20px;
  border: 1px solid color-mix(in srgb, var(--teal) 24%, var(--line));
  background:
    radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--coral) 9%, transparent), transparent 32%),
    linear-gradient(135deg, color-mix(in srgb, var(--teal) 9%, var(--paper)), var(--paper));
  box-shadow: 0 22px 50px -45px color-mix(in srgb, var(--deep) 60%, transparent);
}

.home-course-search__copy > span {
  color: var(--coral);
  font-size: 11px;
  font-weight: 900;
}

.home-course-search__copy h3 {
  margin: 3px 0 1px;
  color: var(--ink);
  font: 900 clamp(18px, 2vw, 22px)/1.35 var(--heading);
}

.home-course-search__copy p {
  font-size: 12px;
  line-height: 1.6;
}

.home-course-search__controls {
  display: flex;
  align-items: end;
  gap: 10px;
  min-width: 0;
}

.home-course-search__field {
  display: grid;
  flex: 1;
  gap: 7px;
  min-width: 0;
}

.home-course-search__label {
  color: var(--ink);
  font-size: 12px;
  font-weight: 900;
}

.home-course-search__input-wrap {
  position: relative;
  display: block;
}

.home-course-search__input-wrap > svg {
  position: absolute;
  z-index: 1;
  top: 50%;
  inset-inline-start: 17px;
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--teal);
  stroke-linecap: round;
  stroke-width: 1.8;
  transform: translateY(-50%);
  pointer-events: none;
}

.home-course-search input {
  width: 100%;
  min-height: 48px;
  padding: 0 50px;
  border: 1px solid var(--line);
  border-radius: 0;
  outline: 0;
  background: var(--home-v2-surface);
  color: var(--ink);
  font: 800 14px var(--heading);
  transition: border-color 0.2s ease, box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.home-course-search input::placeholder {
  color: color-mix(in srgb, var(--home-v2-muted) 72%, transparent);
}

.home-course-search input:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--teal) 14%, transparent);
}

.home-course-search input:disabled {
  cursor: wait;
  opacity: 0.7;
}

.home-course-search__loader {
  position: absolute;
  top: calc(50% - 8px);
  inset-inline-end: 16px;
  width: 16px;
  height: 16px;
  border: 2px solid color-mix(in srgb, var(--teal) 22%, transparent);
  border-top-color: var(--teal);
  border-radius: 50%;
  animation: home-course-search-spin 0.7s linear infinite;
}

.home-course-search__clear {
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid var(--deep);
  background: var(--deep);
  color: #fff;
  cursor: pointer;
  font-weight: 900;
  white-space: nowrap;
  transition: background-color 0.2s ease, border-color 0.2s ease,
    transform 0.2s ease;
}

.home-course-search__clear:hover:not(:disabled) {
  border-color: var(--teal);
  background: var(--teal);
  transform: translateY(-2px);
}

.home-course-search__clear:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--coral) 55%, transparent);
  outline-offset: 3px;
}

.home-course-search__clear:disabled {
  cursor: wait;
  opacity: 0.65;
}

.home-course-search-reveal-enter-active,
.home-course-search-reveal-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.home-course-search-reveal-enter-from,
.home-course-search-reveal-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.home-course-teacher-filter {
  margin-bottom: 18px;
  padding: 17px 20px 19px;
  border: 1px solid var(--line);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--teal) 8%, var(--paper)), var(--paper));
}

.home-course-teacher-filter__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 12px;
}

.home-course-teacher-filter__head > div > span {
  color: var(--coral);
  font-size: 11px;
  font-weight: 900;
}

.home-course-teacher-filter__head h3 {
  margin: 3px 0 1px;
  color: var(--ink);
  font: 900 19px/1.35 var(--heading);
}

.home-course-teacher-filter__clear {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--line);
  background: var(--home-v2-surface);
  color: var(--teal);
  cursor: pointer;
  font-weight: 900;
}

.home-course-teacher-filter__options {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 2px 2px 8px;
  scroll-padding-inline: 2px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--teal) 35%, transparent) transparent;
}

.home-course-teacher-option {
  display: grid;
  width: 218px;
  min-width: 218px;
  min-height: 64px;
  grid-template-columns: 42px minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 1px 10px;
  padding: 9px;
  border: 1px solid var(--line);
  background: var(--home-v2-surface);
  color: var(--ink);
  cursor: pointer;
  text-align: start;
  scroll-snap-align: start;
  transition: border-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.2s ease, background-color 0.2s ease;
}

.home-course-teacher-option:hover:not(:disabled) {
  border-color: var(--teal);
  box-shadow: 0 18px 30px -26px color-mix(in srgb, var(--deep) 55%, transparent);
  transform: translateY(-2px);
}

.home-course-teacher-option:focus-visible,
.home-course-teacher-filter__clear:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--coral) 55%, transparent);
  outline-offset: 3px;
}

.home-course-teacher-option:disabled,
.home-course-teacher-filter__clear:disabled {
  cursor: wait;
  opacity: 0.65;
}

.home-course-teacher-option.active {
  border-color: var(--deep);
  background: var(--deep);
  color: #fff;
  box-shadow: inset 0 -3px var(--coral);
}

.home-course-teacher-option > span:first-child {
  display: grid;
  width: 42px;
  height: 42px;
  grid-row: 1 / 3;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--teal) 30%, var(--line));
  border-radius: 50%;
  background: color-mix(in srgb, var(--teal) 10%, var(--paper));
  color: var(--teal);
  font: 900 11px var(--heading);
}

.home-course-teacher-option__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-course-teacher-option__avatar b {
  font: 900 14px var(--heading);
}

.home-course-teacher-option strong {
  min-width: 0;
  overflow: hidden;
  font: 900 13px/1.35 var(--heading);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-course-teacher-option small {
  color: var(--home-v2-muted);
  font-size: 10px;
  font-weight: 800;
}

.home-course-teacher-option.active > span:first-child {
  border-color: rgb(255 255 255 / 25%);
  background: rgb(255 255 255 / 13%);
  color: #fff;
}

.home-course-teacher-option.active small {
  color: rgb(255 255 255 / 70%);
}

.home-course-teacher-filter__empty {
  margin-top: 14px !important;
  padding-top: 12px;
  border-top: 1px dashed var(--line);
  font-size: 12px;
}

.home-course-picker {
  display: grid;
  grid-template-columns: minmax(180px, 220px) minmax(0, 1fr);
  align-items: center;
  gap: clamp(18px, 3vw, 30px);
  margin-bottom: 16px;
  padding: 16px 20px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--teal) 6%, var(--paper));
}

.home-course-year-picker {
  margin-top: 0;
  background: color-mix(in srgb, var(--deep) 5%, var(--paper));
}

.home-course-picker > div:first-child {
  min-width: 0;
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
  margin: 3px 0 1px;
  color: var(--ink);
  font: 900 18px/1.4 var(--heading);
}

.home-course-picker > div:first-child > p {
  color: var(--home-v2-muted);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
}

.home-course-audiences {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
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
  min-height: 60px;
  grid-template-columns: 36px minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 1px 9px;
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
  width: 36px;
  height: 36px;
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
  font: 800 13px/1.4 var(--heading);
  overflow-wrap: anywhere;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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

@keyframes home-course-search-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 992px) {
  .home-course-showcase.is-home-preview .home-course-audiences {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 12px;
  }

  .home-course-showcase.is-home-preview .home-course-audiences button {
    min-height: 86px;
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 2px 12px;
    padding: 10px;
  }

  .home-course-showcase.is-home-preview .stage-option-index {
    width: 46px;
    height: 46px;
    font-size: 14px;
  }

  .home-course-showcase.is-home-preview .stage-option-label {
    font-size: 15px;
  }

  .home-course-showcase.is-home-preview .home-course-audiences small {
    font-size: 11px;
  }
}

@media (max-width: 820px) {
  .split-heading {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .home-course-search {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 18px;
  }

  .home-course-picker {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 12px;
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
  .split-heading {
    gap: 12px;
    margin-bottom: 24px;
  }

  .home-course-showcase h2 {
    margin-top: 9px;
    font-size: clamp(30px, 8.5vw, 36px);
    line-height: 1.28;
  }

  .split-heading > p {
    font-size: 13px;
    line-height: 1.75;
  }

  .home-course-search {
    gap: 12px;
    margin: 20px 0 22px;
    padding: 14px;
  }

  .home-course-search__controls {
    align-items: stretch;
    flex-direction: column;
  }

  .home-course-search__clear {
    width: 100%;
    min-height: 44px;
  }

  .home-course-teacher-filter {
    padding: 14px;
  }

  .home-course-teacher-filter__head {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }

  .home-course-teacher-filter__clear {
    width: 100%;
  }

  .home-course-teacher-filter__options {
    display: flex;
    overflow-x: auto;
    margin-inline: -14px;
    padding: 2px 14px 8px;
    scroll-padding-inline: 14px;
    scroll-snap-type: x proximity;
  }

  .home-course-teacher-option {
    width: min(72vw, 220px);
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  .home-course-picker {
    margin-bottom: 12px;
    padding: 14px;
  }

  .home-course-picker h3,
  .home-course-search__copy h3,
  .home-course-teacher-filter__head h3 {
    font-size: 17px;
  }

  .home-course-audiences {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
  }

  .home-course-audiences button {
    display: flex;
    min-height: 50px;
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
    gap: 8px;
    margin-bottom: 14px;
  }

  .home-course-result-head h3 {
    font-size: 24px;
  }

  .home-course-empty {
    grid-template-columns: 1fr;
    min-height: 150px;
    padding: 20px;
  }

  .home-course-empty-step {
    display: none;
  }
}

@media (max-width: 430px) {
  .home-course-audiences {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
  .home-course-audiences button,
  .home-course-teacher-option {
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
