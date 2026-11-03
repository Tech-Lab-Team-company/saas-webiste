import { onBeforeUnmount, onMounted } from "vue";

// Slower, eased mouse-wheel scrolling for a scroll container (or the page).
const WHEEL_SPEED = 0.35;
const WHEEL_EASING = 0.12;

export const createSlowWheelScroller = (
  getScroller: () => HTMLElement | null | undefined,
) => {
  let target = 0;
  let frame = 0;
  let lastScrollTop = 0;

  const step = () => {
    const el = getScroller();
    // Stop if something else (scrollbar drag, keyboard, scrollTo) moved it.
    if (!el || Math.abs(el.scrollTop - lastScrollTop) > 1) {
      frame = 0;
      return;
    }
    const distance = target - el.scrollTop;
    if (Math.abs(distance) <= 1) {
      el.scrollTop = target;
      frame = 0;
      return;
    }
    // At least 1px per frame: browsers may round sub-pixel scrollTop changes.
    el.scrollTop +=
      Math.sign(distance) * Math.max(1, Math.abs(distance) * WHEEL_EASING);
    lastScrollTop = el.scrollTop;
    frame = requestAnimationFrame(step);
  };

  const handleWheel = (event: WheelEvent) => {
    const el = getScroller();
    if (!el || event.defaultPrevented || event.ctrlKey) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    const unit =
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientHeight : 1;
    if (!frame) target = el.scrollTop;
    target = Math.max(
      0,
      Math.min(maxScroll, target + event.deltaY * unit * WHEEL_SPEED),
    );

    event.preventDefault();
    if (!frame) {
      lastScrollTop = el.scrollTop;
      frame = requestAnimationFrame(step);
    }
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  return { handleWheel, stop };
};

// True when the wheel event happens inside an element that scrolls on its own
// (dropdowns, modals, lists) so the page should not hijack it.
const isInsideOwnScroller = (event: WheelEvent) => {
  let node = event.target as HTMLElement | null;
  while (node && node !== document.body && node !== document.documentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight
    ) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
};

export const usePageSlowWheelScroll = () => {
  const scroller = createSlowWheelScroller(
    () => document.scrollingElement as HTMLElement | null,
  );

  const onWheel = (event: WheelEvent) => {
    if (isInsideOwnScroller(event)) return;
    scroller.handleWheel(event);
  };

  onMounted(() => {
    window.addEventListener("wheel", onWheel, { passive: false });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("wheel", onWheel);
    scroller.stop();
  });
};
