import { gsap } from "gsap";
import { nextTick, onBeforeUnmount, onMounted } from "vue";

export const useStudentDashboardMotion = () => {
  let animationContext: gsap.Context | null = null;
  let animationFrame: number | null = null;

  const prefersReducedMotion = () =>
    import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const playEntrance = async () => {
    if (!import.meta.client) return;
    await nextTick();

    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => {
      animationContext?.revert();

      const root = document.querySelector<HTMLElement>(".student-dashboard-shell");
      if (!root || prefersReducedMotion()) return;

      animationContext = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        timeline
          .from(".profile-dashboard-sidebar", {
            autoAlpha: 0,
            x: 30,
            duration: 0.68,
          })
          .from(
            ".profile-dashboard-topbar > *",
            { autoAlpha: 0, y: -14, stagger: 0.09, duration: 0.48 },
            0.12,
          )
          .from(
            ".dashboard-heading > *",
            { autoAlpha: 0, y: 24, stagger: 0.1, duration: 0.58 },
            0.22,
          )
          .from(
            ".continue-panel, .featured-loader, .empty-feature",
            { autoAlpha: 0, y: 30, scale: 0.985, duration: 0.72 },
            0.34,
          )
          .from(
            ".study-summary",
            { autoAlpha: 0, x: -24, duration: 0.64 },
            0.43,
          )
          .from(
            ".summary-score, .summary-stats > div",
            { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.42 },
            0.58,
          )
          .from(
            ".courses-section .section-head > *",
            { autoAlpha: 0, y: 18, stagger: 0.08, duration: 0.48 },
            0.66,
          );

        gsap.from(".continue-panel .progress i", {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 1.05,
          delay: 0.75,
          ease: "power3.out",
        });

        gsap.from(".score-ring", {
          rotate: -70,
          scale: 0.72,
          autoAlpha: 0,
          duration: 0.85,
          delay: 0.58,
          ease: "back.out(1.55)",
        });

        gsap.to(".featured-art", {
          y: -7,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, root);
    });
  };

  const animateCourseCards = async () => {
    if (!import.meta.client || prefersReducedMotion()) return;
    await nextTick();

    const root = document.querySelector<HTMLElement>(".student-dashboard-shell");
    if (!root) return;

    gsap.fromTo(
      root.querySelectorAll(".course-card"),
      { autoAlpha: 0, y: 28, scale: 0.975 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.58,
        stagger: 0.085,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      },
    );

    gsap.from(root.querySelectorAll(".course-card .progress i"), {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.85,
      stagger: 0.07,
      delay: 0.18,
      ease: "power2.out",
    });
  };

  onMounted(playEntrance);
  onBeforeUnmount(() => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    animationContext?.revert();
  });

  return { animateCourseCards };
};
