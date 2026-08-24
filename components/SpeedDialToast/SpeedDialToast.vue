<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import {
    createTelegramUrl,
    createTelUrl,
    createWhatsAppUrl,
} from "~/utils/contactLinks";

type ContactType = 'phone' | 'whatsapp' | 'telegram'

interface ContactItem extends MenuItem {
    label: string
    icon: string
    type: ContactType
    description: string
}

interface SpeedDialInstance {
    hide: () => void
}

const UserSetting = useSettingStore();
const DESKTOP_WIDGET_WIDTH = 56;
const MOBILE_WIDGET_WIDTH = 56;
const WIDGET_HEIGHT = 56;
const EDGE_GAP = 8;
const MENU_CLEARANCE = 260;
const POSITION_STORAGE_KEY = 'contact-speed-dial-position';
const DRAG_THRESHOLD = 6;

const dragger = ref<HTMLElement | null>(null);
const speedDial = ref<SpeedDialInstance | null>(null);
const position = reactive({ left: 32, top: 0 });
const viewport = reactive({ width: 0, height: 0 });
const hasBeenMoved = ref(false);
const showDragHint = ref(true);
const isDragging = ref(false);
const isContactMenuOpen = ref(false);
let didDrag = false;
let activePointerId: number | null = null;
let activeCaptureTarget: HTMLElement | null = null;
let pointerStartX = 0;
let pointerStartY = 0;
let positionStartLeft = 0;
let positionStartTop = 0;
let dragStartedFromLauncher = false;
let suppressNextLauncherClick = false;
let suppressClickTimer: ReturnType<typeof window.setTimeout> | null = null;
let dragHintTimer: ReturnType<typeof window.setTimeout> | null = null;

const isValidCssColor = (value: unknown): value is string => {
    const color = String(value || '').trim();
    return /^(#[\da-f]{3,8}|(?:rgb|hsl)a?\([^)]*\))$/iu.test(color);
};

const contactThemeStyle = computed(() => {
    const primaryColor = UserSetting.setting?.primary_color;
    const secondaryColor = UserSetting.setting?.secondary_color;

    return {
        '--contact-primary': isValidCssColor(primaryColor) ? primaryColor : '#203e78',
        '--contact-secondary': isValidCssColor(secondaryColor) ? secondaryColor : '#1677e8',
    };
});

const openExternalLink = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};

const items = computed<ContactItem[]>(() => {
    const countryCode = UserSetting.setting?.country_code;
    const phone = UserSetting.setting?.phone;
    const whatsapp = UserSetting.setting?.whatsapp;
    const telegram = UserSetting.setting?.telegram;
    const phoneUrl = createTelUrl(phone, countryCode);
    const whatsappUrl = createWhatsAppUrl(whatsapp, countryCode);
    const telegramUrl = createTelegramUrl(telegram);

    return [
        phoneUrl && {
            label: 'اتصل بنا',
            description: phone || 'مكالمة مباشرة',
            icon: 'pi pi-phone',
            type: 'phone' as const,
            command: () => {
                window.location.href = phoneUrl;
            },
        },
        whatsappUrl && {
            label: 'واتساب',
            description: 'رد سريع من فريق الدعم',
            icon: 'pi pi-whatsapp',
            type: 'whatsapp' as const,
            command: () => openExternalLink(whatsappUrl),
        },
        telegramUrl && {
            label: 'تيليجرام',
            description: 'تواصل معنا عبر تيليجرام',
            icon: 'pi pi-telegram',
            type: 'telegram' as const,
            command: () => openExternalLink(telegramUrl),
        },
    ].filter((item): item is ContactItem => Boolean(item));
});

const opensMenuDown = computed(() => {
    if (!viewport.height) return false;

    const spaceAbove = position.top - 16;
    const spaceBelow = viewport.height - position.top - WIDGET_HEIGHT - 16;
    return spaceBelow >= MENU_CLEARANCE || spaceBelow > spaceAbove;
});

const opensMenuTowardRight = computed(() => (
    viewport.width > 0 && position.left + (DESKTOP_WIDGET_WIDTH / 2) < viewport.width / 2
));

