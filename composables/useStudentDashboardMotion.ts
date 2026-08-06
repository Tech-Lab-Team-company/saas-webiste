import { gsap } from "gsap";
import { nextTick, onBeforeUnmount, onMounted } from "vue";

export const useStudentDashboardMotion = () => {
  let animationContext: gsap.Context | null = null;
  let summaryAnimationContext: gsap.Context | null = null;
  let courseAnimationContext: gsap.Context | null = null;
  let summaryObserver: IntersectionObserver | null = null;
  let coursesObserver: IntersectionObserver | null = null;
  let animationFrame: number | null = null;
  let cardInteractionCleanups: Array<() => void> = [];

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
            ".profile-options .profile-option",
            {
              autoAlpha: 0,
              x: 18,
              stagger: 0.045,
              duration: 0.42,
            },
            0.16,
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
            ".summary-stats > div",
            { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.42 },
            0.58,
          );

        gsap.from(".continue-panel .progress i", {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 1.05,
          delay: 0.75,
          ease: "power3.out",
        });

        gsap.to(".profile-topbar-status > span", {
          scale: 1.65,
          autoAlpha: 0.45,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, root);
    });
  };

  const animateSummaryScore = async () => {
    if (!import.meta.client) return;
    await nextTick();

    summaryObserver?.disconnect();
    summaryAnimationContext?.revert();

    const root = document.querySelector<HTMLElement>(".student-dashboard-shell");
    const summaryScore = root?.querySelector<HTMLElement>(".summary-score");
    const scoreRing = summaryScore?.querySelector<HTMLElement>(".score-ring");
    const scoreValue = scoreRing?.querySelector<HTMLElement>(".score-ring__value");
    const statValues = Array.from(
      root?.querySelectorAll<HTMLElement>(".summary-stat-value") ?? [],
    );

    if (!root || !summaryScore || !scoreRing || !scoreValue) return;

    const targetScore = Math.min(
      100,
      Math.max(0, Number(scoreRing.dataset.score) || 0),
    );

    if (prefersReducedMotion()) {
      scoreRing.style.setProperty("--score", `${targetScore}%`);
      scoreValue.textContent = String(Math.round(targetScore));
      statValues.forEach((element) => {
        element.textContent = String(Number(element.dataset.count) || 0);
      });
      return;
    }

    scoreRing.style.setProperty("--score", "0%");
    scoreValue.textContent = "0";
    statValues.forEach((element) => {
      element.textContent = "0";
    });

    const playScoreAnimation = () => {
      const counter = { value: 0 };

      summaryAnimationContext = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .fromTo(
            summaryScore,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
          )
          .fromTo(
            scoreRing,
            { rotate: -85, scale: 0.68 },
            {
              rotate: 0,
              scale: 1,
              duration: 0.9,
              ease: "back.out(1.6)",
            },
            0.08,
          )
          .to(
            scoreRing,
            {
              "--score": `${targetScore}%`,
              duration: 1.15,
              ease: "power2.out",
            },
            0.16,
          )
          .to(
            counter,
            {
              value: targetScore,
              duration: 1.15,
              ease: "power2.out",
              onUpdate: () => {
                scoreValue.textContent = String(Math.round(counter.value));
              },
            },
            0.16,
          )
          .from(
            ".summary-score > div:last-child > *",
            { autoAlpha: 0, x: -12, stagger: 0.08, duration: 0.4 },
            0.32,
          );

        statValues.forEach((element, index) => {
          const statCounter = { value: 0 };
          const targetValue = Number(element.dataset.count) || 0;

          timeline.to(
            statCounter,
            {
              value: targetValue,
              duration: 0.75,
              ease: "power2.out",
              onUpdate: () => {
                element.textContent = String(Math.round(statCounter.value));
              },
            },
            0.42 + index * 0.08,
          );
        });
      }, root);
    };

    summaryObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        summaryObserver?.disconnect();
        summaryObserver = null;
        playScoreAnimation();
      },
      { threshold: 0.35 },
    );
    summaryObserver.observe(summaryScore);
  };

  const animateCourseCards = async () => {
    if (!import.meta.client) return;
    await nextTick();

    const root = document.querySelector<HTMLElement>(".student-dashboard-shell");
    if (!root) return;

    coursesObserver?.disconnect();
    courseAnimationContext?.revert();
    cardInteractionCleanups.forEach((cleanup) => cleanup());
    cardInteractionCleanups = [];

    const featuredPanel = root.querySelector<HTMLElement>(".continue-panel");
    const coursesSection = root.querySelector<HTMLElement>(".courses-section");
    const courseCards = Array.from(
      root.querySelectorAll<HTMLElement>(".course-card"),
    );

    if (prefersReducedMotion()) return;

    courseAnimationContext = gsap.context(() => {
      if (featuredPanel) {
        const featuredTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        featuredTimeline
          .fromTo(
            featuredPanel,
            { autoAlpha: 0, y: 28, scale: 0.985 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.68 },
          )
          .from(
            ".featured-content > *",
            {
              autoAlpha: 0,
              y: 17,
              stagger: 0.075,
              duration: 0.44,
            },
            0.16,
          )
          .fromTo(
            ".featured-art",
            { autoAlpha: 0, x: -22, rotate: -2, scale: 0.94 },
            {
              autoAlpha: 1,
              x: 0,
              rotate: 0,
              scale: 1,
              duration: 0.72,
              ease: "back.out(1.3)",
            },
            0.2,
          )
          .from(
            ".featured-meta > span",
            { autoAlpha: 0, scale: 0.88, stagger: 0.06, duration: 0.34 },
            0.3,
          );

        gsap.from(".continue-panel .progress i", {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 1.05,
          delay: 0.42,
          ease: "power3.out",
        });

        gsap.to(".featured-art", {
          y: -7,
          duration: 3,
          delay: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (coursesSection && courseCards.length) {
        gsap.set(courseCards, { autoAlpha: 0, y: 36, scale: 0.965 });
      }
    }, root);

    const revealCourses = () => {
      courseAnimationContext?.add(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        timeline
          .fromTo(
            ".courses-section .section-head > *",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.5 },
          )
          .to(
            courseCards,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              stagger: 0.09,
            },
            0.12,
          )
          .from(
            courseCards.map((card) => card.querySelector(".subject-badge")),
            {
              autoAlpha: 0,
              scale: 0.72,
              stagger: 0.07,
              duration: 0.35,
              ease: "back.out(1.7)",
            },
            0.34,
          )
          .from(
            courseCards.map((card) => card.querySelector(".progress i")),
            {
              scaleX: 0,
              transformOrigin: "right center",
              stagger: 0.07,
              duration: 0.82,
              ease: "power2.out",
            },
            0.38,
          );
      });
    };

    if (coursesSection && courseCards.length) {
      coursesObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          coursesObserver?.disconnect();
          coursesObserver = null;
          revealCourses();
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
      );
      coursesObserver.observe(coursesSection);
    }

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      courseCards.forEach((card) => {
        const rotateX = gsap.quickTo(card, "rotationX", {
          duration: 0.35,
          ease: "power3.out",
        });
        const rotateY = gsap.quickTo(card, "rotationY", {
          duration: 0.35,
          ease: "power3.out",
        });

        const handlePointerMove = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
          const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
          rotateX(vertical * -3.5);
          rotateY(horizontal * 3.5);
        };
        const handlePointerEnter = () => {
          gsap.to(card, {
            y: -7,
            scale: 1.012,
            duration: 0.32,
            ease: "power2.out",
          });
        };
        const handlePointerLeave = () => {
          rotateX(0);
          rotateY(0);
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: "power3.out",
          });
        };

        card.style.transformStyle = "preserve-3d";
        card.addEventListener("pointermove", handlePointerMove);
        card.addEventListener("pointerenter", handlePointerEnter);
        card.addEventListener("pointerleave", handlePointerLeave);
        cardInteractionCleanups.push(() => {
          card.removeEventListener("pointermove", handlePointerMove);
          card.removeEventListener("pointerenter", handlePointerEnter);
          card.removeEventListener("pointerleave", handlePointerLeave);
          card.style.removeProperty("transform-style");
        });
      });
    }
  };

  onMounted(playEntrance);
  onBeforeUnmount(() => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    summaryObserver?.disconnect();
    coursesObserver?.disconnect();
    cardInteractionCleanups.forEach((cleanup) => cleanup());
    cardInteractionCleanups = [];
    courseAnimationContext?.revert();
    summaryAnimationContext?.revert();
    animationContext?.revert();
  });

  return { animateCourseCards, animateSummaryScore };
};
