<script setup lang="ts">
import CourseDetailsModel from "~/features/FetchCourseDetails/Data/models/course_details_model";
import Dashedicon from "~/public/icons/dashedicon.vue";
import PaymentDialog from "./PaymentDialog.vue";
import CoursesPaymentParams from "~/features/CoursePayment/Core/Params/courses_payment_params";
import CoursesPaymentController from "~/features/CoursePayment/presentation/controllers/courses_payment_controller";

import microphone from "@/public/icons/microphone.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";

const props = defineProps({
  CourseData: {
    type: Object as () => CourseDetailsModel | null,
    default: null,
  },
  status: {
    type: Number,
    default: 0,
  },
});

const CardDetails = ref(props.CourseData);
const Status = ref(props.status);

watch(
  () => props.CourseData,
  (newValue) => {
    CardDetails.value = newValue;
  },
  { immediate: true }
);
watch(
  () => props.status,
  (newValue) => {
    Status.value = newValue;
  },
  { immediate: true }
);

const userSetting = useSettingStore();

const router = useRouter();
const toast = useToast();
const emit = defineEmits(["Changestatus"]);
const JoinCourse = async () => {
  // router.currentRoute.value.params.id
  const coursePaymentParams = new CoursesPaymentParams({
    CourseId: Number(router.currentRoute.value.params.id),
    PaymentMethod: 0,
    Account: "",
    Receipt: null,
  });
  const coursesPaymentController = CoursesPaymentController.getInstance();
  if (userStore.user) {
    const state = await coursesPaymentController.CoursesPayment(
      coursePaymentParams
    );
  } else {
    toast.add({
      severity: "info",
      summary: "تنبيه",
      detail: "يجب تسجيل الدخول",
      life: 3000,
    });
  }
  if (Status.value) {
    emit("Changestatus");
  }
};

const userStore = useUserStore();
</script>

