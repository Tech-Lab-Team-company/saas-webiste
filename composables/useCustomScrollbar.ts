import { onBeforeUnmount, onMounted } from "vue";
import { createSlowWheelScroller } from "~/composables/useSlowWheelScroll";

type ScrollbarVariant = "light" | "dark";

interface CustomScrollbarOptions {
  // Element the scrollbar is drawn beside.
  target: () => HTMLElement | null | undefined;
  // Element that actually scrolls. Defaults to `target`; pass "page" when the
  // target's content scrolls with the document (sticky sidebar/topbar layouts).
  scroller?: "page" | (() => HTMLElement | null | undefined);
  // The track sits on the target's scrollbar side (left in RTL, right in LTR),
  // either just inside that edge or in the gutter just outside it.
  placement?: "inside" | "outside";
  gap?: number;
  // Viewport Y the track must stay below, e.g. the bottom of a sticky topbar.
  topBoundary?: () => number;
  variant?: ScrollbarVariant;
}

const TRACK_WIDTH = 8;
const TRACK_INSET = 8;
const MIN_THUMB = 36;
const MIN_TRACK = 60;
const DRAGGING_CLASS = "profile-scrollbar-dragging";

/**
 * Custom, draggable vertical scrollbar that overlays a scroll area without
 * changing its layout. The track is position: fixed and follows the target.
 */
