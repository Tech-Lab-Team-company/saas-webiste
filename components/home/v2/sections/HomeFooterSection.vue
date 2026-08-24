<script setup lang="ts">
import { gsap } from 'gsap'
import type { HomeSiteViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'
import { getDescriptiveImageAlt } from '~/utils/imageAlt'

const props = defineProps<{
  site: HomeSiteViewModel
}>()

const whatsappUrl = computed(() => {
  const value = props.site.socials.whatsapp
  if (!value || value.startsWith('http')) return value

  return `https://wa.me/${value.replace(/\D/g, '').replace(/^0/, '20')}`
})

const footerDescription = computed(() =>
  (props.site.description || '')
    .replace(/\s+/g, ' ')
    .trim(),
)

const followLabel = computed(() =>
  props.site.brandName ? `تابع ${props.site.brandName}` : 'تابع المنصة',
)

const footerSection = ref<HTMLElement | null>(null)
let footerAnimationContext: ReturnType<typeof gsap.context> | null = null
let footerHasEntered = false

const revealFooter = () => {
  const footer = footerSection.value
  if (!footer || footerHasEntered) return

  footerHasEntered = true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  footerAnimationContext = gsap.context(() => {
    const timeline = gsap
      .timeline({ defaults: { ease: 'power2.out' } })
      .from('.home-v2-footer__logo', {
        autoAlpha: 0,
        scale: 0.76,
        rotation: -6,
        duration: 0.84,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
      })
      .from(
        '.home-v2-footer__brand-copy > *',
        {
          autoAlpha: 0,
          x: 22,
          duration: 0.58,
          stagger: 0.09,
          clearProps: 'opacity,visibility,transform',
        },
        0.16,
      )
      .from(
        '.home-v2-footer__description, .home-v2-footer__contacts',
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.66,
          stagger: 0.11,
          clearProps: 'opacity,visibility,transform',
        },
        0.34,
      )
      .from(
        '.home-v2-footer__links',
        {
          autoAlpha: 0,
          y: 30,
          duration: 0.74,
          stagger: 0.14,
          clearProps: 'opacity,visibility,transform',
        },
        0.34,
      )
      .from(
        '.home-v2-footer__links > *',
        {
          autoAlpha: 0,
          x: 18,
          duration: 0.52,
          stagger: 0.055,
          clearProps: 'opacity,visibility,transform',
        },
        0.54,
      )
    const socialLabel = footer.querySelector('.home-v2-footer__social-block > b')
    const socialLinks = footer.querySelectorAll('.home-v2-footer__socials > a')

    if (socialLabel) {
      timeline.from(
        socialLabel,
        {
          autoAlpha: 0,
          y: 12,
          duration: 0.5,
          clearProps: 'opacity,visibility,transform',
        },
        0.62,
      )
    }

    if (socialLinks.length) {
      timeline.from(
        socialLinks,
        {
          autoAlpha: 0,
          y: 16,
          scale: 0.92,
          duration: 0.64,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform',
        },
        0.68,
      )
    }

    timeline
      .from(
        '.home-v2-footer__bottom',
        {
          clipPath: 'inset(0 50% 0 50%)',
          duration: 0.88,
          ease: 'power2.inOut',
          clearProps: 'clip-path',
        },
        0.9,
      )
      .from(
        '.home-v2-footer__bottom > *',
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.56,
          stagger: 0.09,
          clearProps: 'opacity,visibility,transform',
        },
        1.08,
      )
  }, footer)
}

useScrollTriggeredReveal(footerSection, revealFooter, {
  threshold: 0.1,
})

onBeforeUnmount(() => {
  footerAnimationContext?.revert()

  if (footerSection.value) {
    gsap.killTweensOf(footerSection.value.querySelectorAll('*'))
  }
})
</script>

