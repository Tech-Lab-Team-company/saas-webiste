<script setup lang="ts">
import { gsap } from "gsap";

const notesSection = ref<HTMLElement | null>(null);
let notesAnimationContext: ReturnType<typeof gsap.context> | null = null;
let notesHasEntered = false;

const revealNotesSection = () => {
  const section = notesSection.value;
  if (!section || notesHasEntered) return;

  notesHasEntered = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  notesAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    timeline
      .from(".home-v2-notes__heading .section-tag", {
        autoAlpha: 0,
        x: 26,
        duration: 0.55,
      })
      .from(
        ".home-v2-notes__heading h2",
        { autoAlpha: 0, y: 34, duration: 0.78 },
        0.12,
      )
      .from(
        ".home-v2-notes__heading > p",
        { autoAlpha: 0, y: 22, duration: 0.65 },
        0.27,
      )
      .from(
        ".home-v2-notes__feature",
        {
          autoAlpha: 0,
          y: 38,
          scale: 0.985,
          duration: 0.85,
          clearProps: "opacity,visibility,transform",
        },
        0.4,
      )
      .from(
        ".home-v2-notes__cover",
        {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.85,
          ease: "expo.inOut",
          clearProps: "clip-path",
        },
        0.52,
      )
      .from(
        ".home-v2-notes__cover > *",
        { autoAlpha: 0, y: 16, duration: 0.48, stagger: 0.08 },
        0.82,
      )
      .from(
        ".home-v2-notes__copy > *",
        { autoAlpha: 0, y: 18, duration: 0.52, stagger: 0.075 },
        0.72,
      );

    gsap.to(".home-v2-notes__cover > span", {
      y: -4,
      opacity: 0.72,
      duration: 2.8,
      delay: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, section);
};

useScrollTriggeredReveal(notesSection, revealNotesSection, {
  threshold: 0.18,
});

onBeforeUnmount(() => {
  notesAnimationContext?.revert();
});
</script>

<template>
  <section
    id="notes"
    ref="notesSection"
    class="section home-v2-notes"
    aria-labelledby="home-v2-notes-title"
  >
    <div class="container">
      <div class="home-v2-notes__heading">
        <div>
          <span class="section-tag">مكتبة مستقلة</span>
          <h2 id="home-v2-notes-title">اختار مذكرتك<br />على حسب <em>احتياجك.</em></h2>
        </div>
        <p>سيظهر هنا محتوى المكتبة عندما تتوفر واجهة بيانات ومسار فعليان لها في التطبيق.</p>
      </div>

      <article class="home-v2-notes__feature">
        <div class="home-v2-notes__cover" aria-hidden="true">
          <span>NOTES</span>
          <strong>مكتبة EduHub</strong>
          <small>محتوى قيد الربط</small>
        </div>
        <div class="home-v2-notes__copy">
          <span>قسم جاهز للربط</span>
          <h3>المذكرات ستظهر هنا بعد اعتماد مصدر بياناتها.</h3>
          <p>
            لا توجد حاليًا صفحة أو API للمكتبة في التطبيق، لذلك لا تعرض المعاينة أي منتج أو سعر
            غير حقيقي.
          </p>
          <span class="home-v2-disabled-action" aria-disabled="true">رابط المذكرات غير متاح حاليًا</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-v2-notes {
  background: #eef4ff;
}

.home-v2-notes__heading {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: end;
  gap: 60px;
  margin-bottom: 38px;
}

.home-v2-notes h2 {
  margin: 12px 0 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.2 var(--home-v2-heading);
}

.home-v2-notes h2 em {
  color: var(--home-v2-coral);
  font-style: normal;
}

.home-v2-notes__heading > p {
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-v2-notes__feature {
  display: grid;
  min-height: 370px;
  grid-template-columns: minmax(250px, 0.72fr) minmax(0, 1.28fr);
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 30px 80px -62px #06114799;
  transition: border-color 0.35s ease, box-shadow 0.35s ease,
    transform 0.35s ease;
}

.home-v2-notes__feature:hover {
  border-color: color-mix(in srgb, var(--home-v2-blue) 24%, var(--home-v2-line));
  box-shadow: 0 38px 90px -58px #06114780;
  transform: translateY(-4px);
}

.home-v2-notes__cover {
  position: relative;
  display: grid;
  align-content: end;
  gap: 12px;
  overflow: hidden;
  padding: 34px;
  background:
    linear-gradient(135deg, transparent 49%, #ffffff16 50%),
    var(--home-v2-deep);
  color: #fff;
}

.home-v2-notes__cover::after {
  position: absolute;
  top: -80px;
  inset-inline-end: -90px;
  width: 240px;
  height: 240px;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 50%;
  background: radial-gradient(circle, rgb(255 255 255 / 8%), transparent 68%);
  content: "";
  transition: transform 0.8s cubic-bezier(0.2, 0.75, 0.25, 1);
}

.home-v2-notes__feature:hover .home-v2-notes__cover::after {
  transform: scale(1.12) translate(-8px, 8px);
}

.home-v2-notes__cover > * {
  position: relative;
  z-index: 1;
}

.home-v2-notes__cover span {
  color: #90c6ff;
  font: 900 12px var(--home-v2-heading);
  letter-spacing: 0.12em;
}

.home-v2-notes__cover strong {
  font: 900 clamp(27px, 3vw, 40px) / 1.25 var(--home-v2-heading);
}

.home-v2-notes__cover small {
  color: #ffffffb8;
}

.home-v2-notes__copy {
  display: grid;
  align-content: center;
  gap: 16px;
  padding: clamp(28px, 5vw, 65px);
}

.home-v2-notes__copy > span:first-child {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}

.home-v2-notes h3 {
  max-width: 650px;
  margin: 0;
  font: 900 clamp(27px, 3.4vw, 42px) / 1.35 var(--home-v2-heading);
}

.home-v2-notes__copy p {
  max-width: 680px;
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

@media (max-width: 760px) {
  .home-v2-notes__heading,
  .home-v2-notes__feature {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .home-v2-notes__cover {
    min-height: 230px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-notes__feature,
  .home-v2-notes__cover::after {
    transition: none;
  }

  .home-v2-notes__feature:hover {
    transform: none;
  }
}
</style>
