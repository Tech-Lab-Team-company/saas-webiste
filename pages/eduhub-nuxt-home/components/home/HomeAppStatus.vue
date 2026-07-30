<script setup lang="ts">
const appLinks = [
  {
    label: 'حمّل Android',
    href: 'https://play.google.com/store/apps/details?id=com.aboelezz.eslam.salama',
    primary: true,
  },
  {
    label: 'حمّل iPhone',
    href: 'https://tr.ee/vhXRhcPAjc',
    primary: false,
  },
] as const
</script>

<template>
  <section id="app-status" class="app-status-section">
    <div class="container app-status-grid">
      <div class="app-status-copy" data-motion-reveal="up">
        <span class="section-tag light">Android وiPhone</span>
        <h2>
          ذاكر على الويب.<br />
          <em>وكمّل من التطبيق.</em>
        </h2>
        <p>استعرض الكورسات والمذكرات على الموقع، وحمّل تطبيق مستر إسلام على نظام موبايلك.</p>

        <div>
          <a
            v-for="link in appLinks"
            :key="link.href"
            :class="link.primary ? 'button' : 'app-status-link'"
            :href="link.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ link.label }}
            <span v-if="link.primary" aria-hidden="true">←</span>
          </a>

          <NuxtLink to="/open-in-app" class="app-status-link">كل طرق المتابعة</NuxtLink>
        </div>
      </div>

      <figure class="app-status-phone app-status-real-shot" data-motion-reveal="scale" data-motion-order="1">
        <NuxtImg
          src="/eslam-salama-app-screen.webp"
          alt="لقطة حقيقية من تطبيق إسلام سلامة تعرض الكورسات"
          width="380"
          height="675"
          sizes="sm:74vw 290px"
          loading="lazy"
        />
        <figcaption>لقطة حقيقية من التطبيق</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.app-status-section {
  overflow: hidden;
  padding: 92px 0;
  background: #061147;
  color: #fff;
}

.app-status-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  align-items: center;
  gap: 90px;
}

.app-status-copy h2 {
  margin: 14px 0;
  font: 900 clamp(37px, 4.2vw, 58px) / 1.3 var(--heading);
  letter-spacing: -0.04em;
}

.app-status-copy h2 em {
  color: #5ba8ff;
  font-style: normal;
}

.app-status-copy > p {
  max-width: 650px;
  color: #ffffffc7;
  font-size: 16px;
  line-height: 1.9;
}

.app-status-copy > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
  margin-top: 26px;
}

.app-status-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  border-bottom: 1px solid #ffffff8c;
  font-size: 14px;
  font-weight: 800;
}

.app-status-phone {
  justify-self: center;
  width: 290px;
  transform: rotate(-2deg);
}

.app-status-real-shot {
  min-height: 0;
  overflow: hidden;
  padding: 0;
  border: 8px solid #fff3;
  border-radius: 36px;
  background: #fff;
  box-shadow: 26px 30px #02061747;
}

.app-status-real-shot :deep(img) {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.app-status-real-shot figcaption {
  padding: 11px 14px;
  background: #fff;
  color: #081b3a;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}

@media (max-width: 900px) {
  .app-status-grid {
    grid-template-columns: 1fr;
    gap: 56px;
  }

  .app-status-phone {
    justify-self: start;
  }
}

@media (max-width: 620px) {
  .app-status-section {
    padding: 72px 0;
  }

  .app-status-copy h2 {
    font-size: 38px;
  }

  .app-status-copy > div {
    align-items: stretch;
    gap: 14px;
  }

  .app-status-copy > div > * {
    justify-content: center;
  }

  .app-status-phone {
    width: min(290px, 82vw);
    justify-self: center;
  }
}
</style>