<template>
  <footer ref="footerSection" class="home-v2-footer">
    <div class="container home-v2-footer__grid">
      <div class="home-v2-footer__brand-column">
        <NuxtLink to="/" class="home-v2-footer__brand" :aria-label="`${site.brandName || 'المنصة'} — الرئيسية`">
          <span :class="['home-v2-footer__logo', { 'home-v2-footer__logo--empty': !site.logo }]">
            <NuxtImg
              v-if="site.logo"
              :src="site.logo.src"
              :alt="getDescriptiveImageAlt(site.logo?.alt, `شعار ${site.brandName || 'المنصة التعليمية'}`)"
              width="46"
              height="46"
              format="webp"
              quality="75"
              loading="lazy"
            />
            <span v-else aria-hidden="true">+</span>
          </span>
          <span class="home-v2-footer__brand-copy">
            <b>{{ site.brandName || 'أضف اسم المنصة' }}</b>
          </span>
        </NuxtLink>

        <p v-if="footerDescription" class="home-v2-footer__description">
          {{ footerDescription }}
        </p>

        <address class="home-v2-footer__contacts" aria-label="بيانات التواصل">
          <a v-if="site.phone" :href="`tel:${site.phone}`" dir="ltr">
            <i class="pi pi-phone" aria-hidden="true"></i>
            <span>{{ site.phone }}</span>
          </a>
          <a v-if="site.email" :href="`mailto:${site.email}`" dir="ltr">
            <i class="pi pi-envelope" aria-hidden="true"></i>
            <span>{{ site.email }}</span>
          </a>
          <span v-if="site.address">
            <i class="pi pi-map-marker" aria-hidden="true"></i>
            {{ site.address }}
          </span>
        </address>

        <div
          v-if="site.socials.facebook || site.socials.instagram || whatsappUrl"
          class="home-v2-footer__social-block"
          aria-label="حسابات المنصة على وسائل التواصل الاجتماعي"
        >
          <b>{{ followLabel }}</b>
          <div class="home-v2-footer__socials" role="list">
            <a
              v-if="site.socials.facebook"
              :href="site.socials.facebook"
              target="_blank"
              rel="noreferrer"
              role="listitem"
              aria-label="فيسبوك — يفتح في نافذة جديدة"
            >
              <span class="home-v2-footer__social-icon" aria-hidden="true">
                <IconsFacebook />
              </span>
              <span>فيسبوك</span>
            </a>

            <a
              v-if="site.socials.instagram"
              :href="site.socials.instagram"
              target="_blank"
              rel="noreferrer"
              role="listitem"
              aria-label="إنستجرام — يفتح في نافذة جديدة"
            >
              <span class="home-v2-footer__social-icon" aria-hidden="true">
                <IconsInstagram />
              </span>
              <span>إنستجرام</span>
            </a>

            <a
              v-if="whatsappUrl"
              :href="whatsappUrl"
              target="_blank"
              rel="noreferrer"
              role="listitem"
              aria-label="واتساب — يفتح في نافذة جديدة"
            >
              <span class="home-v2-footer__social-icon" aria-hidden="true">
                <IconsWhatsApp />
              </span>
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>

      <nav class="home-v2-footer__links" aria-label="روابط المنصة">
        <b>استكشف</b>
        <NuxtLink to="/course">الكورسات</NuxtLink>
        <NuxtLink v-if="site.hasTeacherDirectory" to="/teachers">المدرسون</NuxtLink>
        <NuxtLink to="/books">الكتب</NuxtLink>
        <NuxtLink to="/blogs">المدونة</NuxtLink>
        <NuxtLink to="/about-teacher">{{ site.hasTeacherDirectory ? "عن المنصة" : "عن المدرس" }}</NuxtLink>
        <NuxtLink v-if="site.app.enabled" to="/#app-status">التطبيق</NuxtLink>
      </nav>

      <nav class="home-v2-footer__links" aria-label="روابط الطالب">
        <b>مساحة الطالب</b>
        <NuxtLink to="/profile">مساحة الطالب</NuxtLink>
        <NuxtLink to="/loginhome">تسجيل الدخول</NuxtLink>
        <NuxtLink to="/Auth/register">إنشاء حساب</NuxtLink>
      </nav>
    </div>

    <div class="container home-v2-footer__bottom">
      <span>
        © {{ new Date().getFullYear() }}<template v-if="site.brandName"> {{ site.brandName }}</template>.
        جميع الحقوق محفوظة.
      </span>
      <nav class="home-v2-footer__legal" aria-label="السياسات القانونية">
        <NuxtLink to="/privacy">سياسة الخصوصية</NuxtLink>
        <NuxtLink to="/terms">الشروط والأحكام</NuxtLink>
      </nav>
      <div class="home-v2-footer__providers" dir="ltr">
        <a
          class="home-v2-footer__powered-by"
          href="https://eduhubco.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Powered by</span>
          <strong>EduHub</strong>
        </a>
        <a
          class="home-v2-footer__tech-lab-badge"
          href="https://techlabeg.com/"
          target="_blank"
          rel="noopener noreferrer"
          dir="rtl"
          aria-label="إحدى منتجات Tech Lab، يفتح في نافذة جديدة"
        >
          <span class="home-v2-footer__tech-lab-prefix" dir="rtl">إحدى منتجات</span>
          <span class="home-v2-footer__tech-lab-logo">
            <img
              src="/images/full-logo-techlab.webp"
              alt="شعار Tech Lab"
              width="138"
              height="55"
              loading="lazy"
              decoding="async"
            />
          </span>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.home-v2-footer {
  --footer-primary: var(--home-v2-blue, var(--primary-color, #28366c));
  --footer-secondary: var(--home-v2-deep, var(--secondary-color, #3a3e7e));
  --footer-background: var(
    --app-footer-bg,
    color-mix(in srgb, var(--footer-primary) 82%, #071020)
  );
  --footer-accent: color-mix(in srgb, var(--footer-primary) 48%, white);
  --footer-accent-strong: color-mix(in srgb, var(--footer-secondary) 48%, white);
  --footer-secondary-light: color-mix(in srgb, var(--footer-secondary) 36%, white);
  --footer-soft-border: color-mix(in srgb, var(--footer-accent) 25%, transparent);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: 70px;
  background:
    radial-gradient(
      circle at 8% 88%,
      color-mix(in srgb, var(--footer-primary) 52%, transparent) 0,
      transparent 28%
    ),
    radial-gradient(
      circle at 92% 4%,
      color-mix(in srgb, var(--footer-secondary) 26%, transparent) 0,
      transparent 35%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--footer-secondary) 36%, #030a1c) 0%,
      var(--footer-background) 52%,
      color-mix(in srgb, var(--footer-primary) 40%, #020817) 100%
    );
  color: #fff;
  transition: background-color .3s ease, color .3s ease;
}

.home-v2-footer::before {
  position: absolute;
  z-index: -1;
  bottom: -230px;
  left: -225px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle,
    transparent 0 22px,
    color-mix(in srgb, var(--footer-primary) 60%, transparent) 23px 24px
  );
  content: "";
  opacity: 0.5;
}

.home-v2-footer::after {
  position: absolute;
  z-index: -1;
  bottom: -180px;
  left: -115px;
  width: 340px;
  height: 280px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--footer-primary) 38%, transparent);
  filter: blur(70px);
  content: "";
  opacity: 0.72;
}

.home-v2-footer__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: clamp(52px, 6vw, 100px);
  padding-bottom: 58px;
}

.home-v2-footer__brand {
  display: flex;
  width: max-content;
  max-width: 100%;
  align-items: center;
  gap: 11px;
  color: #fff;
  transition: color 0.25s ease;
}

.home-v2-footer__brand.router-link-active,
.home-v2-footer__brand.router-link-exact-active {
  color: #fff;
}

.home-v2-footer__brand:hover,
.home-v2-footer__brand:focus-visible {
  color: var(--footer-accent-strong);
}

.home-v2-footer__logo {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  place-items: center;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--footer-accent) 58%, white);
  border-radius: 10px;
  background: #fff;
}