const menuMaxHeight = computed(() => {
    if (!viewport.height) return 260;

    const availableSpace = opensMenuDown.value
        ? viewport.height - position.top - WIDGET_HEIGHT - 24
        : position.top - 24;

    return Math.max(72, Math.floor(availableSpace));
});

const floatingStyle = computed(() => ({
    ...contactThemeStyle.value,
    '--contact-menu-max-height': `${menuMaxHeight.value}px`,
    left: `${position.left}px`,
    top: `${position.top}px`,
}));

const getWidgetWidth = () => (
    window.innerWidth <= 560 ? MOBILE_WIDGET_WIDTH : DESKTOP_WIDGET_WIDTH
);

const keepInsideViewport = (left: number, top: number) => {
    const widgetWidth = getWidgetWidth();
    const maxLeft = Math.max(EDGE_GAP, window.innerWidth - widgetWidth - EDGE_GAP);
    const minTop = EDGE_GAP;
    const maxTop = Math.max(minTop, window.innerHeight - WIDGET_HEIGHT - EDGE_GAP);

    position.left = Math.min(Math.max(left, EDGE_GAP), maxLeft);
    position.top = Math.min(Math.max(top, minTop), maxTop);
};

const setDefaultPosition = () => {
    const isMobile = window.innerWidth <= 768;
    const left = isMobile ? 18 : 28;
    const top = window.innerHeight * (isMobile ? 0.68 : 0.76) - (WIDGET_HEIGHT / 2);
    keepInsideViewport(left, top);
};

const savePosition = () => {
    try {
        window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
    } catch {
        // The widget still works when browser storage is unavailable.
    }
};

const restorePosition = (): boolean => {
    try {
        const savedPosition = JSON.parse(
            window.localStorage.getItem(POSITION_STORAGE_KEY) || 'null',
        ) as { left?: unknown; top?: unknown } | null;
        const left = Number(savedPosition?.left);
        const top = Number(savedPosition?.top);

        if (!Number.isFinite(left) || !Number.isFinite(top)) return false;

        keepInsideViewport(left, top);
        hasBeenMoved.value = true;
        return true;
    } catch {
        return false;
    }
};

const handlePointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    const dragHandle = target.closest('.contact-speed-dial-drag-handle');
    const launcher = target.closest('.contact-launcher');
    if ((!dragHandle && !launcher) || !dragger.value || event.button !== 0) return;

    if (dragHandle) event.preventDefault();
    const bounds = dragger.value.getBoundingClientRect();
    showDragHint.value = false;
    didDrag = false;
    dragStartedFromLauncher = Boolean(launcher);
    activeCaptureTarget = (launcher || dragHandle) as HTMLElement;
    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    positionStartLeft = bounds.left;
    positionStartTop = bounds.top;
    activeCaptureTarget.setPointerCapture(event.pointerId);
};

const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return;

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;
    if (Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) {
        didDrag = true;
        isDragging.value = true;
    }
    if (!didDrag) return;

    event.preventDefault();
    keepInsideViewport(positionStartLeft + deltaX, positionStartTop + deltaY);
};

const handlePointerUp = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return;

    const completedDrag = didDrag;
    isDragging.value = false;
    activePointerId = null;
    hasBeenMoved.value ||= completedDrag;

    if (completedDrag) {
        savePosition();
        suppressNextLauncherClick = dragStartedFromLauncher;
        if (suppressClickTimer !== null) window.clearTimeout(suppressClickTimer);
        suppressClickTimer = window.setTimeout(() => {
            suppressNextLauncherClick = false;
        }, 450);
    }

    dragStartedFromLauncher = false;
    if (activeCaptureTarget?.hasPointerCapture(event.pointerId)) {
        activeCaptureTarget.releasePointerCapture(event.pointerId);
    }
    activeCaptureTarget = null;
};

const handleLauncherClick = (
    event: MouseEvent,
    toggleCallback: (event: MouseEvent) => void,
) => {
    if (suppressNextLauncherClick) {
        suppressNextLauncherClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    if (isContactMenuOpen.value) {
        speedDial.value?.hide();
        return;
    }

    toggleCallback(event);
};

const closeContactMenu = () => {
    speedDial.value?.hide();
};

const handleResize = () => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;

    if (hasBeenMoved.value) {
        keepInsideViewport(position.left, position.top);
        return;
    }

    setDefaultPosition();
};

