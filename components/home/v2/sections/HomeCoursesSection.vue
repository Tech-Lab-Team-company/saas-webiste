<script setup lang="ts">
import { gsap } from "gsap";
import type {
  HomeCourseTabKey,
  HomeCourseViewModel,
  HomeCoursesViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  courses: HomeSectionState<HomeCoursesViewModel>;
  loadCoursesByYear: (
    stageId: number,
    yearId: number,
  ) => Promise<HomeSectionState<HomeCourseViewModel[]>>;
}>();

const selectedTabKey = ref<HomeCourseTabKey | null>(null);
const coursesByTab = ref<
  Partial<Record<HomeCourseTabKey, HomeSectionState<HomeCourseViewModel[]>>>
>({});
const loadingTabKey = ref<HomeCourseTabKey | null>(null);
const requestIds = ref<Partial<Record<HomeCourseTabKey, number>>>({});
const coursesSection = ref<HTMLElement | null>(null);
const courseResults = ref<HTMLElement | null>(null);
const sectionHasEntered = ref(false);
let coursesAnimationContext: ReturnType<typeof gsap.context> | null = null;
const MAX_VISIBLE_COURSES = 6;

const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const selectedTab = computed(
  () =>
    props.courses.data.tabs.find((tab) => tab.key === selectedTabKey.value) ??
    null,
);

const selectedCourses = computed<HomeSectionState<
  HomeCourseViewModel[]
> | null>(() => {
  if (!selectedTab.value) {
    return null;
  }

  return coursesByTab.value[selectedTab.value.key] ?? null;
});

const visibleCourses = computed(() =>
  selectedCourses.value?.data.slice(0, MAX_VISIBLE_COURSES) ?? [],
);