.home-v2-footer__logo :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.home-v2-footer__logo--empty {
  border-style: dashed;
  background: color-mix(in srgb, var(--footer-primary) 13%, transparent);
  color: var(--footer-accent);
  font: 300 28px/1 var(--home-v2-heading);
}

.home-v2-footer__brand-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.home-v2-footer__brand b {
  color: inherit;
  font: 900 17px/1 var(--home-v2-heading);
  letter-spacing: 0.04em;
}

.home-v2-footer__brand small {
  margin-top: 6px;
  color: #ffffffb8;
  font-size: 12px;
}

.home-v2-footer__description {
  max-width: 350px;
  margin: 22px 0 0;
  color: var(--footer-accent);
  font-size: 15px;
  line-height: 1.8;
}

.home-v2-footer__contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 0;
  margin-top: 18px;
  color: #ffffffb8;
  font-style: normal;
}

.home-v2-footer__contacts a,
.home-v2-footer__contacts > span {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  gap: 8px;
  padding-inline: 24px;
  /* border-inline-end: 1px solid var(--footer-soft-border); */
  color: #ffffffb8;
  font-size: 13px;
}

.home-v2-footer__contacts > :first-child {
  padding-inline-start: 0;
}

.home-v2-footer__contacts > :last-child {
  border-inline-end: 0;
}

.home-v2-footer__contacts .pi {
  color: var(--footer-accent-strong);
  font-size: 14px;
}

.home-v2-footer__contacts a:hover {
  color: #fff;
  text-decoration: underline;
}

.home-v2-footer__social-block {
  margin-top: 26px;
}

