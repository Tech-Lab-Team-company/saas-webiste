<script setup lang="ts">
import "primeicons/primeicons.css";
import { createTelUrl, createWhatsAppUrl } from "~/utils/contactLinks";

const UserSetting = useSettingStore();
const BUTTON_SIZE = 76;
const EDGE_GAP = 8;
const MENU_CLEARANCE = 150;

const dragger = ref<HTMLElement | null>(null);
const position = reactive({ left: 32, top: 0 });
const hasBeenMoved = ref(false);
const showDragHint = ref(true);
const isDragging = ref(false);
let didDrag = false;
let activePointerId: number | null = null;
let pointerStartX = 0;
let pointerStartY = 0;
let positionStartLeft = 0;
let positionStartTop = 0;
let dragHintTimer: ReturnType<typeof window.setTimeout> | null = null;

const items = computed(() => {
    const countryCode = UserSetting.setting?.country_code;
    const phoneUrl = createTelUrl(UserSetting.setting?.phone, countryCode);
    const whatsappUrl = createWhatsAppUrl(UserSetting.setting?.whatsapp, countryCode);

    return [
        phoneUrl && {
            label: 'اتصال',
            icon: 'pi pi-phone',
            command: () => {
                window.location.href = phoneUrl;
            },
        },
        whatsappUrl && {
            label: 'واتساب',
            icon: 'pi pi-whatsapp',
            command: () => {
                window.location.href = whatsappUrl;
            },
        },
    ].filter((item): item is NonNullable<typeof item> => Boolean(item));
});

const floatingStyle = computed(() => ({
    left: `${position.left}px`,
    top: `${position.top}px`,
}));

const keepInsideViewport = (left: number, top: number) => {
    const maxLeft = Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP);
    const minTop = Math.min(MENU_CLEARANCE, Math.max(EDGE_GAP, window.innerHeight - BUTTON_SIZE - EDGE_GAP));
    const maxTop = Math.max(minTop, window.innerHeight - BUTTON_SIZE - EDGE_GAP);

    position.left = Math.min(Math.max(left, EDGE_GAP), maxLeft);
    position.top = Math.min(Math.max(top, minTop), maxTop);
};

const setDefaultPosition = () => {
    const isMobile = window.innerWidth <= 768;
    const left = isMobile ? 32 : 40;
    const top = window.innerHeight * (isMobile ? 0.66 : 0.78) - 32;
    keepInsideViewport(left, top);
};

const handlePointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    const isDragTarget = target.closest('.contact-speed-dial-drag-handle');
    if (!isDragTarget || !dragger.value) return;

    event.preventDefault();
    event.stopPropagation();
    const bounds = dragger.value.getBoundingClientRect();
    showDragHint.value = false;
    isDragging.value = true;
    didDrag = false;
    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    positionStartLeft = bounds.left;
    positionStartTop = bounds.top;
    dragger.value.setPointerCapture(event.pointerId);
};

const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging.value || event.pointerId !== activePointerId) return;

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;
    if (Math.hypot(deltaX, deltaY) > 4) didDrag = true;
    if (!didDrag) return;

    event.preventDefault();
    keepInsideViewport(positionStartLeft + deltaX, positionStartTop + deltaY);
};

const handlePointerUp = (event: PointerEvent) => {
    if (!isDragging.value || event.pointerId !== activePointerId) return;

    isDragging.value = false;
    activePointerId = null;
    hasBeenMoved.value ||= didDrag;
    if (dragger.value?.hasPointerCapture(event.pointerId)) {
        dragger.value.releasePointerCapture(event.pointerId);
    }
};

const handleResize = () => {
    if (hasBeenMoved.value) {
        keepInsideViewport(position.left, position.top);
        return;
    }

    setDefaultPosition();
};

onMounted(() => {
    setDefaultPosition();
    window.addEventListener('resize', handleResize);
    dragHintTimer = window.setTimeout(() => {
        showDragHint.value = false;
    }, 5000);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    if (dragHintTimer !== null) window.clearTimeout(dragHintTimer);
});
</script>