export const useCustomScrollbar = (options: CustomScrollbarOptions) => {
  let track: HTMLDivElement | null = null;
  let thumb: HTMLDivElement | null = null;
  let frame = 0;
  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;
  let scrollSource: HTMLElement | Window | null = null;

  let dragPointerId: number | null = null;
  let dragStartY = 0;
  let dragStartScroll = 0;
  let trackHeight = 0;
  let thumbHeight = 0;

  const getScroller = (): HTMLElement | null => {
    if (options.scroller === "page") {
      return document.scrollingElement as HTMLElement | null;
    }
    return (options.scroller ?? options.target)() ?? null;
  };

  const getMaxScroll = (el: HTMLElement) =>
    Math.max(0, el.scrollHeight - el.clientHeight);

  const update = () => {
    frame = 0;
    const target = options.target();
    const scroller = getScroller();
    if (!track || !thumb || !target || !scroller) return;

    const maxScroll = getMaxScroll(scroller);
    const rect = target.getBoundingClientRect();
    const top =
      Math.max(rect.top, options.topBoundary?.() ?? 0, 0) + TRACK_INSET;
    const bottom = Math.min(rect.bottom, window.innerHeight) - TRACK_INSET;
    trackHeight = bottom - top;

    if (maxScroll <= 1 || rect.width === 0 || trackHeight < MIN_TRACK) {
      track.hidden = true;
      return;
    }

    const isRtl = getComputedStyle(target).direction === "rtl";
    const gap = options.gap ?? 4;
    const outside = options.placement === "outside";
    const left = isRtl
      ? outside ? rect.left - gap - TRACK_WIDTH : rect.left + gap
      : outside ? rect.right + gap : rect.right - gap - TRACK_WIDTH;
    const clampedLeft = Math.min(
      Math.max(left, 2),
      document.documentElement.clientWidth - TRACK_WIDTH - 2,
    );

    thumbHeight = Math.max(
      MIN_THUMB,
      Math.min(trackHeight, (trackHeight * scroller.clientHeight) / scroller.scrollHeight),
    );
    const progress = Math.min(1, Math.max(0, scroller.scrollTop / maxScroll));

    track.hidden = false;
    track.style.top = `${top}px`;
    track.style.left = `${clampedLeft}px`;
    track.style.height = `${trackHeight}px`;
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${(trackHeight - thumbHeight) * progress}px)`;
  };

  const scheduleUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const scrollPerPixel = (scroller: HTMLElement) => {
    const freeTrack = trackHeight - thumbHeight;
    return freeTrack > 0 ? getMaxScroll(scroller) / freeTrack : 0;
  };

  const onThumbPointerDown = (event: PointerEvent) => {
    const scroller = getScroller();
    if (!thumb || !scroller || event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    dragPointerId = event.pointerId;
    dragStartY = event.clientY;
    dragStartScroll = scroller.scrollTop;
    thumb.setPointerCapture(event.pointerId);
    track?.classList.add("is-dragging");
    document.documentElement.classList.add(DRAGGING_CLASS);
  };

  const onThumbPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== dragPointerId) return;
    const scroller = getScroller();
    if (!scroller) return;

    event.preventDefault();
    scroller.scrollTop =
      dragStartScroll + (event.clientY - dragStartY) * scrollPerPixel(scroller);
    scheduleUpdate();
  };

  const endDrag = (event: PointerEvent) => {
    if (event.pointerId !== dragPointerId) return;
    dragPointerId = null;
    if (thumb?.hasPointerCapture(event.pointerId)) {
      thumb.releasePointerCapture(event.pointerId);
    }
    track?.classList.remove("is-dragging");
    document.documentElement.classList.remove(DRAGGING_CLASS);
  };

  // Clicking the track jumps so the thumb centres on the click point.
  const onTrackPointerDown = (event: PointerEvent) => {
    const scroller = getScroller();
    if (!track || !scroller || event.target !== track || event.button !== 0) return;

    event.preventDefault();
    const clickY = event.clientY - track.getBoundingClientRect().top;
    const nextThumbTop = clickY - thumbHeight / 2;
    scroller.scrollTop = nextThumbTop * scrollPerPixel(scroller);
    scheduleUpdate();
  };

  // Wheel over the track scrolls its own area instead of the page/body.
  const trackWheelScroller = createSlowWheelScroller(getScroller);
  const onTrackWheel = trackWheelScroller.handleWheel;

  const mount = () => {
    const target = options.target();
    // Mount inside the page root so the dashboard styles and theme variables apply.
    const pageRoot = target?.closest(".profile-redesign-page");
    if (!target || !pageRoot) return;

    track = document.createElement("div");
    track.className = `profile-custom-scrollbar profile-custom-scrollbar--${options.variant ?? "dark"}`;
    track.setAttribute("aria-hidden", "true");
    track.hidden = true;

    thumb = document.createElement("div");
    thumb.className = "profile-custom-scrollbar__thumb";
    track.appendChild(thumb);

    pageRoot.appendChild(track);

    track.addEventListener("pointerdown", onTrackPointerDown);
    track.addEventListener("wheel", onTrackWheel, { passive: false });
    thumb.addEventListener("pointerdown", onThumbPointerDown);
    thumb.addEventListener("pointermove", onThumbPointerMove);
    thumb.addEventListener("pointerup", endDrag);
    thumb.addEventListener("pointercancel", endDrag);

    scrollSource = options.scroller === "page" ? window : getScroller();
    scrollSource?.addEventListener("scroll", scheduleUpdate, { passive: true });
    if (scrollSource !== window) {
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
    }
    window.addEventListener("resize", scheduleUpdate);

    // Content changes (tab switches, lazy data, images) resize the scroll area.
    resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(target);
    const scroller = getScroller();
    const contentRoot = options.scroller === "page" ? document.body : scroller;
    if (contentRoot) {
      resizeObserver.observe(contentRoot);
      Array.from(contentRoot.children).forEach((child) => resizeObserver?.observe(child));
    }

    mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(target, { childList: true, subtree: true });

    scheduleUpdate();
  };

  const unmount = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    trackWheelScroller.stop();

    scrollSource?.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    resizeObserver = null;
    mutationObserver = null;
    scrollSource = null;

    if (thumb) {
      thumb.removeEventListener("pointerdown", onThumbPointerDown);
      thumb.removeEventListener("pointermove", onThumbPointerMove);
      thumb.removeEventListener("pointerup", endDrag);
      thumb.removeEventListener("pointercancel", endDrag);
    }
    if (track) {
      track.removeEventListener("pointerdown", onTrackPointerDown);
      track.removeEventListener("wheel", onTrackWheel);
      track.remove();
    }
    track = null;
    thumb = null;
    dragPointerId = null;
    document.documentElement.classList.remove(DRAGGING_CLASS);
  };

  onMounted(mount);
  onBeforeUnmount(unmount);

  return { update: scheduleUpdate };
};