onMounted(() => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    if (!restorePosition()) setDefaultPosition();
    window.addEventListener('resize', handleResize);
    dragHintTimer = window.setTimeout(() => {
        showDragHint.value = false;
    }, 4000);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    if (suppressClickTimer !== null) window.clearTimeout(suppressClickTimer);
    if (dragHintTimer !== null) window.clearTimeout(dragHintTimer);
});
</script>

<template>
    <div
        v-if="items.length"
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
                اسحب الزر لتحريكه، واضغط لوسائل التواصل
            </span>
        </Transition>

        <button
            class="contact-speed-dial-drag-handle"
            type="button"
            aria-label="اسحب لتحريك زر التواصل"
            title="اسحب لتحريك زر التواصل"
            @click.stop.prevent
        >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </button>

        <SpeedDial
            ref="speedDial"
            class="contact-speed-dial"
            :class="{
                'contact-speed-dial--toward-right': opensMenuTowardRight,
                'contact-speed-dial--down': opensMenuDown,
            }"
            :model="items"
            :transition-delay="55"
            direction="up"
            aria-label="خيارات التواصل معنا"
            @show="isContactMenuOpen = true"
            @hide="isContactMenuOpen = false"
        >
            <template #button="{ visible, toggleCallback }">
                <button
                    class="contact-launcher"
                    :class="{ 'is-open': visible }"
                    type="button"
                    :aria-expanded="visible"
                    aria-haspopup="menu"
                    aria-label="فتح خيارات التواصل معنا"
                    title="اضغط للتواصل أو اسحب لتحريك الزر"
                    @click="handleLauncherClick($event, toggleCallback)"
                    @keydown.esc.prevent.stop="closeContactMenu"
                >
                    <span class="contact-launcher__icon" aria-hidden="true">
                        <i :class="visible ? 'pi pi-times' : 'pi pi-comments'"></i>
                        <span v-if="!visible" class="contact-launcher__status"></span>
                    </span>
                </button>
            </template>

            <template #item="{ item, onClick }">
                <button
                    class="contact-action"
                    :class="`contact-action--${item.type}`"
                    type="button"
                    role="menuitem"
                    :aria-label="item.label"
                    @click="onClick"
                >
                    <span class="contact-action__icon" aria-hidden="true">
                        <i :class="item.icon"></i>
                    </span>
                    <span class="contact-action__copy">
                        <strong>{{ item.label }}</strong>
                        <small>{{ item.description }}</small>
                    </span>
                    <i class="contact-action__arrow pi pi-arrow-up-left" aria-hidden="true"></i>
                </button>
            </template>
        </SpeedDial>
    </div>
</template>

