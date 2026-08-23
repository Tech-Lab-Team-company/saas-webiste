<script setup lang="ts">
import CourseDetailsModel from "~/features/FetchCourseDetails/Data/models/course_details_model";
import Dashedicon from "~/public/icons/dashedicon.vue";
import PaymentDialog from "./PaymentDialog.vue";
import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";

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
const normalizeStatus = (value: unknown): number => {
  const parsedStatus = Number(value);
  return Number.isFinite(parsedStatus) ? parsedStatus : 0;
};
const Status = ref(normalizeStatus(props.status));

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
    Status.value = normalizeStatus(newValue);
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
  if (userStore.user) {
    isJoining.value = true;

    try {
      const courseId = Number(CardDetails.value?.id);
      if (!Number.isInteger(courseId) || courseId <= 0) {
        throw new Error("معرّف الكورس غير صالح. أعد تحميل الصفحة وحاول مرة أخرى.");
      }

      const response = await NetworkService.instance.post({
        url: ApiNames.Instance.buy_product,
        isAuth: true,
        data: {
          course_id: courseId,
          subscription_type: 5,
        },
      });
      const apiStatus = response?.data?.status;
      const apiSuccess = response?.data?.success;
      const failedValues = ["0", "false", "error", "failed", "fail"];
      const failed =
        response.status < 200
        || response.status >= 300
        || apiStatus === false
        || apiStatus === 0
        || failedValues.includes(String(apiStatus ?? "").toLowerCase())
        || apiSuccess === false
        || apiSuccess === 0
        || failedValues.includes(String(apiSuccess ?? "").toLowerCase());

      if (failed) {
        throw new Error(response?.data?.message || "تعذر إرسال طلب الانضمام.");
      }

      Status.value = 1;
      emit("Changestatus");
      DialogSelector.instance.successDialog.openDialog({
        dialogName: "dialog",
        titleContent: "تم إرسال طلب الانضمام بنجاح",
        imageElement: successImage,
        messageContent:
          response?.data?.message
          || "سنراجع طلبك، وستظهر حالة الكورس على حسابك فور اعتماده.",
        autoCloseMs: 6500,
      });
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: "لم يتم إرسال طلب الانضمام",
        imageElement: errorImage,
        messageContent:
          error?.response?.data?.message
          || error?.message
          || "تعذر إرسال الطلب الآن. حاول مرة أخرى.",
        autoCloseMs: 6500,
      });
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
                <div
                  v-else-if="CardDetails?.is_subscribed"
                  class="course-owned-status"
                  role="status"
                >
                  <span class="course-owned-status__icon" aria-hidden="true">
                    <i class="pi pi-check"></i>
                  </span>
                  <strong>{{ $t("course_already_owned") }}</strong>
                  <small>{{ $t("course_access_ready") }}</small>
                </div>
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
                    :course-id="Number(CardDetails?.id)"
                    :status="Status"
                    :course-title="CardDetails?.title"
                    :price="CardDetails?.CoursePrice"
                    :currency="CardDetails?.currency"
                    pending-label="طلب الانضمام قيد المراجعة"
                    class="payment-dialog"
                    v-if="CardDetails?.CoursePrice && !CardDetails?.is_subscribed"
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
            :course-id="Number(CardDetails?.id)"
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
