<script setup lang="ts">
const actions = [
  { label: 'اختار صفك', to: '/#courses', primary: true },
  { label: 'أنشئ حسابك', to: '/register', primary: false },
] as const
</script>

<template>
  <section id="contact" class="cta-section">
    <div class="container cta-panel" data-motion-reveal="up">
      <span class="cta-line">جاهز تبدأ؟</span>
      <h2>
        افهم القانون.<br />
        <em>وطبّقه صح.</em>
      </h2>
      <p>اختار صفك وشوف الكورسات والمذكرات المناسبة لمرحلتك.</p>

      <div>
        <NuxtLink
          v-for="action in actions"
          :key="action.to"
          :to="action.to"
          :class="action.primary ? 'button button-light' : 'secondary-action'"
        >
          {{ action.label }}
          <span v-if="action.primary" aria-hidden="true">←</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding: 0 0 100px;
  background: var(--cream);
}

.cta-panel {
  position: relative;
  overflow: hidden;
  padding: 80px 30px;
  border-radius: 12px;
  background: #0b5fc2;
  color: #fff;
  text-align: center;
}

.cta-panel::before,
.cta-panel::after {
  position: absolute;
  border: 1px solid #ffffff38;
  border-radius: 50%;
  content: '';
}

.cta-panel::before {
  top: -140px;
  right: -260px;
  width: 400px;
  height: 400px;
}

.cta-panel::after {
  bottom: -150px;
  left: -210px;
  width: 300px;
  height: 300px;
}

.cta-line,
.cta-panel h2,
.cta-panel p,
.cta-panel > div {
  position: relative;
  z-index: 1;
}

.cta-line {
  font-size: 12px;
  font-weight: 800;
}

.cta-panel h2 {
  margin: 12px 0;
  font: 900 clamp(42px, 5vw, 68px) / 1.16 var(--heading);
  letter-spacing: -0.045em;
}

.cta-panel h2 em {
  color: #ffcf63;
  font-style: normal;
}

.cta-panel p {
  color: #fffc;
  font-size: 15px;
  line-height: 1.8;
}

.cta-panel > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.cta-panel .button-light {
  margin-top: 18px;
  color: #061147;
}

.secondary-action {
  margin-top: 18px;
  padding-bottom: 6px;
  border-bottom: 1px solid #ffffffa6;
  font-size: 13px;
  font-weight: 800;
}

:global(html[data-theme='dark']) .cta-section {
  background: #050b1c;
}

@media (max-width: 620px) {
  .cta-section {
    padding-bottom: 72px;
  }

  .cta-panel {
    padding: 62px 20px;
  }

  .cta-panel h2 {
    font-size: 42px;
  }

  .cta-panel > div {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