<template>
  <section class="course-hero-shell" dir="auto">
    <div class="card-container">
      <main class="card-text">
        <div class="course-badges">
          <span class="course-badge course-badge-subject" v-if="CardDetails?.Subject?.title">
            <i class="pi pi-book" aria-hidden="true"></i>
            {{ CardDetails?.Subject?.title }}
          </span>
          <span class="course-badge course-badge-access">
            <i
              :class="CardDetails?.CoursePrice != 0 ? 'pi pi-lock' : 'pi pi-check-circle'"
              aria-hidden="true"
            ></i>
            {{ CardDetails?.CoursePrice != 0 ? $t("paid_course") : $t("free") }}
          </span>
        </div>

        <div class="card-text-title">
          <p class="course-kicker">{{ $t("course_details") }}</p>
          <h1 class="card-text-main-title">{{ CardDetails?.title }}</h1>
        </div>

        <section class="about-course" v-if="CardDetails?.description">
          <div class="section-heading">
            <span class="section-icon"><i class="pi pi-align-right" aria-hidden="true"></i></span>
            <h2>{{ $t("about_course") }}</h2>
          </div>
          <div class="card-text-description" v-html="CardDetails?.description"></div>
        </section>

        <div class="course-info-grid">
          <div class="course-info-item" v-if="CardDetails?.course_videos">
            <span class="info-icon"><video1 /></span>
            <span class="info-copy">
              <strong>{{ CardDetails?.course_videos }}</strong>
              <small>{{ $t("video") }}</small>
            </span>
          </div>
          <div class="course-info-item" v-if="CardDetails?.course_docs">
            <span class="info-icon"><note /></span>
            <span class="info-copy">
              <strong>{{ CardDetails?.course_docs }}</strong>
              <small>{{ $t("paper_file") }}</small>
            </span>
          </div>
          <div class="course-info-item" v-if="CardDetails?.course_records">
            <span class="info-icon"><microphone /></span>
            <span class="info-copy">
              <strong>{{ CardDetails?.course_records }}</strong>
              <small>{{ $t("audio_file") }}</small>
            </span>
          </div>
        </div>

        <section class="teacher-card" v-if="CardDetails?.Teacher || userSetting.setting">
          <img
            :src="CardDetails?.Teacher?.image?.img || userSetting.setting?.image?.img"
            :alt="CardDetails?.Teacher?.name || userSetting.setting?.name"
          />
          <div class="teacher-copy">
            <span>{{ $t("course_teacher") }}</span>
            <strong>{{ CardDetails?.Teacher?.name || userSetting.setting?.name }}</strong>
          </div>
          <i class="pi pi-user teacher-icon" aria-hidden="true"></i>
        </section>
      </main>

      <aside class="course-summary-card">
        <div class="card-video">
          <img
            :src="CardDetails?.Image?.img || userSetting.setting?.image?.img"
            :alt="CardDetails?.title || CardDetails?.Image?.image"
          />
          <span class="media-label" v-if="CardDetails?.Subject?.title">
            {{ CardDetails?.Subject?.title }}
          </span>
        </div>

        <div class="summary-content">
          <p class="summary-label">{{ $t("course_access") }}</p>
          <p class="salary" v-if="CardDetails?.CoursePrice != 0 && !CardDetails?.is_subscribed">
            <span class="price">{{ CardDetails?.CoursePrice }}</span>
            <span class="currency">{{ CardDetails?.currency }}</span>
          </p>
          <p class="salary salary-status" v-else-if="CardDetails?.is_subscribed">
            <i class="pi pi-verified" aria-hidden="true"></i>
            {{ $t("buying_course_done" ) }}
          </p>
          <p class="salary salary-status" v-else>
            <i class="pi pi-gift" aria-hidden="true"></i>
            {{ $t("free") }}
          </p>

          <div class="summary-meta">
            <p v-if="CardDetails?.course_videos">
              <i class="pi pi-play-circle" aria-hidden="true"></i>
              <span>{{ CardDetails?.course_videos }} {{ $t("video") }}</span>
            </p>
            <p v-if="CardDetails?.course_docs">
              <i class="pi pi-file" aria-hidden="true"></i>
              <span>{{ CardDetails?.course_docs }} {{ $t("paper_file") }}</span>
            </p>
            <p v-if="CardDetails?.course_records">
              <i class="pi pi-volume-up" aria-hidden="true"></i>
              <span>{{ CardDetails?.course_records }} {{ $t("audio_file") }}</span>
            </p>
          </div>

          <div class="btns btns-container">
            <PaymentDialog
              :status="Status"
              class="payment-dialog"
              v-if="CardDetails?.CoursePrice"
            />

            <button class="payment-btn" @click="JoinCourse" v-if="
              Status != 1 &&
              CardDetails?.CoursePrice != 0 &&
              !CardDetails?.is_subscribed &&
              userSetting.setting?.join_option_status == 1
            ">
              طلب الانضمام
            </button>

            <button v-if="
              Status == 1 &&
              userStore.user &&
              !CardDetails?.is_subscribed &&
              CardDetails?.is_paid &&
              userSetting?.setting?.join_option_status == 1
            " disabled class="btn-disabled">
              فى انتظار قبول الطلب
            </button>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.course-hero-shell {
  --course-accent: var(--primary-color, #1d4ed8);
  --course-accent-soft: color-mix(in srgb, var(--course-accent) 9%, white);
  --course-ink: #172033;
  --course-muted: #687386;
  --course-border: #e4e9f1;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--course-accent) 8%, transparent) 0 3px, transparent 4px) 0 0 / 28px 28px,
    linear-gradient(135deg, #f7f9fd 0%, #ffffff 54%, var(--course-accent-soft) 100%);
  padding: clamp(24px, 4vw, 64px) clamp(16px, 4vw, 56px);
}

.course-hero-shell::before,
.course-hero-shell::after {
  content: "";
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  background: color-mix(in srgb, var(--course-accent) 7%, transparent);
}

.course-hero-shell::before {
  width: 280px;
  height: 280px;
  inset-block-start: -170px;
  inset-inline-end: -80px;
}

.course-hero-shell::after {
  width: 160px;
  height: 160px;
  inset-block-end: -110px;
  inset-inline-start: 4%;
}

.card-container {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(290px, 380px);
  align-items: start;
  gap: clamp(24px, 4vw, 56px);
  background: transparent;
}

.card-text {
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-block: clamp(4px, 1vw, 14px);
}

.course-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.course-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  width: fit-content;
  min-height: 34px;
  padding: 6px 12px;
  border: 1px solid color-mix(in srgb, var(--course-accent) 16%, white);
  border-radius: 999px;
  background: var(--course-accent-soft);
  color: var(--course-accent);
  font-size: 13px;
  font-weight: 700;
}

.course-badge-access {
  background: #eefbf3;
  border-color: #d7f2e1;
  color: #157347;
}

.card-text-title {
  display: block;
  width: 100%;
  padding: 0;
}

.course-kicker,
.summary-label {
  color: var(--course-muted);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.card-text-main-title {
  margin-top: 6px;
  color: var(--course-ink);
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 800;
  line-height: 1.25;
  text-align: start;
  text-wrap: balance;
}

.about-course {
  max-width: 720px;
  padding: 22px;
  border: 1px solid var(--course-border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.8);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.section-heading h2 {
  color: var(--course-ink);
  font-size: 18px;
  font-weight: 800;
}

.section-icon,
.info-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: var(--course-accent-soft);
  color: var(--course-accent);
}

.card-text-description {
  height: auto;
  max-height: 250px;
  overflow-y: auto;
  padding-inline-end: 6px;
  color: var(--course-muted);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.9;
  text-align: start;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--course-accent) 30%, white) transparent;
}

.card-text-description :deep(p + p) {
  margin-top: 8px;
}

.course-info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.course-info-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 142px;
  padding: 12px 14px;
  border: 1px solid var(--course-border);
  border-radius: 14px;
  background: #fff;
}