.home-v2-footer__social-block > b {
  display: block;
  color: #fff;
  font: 800 15px var(--home-v2-heading);
}

.home-v2-footer__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.home-v2-footer__socials > a {
  display: flex;
  width: 96px;
  min-height: 78px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--footer-soft-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--footer-primary) 13%, transparent);
  color: #ffffffc7;
  font-size: 11px;
  font-weight: 800;
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease,
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-v2-footer__socials > a:hover {
  transform: translateY(-4px);
  border-color: var(--footer-accent);
  background: color-mix(in srgb, var(--footer-primary) 27%, transparent);
  box-shadow: 0 14px 28px color-mix(in srgb, #000 25%, transparent);
  color: #fff;
}

.home-v2-footer__social-icon {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  place-items: center;
  border-radius: 7px;
  background: transparent;
}

.home-v2-footer__social-icon :deep(svg) {
  display: block;
  width: 22px;
  height: 22px;
}

.home-v2-footer__links {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 13px;
}

.home-v2-footer__links > b {
  position: relative;
  margin-bottom: 8px;
  padding-bottom: 15px;
  color: #fff;
  font: 800 16px var(--home-v2-heading);
}

.home-v2-footer__links > b::after {
  position: absolute;
  right: 0;
  bottom: 2px;
  width: 32px;
  height: 2px;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--footer-primary), var(--footer-secondary-light));
  box-shadow: 0 0 12px color-mix(in srgb, var(--footer-primary) 58%, transparent);
  content: "";
}

.home-v2-footer__links > a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: #ffffff9e;
  font-size: 14px;
  transition: color 0.25s ease, transform 0.25s ease;
}

.home-v2-footer__links > a::before {
  margin-inline-end: 10px;
  color: var(--footer-accent-strong);
  content: "‹";
  font-size: 17px;
  line-height: 1;
}

.home-v2-footer__links > a:hover {
  color: var(--footer-accent-strong);
  transform: translateX(-3px);
}

.home-v2-footer__bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 0;
  border-top: 1px solid color-mix(in srgb, var(--footer-accent) 42%, transparent);
  color: #ffffffb3;
  font-size: 12px;
}

.home-v2-footer__legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.home-v2-footer__legal a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: #ffffffc7;
  font-size: 12px;
  font-weight: 800;
  transition: color 0.28s ease;
}

.home-v2-footer__legal a:hover {
  color: var(--footer-accent-strong);
}

.home-v2-footer__providers {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
}

.home-v2-footer__powered-by {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  color: var(--footer-secondary-light);
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  transition: color 0.28s ease;
}

.home-v2-footer__powered-by strong {
  color: #f1ce78;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: .01em;
  line-height: 1;
  transition: color 0.28s ease, transform 0.28s ease;
}

.home-v2-footer__powered-by:hover,
.home-v2-footer__powered-by:focus-visible {
  color: var(--footer-accent-strong);
}

.home-v2-footer__powered-by:hover strong,
.home-v2-footer__powered-by:focus-visible strong {
  color: #ffe09a;
  transform: translateY(-1px);
}

