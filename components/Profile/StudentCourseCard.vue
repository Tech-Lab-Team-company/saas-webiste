<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw | null;
    title: string;
    image?: string | null;
    imageAlt?: string;
    subject?: string;
    teacherName?: string;
    description?: string;
    videoCount?: number;
    documentCount?: number;
    audioCount?: number;
    progress?: number;
    isLast?: boolean;
    isBlocked?: boolean;
    invoiceLink?: string | null;
  }>(),
  {
    image: null,
    imageAlt: "",
    subject: "كورس",
    teacherName: "",
    description: "",
    videoCount: 0,
    documentCount: 0,
    audioCount: 0,
    progress: 0,
    isLast: false,
    isBlocked: false,
    invoiceLink: null,
  },
);

const normalizedProgress = computed(() => {
  const value = Number(props.progress);
  return Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : 0;
});
</script>

<template>
  <article :class="['student-course-card', { 'student-course-card--blocked': isBlocked }]">
    <NuxtLink
      v-if="to"
      class="student-course-card__link"
      :to="to"
      :aria-label="`${isLast ? 'متابعة' : 'فتح'} كورس ${title}، التقدم ${normalizedProgress}%`"
    >
      <div class="student-course-card__cover">
        <img v-if="image" :src="image" :alt="imageAlt || title" />
        <div v-else class="student-course-card__fallback" aria-hidden="true">
          <strong>{{ title?.charAt(0) || "ك" }}</strong>
          <small>Edu.HUB</small>
        </div>
        <span class="student-course-card__subject">{{ subject || "كورس" }}</span>
        <span v-if="isLast" class="student-course-card__resume">متابعة</span>
      </div>

      <div class="student-course-card__info">
        <div v-if="teacherName" class="student-course-card__teacher">
          <span>{{ teacherName.charAt(0) }}</span>
          <small>{{ teacherName }}</small>
        </div>
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
        <div class="student-course-card__meta">
          <span>▶ {{ videoCount }} فيديو</span>
          <span>▤ {{ documentCount }} ملف</span>
          <span>♪ {{ audioCount }} تسجيل صوتي</span>
        </div>
        <div class="student-course-card__footer">
          <div class="student-course-card__progress">
            <div>
              <span>التقدم</span>
              <b>{{ normalizedProgress }}%</b>
            </div>
            <span><i :style="{ width: `${normalizedProgress}%` }" /></span>
          </div>
          <i class="student-course-card__arrow">←</i>
        </div>
      </div>
    </NuxtLink>

    <div v-else class="student-course-card__link" aria-disabled="true">
      <div class="student-course-card__cover">
        <img v-if="image" :src="image" :alt="imageAlt || title" />
        <div v-else class="student-course-card__fallback" aria-hidden="true">
          <strong>{{ title?.charAt(0) || "ك" }}</strong>
          <small>Edu.HUB</small>
        </div>
        <span class="student-course-card__subject">{{ subject || "كورس" }}</span>
        <span class="student-course-card__blocked-label">الوصول موقوف</span>
      </div>
      <div class="student-course-card__info">
        <div v-if="teacherName" class="student-course-card__teacher">
          <span>{{ teacherName.charAt(0) }}</span>
          <small>{{ teacherName }}</small>
        </div>
        <h3>{{ title }}</h3>
        <p>تواصل مع الدعم لاستعادة الوصول إلى محتوى الكورس.</p>
        <div class="student-course-card__meta">
          <span>▶ {{ videoCount }} فيديو</span>
          <span>▤ {{ documentCount }} ملف</span>
          <span>♪ {{ audioCount }} تسجيل صوتي</span>
        </div>
      </div>
    </div>

    <a
      v-if="invoiceLink"
      class="student-course-card__invoice"
      :href="invoiceLink"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i class="pi pi-file-pdf" aria-hidden="true" />
      الفاتورة
    </a>
  </article>
</template>

