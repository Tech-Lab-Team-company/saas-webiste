<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useUserStore } from "~/stores/user";

export interface SecurityData {
  secure?: number;
  is_flipbook?: number;
  code_duration?: number;
  is_fixed?: number;
  show_video_code?: number;
  code_font_size?: number;
  open_pdf_type?: number;
  download_option?: number;
  can_download_offline?: number;
  can_save_to_device?: number;
  long_video?: boolean;
}

const props = withDefaults(
  defineProps<{
    courseId?: number | null;
    securityData?: SecurityData | null;
  }>(),
  {
    courseId: null,
    securityData: null,
  },
);

const userStore = useUserStore();
const protectionConfig = useCourseProtectionConfig();

const marks = Array.from(
  { length: protectionConfig.watermarkCopies },
  (_, index) => index,
);

const watermark = computed(() => {
  const user = userStore.user;
  if (!user) return protectionConfig.watermarkFallbackText;

  return [
    protectionConfig.watermarkShowStudentName ? user.name : "",
    protectionConfig.watermarkShowStudentId && user.id ? `ID ${user.id}` : "",
    protectionConfig.watermarkShowCourseId && props.courseId
      ? `COURSE ${props.courseId}`
      : "",
  ]
    .filter(Boolean)
    .join("  •  ") || protectionConfig.watermarkFallbackText;
});

// 1. show_video_code: controls whether watermark is enabled
const isCodeShown = computed(() => {
  if (!protectionConfig.enabled) return false;
  if (
    props.securityData &&
    props.securityData.show_video_code !== undefined &&
    props.securityData.show_video_code !== null
  ) {
    const val = props.securityData.show_video_code;
    return val === 1 || val === "1" || val === true;
  }
  return protectionConfig.watermarkEnabled;
});

// 2. is_fixed: 1 = fixed repeated grid, 0 = dynamic moving / floating watermark
const isFixed = computed(() => {
  if (
    props.securityData &&
    props.securityData.is_fixed !== undefined &&
    props.securityData.is_fixed !== null
  ) {
    const val = props.securityData.is_fixed;
    return val === 1 || val === "1" || val === true;
  }
  return true;
});

// 3. code_font_size: custom dynamic font size in pixels
const customFontSize = computed(() => {
  const raw = props.securityData?.code_font_size;
  if (raw !== undefined && raw !== null) {
    const num = Number(raw);
    if (Number.isFinite(num) && num > 0) {
      return `${num}px`;
    }
  }
  return null;
});

const watermarkStyle = computed(() => {
  const styles: Record<string, string> = {
    "--course-watermark-opacity": String(
      isFixed.value
        ? protectionConfig.watermarkOpacity
        : Math.max(0.65, protectionConfig.watermarkOpacity * 2.2),
    ),
  };

  if (customFontSize.value) {
    styles["--course-watermark-font-size"] = customFontSize.value;
  }

  return styles;
});

// 4. code_duration: play & off (appear and disappear cycle)
const isDurationVisible = ref(true);
let durationTimer: ReturnType<typeof setTimeout> | null = null;

const clearDurationTimer = () => {
  if (durationTimer) {
    clearTimeout(durationTimer);
    durationTimer = null;
  }
};

// Dynamic floating position for is_fixed = 0
const dynamicPosition = ref({
  top: "28%",
  left: "32%",
  rotation: "-10deg",
});

let moveTimer: ReturnType<typeof setInterval> | null = null;

const clearMoveTimer = () => {
  if (moveTimer) {
    clearInterval(moveTimer);
    moveTimer = null;
  }
};

const updateDynamicPosition = () => {
  const minX = 14;
  const maxX = 66;
  const minY = 14;
  const maxY = 72;

  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  const randomRot = Math.floor(Math.random() * 24) - 12; // -12deg to +12deg

  dynamicPosition.value = {
    top: `${randomY}%`,
    left: `${randomX}%`,
    rotation: `${randomRot}deg`,
  };
};

const dynamicFloatingStyle = computed(() => ({
  "--dynamic-top": dynamicPosition.value.top,
  "--dynamic-left": dynamicPosition.value.left,
  "--dynamic-rotation": dynamicPosition.value.rotation,
}));

