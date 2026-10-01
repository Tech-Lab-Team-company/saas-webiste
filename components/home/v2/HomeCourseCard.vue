<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import type { HomeCourseViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import { getDescriptiveImageAlt } from "~/utils/imageAlt";
import { htmlToSeoText } from "~/utils/seoText";

const props = withDefaults(defineProps<{
  course: HomeCourseViewModel;
  levelLabel?: string;
  index?: number;
  progress?: number | null;
  animate?: boolean;
  interactive?: boolean;
  to?: RouteLocationRaw | null;
}>(), {
  levelLabel: "",
  index: 0,
  progress: null,
  animate: true,
  interactive: true,
  to: null,
});

const courseLink = computed(() => props.to ?? props.course.route);

const tone = computed(() => ["mint", "violet", "sky", "deep"][props.index % 4]);
const safeProgress = computed(() => Math.min(100, Math.max(0, props.progress ?? 0)));
const courseDescription = computed(() =>
  htmlToSeoText(props.course.description)
  || "شرح منظم ومراجعة مركزة تساعدك تفهم وتطبق بثقة.",
);
const imageFailed = ref(false);

watch(() => props.course.image?.src, () => {
  imageFailed.value = false;
});

const tiltCard = (event: PointerEvent) => {
  if (!props.interactive) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = event.currentTarget as HTMLElement;
  const rect = card.getBoundingClientRect();
  const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
  const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
  card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
};

const resetCard = (event: PointerEvent) => {
  if (!props.interactive) return;
  (event.currentTarget as HTMLElement).style.removeProperty("transform");
};
</script>

<template>
  <NuxtLink
    :to="courseLink"
    class="course-card"
    :class="[tone, { 'course-card--animate': animate }]"
    :style="{ '--course-delay': `${index * 80}ms` }"
    @pointermove="tiltCard"
    @pointerleave="resetCard"
  >
    <div class="course-cover" :class="{ 'has-image': course.image && !imageFailed }">
      <NuxtImg
        v-if="course.image && !imageFailed"
        :src="course.image.src"
        :alt="getDescriptiveImageAlt(course.image.alt, `غلاف كورس ${course.title}`)"
        width="680"
        height="452"
        sizes="sm:100vw md:50vw lg:380px"
        format="webp"
        quality="76"
        loading="lazy"
        decoding="async"
        @error="imageFailed = true"
      />
      <template v-else>
        <span class="course-code">PHYSICS COURSE</span>
        <span class="course-index">{{ String(index + 1).padStart(2, "0") }}</span>
        <span class="course-mark" aria-hidden="true">ف</span>
        <span class="level-pill">{{ levelLabel }}</span>
      </template>
    </div>

    <div class="course-content">
      <span class="teacher">
        {{ course.teacher?.name || course.sourceSubject?.title || levelLabel }}
      </span>
      <h3>{{ course.title }}</h3>
      <p>{{ courseDescription }}</p>

      <div v-if="progress !== null" class="course-progress" :aria-label="`نسبة التقدم ${safeProgress}%`">
        <span><i :style="{ width: `${safeProgress}%` }" /></span>
        <b>{{ safeProgress }}%</b>
      </div>

      <div class="course-footer">
        <span>{{ course.videosCount ?? 0 }} درس</span>
        <b v-if="progress === null">{{ course.price !== null && course.price > 0 ? `${course.price} ${course.currency ?? ""}` : "مجاني" }}</b>
        <b v-else>{{ course.documentsCount ?? 0 }} ملف</b>
        <span class="course-arrow" aria-hidden="true">←</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.course-card { --card-ink: var(--ink, var(--home-v2-ink, var(--profile-ink, #10223f))); --card-deep: var(--deep, var(--home-v2-deep, var(--profile-primary, var(--secondary-color, #28366c)))); --card-accent: var(--teal, var(--home-v2-blue, var(--profile-secondary, var(--primary-color, #28366c)))); --card-line: var(--line, var(--home-v2-line, var(--profile-border, #dce3e5))); --card-surface: var(--home-v2-surface, var(--profile-surface, #fff)); --card-muted: var(--home-v2-muted, var(--profile-muted, #6b7e82)); --card-body: var(--body, var(--home-v2-body, "Tajawal", Tahoma, Arial, sans-serif)); --card-heading: var(--heading, var(--home-v2-heading, "Cairo", "Tajawal", Tahoma, Arial, sans-serif)); display:flex; min-width:0; flex-direction:column; overflow:hidden; border:1px solid var(--card-line); background:var(--card-surface); color:var(--card-ink); font-family:var(--card-body); box-shadow:0 10px 28px -30px color-mix(in srgb, var(--card-deep) 42%, transparent); transform-style:preserve-3d; transform-origin:center; will-change:transform; transition:border-color .25s ease, transform .25s ease, box-shadow .25s ease; }
.course-card--animate { animation:course-card-enter .68s var(--course-delay) cubic-bezier(.2,.75,.25,1) both; }
.course-card:hover { border-color:color-mix(in srgb, var(--card-accent) 55%, var(--card-line)); box-shadow:0 24px 54px -34px color-mix(in srgb, var(--card-deep) 55%, transparent); transform:translateY(-8px); }
.course-cover { position:relative; height:300px; overflow:hidden; padding:20px; background:var(--course-card-cover, #d8e9e5); color:color-mix(in srgb, var(--card-deep) 78%, var(--card-ink)); transform:translateZ(1px); }
.course-cover::before { position:absolute; bottom:-90px; left:-50px; width:230px; height:230px; border:1px solid color-mix(in srgb, var(--card-ink) 17%, transparent); border-radius:50%; content:""; transition:transform .45s ease; }
.course-card:hover .course-cover::before { transform:scale(1.08) translate(5px,-4px); }
.violet .course-cover { background:var(--course-card-cover-violet, #dcd8ed); }.sky .course-cover { background:var(--course-card-cover-sky, #bcdadc); }.deep .course-cover { background:var(--card-deep); color:#fff; }
.course-cover.has-image { padding:0; background:var(--course-card-cover, #d8e9e5); }.course-cover.has-image::before { z-index:1; border-color:#ffffff52; }
.course-cover img { display:block; width:100%; height:100%; object-fit:cover; transition:transform .55s cubic-bezier(.2,.75,.25,1); }.course-card:hover .course-cover img { transform:scale(1.045); }
.course-code { font:800 10px var(--card-heading); letter-spacing:.15em; }.course-index { position:absolute; top:18px; left:20px; font:700 11px var(--card-heading); }
.course-mark { position:absolute; right:26px; bottom:-25px; opacity:.16; font:900 152px/1 var(--card-heading); transition:opacity .25s ease,transform .35s ease; }.course-card:hover .course-mark { opacity:.22; transform:translateY(-4px); }
.level-pill { position:absolute; right:20px; bottom:18px; padding:7px 11px; border:1px solid var(--card-line); background:var(--course-card-pill, color-mix(in srgb, var(--card-surface) 94%, transparent)); color:var(--card-ink); font-size:10px; font-weight:800; }
.course-content { display:flex; min-height:225px; flex:1; flex-direction:column; padding:25px; }.teacher { color:var(--card-accent); font-size:12px; font-weight:900; }
.course-content h3 { display:-webkit-box; margin:7px 0 10px; overflow:hidden; font:800 21px/1.35 var(--card-heading); -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.course-content p { display:-webkit-box; min-height:68px; margin:0; overflow:hidden; color:var(--card-muted); font-size:13px; line-height:1.75; -webkit-box-orient:vertical; -webkit-line-clamp:3; }
.course-progress { display:grid; grid-template-columns:1fr auto; align-items:center; gap:10px; margin:4px 0 14px; }.course-progress>span { height:7px; overflow:hidden; background:color-mix(in srgb, var(--card-muted) 22%, var(--card-surface)); }.course-progress i { display:block; height:100%; background:linear-gradient(90deg,var(--card-accent),var(--card-deep)); transition:width .7s ease; }.course-progress b { color:var(--card-accent); font-size:12px; }
.course-footer { display:grid; grid-template-columns:1fr auto 38px; align-items:center; gap:12px; margin-top:auto; padding-top:18px; border-top:1px solid var(--card-line); font-size:12px; font-weight:800; }.course-footer>b { color:var(--card-accent); font:900 13px var(--card-heading); }
.course-arrow { display:grid; width:38px; height:38px; place-items:center; background:var(--card-deep); color:#fff; font-size:18px; transition:background-color .2s ease,transform .2s ease; }.course-card:hover .course-arrow { background:var(--card-accent); transform:translateX(-2px); }
@keyframes course-card-enter { from { opacity:0; transform:translateY(34px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
@media (max-width:620px) {
  .course-cover { height:210px; padding:16px; }
  .course-index { top:14px; left:15px; }
  .course-mark { right:20px; font-size:112px; }
  .level-pill { right:15px; bottom:14px; padding:6px 9px; }
  .course-content { min-height:0; padding:17px; }
  .teacher { font-size:11px; }
  .course-content h3 { margin:5px 0 7px; font-size:18px; line-height:1.4; }
  .course-content p { min-height:0; font-size:12.5px; line-height:1.7; -webkit-line-clamp:2; }
  .course-footer { grid-template-columns:1fr auto 34px; gap:8px; padding-top:14px; font-size:11px; }
  .course-footer > b { font-size:12px; }
  .course-arrow { width:34px; height:34px; font-size:16px; }
}
@media (prefers-reduced-motion:reduce) { .course-card { animation:none; transition:none; }.course-cover img,.course-arrow { transition:none; } }
</style>