<template>
    <div
        ref="dragger"
        class="contact-speed-dial-dragger"
        :class="{ 'is-dragging': isDragging }"
        :style="floatingStyle"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
    >
        <Transition name="drag-hint">
            <span v-if="showDragHint" class="contact-speed-dial-drag-hint">
                اسحب لتحريك زر التواصل
            </span>
        </Transition>
        <button
            class="contact-speed-dial-drag-handle"
            type="button"
            aria-label="اسحب لتحريك زر التواصل"
            title="اسحب لتحريك زر التواصل"
            @click.stop.prevent
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 8.7 5.3l1.4 1.4.9-.9V11H5.8l.9-.9-1.4-1.4L2 12l3.3 3.3 1.4-1.4-.9-.9H11v5.2l-.9-.9-1.4 1.4L12 22l3.3-3.3-1.4-1.4-.9.9V13h5.2l-.9.9 1.4 1.4L22 12l-3.3-3.3-1.4 1.4.9.9H13V5.8l.9.9 1.4-1.4L12 2Z" />
            </svg>
        </button>
        <SpeedDial
            class="contact-speed-dial"
            :model="items"
            direction="up"
            aria-label="فتح خيارات التواصل"
        >
            <template #icon>
                <i class="pi pi-cloud"></i>
            </template>
        </SpeedDial>
    </div>

</template>

<style>
.contact-speed-dial-dragger {
    position: fixed;
    z-index: 9999;
    width: 76px;
    height: 76px;
    user-select: none;
}

.contact-speed-dial-drag-handle {
    position: absolute;
    z-index: 3;
    top: -9px;
    right: -9px;
    display: grid;
    width: 25px;
    height: 25px;
    padding: 0;
    place-items: center;
    border: 1px solid #cbd9f5;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 5px 16px rgba(10, 35, 92, 0.2);
    color: #3268df;
    cursor: grab;
    touch-action: none;
}

.contact-speed-dial-drag-handle svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
}

.contact-speed-dial-dragger.is-dragging .contact-speed-dial-drag-handle {
    cursor: grabbing;
}

.contact-speed-dial-drag-hint {
    position: absolute;
    z-index: 2;
    top: -45px;
    left: 0;
    width: max-content;
    max-width: min(210px, calc(100vw - 24px));
    padding: 6px 10px;
    border: 1px solid #d7e1f5;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 4px 14px rgba(10, 35, 92, 0.12);
    color: #315da8;
    direction: rtl;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.35;
    pointer-events: none;
    white-space: nowrap;
}
.p-button-sm.p-button-icon-only.p-button-rounded{
    width: 40px !important;
    height: 40px !important;
}

.drag-hint-enter-active,
.drag-hint-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.drag-hint-enter-from,
.drag-hint-leave-to {
    opacity: 0;
    transform: translateY(4px);
}

.contact-speed-dial {
    position: relative !important;
    display: block !important;
    width: 76px;
    height: 76px;
}

.contact-speed-dial .p-speeddial-list {
    position: absolute !important;
    bottom: calc(100% + 12px);
    left: 8px;
    display: flex !important;
    width: 60px;
    gap: 10px;
}

.contact-speed-dial .p-speeddial-button,
.contact-speed-dial .p-speeddial-button.p-button-icon-only {
    width: 60px !important;
    min-width: 60px !important;
    max-width: 60px !important;
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
    padding: 0 !important;
    flex: 0 0 60px !important;
    touch-action: none;
}

.contact-speed-dial .p-speeddial-item .p-speeddial-action {
    width: 60px !important;
    min-width: 60px !important;
    max-width: 60px !important;
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
    padding: 0 !important;
    flex: 0 0 60px !important;
}

.contact-speed-dial .p-speeddial-button .pi {
    font-size: 2rem !important;
}

.contact-speed-dial .p-speeddial-action .pi {
    font-size: 1rem !important;
}
</style>