const setupTimers = () => {
  clearDurationTimer();
  clearMoveTimer();

  if (!isCodeShown.value) {
    isDurationVisible.value = false;
    return;
  }

  if (!isFixed.value) {
    updateDynamicPosition();
  }

  const durationSec = Number(props.securityData?.code_duration || 0);

  if (Number.isFinite(durationSec) && durationSec > 0) {
    const durationMs = Math.max(1000, durationSec * 1000);
    const offDurationMs = Math.max(2000, durationMs);

    const scheduleNext = (showing: boolean) => {
      isDurationVisible.value = showing;
      if (showing && !isFixed.value) {
        updateDynamicPosition();
      }

      durationTimer = setTimeout(() => {
        scheduleNext(!showing);
      }, showing ? durationMs : offDurationMs);
    };

    scheduleNext(true);
  } else {
    isDurationVisible.value = true;

    if (!isFixed.value) {
      moveTimer = setInterval(() => {
        updateDynamicPosition();
      }, 4000);
    }
  }
};

watch(
  () => [
    props.securityData?.code_duration,
    props.securityData?.is_fixed,
    props.securityData?.show_video_code,
    props.securityData?.code_font_size,
    protectionConfig.enabled,
    protectionConfig.watermarkEnabled,
  ],
  setupTimers,
  { immediate: true },
);

onBeforeUnmount(() => {
  clearDurationTimer();
  clearMoveTimer();
});
</script>

<template>
  <div
    v-if="isCodeShown && isDurationVisible"
    class="course-media-watermark"
    :class="{
      'course-media-watermark--fixed': isFixed,
      'course-media-watermark--dynamic': !isFixed,
    }"
    :style="watermarkStyle"
    aria-hidden="true"
  >
    <!-- Fixed Grid Pattern -->
    <template v-if="isFixed">
      <span v-for="mark in marks" :key="mark">{{ watermark }}</span>
    </template>

    <!-- Dynamic Floating Watermark -->
    <template v-else>
      <div
        class="course-media-watermark__floating"
        :style="dynamicFloatingStyle"
      >
        <div class="watermark-pill">
          <i class="watermark-pill__dot" aria-hidden="true"></i>
          <span>{{ watermark }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.course-media-watermark {
  position: absolute;
  z-index: 12;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.3s ease-in-out;
}

.course-media-watermark--fixed {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  align-content: space-around;
  gap: clamp(20px, 5vw, 58px) 12px;
  padding: 24px 0;
}

.course-media-watermark--fixed span {
  color: rgb(255 255 255 / var(--course-watermark-opacity, 0.3));
  font-size: var(--course-watermark-font-size, clamp(9px, 1.05vw, 13px));
  font-weight: 800;
  letter-spacing: 0.035em;
  text-align: center;
  text-shadow: 0 1px 3px rgb(0 0 0 / 70%);
  transform: rotate(-18deg);
  white-space: nowrap;
}

.course-media-watermark--dynamic {
  display: block;
}

.course-media-watermark__floating {
  position: absolute;
  top: var(--dynamic-top, 28%);
  left: var(--dynamic-left, 32%);
  transform: translate(-50%, -50%) rotate(var(--dynamic-rotation, -10deg));
  transition:
    top 1.2s cubic-bezier(0.25, 1, 0.5, 1),
    left 1.2s cubic-bezier(0.25, 1, 0.5, 1),
    transform 1.2s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.3s ease;
}

.watermark-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 9999px;
  background: rgb(0 0 0 / 48%);
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 20px rgb(0 0 0 / 35%);
  color: rgb(255 255 255 / var(--course-watermark-opacity, 0.75));
  font-size: var(--course-watermark-font-size, clamp(11px, 1.1vw, 15px));
  font-weight: 800;
  letter-spacing: 0.035em;
  text-shadow: 0 1px 4px rgb(0 0 0 / 80%);
  white-space: nowrap;
}

.watermark-pill__dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2878e8;
  box-shadow: 0 0 8px #2878e8;
}

@media (max-width: 680px) {
  .course-media-watermark--fixed {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    gap: 22px 8px;
  }
}
</style>