<style>
.contact-speed-dial-dragger {
    --contact-primary: #203e78;
    --contact-secondary: #1677e8;
    --contact-surface: #ffffff;
    --contact-text: #102143;
    --contact-muted: #66728a;
    --contact-border: color-mix(in srgb, var(--contact-primary) 17%, #d9e1ed);
    position: fixed;
    z-index: 9999;
    width: 56px;
    height: 56px;
    direction: rtl;
    user-select: none;
}

.contact-speed-dial-drag-handle {
    position: absolute;
    z-index: 4;
    top: -8px;
    right: 10px;
    display: flex;
    width: 32px;
    height: 16px;
    padding: 0;
    align-items: center;
    justify-content: center;
    gap: 3px;
    border: 1px solid var(--contact-border);
    border-radius: 9px 9px 4px 4px;
    background: var(--contact-surface);
    box-shadow: 0 5px 15px color-mix(in srgb, var(--contact-primary) 18%, transparent);
    color: var(--contact-primary);
    cursor: grab;
    touch-action: none;
}

.contact-speed-dial-drag-handle span {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: currentColor;
}

.contact-speed-dial-dragger.is-dragging {
    cursor: grabbing;
    opacity: 0.92;
}

.contact-speed-dial-dragger.is-dragging .contact-speed-dial-drag-handle,
.contact-speed-dial-dragger.is-dragging .contact-launcher {
    cursor: grabbing;
}

.contact-speed-dial-dragger.is-dragging .contact-launcher {
    box-shadow:
        0 25px 55px color-mix(in srgb, var(--contact-primary) 42%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.24);
    transform: scale(1.025) rotate(-0.6deg);
}

.contact-speed-dial-drag-hint {
    position: absolute;
    z-index: 2;
    bottom: calc(100% + 18px);
    left: 0;
    width: max-content;
    max-width: min(245px, calc(100vw - 24px));
    padding: 8px 12px;
    border: 1px solid var(--contact-border);
    border-radius: 10px;
    background: var(--contact-surface);
    box-shadow: 0 10px 25px color-mix(in srgb, var(--contact-primary) 14%, transparent);
    color: var(--contact-text);
    font-size: 11px;
    font-weight: 700;
    line-height: 1.35;
    pointer-events: none;
    white-space: nowrap;
}

.contact-speed-dial-drag-hint::after {
    position: absolute;
    bottom: -5px;
    left: 24px;
    width: 9px;
    height: 9px;
    border-right: 1px solid var(--contact-border);
    border-bottom: 1px solid var(--contact-border);
    background: var(--contact-surface);
    content: '';
    transform: rotate(45deg);
}

.drag-hint-enter-active,
.drag-hint-leave-active {
    transition: opacity 0.22s ease, transform 0.22s ease;
}

.drag-hint-enter-from,
.drag-hint-leave-to {
    opacity: 0;
    transform: translateY(5px);
}

.contact-speed-dial {
    position: relative !important;
    display: block !important;
    width: 100%;
    height: 56px;
}

.contact-speed-dial .p-speeddial-list {
    position: absolute !important;
    right: 0 !important;
    bottom: calc(100% + 14px) !important;
    left: auto !important;
    display: flex !important;
    width: min(240px, calc(100vw - 16px));
    max-height: var(--contact-menu-max-height, 260px);
    flex-direction: column !important;
    align-items: stretch !important;
    padding: 7px !important;
    gap: 5px !important;
    border: 1px solid var(--contact-border);
    border-radius: 17px;
    background: color-mix(in srgb, var(--contact-surface) 95%, transparent);
    box-shadow: 0 22px 55px color-mix(in srgb, var(--contact-primary) 22%, transparent);
    backdrop-filter: blur(16px);
    overflow-x: hidden;
    overflow-y: auto;
    opacity: 1;
    transform: translateY(0) scale(1);
    transform-origin: bottom right;
    visibility: visible;
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0s linear;
}

.contact-speed-dial--toward-right .p-speeddial-list {
    right: auto !important;
    left: 0 !important;
    transform-origin: bottom left;
}

.contact-speed-dial--down .p-speeddial-list {
    top: calc(100% + 14px) !important;
    bottom: auto !important;
    transform-origin: top right;
}

.contact-speed-dial--down.contact-speed-dial--toward-right .p-speeddial-list {
    transform-origin: top left;
}

.contact-speed-dial:not(.p-speeddial-open) .p-speeddial-list {
    pointer-events: none !important;
    opacity: 0;
    transform: translateY(10px) scale(0.97);
    visibility: hidden;
    transition: opacity 0.16s ease, transform 0.16s ease, visibility 0s linear 0.16s;
}

.contact-speed-dial--down:not(.p-speeddial-open) .p-speeddial-list {
    transform: translateY(-10px) scale(0.97);
}

.contact-speed-dial .p-speeddial-list::before {
    display: block;
    width: 100%;
    padding: 4px 7px 7px;
    border-bottom: 1px solid var(--contact-border);
    color: var(--contact-muted);
    content: 'اختر وسيلة التواصل المناسبة لك';
    font-size: 9px;
    font-weight: 800;
    text-align: right;
}

.contact-speed-dial .p-speeddial-item {
    width: 100%;
}

.contact-launcher {
    position: relative;
    display: grid;
    width: 52px;
    height: 52px;
    padding: 6px;
    grid-template-columns: 1fr;
    align-items: center;
    gap: 0;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--contact-secondary) 50%, white);
    border-radius: 17px 7px 17px 7px;
    background:
        radial-gradient(circle at 15% 0%, rgba(255, 255, 255, 0.24), transparent 36%),
        linear-gradient(135deg, var(--contact-secondary), var(--contact-primary));
    box-shadow:
        0 16px 34px color-mix(in srgb, var(--contact-primary) 30%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    color: #fff;
    cursor: grab;
    isolation: isolate;
    text-align: center;
    touch-action: none;
    transition: transform 0.22s ease, border-radius 0.22s ease, box-shadow 0.22s ease;
}

