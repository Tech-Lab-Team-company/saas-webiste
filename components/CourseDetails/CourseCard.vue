<script setup lang="ts">
import Dialog from "primevue/dialog";
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
import { DataSuccess } from "~/base/core/networkStructure/Resources/dataState/data_state";
import AddFavoriteController from "~/features/Favorite/presentation/controllers/add_favorite_controller";
import AddFavoriteParams from "~/features/Favorite/Core/Params/add_favorite_params";
import { FavoriteEnum } from "~/features/Favorite/Core/enums/favorite_params";

const props = defineProps({
  CourseData: {
    type: Object as () => CourseDetailsModel | null,
    default: null,
  },
  status: {
    type: Number,
    default: 0,
  },
  dashboardMode: {
    type: Boolean,
    default: false,
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
const introDialogVisible = ref(false);
const introVideo = ref<HTMLVideoElement | null>(null);

const introUrl = computed(() => {
  const value = CardDetails.value?.intro;
  return typeof value === "string" && value.trim() ? value.trim() : null;
});

const favController = AddFavoriteController.getInstance();
const isFavorite = ref(false);
const isFavoritePending = ref(false);

watch(
  () => CardDetails.value,
  (course) => {
    isFavorite.value = Boolean(course?.is_favorite);
  },
  { immediate: true },
);

const toggleFavorite = async () => {
  if (!CardDetails.value || isFavoritePending.value) return;

  const courseId = Number(CardDetails.value.id);
  if (!Number.isInteger(courseId) || courseId <= 0) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "تعذر تحديد الكورس لإضافته إلى المفضلة.",
      life: 3000,
    });
    return;
  }

  const wasFavorite = isFavorite.value;
  isFavoritePending.value = true;
  try {
    const stateRef = await favController.addFavorite(
      new AddFavoriteParams(FavoriteEnum.COURSE, courseId),
    );

    if (!(stateRef.value instanceof DataSuccess)) {
      throw new Error(
        stateRef.value.error?.title ?? "تعذر إضافة الكورس إلى المفضلة.",
      );
    }

    isFavorite.value = !wasFavorite;
    toast.add({
      severity: "success",
      summary: wasFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
      detail: wasFavorite
        ? "تمت إزالة الكورس من قائمة المفضلة."
        : "تمت إضافة الكورس إلى قائمة المفضلة بنجاح.",
      life: 3000,
    });
  } catch (error: unknown) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail:
        error instanceof Error
          ? error.message
          : "تعذر إضافة الكورس إلى المفضلة. حاول مرة أخرى.",
      life: 3000,
    });
  } finally {
    isFavoritePending.value = false;
  }
};

const youtubeEmbedUrl = computed(() => {
  if (!introUrl.value) return null;

  try {
    const url = new URL(introUrl.value);
    const hostname = url.hostname.replace(/^www\./u, "").toLowerCase();
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (hostname === "youtube.com" || hostname.endsWith(".youtube.com")) {
      videoId =
        url.searchParams.get("v")
        || url.pathname.match(/^\/(?:embed|shorts)\/([^/?#]+)/u)?.[1]
        || null;
    }

    return videoId
      ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`
      : null;
  } catch {
    return null;
  }
});

const openIntroDialog = () => {
  if (introUrl.value) introDialogVisible.value = true;
};

const stopIntroVideo = () => {
  if (!introVideo.value) return;
  introVideo.value.pause();
  introVideo.value.currentTime = 0;
};

watch(introUrl, (value) => {
  if (!value) introDialogVisible.value = false;
});

watch(introDialogVisible, (visible) => {
  if (!visible) stopIntroVideo();
});

onBeforeUnmount(stopIntroVideo);

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
            <template v-if="dashboardMode">
              <NuxtLink :to="{ name: 'student-dashboard' }">الرئيسية</NuxtLink>
              <span>/</span>
              <NuxtLink :to="{ name: 'profilecourse' }">مشترياتي</NuxtLink>
              <span>/</span>
              <b>{{ CardDetails?.title }}</b>
            </template>
            <template v-else>
              <NuxtLink to="/">الرئيسية</NuxtLink>
              <span>/</span>
              <NuxtLink to="/course">{{ $t("all_courses") }}</NuxtLink>
              <span>/</span>
              <b>{{ CardDetails?.title }}</b>
            </template>
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
                <button
                  v-if="introUrl"
                  type="button"
                  class="enroll-cover__play"
                  :aria-label="`تشغيل الفيديو التعريفي لكورس ${CardDetails?.title || ''}`"
                  @click="openIntroDialog"
                >
                  <i class="pi pi-play-circle" aria-hidden="true"></i>
                </button>
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

                <button
                  type="button"
                  class="favorite-action"
                  :class="{ 'favorite-action--active': isFavorite }"
                  :disabled="isFavoritePending"
                  :aria-pressed="isFavorite"
                  :aria-label="isFavorite ? 'أزل الكورس من المفضلة' : 'أضف الكورس إلى المفضلة'"
                  @click="toggleFavorite"
                >
                  <span class="favorite-action__heart" aria-hidden="true">
                    <i :class="isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
                  </span>
                  <span class="favorite-action__label">
                    {{ isFavorite ? "إزالة من المفضلة" : "أضف إلى المفضلة" }}
                  </span>
                  <i
                    v-if="isFavoritePending"
                    class="pi pi-spin pi-spinner favorite-action__spinner"
                    aria-hidden="true"
                  ></i>
                </button>

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

    <Dialog
      v-model:visible="introDialogVisible"
      modal
      dismissable-mask
      :draggable="false"
      :style="{ width: 'min(900px, calc(100vw - 24px))' }"
      class="course-intro-dialog"
      dir="rtl"
      @hide="stopIntroVideo"
    >
      <template #header>
        <div class="course-intro-dialog__header">
          <span class="pi pi-play-circle" aria-hidden="true"></span>
          <div>
            <strong>الفيديو التعريفي</strong>
            <small>{{ CardDetails?.title }}</small>
          </div>
        </div>
      </template>

      <div v-if="introDialogVisible && introUrl" class="course-intro-dialog__media">
        <iframe
          v-if="youtubeEmbedUrl"
          :src="youtubeEmbedUrl"
          :title="`الفيديو التعريفي لكورس ${CardDetails?.title || ''}`"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <video
          v-else
          ref="introVideo"
          :src="introUrl"
          :poster="CardDetails?.Image?.img || userSetting.setting?.image?.img"
          controls
          autoplay
          playsinline
          preload="metadata"
        >
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-card.scss"></style>
