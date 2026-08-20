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
const isJoining = ref(false);

const updateCourseStatus = (status: number) => {
  Status.value = status;
  emit("Changestatus");
};

const JoinCourse = async () => {
  if (isJoining.value) return;

  const coursePaymentParams = new CoursesPaymentParams({
    CourseId: Number(router.currentRoute.value.params.id),
    PaymentMethod: 0,
    Account: "",
    Receipt: null,
  });
  const coursesPaymentController = CoursesPaymentController.getInstance();
  if (userStore.user) {
    isJoining.value = true;

    try {
      await coursesPaymentController.CoursesPayment(coursePaymentParams);

      if (coursesPaymentController.isDataSuccess()) {
        Status.value = 1;
        emit("Changestatus");
      }
    } finally {
      isJoining.value = false;
    }
  } else {
    toast.add({
      severity: "info",
      summary: "تنبيه",
      detail: "يجب تسجيل الدخول",
      life: 3000,
    });
    await router.push({
      path: "/loginhome",
      query: { redirect: router.currentRoute.value.fullPath },
    });
  }
};

const userStore = useUserStore();
</script>

<template>
  <div class="course-card-layout" dir="auto">
    <section class="course-hero-shell public-detail-hero">
      <div class="course-hero-inner detail-hero-grid">
        <div class="card-text detail-copy">
          <div class="detail-breadcrumb" aria-label="مسار الصفحة">
            <NuxtLink to="/">الرئيسية</NuxtLink>
            <span>/</span>
            <NuxtLink to="/course">{{ $t("all_courses") }}</NuxtLink>
            <span>/</span>
            <b>{{ CardDetails?.title }}</b>
          </div>

          <div class="course-badges">
            <span class="course-badge course-badge-access detail-badge">
              <i
                :class="CardDetails?.CoursePrice != 0 ? 'pi pi-wallet' : 'pi pi-check-circle'"
                aria-hidden="true"
              ></i>
              <template v-if="CardDetails?.course_videos">
                {{ CardDetails?.course_videos }} {{ $t("video") }}
                <span class="course-badge-separator" aria-hidden="true">&middot;</span>
              </template>
              {{ CardDetails?.CoursePrice != 0 ? $t("paid_course") : $t("free") }}
            </span>
          </div>

          <div class="card-text-title">
            <h1 class="card-text-main-title">{{ CardDetails?.title }}</h1>
            <h2>{{ CardDetails?.Teacher?.name || userSetting.setting?.name }}</h2>
          </div>

          <div
            class="hero-description"
            v-if="CardDetails?.description"
            v-html="CardDetails?.description"
          ></div>

          <div class="hero-course-details detail-teacher">
            <div class="hero-teacher" v-if="CardDetails?.Teacher || userSetting.setting">
              <span class="hero-teacher-avatar" aria-hidden="true">
                {{ (CardDetails?.Teacher?.name || userSetting.setting?.name || CardDetails?.title || "").charAt(0) }}
              </span>
              <div>
                <small>{{ $t("course_teacher") }}</small>
                <b>{{ CardDetails?.Teacher?.name || userSetting.setting?.name }}</b>
              </div>
            </div>

            <i v-if="(CardDetails?.Teacher || userSetting.setting) && CardDetails?.Subject?.title"></i>

            <div class="hero-subject" v-if="CardDetails?.Subject?.title">
              <small>{{ $t("subject") }}</small>
              <b>{{ CardDetails?.Subject?.title }}</b>
            </div>
          </div>
        </div>

        <div class="hero-media detail-art">
          <img
            :src="CardDetails?.Image?.img || userSetting.setting?.image?.img"
            :alt="CardDetails?.title || CardDetails?.Image?.image"
          />
          <span>{{ CardDetails?.Teacher?.name || userSetting.setting?.name }}</span>
          <small v-if="CardDetails?.Subject?.title">{{ CardDetails?.Subject?.title }}</small>
        </div>
      </div>
    </section>

    <div class="course-body-shell course-detail-main">
      <div class="course-body-grid detail-layout">
        <main class="course-main-content detail-content">
          <slot name="main" :platform-teacher="userSetting.setting"></slot>
        </main>

        <aside class="course-details-sidebar">
          <div class="course-details-sidebar__inner">
            <article class="course-summary-card enroll-card">
              <div class="summary-media enroll-cover">
                <img
                  :src="CardDetails?.Image?.img || userSetting.setting?.image?.img"
                  :alt="CardDetails?.title || CardDetails?.Image?.image"
                />
                <span aria-hidden="true"><i class="pi pi-play-circle"></i></span>
                <small v-if="CardDetails?.Subject?.title">{{ CardDetails?.Subject?.title }}</small>
              </div>

              <div class="summary-content">
                <div class="enroll-price">
                  <span class="summary-label">{{ $t("course_access") }}</span>
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
                </div>

                <div class="summary-meta"><ul>
                  <li>
                    <span>{{ CardDetails?.course_videos || 0 }} {{ $t("video") }}</span>
                  </li>
                  <li>
                    <span>{{ CardDetails?.course_docs || 0 }} {{ $t("paper_file") }}</span>
                  </li>
                  <li v-if="CardDetails?.course_records">
                    <span>{{ CardDetails?.course_records }} {{ $t("audio_file") }}</span>
                  </li>
                  <li v-if="CardDetails?.Subject?.title">
                    <span>{{ CardDetails?.Subject?.title }}</span>
                  </li>
                </ul></div>

                <div class="btns btns-container">
                  <PaymentDialog
                    :status="Status"
                    :course-title="CardDetails?.title"
                    :price="CardDetails?.CoursePrice"
                    :currency="CardDetails?.currency"
                    pending-label="طلب الانضمام قيد المراجعة"
                    class="payment-dialog"
                    v-if="CardDetails?.CoursePrice"
                    @status-changed="updateCourseStatus"
                  />

                  <button class="payment-btn" @click="JoinCourse" :disabled="isJoining" v-if="
                    Status == 0 &&
                    CardDetails?.CoursePrice != 0 &&
                    !CardDetails?.is_subscribed &&
                    userSetting.setting?.join_option_status == 1
                  ">
                    <i :class="isJoining ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'" aria-hidden="true"></i>
                    {{ isJoining ? "جاري إرسال الطلب..." : "طلب الانضمام" }}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </div>

    <section
      class="course-final-cta detail-final"
      v-if="CardDetails?.CoursePrice != 0 && !CardDetails?.is_subscribed"
    >
      <div class="course-final-cta__inner">
        <div class="final-cta-copy">
          <span>{{ $t("course_access") }}</span>
          <h2>جاهز تبدأ <em>{{ CardDetails?.title }}</em>؟</h2>
          <div v-if="CardDetails?.description" v-html="CardDetails?.description"></div>
        </div>

        <div class="btns final-cta-actions">
          <PaymentDialog
            :status="Status"
            :course-title="CardDetails?.title"
            :price="CardDetails?.CoursePrice"
            :currency="CardDetails?.currency"
            pending-label="طلب الانضمام قيد المراجعة"
            class="payment-dialog"
            v-if="CardDetails?.CoursePrice"
            @status-changed="updateCourseStatus"
          />

          <button class="payment-btn" @click="JoinCourse" :disabled="isJoining" v-if="
            Status == 0 &&
            CardDetails?.CoursePrice != 0 &&
            !CardDetails?.is_subscribed &&
            userSetting.setting?.join_option_status == 1
          ">
            <i :class="isJoining ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'" aria-hidden="true"></i>
            {{ isJoining ? "جاري إرسال الطلب..." : "طلب الانضمام" }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-card.scss"></style>