.home-v2-footer__tech-lab-badge {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  min-height: 62px;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  padding: 6px 8px 6px 10px;
  border: 1px solid color-mix(in srgb, var(--footer-primary) 38%, #d9eee7);
  border-radius: 13px;
  background: #fff;
  box-shadow:
    0 8px 20px rgba(1, 13, 28, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  color: #536a64;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    border-color 0.28s ease,
    box-shadow 0.28s ease,
    transform 0.28s cubic-bezier(0.2, 0.75, 0.25, 1);
}

.home-v2-footer__tech-lab-badge::before {
  position: absolute;
  z-index: -1;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, var(--footer-primary), var(--footer-secondary));
  content: "";
}

.home-v2-footer__tech-lab-badge::after {
  content: none;
}

.home-v2-footer__tech-lab-badge:hover,
.home-v2-footer__tech-lab-badge:focus-visible {
  border-color: color-mix(in srgb, var(--footer-primary) 72%, white);
  box-shadow:
    0 11px 24px rgba(1, 13, 28, 0.24),
    0 0 0 2px color-mix(in srgb, var(--footer-primary) 13%, transparent);
  transform: translateY(-2px);
}

.home-v2-footer__tech-lab-badge:focus-visible {
  outline: 2px solid var(--footer-accent-strong);
  outline-offset: 3px;
}

.home-v2-footer__tech-lab-logo {
  display: flex;
  width: 138px;
  height: 50px;
  flex: 0 0 138px;
  align-items: center;
  justify-content: center;
}

.home-v2-footer__tech-lab-logo img {
  display: block;
  width: 138px;
  height: 55px;
  object-fit: contain;
  filter: contrast(1.12) saturate(1.12);
  transition: transform 0.3s ease;
}

.home-v2-footer__tech-lab-badge:hover .home-v2-footer__tech-lab-logo img,
.home-v2-footer__tech-lab-badge:focus-visible .home-v2-footer__tech-lab-logo img {
  transform: scale(1.04);
}

.home-v2-footer__tech-lab-prefix {
  color: color-mix(in srgb, var(--footer-primary) 46%, #44554f);
  font-size: 11px;
  font-weight: 900;
  line-height: 1.4;
}

@media (max-width: 900px) {
  .home-v2-footer__grid {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 680px) {
  .home-v2-footer {
    padding-top: 32px;
  }

  .home-v2-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px 16px;
    padding-bottom: 28px;
  }

  .home-v2-footer__brand-column {
    grid-column: 1 / -1;
  }

  .home-v2-footer__bottom {
    gap: 12px;
    padding-block: 14px;
    flex-direction: column;
    align-items: flex-start;
  }

  .home-v2-footer__legal {
    justify-content: flex-start;
  }

  .home-v2-footer__providers {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .home-v2-footer__description {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.65;
  }

  .home-v2-footer__contacts {
    gap: 4px;
    margin-top: 10px;
  }

  .home-v2-footer__contacts a,
  .home-v2-footer__contacts > span {
    min-height: 28px;
    gap: 6px;
    padding-inline: 10px;
    font-size: 12px;
  }

  .home-v2-footer__social-block {
    margin-top: 14px;
  }

  .home-v2-footer__social-block > b {
    font-size: 13px;
  }

  .home-v2-footer__socials {
    gap: 8px;
    margin-top: 9px;
  }

  .home-v2-footer__socials > a {
    width: 44px;
    min-height: 44px;
    padding: 8px;
  }

  .home-v2-footer__socials > a > span:last-child {
    display: none;
  }

  .home-v2-footer__links {
    gap: 2px;
  }

  .home-v2-footer__links > b {
    margin-bottom: 4px;
    padding-bottom: 10px;
    font-size: 14px;
  }

  .home-v2-footer__links > a {
    min-height: 38px;
    font-size: 12.5px;
  }

  .home-v2-footer__links > a::before {
    margin-inline-end: 6px;
  }

  .home-v2-footer__legal {
    gap: 12px;
  }

  .home-v2-footer__legal a {
    min-height: 36px;
    font-size: 11px;
  }

  .home-v2-footer__providers {
    gap: 8px;
  }
}

@media (max-width: 430px) {
  .home-v2-footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 12px;
  }

  .home-v2-footer__brand-column {
    grid-column: 1 / -1;
  }

  .home-v2-footer__brand small {
    display: none;
  }

  .home-v2-footer__description {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .home-v2-footer__links {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: start;
    column-gap: 8px;
  }

  .home-v2-footer__links > b {
    grid-column: 1 / -1;
  }

  .home-v2-footer__links > a {
    min-height: 38px;
    font-size: 11.5px;
  }

  .home-v2-footer__links > a::before {
    display: none;
  }

  .home-v2-footer__bottom {
    align-items: center;
    text-align: center;
  }

  .home-v2-footer__legal {
    justify-content: center;
  }

  .home-v2-footer__providers {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .home-v2-footer__powered-by {
    width: fit-content;
  }

  .home-v2-footer__tech-lab-badge {
    width: auto;
    max-width: 100%;
    justify-content: center;
    min-height: 44px;
    padding: 3px 6px;
    border-radius: 10px;
  }

  .home-v2-footer__tech-lab-prefix {
    display: none;
  }

  .home-v2-footer__tech-lab-logo {
    width: 100px;
    height: 38px;
    flex-basis: 100px;
  }

  .home-v2-footer__tech-lab-logo img {
    width: 100px;
    height: 40px;
  }

  .home-v2-footer__powered-by strong {
    font-size: 14px;
  }

}

@media (max-width: 340px) {
  .home-v2-footer__grid {
    grid-template-columns: 1fr;
  }

  .home-v2-footer__brand-column {
    grid-column: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-footer__tech-lab-badge,
  .home-v2-footer__tech-lab-badge::after,
  .home-v2-footer__tech-lab-logo img {
    transition: none;
  }
}
</style>