.info-icon {
  width: 36px;
  height: 36px;
}

.info-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.info-icon :deep(path) {
  stroke: currentColor;
}

.info-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.info-copy strong {
  color: var(--course-ink);
  font-size: 16px;
}

.info-copy small {
  color: var(--course-muted);
  font-size: 12px;
}

.teacher-card {
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 13px;
  max-width: 420px;
  padding: 13px;
  border: 1px solid var(--course-border);
  border-radius: 16px;
  background: #fff;
}

.teacher-card img {
  width: 52px;
  height: 52px;
  border: 2px solid #fff;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 0 0 1px var(--course-border);
}

.teacher-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.teacher-copy span {
  color: var(--course-muted);
  font-size: 12px;
}

.teacher-copy strong {
  overflow: hidden;
  color: var(--course-ink);
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher-icon {
  color: color-mix(in srgb, var(--course-accent) 40%, white);
  font-size: 20px;
}

.course-summary-card {
  position: sticky;
  top: 24px;
  overflow: hidden;
  border: 1px solid var(--course-border);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 16px 38px rgba(24, 39, 75, 0.09);
}

.card-video {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: 0;
  background: #eef1f6;
}

.card-video::after {
  content: "";
  position: absolute;
  inset: 55% 0 0;
  background: linear-gradient(to top, rgba(13, 23, 42, 0.52), transparent);
  pointer-events: none;
}

.card-video img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.course-summary-card:hover .card-video img {
  transform: scale(1.025);
}

.media-label {
  position: absolute;
  z-index: 1;
  inset-inline-start: 14px;
  inset-block-end: 14px;
  max-width: calc(100% - 28px);
  overflow: hidden;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--course-ink);
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-content {
  padding: 20px;
}

.salary {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 4px;
  color: var(--course-accent);
  font-weight: 800;
}

.salary .price {
  font-size: 31px;
  line-height: 1.2;
}

.salary .currency {
  font-size: 15px;
}

.salary-status {
  align-items: center;
  font-size: 20px;
}

.summary-meta {
  display: grid;
  gap: 9px;
  margin-top: 16px;
  padding-block: 15px;
  border-block: 1px solid var(--course-border);
}

.summary-meta p {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--course-muted);
  font-size: 13px;
}

.summary-meta i {
  width: 18px;
  color: var(--course-accent);
  text-align: center;
}

.btns-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  align-items: stretch;
  gap: 10px;
  width: 100%;
  margin-top: 16px;
}

.payment-dialog {
  width: 100%;
}

.btns-container > button,
.payment-dialog :deep(.btns button) {
  width: 100%;
  min-height: 46px;
  margin: 0;
  padding: 11px 16px;
  border: 1px solid var(--course-accent);
  border-radius: 12px;
  background: var(--course-accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.btns-container > button:hover:not(:disabled),
.payment-dialog :deep(.btns button:hover:not(:disabled)) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--course-accent) 24%, transparent);
}

.btns-container > .payment-btn {
  background: #fff;
  color: var(--course-accent);
}

.btns-container > .btn-disabled,
.payment-dialog :deep(.btn-disabled) {
  border-color: #d9dee8;
  background: #eef1f5;
  color: #7b8494;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .card-container {
    grid-template-columns: 1fr;
  }

  .course-summary-card {
    position: static;
    display: grid;
    grid-template-columns: minmax(240px, 0.8fr) 1fr;
  }

  .card-video {
    min-height: 100%;
  }
}

@media (max-width: 640px) {
  .course-hero-shell {
    padding: 22px 14px 28px;
  }

  .card-text {
    gap: 17px;
  }

  .card-text-main-title {
    font-size: clamp(27px, 9vw, 36px);
  }

  .about-course {
    padding: 17px;
  }

  .course-info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .course-info-item {
    min-width: 0;
    padding: 10px;
  }

  .course-summary-card {
    grid-template-columns: 1fr;
  }

  .card-video {
    min-height: auto;
  }

  .summary-content {
    padding: 17px;
  }

  .btns-container {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-video img,
  .btns-container > button,
  .payment-dialog :deep(.btns button) {
    transition: none;
  }
}

/* Keep page-level legacy course styles from overriding this isolated redesign. */
.course-hero-shell .card-container .card-text .card-text-title {
  display: block;
  width: 100%;
  padding: 0;
}

.course-hero-shell .card-container .card-text .card-text-title .card-text-main-title {
  margin-top: 6px;
  color: var(--course-ink);
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 800;
  line-height: 1.25;
  text-align: start;
}

.course-hero-shell .card-container .card-text .card-text-description {
  height: auto;
  max-height: 250px;
  margin: 0;
  padding: 0;
  color: var(--course-muted);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.9;
  text-align: start;
}

@media (max-width: 640px) {
  .course-hero-shell .card-container .card-text .card-text-title .card-text-main-title {
    font-size: clamp(27px, 9vw, 36px);
  }
}
</style>
