<script setup lang="ts">
import type { HomeCourseViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

const props = withDefaults(defineProps<{
  course: HomeCourseViewModel;
  levelLabel?: string;
  index?: number;
  progress?: number | null;
  animate?: boolean;
  interactive?: boolean;
}>(), {
  levelLabel: "",
  index: 0,
  progress: null,
  animate: true,
  interactive: true,
});

const tone = computed(() => ["mint", "violet", "sky", "deep"][props.index % 4]);
const safeProgress = computed(() => Math.min(100, Math.max(0, props.progress ?? 0)));
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
    :to="course.route"
    class="course-card"
    :class="[tone, { 'course-card--animate': animate }]"
    :style="{ '--course-delay': `${index * 80}ms` }"
    @pointermove="tiltCard"
    @pointerleave="resetCard"
  >
    <div class="course-cover" :class="{ 'has-image': course.image && !imageFailed }">
      <img v-if="course.image && !imageFailed" :src="course.image.src" :alt="course.image.alt || course.title" width="680" height="452" loading="lazy" @error="imageFailed = true" />
      <template v-else>
        <span class="course-code">PHYSICS COURSE</span>
        <span class="course-index">{{ String(index + 1).padStart(2, "0") }}</span>
        <span class="course-mark" aria-hidden="true">ف</span>
        <span class="level-pill">{{ levelLabel }}</span>
      </template>
    </div>

    <div class="course-content">
      <span class="teacher">{{ course.sourceSubject?.title || levelLabel }}</span>
      <h3>{{ course.title }}</h3>
      <p>{{ course.description || "شرح منظم ومراجعة مركزة تساعدك تفهم وتطبق بثقة." }}</p>

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
.course-card { --card-ink: var(--ink, var(--home-v2-ink, #10223f)); --card-deep: var(--deep, var(--home-v2-deep, var(--secondary-color, #28366c))); --card-accent: var(--teal, var(--home-v2-blue, var(--primary-color, #28366c))); --card-line: var(--line, var(--home-v2-line, #dce3e5)); --card-heading: var(--heading, var(--home-v2-heading, inherit)); display:flex; min-width:0; flex-direction:column; overflow:hidden; border:1px solid var(--card-line); background:var(--home-v2-surface, #fff); color:var(--card-ink); box-shadow:0 10px 28px -30px #12313966; transform-style:preserve-3d; transform-origin:center; will-change:transform; transition:border-color .25s ease, transform .25s ease, box-shadow .25s ease; }
.course-card--animate { animation:course-card-enter .68s var(--course-delay) cubic-bezier(.2,.75,.25,1) both; }
.course-card:hover { border-color:color-mix(in srgb, var(--card-accent) 55%, var(--card-line)); box-shadow:0 24px 54px -34px #12313980; transform:translateY(-8px); }
.course-cover { position:relative; height:300px; overflow:hidden; padding:20px; background:#d8e9e5; color:color-mix(in srgb, var(--card-deep) 78%, #071020); transform:translateZ(1px); }
.course-cover::before { position:absolute; bottom:-90px; left:-50px; width:230px; height:230px; border:1px solid #1231392b; border-radius:50%; content:""; transition:transform .45s ease; }
.course-card:hover .course-cover::before { transform:scale(1.08) translate(5px,-4px); }
.violet .course-cover { background:#dcd8ed; }.sky .course-cover { background:#bcdadc; }.deep .course-cover { background:var(--card-deep); color:#fff; }
.course-cover.has-image { padding:0; background:#d8e9e5; }.course-cover.has-image::before { z-index:1; border-color:#ffffff52; }
.course-cover img { display:block; width:100%; height:100%; object-fit:cover; transition:transform .55s cubic-bezier(.2,.75,.25,1); }.course-card:hover .course-cover img { transform:scale(1.045); }
.course-code { font:800 10px var(--card-heading); letter-spacing:.15em; }.course-index { position:absolute; top:18px; left:20px; font:700 11px var(--card-heading); }
.course-mark { position:absolute; right:26px; bottom:-25px; opacity:.16; font:900 152px/1 var(--card-heading); transition:opacity .25s ease,transform .35s ease; }.course-card:hover .course-mark { opacity:.22; transform:translateY(-4px); }
.level-pill { position:absolute; right:20px; bottom:18px; padding:7px 11px; border:1px solid rgb(8 27 58 / 10%); background:#fffffff0; color:#10223f; font-size:10px; font-weight:800; }
.course-content { display:flex; min-height:225px; flex:1; flex-direction:column; padding:25px; }.teacher { color:var(--card-accent); font-size:12px; font-weight:900; }
.course-content h3 { display:-webkit-box; margin:7px 0 10px; overflow:hidden; font:800 21px/1.35 var(--card-heading); -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.course-content p { display:-webkit-box; min-height:68px; margin:0; overflow:hidden; color:var(--home-v2-muted, #6b7e82); font-size:13px; line-height:1.75; -webkit-box-orient:vertical; -webkit-line-clamp:3; }
.course-progress { display:grid; grid-template-columns:1fr auto; align-items:center; gap:10px; margin:4px 0 14px; }.course-progress>span { height:7px; overflow:hidden; background:#e7ecee; }.course-progress i { display:block; height:100%; background:linear-gradient(90deg,var(--card-accent),var(--card-deep)); transition:width .7s ease; }.course-progress b { color:var(--card-accent); font-size:12px; }
.course-footer { display:grid; grid-template-columns:1fr auto 38px; align-items:center; gap:12px; margin-top:auto; padding-top:18px; border-top:1px solid var(--card-line); font-size:12px; font-weight:800; }.course-footer>b { color:var(--card-accent); font:900 13px var(--card-heading); }
.course-arrow { display:grid; width:38px; height:38px; place-items:center; background:var(--card-deep); color:#fff; font-size:18px; transition:background-color .2s ease,transform .2s ease; }.course-card:hover .course-arrow { background:var(--card-accent); transform:translateX(-2px); }
@keyframes course-card-enter { from { opacity:0; transform:translateY(34px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
@media (prefers-reduced-motion:reduce) { .course-card { animation:none; transition:none; }.course-cover img,.course-arrow { transition:none; } }
</style>