const selectTab = async (tabKey: HomeCourseTabKey, event?: Event) => {
  const tab = props.courses.data.tabs.find((item) => item.key === tabKey);

  if (!tab || loadingTabKey.value === tab.key) {
    return;
  }

  const selectedButton = event?.currentTarget as HTMLElement | null;
  if (selectedButton && !shouldReduceMotion()) {
    const indexBadge = selectedButton.querySelector(".stage-option-index");
    gsap.fromTo(
      indexBadge,
      { scale: 0.72, rotate: -8 },
      { scale: 1, rotate: 0, duration: 0.55, ease: "back.out(2)" },
    );
  }

  selectedTabKey.value = tab.key;
  loadingTabKey.value = tab.key;
  const requestId = (requestIds.value[tab.key] ?? 0) + 1;
  requestIds.value[tab.key] = requestId;

  const result = await props.loadCoursesByYear(tab.stageId, tab.yearId);

  if (requestIds.value[tab.key] !== requestId) {
    return;
  }

  coursesByTab.value[tab.key] = result;

  if (loadingTabKey.value === tab.key) {
    loadingTabKey.value = null;
  }
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
      y: 42,
      scale: 0.965,
      rotationX: 7,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.72,
      stagger: 0.09,
      ease: "power3.out",
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
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from(".split-heading .section-tag", {
        autoAlpha: 0,
        x: 38,
        duration: 0.55,
      })
      .from(
        ".split-heading h2",
        { autoAlpha: 0, y: 48, duration: 0.85, ease: "expo.out" },
        0.12,
      )
      .from(
        ".split-heading > p",
        { autoAlpha: 0, y: 28, duration: 0.65 },
        0.28,
      )
      .from(
        ".home-course-picker",
        {
          autoAlpha: 0,
          clipPath: "inset(0 50% 0 50%)",
          y: 28,
          duration: 0.9,
          ease: "expo.inOut",
        },
        0.42,
      )
      .from(
        ".home-course-audiences button",
        {
          autoAlpha: 0,
          y: 20,
          scale: 0.92,
          duration: 0.48,
          stagger: 0.08,
        },
        0.72,
      )
      .from(
        ".home-course-result > *",
        { autoAlpha: 0, y: 34, duration: 0.65 },
        0.93,
      )
      .from(
        ".all-courses",
        { autoAlpha: 0, y: 18, duration: 0.5 },
        1.05,
      );

    gsap.to(".home-course-motion-orb--one", {
      x: 30,
      y: -24,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".home-course-motion-orb--two", {
      x: -26,
      y: 30,
      duration: 8.5,
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

  gsap.to(card, {
    rotationY: horizontal * 5,
    rotationX: vertical * -5,
    y: -8,
    duration: 0.45,
    ease: "power2.out",
    overwrite: "auto",
  });
  const coverVisual = card.querySelector(".course-cover img, .course-mark");
  if (coverVisual) {
    gsap.to(coverVisual, {
      x: horizontal * 9,
      y: vertical * 7,
      duration: 0.55,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
};

const resetCourseCard = (event: PointerEvent) => {
  const card = event.currentTarget as HTMLElement;

  gsap.to(card, {
    rotationX: 0,
    rotationY: 0,
    y: 0,
    duration: 0.65,
    ease: "elastic.out(1, 0.55)",
    overwrite: "auto",
    onComplete: () => gsap.set(card, { clearProps: "transform" }),
  });
  const coverVisual = card.querySelector(".course-cover img, .course-mark");
  if (coverVisual) {
    gsap.to(coverVisual, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => gsap.set(coverVisual, { clearProps: "transform" }),
    });
  }
};

watch(
  () => [
    selectedTabKey.value,
    loadingTabKey.value,
    selectedCourses.value?.status,
    visibleCourses.value.map((course) => course.id).join(","),
  ],
  animateCourseResults,
  { flush: "post" },
);

useScrollTriggeredReveal(coursesSection, revealCoursesSection, {
  threshold: 0.16,
});

onBeforeUnmount(() => {
  coursesAnimationContext?.revert();
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
            ابدأ من صفك.<br />وكمل <em>بخطة واضحة.</em>
          </h2>
        </div>
        <p>
          كل صف له منهجه وسرعته. اختار مرحلتك علشان تشوف كورساتها
          ومراجعاتها فقط.
        </p>
      </div>

      <div class="home-course-picker">
        <div>
          <span>خطوتك الأولى</span>
          <h3 id="home-v2-stage-title">أنت في أنهي صف؟</h3>
          <p id="home-v2-stage-help">
            اختار صفك وهنعرض لك الكورسات المناسبة له فورًا.
          </p>
        </div>

        <div
          class="home-course-audiences"
          role="group"
          aria-labelledby="home-v2-stage-title"
          aria-describedby="home-v2-stage-help"
        >
          <button
            v-for="(tab, index) in courses.data.tabs"
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
      </div>

      <div
        id="home-v2-course-results"
        ref="courseResults"
        class="home-course-result"
        :class="{ 'is-empty': !selectedTab }"
        aria-live="polite"
      >
        <div v-if="!selectedTab" class="home-course-empty">
          <span class="home-course-empty-step" aria-hidden="true">01</span>
          <div>
            <span>البداية من هنا</span>
            <h3>اختار صفك من فوق</h3>
            <p>
              هنظهر لك الكورسات المناسبة من غير ما نخلط لك مناهج باقي
              الصفوف.
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
            <b v-if="selectedCourses">{{ visibleCourses.length }} كورس</b>
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
            <button type="button" @click="selectTab(selectedTab.key)">
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

          <div v-else-if="selectedCourses" class="course-grid">
            <NuxtLink
              v-for="(course, index) in visibleCourses"
              :key="course.id"
              :to="course.route"
              class="course-card"
              :class="['mint', 'violet', 'sky', 'deep'][index % 4]"
              @pointermove="tiltCourseCard"
              @pointerleave="resetCourseCard"
            >
              <div class="course-cover" :class="{ 'has-image': course.image }">
                <NuxtImg
                  v-if="course.image"
                  :src="course.image.src"
                  :alt="course.image.alt || course.title"
                  width="680"
                  height="452"
                  loading="lazy"
                />
                <template v-else>
                  <span class="course-code">PHYSICS COURSE</span>
                  <span class="course-index">{{ String(index + 1).padStart(2, "0") }}</span>
                  <span class="course-mark" aria-hidden="true">ف</span>
                  <span class="level-pill">{{ selectedTab.label }}</span>
                </template>
              </div>

              <div class="course-content">
                <span class="teacher">
                  {{ course.sourceSubject?.title || selectedTab.label }}
                </span>
                <h3>{{ course.title }}</h3>
                <p v-if="course.description">{{ course.description }}</p>
                <p v-else>شرح منظم ومراجعة مركزة تساعدك تفهم وتطبق بثقة.</p>
                <div class="course-footer">
                  <span>{{ course.videosCount ?? 0 }} درس</span>
                  <b>
                    {{
                      course.price !== null && course.price > 0
                        ? `${course.price} ${course.currency ?? ""}`
                        : "مجاني"
                    }}
                  </b>
                  <span class="course-arrow" aria-hidden="true">←</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>

      <NuxtLink
        :to="selectedTab ? `/course?year_id=${selectedTab.yearId}` : '/course'"
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
  background: #edf4f1;
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
  font: 900 20px/1.4 var(--heading);
}

.home-course-audiences {
  display: grid;
  width: min(100%, 590px);
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
  font: 800 16px/1.4 var(--heading);
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
  animation: home-course-nudge 1.7s ease-in-out infinite;
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
  height: 226px;
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
  .home-course-audiences {
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    font-size: 13px;
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
