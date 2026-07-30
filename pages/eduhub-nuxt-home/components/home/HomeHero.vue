<script setup lang="ts">
const primaryAction = { label: 'اختار صفك', to: '/#courses' }
const secondaryAction = { label: 'عن مستر إسلام', to: '/about' }
</script>

<template>
  <section id="top" class="home-hero" aria-labelledby="home-hero-title">
    <div class="container home-hero-layout">
      <div class="home-hero-copy">
        <p class="home-hero-kicker">Gamma Physics · فيزياء المرحلة الثانوية</p>

        <h1 id="home-hero-title">
          <span>
            افهم الفيزياء من أصلها
            <em>وتحلّها بثقة.</em>
          </span>
        </h1>

        <p class="home-hero-description">
          شرح منظم وتدريب متدرج لطلاب أولى وثانية وثالثة ثانوي؛ من تأسيس الفكرة لحد
          تطبيقها في أسئلة الامتحان.
        </p>

        <div class="home-hero-actions">
          <NuxtLink class="home-hero-primary" :to="primaryAction.to">
            {{ primaryAction.label }} <span aria-hidden="true">←</span>
          </NuxtLink>

          <NuxtLink class="home-hero-secondary" :to="secondaryAction.to">
            {{ secondaryAction.label }} <span aria-hidden="true">↗</span>
          </NuxtLink>
        </div>
      </div>

      <figure class="home-hero-media" aria-label="الأستاذ إسلام سلامة مدرس الفيزياء">
        <NuxtImg
          src="/eslam-salama-teacher-cutout-v2.png"
          alt="الأستاذ إسلام سلامة مدرس الفيزياء"
          width="1086"
          height="1448"
          sizes="sm:100vw md:560px lg:44vw"
          loading="eager"
          fetchpriority="high"
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  min-height: 740px;
  overflow: hidden;
  padding-top: 92px;
  background:
    radial-gradient(circle at 12% 24%, #0867d41f, #0000 33%),
    linear-gradient(135deg, #fbfcff, #eef5ff);
  color: var(--ink);
}

.home-hero::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 32%, #0867d438, #0000 34%),
    linear-gradient(115deg, #0000 54%, #5ba8ff0f);
  content: '';
  pointer-events: none;
}

.home-hero-layout {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: 620px;
  grid-template-columns: minmax(0, 1.08fr) minmax(390px, 0.92fr);
  align-items: center;
  gap: clamp(46px, 5vw, 78px);
}

.home-hero-copy {
  min-width: 0;
  max-width: 690px;
  padding-block: 56px 62px;
}

.home-hero-kicker {
  width: fit-content;
  margin: 0 0 19px;
  padding: 7px 12px;
  border: 1px solid #0867d438;
  border-radius: 99px;
  color: var(--teal);
  font: 800 12px/1.5 var(--heading);
}

.home-hero h1 {
  max-width: 760px;
  margin: 0;
  font: 900 clamp(48px, 4.9vw, 72px) / 1.18 var(--heading);
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.home-hero h1 span {
  display: block;
}

.home-hero h1 em {
  color: var(--coral);
  font-style: normal;
}

.home-hero-description {
  max-width: 630px;
  margin: 24px 0 0;
  color: var(--muted-copy);
  font-size: 17px;
  line-height: 1.95;
  text-wrap: pretty;
}

.home-hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 13px;
  margin-top: 32px;
}

.home-hero-primary,
.home-hero-secondary {
  display: inline-flex;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 4px;
  font: 800 14px/1 var(--heading);
  transition: transform 0.18s, background-color 0.18s, border-color 0.18s;
}

.home-hero-primary {
  background: #0867d4;
  color: #fff;
}

.home-hero-primary:hover {
  transform: translateY(-2px);
  background: #0b5fc2;
}

.home-hero-primary span {
  font-size: 19px;
}

.home-hero-secondary {
  border-color: #081b3a2b;
  background: #ffffff85;
  color: var(--ink);
}

.home-hero-secondary:hover {
  border-color: var(--coral);
  background: #fff;
}

.home-hero-secondary span {
  color: var(--coral);
  font-size: 14px;
}

.home-hero-media {
  position: relative;
  justify-self: start;
  width: min(100%, 470px);
  aspect-ratio: 4 / 5;
  margin: 0;
  overflow: hidden;
  border: 9px solid #0867d41f;
  border-radius: 22px 22px 88px;
  background: linear-gradient(160deg, #e8f1ff, #d8e8ff);
  box-shadow: 0 38px 80px -46px #000000c7;
}

.home-hero-media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

:global(html[data-theme='dark']) .home-hero {
  background:
    radial-gradient(circle at 12% 24%, #0867d426, #0000 33%),
    linear-gradient(135deg, #020617, #081126);
}

:global(html[data-theme='dark']) .home-hero-secondary {
  border-color: var(--dark-line);
  background: var(--dark-surface);
  color: var(--dark-text);
}

:global(html[data-theme='dark']) .home-hero-media {
  border-color: var(--dark-line);
  background: linear-gradient(160deg, #142545, #081126);
}

@media (max-width: 980px) {
  .home-hero {
    min-height: 0;
  }

  .home-hero-layout {
    min-height: 0;
    grid-template-columns: 1fr;
    gap: 14px;
    padding-bottom: 56px;
  }

  .home-hero-copy {
    max-width: 760px;
    padding: 66px 0 28px;
  }

  .home-hero-media {
    width: min(470px, 100%);
  }
}

@media (max-width: 620px) {
  .home-hero {
    padding-top: 76px;
  }

  .home-hero-layout {
    padding-bottom: 32px;
  }

  .home-hero-copy {
    padding: 48px 0 25px;
  }

  .home-hero-kicker {
    margin-bottom: 15px;
  }

  .home-hero h1 {
    font-size: clamp(39px, 11.7vw, 47px);
    line-height: 1.2;
  }

  .home-hero-description {
    margin-top: 18px;
    font-size: 15px;
    line-height: 1.9;
  }

  .home-hero-actions {
    margin-top: 25px;
  }

  .home-hero-primary,
  .home-hero-secondary {
    min-height: 50px;
    padding-inline: 18px;
  }

  .home-hero-media {
    border-width: 7px;
    border-radius: 12px 12px 52px;
  }
}

@media (max-width: 390px) {
  .home-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .home-hero-primary,
  .home-hero-secondary {
    width: 100%;
  }

  .home-hero h1 {
    font-size: 37px;
  }
}
</style>