.contact-launcher::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.16) 45%, transparent 70%);
    content: '';
    transform: translateX(110%);
    transition: transform 0.65s ease;
}

.contact-launcher:hover {
    box-shadow:
        0 19px 42px color-mix(in srgb, var(--contact-primary) 38%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    transform: translateY(-2px);
}

.contact-launcher:hover::before {
    transform: translateX(-110%);
}

.contact-launcher:focus-visible,
.contact-action:focus-visible,
.contact-speed-dial-drag-handle:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--contact-secondary) 36%, white);
    outline-offset: 3px;
}

.contact-launcher.is-open {
    border-radius: 7px 17px 7px 17px;
    transform: translateY(-1px);
}

.contact-launcher__icon {
    position: relative;
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 13px 6px 13px 6px;
    background: rgba(255, 255, 255, 0.13);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.contact-speed-dial .contact-launcher__icon > .pi {
    font-size: 1.08rem;
}

.contact-launcher__status {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    border: 2px solid var(--contact-primary);
    border-radius: 50%;
    background: #7cf3b0;
    box-shadow: 0 0 0 3px rgba(124, 243, 176, 0.15);
}

.contact-action {
    display: grid;
    width: 100%;
    min-height: 52px;
    padding: 6px 8px;
    grid-template-columns: 38px minmax(0, 1fr) 18px;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: transparent;
    color: var(--contact-text);
    cursor: pointer;
    text-align: right;
    transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.contact-action:hover {
    border-color: color-mix(in srgb, var(--contact-secondary) 22%, transparent);
    background: color-mix(in srgb, var(--contact-secondary) 8%, var(--contact-surface));
    transform: translateX(-3px);
}

.contact-action--telegram .contact-action__icon {
    background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--contact-secondary) 22%, var(--contact-surface)),
        color-mix(in srgb, var(--contact-primary) 12%, var(--contact-surface))
    );
}

.contact-action__icon {
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    border-radius: 12px 5px 12px 5px;
    background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--contact-secondary) 17%, var(--contact-surface)),
        color-mix(in srgb, var(--contact-primary) 10%, var(--contact-surface))
    );
    color: var(--contact-secondary);
}

.contact-speed-dial .contact-action__icon .pi {
    font-size: 1rem;
}

.contact-action__copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 2px;
}

.contact-action__copy strong {
    font-size: 12px;
    font-weight: 800;
    line-height: 1.35;
}

.contact-action__copy small {
    overflow: hidden;
    color: var(--contact-muted);
    font-size: 9px;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.contact-speed-dial .contact-action__arrow {
    color: var(--contact-secondary);
    font-size: 0.72rem;
    opacity: 0;
    transform: translate(4px, 4px);
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.contact-speed-dial .contact-action:hover .contact-action__arrow {
    opacity: 0.85;
    transform: translate(0, 0);
}

html[data-theme='dark'] .contact-speed-dial-dragger,
body.dark-mode .contact-speed-dial-dragger,
.dark .contact-speed-dial-dragger {
    --contact-surface: #101a2b;
    --contact-text: #f5f8ff;
    --contact-muted: #aebad0;
    --contact-border: color-mix(in srgb, var(--contact-secondary) 27%, #26344b);
}

@media (max-width: 560px) {
    .contact-speed-dial-dragger {
        width: 56px;
    }

    .contact-speed-dial-drag-handle {
        right: 10px;
    }

    .contact-speed-dial-drag-hint {
        left: 0;
    }

    .contact-speed-dial .p-speeddial-list {
        width: min(240px, calc(100vw - 16px));
    }

    .contact-launcher {
        width: 52px;
        padding: 6px;
        border-radius: 17px 7px 17px 7px;
    }

    .contact-launcher__icon {
        margin: auto;
    }

}

@media (prefers-reduced-motion: reduce) {
    .contact-launcher,
    .contact-launcher::before,
    .contact-action,
    .contact-action__arrow {
        transition: none !important;
    }
}
</style>