<style scoped>
.student-course-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 400px;
  overflow: hidden;
  flex-direction: column;
  border: 1px solid var(--profile-border, #dce3e5);
  border-radius: 15px;
  background: var(--profile-surface, #fff);
  color: var(--profile-ink, #10223f);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--profile-primary, #28366c) 6%, transparent);
  transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}
.student-course-card:hover {
  border-color: color-mix(in srgb, var(--profile-secondary, #1676d2) 32%, white);
  box-shadow: 0 20px 45px color-mix(in srgb, var(--profile-primary, #28366c) 13%, transparent);
  transform: translateY(-5px);
}
.student-course-card__link { display:flex; min-height:400px; flex:1; flex-direction:column; color:inherit; text-decoration:none; }
.student-course-card__cover { position:relative; width:100%; min-height:188px; aspect-ratio:16/9; overflow:hidden; background:var(--profile-primary, #28366c); color:#fff; }
.student-course-card__cover img { width:100%; height:100%; object-fit:cover; transition:transform .45s ease; }
.student-course-card:hover .student-course-card__cover img { transform:scale(1.045); }
.student-course-card__cover::after { position:absolute; inset:0; background:linear-gradient(180deg, transparent 35%, color-mix(in srgb, var(--profile-primary, #28366c) 72%, transparent)); content:""; }
.student-course-card__fallback { display:flex; height:100%; min-height:188px; flex-direction:column; align-items:center; justify-content:center; background:radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--profile-secondary, #1676d2) 72%, white), transparent 35%), linear-gradient(145deg, color-mix(in srgb, var(--profile-primary, #28366c) 82%, var(--profile-secondary, #1676d2)), var(--profile-primary, #28366c)); }
.student-course-card__fallback strong { font-size:60px; line-height:1; }
.student-course-card__fallback small { margin-top:8px; color:color-mix(in srgb, var(--profile-secondary, #1676d2) 34%, white); font-weight:800; }
.student-course-card__subject,.student-course-card__resume,.student-course-card__blocked-label { position:absolute; z-index:2; top:13px; padding:7px 10px; border-radius:7px; font-size:10px; font-weight:800; backdrop-filter:blur(8px); }
.student-course-card__subject { right:13px; max-width:65%; overflow:hidden; background:color-mix(in srgb, var(--profile-primary, #28366c) 76%, transparent); text-overflow:ellipsis; white-space:nowrap; }
.student-course-card__resume { left:13px; background:#dff8e8e8; color:#0d642e; }
.student-course-card__blocked-label { left:13px; background:#ffe7e7ed; color:#a62828; }
.student-course-card__info { display:flex; min-width:0; flex:1; flex-direction:column; padding:17px 18px 16px; }
.student-course-card__teacher { display:flex; align-items:center; gap:8px; }
.student-course-card__teacher > span { display:grid; width:25px; height:25px; place-items:center; border-radius:50%; background:var(--profile-secondary-soft, #eaf3ff); color:var(--profile-secondary, #1676d2); font-size:10px; font-weight:900; }
.student-course-card__teacher small { color:var(--profile-muted, #6b7e82); font-weight:700; }
.student-course-card__info h3 { display:-webkit-box; overflow:hidden; min-height:49px; margin:10px 0 5px; color:var(--profile-ink, #10223f); font-size:16px; line-height:1.55; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.student-course-card__info > p { display:-webkit-box; overflow:hidden; margin:0 0 11px; color:var(--profile-muted, #6b7e82); font-size:11px; line-height:1.6; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.student-course-card__meta { display:flex; flex-wrap:wrap; gap:8px 15px; color:var(--profile-muted, #6b7e82); font-size:10px; }
.student-course-card__footer { display:flex; align-items:flex-end; gap:13px; margin-top:auto; padding-top:14px; border-top:1px solid var(--profile-border, #dce3e5); }
.student-course-card__progress { flex:1; }
.student-course-card__progress > div { display:flex; justify-content:space-between; margin-bottom:6px; color:var(--profile-muted, #6b7e82); font-size:10px; }
.student-course-card__progress b { color:var(--profile-ink, #10223f); }
.student-course-card__progress > span { display:block; height:5px; overflow:hidden; border-radius:20px; background:var(--profile-canvas, #edf1f5); }
.student-course-card__progress > span > i { display:block; height:100%; border-radius:inherit; background:var(--profile-secondary, #1676d2); }
.student-course-card__arrow { display:grid; width:31px; height:31px; place-items:center; border-radius:8px; background:var(--profile-secondary-soft, #eaf3ff); color:var(--profile-secondary, #1676d2); font-style:normal; transition:.2s; }
.student-course-card:hover .student-course-card__arrow { background:var(--profile-secondary, #1676d2); color:var(--profile-on-action, #fff); }
.student-course-card__invoice { position:absolute; z-index:3; right:auto; bottom:13px; left:13px; display:inline-flex; min-height:34px; align-items:center; gap:6px; padding:7px 10px; border:1px solid var(--profile-border, #dce3e5); border-radius:8px; background:var(--profile-surface, #fff); color:var(--profile-secondary, #1676d2); font-size:10px; font-weight:900; text-decoration:none; box-shadow:0 6px 18px rgb(7 20 44 / 10%); }
.student-course-card:has(.student-course-card__invoice) .student-course-card__footer { padding-inline-end:80px; }
.student-course-card--blocked { opacity:.78; }
.student-course-card--blocked:hover { transform:none; }
@media (max-width:520px) { .student-course-card,.student-course-card__link { min-height:380px; } }
@media (prefers-reduced-motion:reduce) { .student-course-card,.student-course-card__cover img,.student-course-card__arrow { transition:none; } }
</style>
