import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { nextTick, onBeforeUnmount, onMounted, type Ref } from "vue";

type QuickMotion = ReturnType<typeof gsap.quickTo>;

type DepthController = {
  xRotation: QuickMotion;
  yRotation: QuickMotion;
  y: QuickMotion;
};

const MAGNETIC_TARGETS = [
  ".home-course-showcase .all-courses",
  ".home-v2-books__actions a",
  ".home-v2-blog__heading a",
  ".home-v2-learning-journey__link",
  ".home-v2-about-teacher__content > a",
  ".home-v2-app__actions a",
  ".home-v2-cta__actions a",
].join(",");

const DEPTH_TARGETS = [
  ".home-v2-blog__card",
  ".home-v2-learning-journey__steps article",
  ".home-v2-about-teacher__quote",
  ".home-v2-app__phone",
  ".home-v2-faq details",
  ".home-v2-cta__panel",
].join(",");

export const useHomePageCinematicMotion = (root: Ref<HTMLElement | null>) => {
  let animationContext: ReturnType<typeof gsap.context> | null = null;
  let motionMedia: ReturnType<typeof gsap.matchMedia> | null = null;
  let refreshFrame: number | null = null;
  let removeLoadListener: (() => void) | null = null;

  const queueRefresh = () => {
    if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      refreshFrame = null;
    });
  };

  const setupSectionScenes = (homeRoot: HTMLElement, desktop: boolean) => {
    const scenes = gsap.utils.toArray<HTMLElement>(
      ":scope > main > section:not(.home-v2-hero)",
      homeRoot
    );

    scenes.forEach((scene) => {
      gsap.fromTo(
        scene,
        {
          autoAlpha: desktop ? 0.64 : 0.8,
          y: desktop ? 66 : 34,
          scale: desktop ? 0.982 : 0.992,
          transformOrigin: "center top",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: scene,
            start: "top 96%",
            end: desktop ? "top 58%" : "top 72%",
            scrub: desktop ? 0.6 : 0.35,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  };

  const setupMagneticTargets = (homeRoot: HTMLElement) => {
    const targets = gsap.utils.toArray<HTMLElement>(MAGNETIC_TARGETS, homeRoot);

    const cleanups = targets.map((target) => {
      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const bounds = target.getBoundingClientRect();
        const x = event.clientX - bounds.left - bounds.width / 2;
        const y = event.clientY - bounds.top - bounds.height / 2;

        gsap.to(target, {
          x: x * 0.11,
          y: y * 0.18 - 3,
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const resetTarget = () => {
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.72,
          ease: "elastic.out(1, 0.42)",
          overwrite: "auto",
          onComplete: () => gsap.set(target, { clearProps: "transform" }),
        });
      };

      target.addEventListener("pointermove", handlePointerMove);
      target.addEventListener("pointerleave", resetTarget);

      return () => {
        target.removeEventListener("pointermove", handlePointerMove);
        target.removeEventListener("pointerleave", resetTarget);
        gsap.killTweensOf(target);
        gsap.set(target, { clearProps: "transform" });
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  const setupDepthTargets = (homeRoot: HTMLElement) => {
    const targets = gsap.utils.toArray<HTMLElement>(DEPTH_TARGETS, homeRoot);
    const cleanups = targets.map((target) => {
      gsap.set(target, {
        transformPerspective: 1100,
        transformOrigin: "center center",
      });

      const quickSettings = { duration: 0.72, ease: "power3.out" };
      const controller: DepthController = {
        xRotation: gsap.quickTo(target, "rotationX", quickSettings),
        yRotation: gsap.quickTo(target, "rotationY", quickSettings),
        y: gsap.quickTo(target, "y", quickSettings),
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const bounds = target.getBoundingClientRect();
        const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
        const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
        controller.xRotation(vertical * -3.8);
        controller.yRotation(horizontal * 4.6);
        controller.y(-5);
      };

      const resetTarget = () => {
        controller.xRotation(0);
        controller.yRotation(0);
        controller.y(0);
      };

      target.addEventListener("pointermove", handlePointerMove);
      target.addEventListener("pointerleave", resetTarget);

      return () => {
        target.removeEventListener("pointermove", handlePointerMove);
        target.removeEventListener("pointerleave", resetTarget);
        gsap.killTweensOf(target);
        gsap.set(target, {
          clearProps: "transform,transformOrigin,willChange",
        });
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  const setupCursorTrail = (homeRoot: HTMLElement) => {
    const main = homeRoot.querySelector<HTMLElement>(":scope > main");
    const trail = gsap.utils.toArray<HTMLElement>(
      ".home-v2-motion-trail > span",
      homeRoot
    );
    if (!main || !trail.length) return () => undefined;

    gsap.set(trail, { x: -80, y: -80, autoAlpha: 0 });
    const xSetters = trail.map((dot, index) =>
      gsap.quickTo(dot, "x", {
        duration: 0.16 + index * 0.11,
        ease: "power3.out",
      })
    );
    const ySetters = trail.map((dot, index) =>
      gsap.quickTo(dot, "y", {
        duration: 0.16 + index * 0.11,
        ease: "power3.out",
      })
    );

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      trail.forEach((dot, index) => {
        xSetters[index]?.(event.clientX);
        ySetters[index]?.(event.clientY);
      });
      gsap.to(trail, {
        autoAlpha: 1,
        duration: 0.25,
        stagger: 0.025,
        overwrite: "auto",
      });
    };

    const hideTrail = () => {
      gsap.to(trail, {
        autoAlpha: 0,
        scale: 0.45,
        duration: 0.28,
        stagger: 0.025,
        overwrite: "auto",
      });
    };

    const showInteractiveState = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const isInteractive = Boolean(target?.closest("a, button, summary"));
      gsap.to(trail, {
        scale: isInteractive ? 1.7 : 1,
        duration: 0.32,
        stagger: 0.035,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    main.addEventListener("pointermove", handlePointerMove);
    main.addEventListener("pointerover", showInteractiveState);
    main.addEventListener("pointerout", showInteractiveState);
    main.addEventListener("pointerleave", hideTrail);

    return () => {
      main.removeEventListener("pointermove", handlePointerMove);
      main.removeEventListener("pointerover", showInteractiveState);
      main.removeEventListener("pointerout", showInteractiveState);
      main.removeEventListener("pointerleave", hideTrail);
      gsap.killTweensOf(trail);
      gsap.set(trail, { clearProps: "all" });
    };
  };

  const setupMotion = async () => {
    await nextTick();
    const homeRoot = root.value;
    if (!homeRoot) return;

    gsap.registerPlugin(ScrollTrigger);
    motionMedia?.revert();
    animationContext?.revert();

    animationContext = gsap.context(() => {
      motionMedia = gsap.matchMedia();
      motionMedia.add(
        {
          desktop: "(min-width: 781px)",
          motion: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (mediaContext) => {
          const conditions = mediaContext.conditions as {
            desktop: boolean;
            motion: boolean;
            reduceMotion: boolean;
          };

          if (conditions.reduceMotion || !conditions.motion) return;

          setupSectionScenes(homeRoot, conditions.desktop);
          if (!conditions.desktop) return;

          const cleanupMagneticTargets = setupMagneticTargets(homeRoot);
          const cleanupDepthTargets = setupDepthTargets(homeRoot);
          const cleanupCursorTrail = setupCursorTrail(homeRoot);

          return () => {
            cleanupMagneticTargets();
            cleanupDepthTargets();
            cleanupCursorTrail();
          };
        }
      );
    }, homeRoot);

    queueRefresh();
    void document.fonts?.ready.then(queueRefresh);
    if (document.readyState !== "complete") {
      const handleLoad = () => queueRefresh();
      window.addEventListener("load", handleLoad, { once: true });
      removeLoadListener = () => window.removeEventListener("load", handleLoad);
    }
  };

  onMounted(() => void setupMotion());

  onBeforeUnmount(() => {
    removeLoadListener?.();
    removeLoadListener = null;
    if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
    refreshFrame = null;
    motionMedia?.revert();
    motionMedia = null;
    animationContext?.revert();
    animationContext = null;
  });
};
