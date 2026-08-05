<script setup lang="ts">
import { gsap } from 'gsap'
import type { HomeSiteViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'

const props = defineProps<{
  site: HomeSiteViewModel
}>()

const whatsappUrl = computed(() => {
  const value = props.site.socials.whatsapp
  if (!value || value.startsWith('http')) return value

  return `https://wa.me/${value.replace(/\D/g, '').replace(/^0/, '20')}`
})

const footerDescription = computed(() =>
  (props.site.description || 'شرح منظم يساعد الطلاب على الفهم والتطبيق بخطوات واضحة.')
    .replace(/\s+/g, ' ')
    .trim(),
)

const brandSubtitle = computed(() => {
  if (props.site.brandName?.toLowerCase().includes('gamma')) {
    return 'إسلام سلامة · مدرس الفيزياء للمرحلة الثانوية'
  }

  return 'منصة تعليمية منظمة للمرحلة الثانوية'
})

const followLabel = computed(() =>
  props.site.brandName?.toLowerCase().includes('gamma') ? 'تابع مستر إسلام' : 'تابع المنصة',
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
        <NuxtLink to="/" class="home-v2-footer__brand" :aria-label="`${site.brandName || 'EduHub'} — الرئيسية`">
          <span :class="['home-v2-footer__logo', { 'home-v2-temporary-asset': !site.logo }]">
            <NuxtImg
              :src="site.logo?.src || '/images/logo.png'"
              :alt="site.logo?.alt || site.brandName || ''"
              width="46"
              height="46"
              loading="lazy"
            />
          </span>
          <span class="home-v2-footer__brand-copy">
            <b lang="en">{{ site.brandName || 'EduHub' }}</b>
            <small>{{ brandSubtitle }}</small>
          </span>
        </NuxtLink>

        <p class="home-v2-footer__description">{{ footerDescription }}</p>

        <address class="home-v2-footer__contacts" aria-label="بيانات التواصل">
          <a v-if="site.phone" :href="`tel:${site.phone}`" dir="ltr">{{ site.phone }}</a>
          <a v-if="site.email" :href="`mailto:${site.email}`" dir="ltr">{{ site.email }}</a>
          <span v-if="site.address">{{ site.address }}</span>
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
                <svg viewBox="0 0 24 24">
                  <path d="M14 8h3V4.2c-.5-.1-2.2-.2-4-.2-3.9 0-6.5 2.4-6.5 6.7V14H3v4h3.5v6h4.3v-6h3.6l.6-4h-4.2v-2.9C10.8 10 11.1 8 14 8Z" />
                </svg>
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
                <svg viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6ZM18.3 6.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
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
                <svg viewBox="0 0 24 24">
                  <path d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L.2 24l6.4-1.7c1.7.9 3.6 1.4 5.5 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6-3.4-8.4Zm-8.4 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 1 1 8.3 4.6Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6L9 7.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3 2.2 1 3 .9 4.1.8.7-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4Z" />
                </svg>
              </span>
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>

      <nav class="home-v2-footer__links" aria-label="روابط المنصة">
        <b>استكشف</b>
        <NuxtLink to="/course">الكورسات</NuxtLink>
        <NuxtLink to="/books">الكتب</NuxtLink>
        <NuxtLink to="/blogs">المدونة</NuxtLink>
        <NuxtLink to="/about-teacher">عن المدرس</NuxtLink>
        <NuxtLink to="/#app-status">التطبيق</NuxtLink>
      </nav>

      <nav class="home-v2-footer__links" aria-label="روابط الطالب">
        <b>مساحة الطالب</b>
        <NuxtLink to="/profile">مساحة الطالب</NuxtLink>
        <NuxtLink to="/login">تسجيل الدخول</NuxtLink>
        <NuxtLink to="/Auth/register">إنشاء حساب</NuxtLink>
      </nav>
    </div>

    <div class="container home-v2-footer__bottom">
      <span>© {{ new Date().getFullYear() }} {{ site.brandName || 'EduHub' }}. جميع الحقوق محفوظة.</span>
      <nav class="home-v2-footer__legal" aria-label="السياسات القانونية">
        <NuxtLink to="/privacy">سياسة الخصوصية</NuxtLink>
        <NuxtLink to="/terms">الشروط والأحكام</NuxtLink>
      </nav>
      <a
        class="home-v2-footer__powered-by"
        href="https://eduhubco.com/"
        target="_blank"
        rel="noopener noreferrer"
        dir="ltr"
      >
        Powered by EduHub
      </a>
    </div>
  </footer>
</template>

<style scoped>
.home-v2-footer {
  padding-top: 70px;
  background: #061147;
  color: #fff;
}

.home-v2-footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: clamp(52px, 6vw, 100px);
  padding-bottom: 55px;
}

.home-v2-footer__brand {
  display: flex;
  width: max-content;
  max-width: 100%;
  align-items: center;
  gap: 11px;
}

.home-v2-footer__logo {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  place-items: center;
  overflow: hidden;
  border: 2px solid #ffffffb3;
  border-radius: 10px;
  background: #fff;
}

.home-v2-footer__logo :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.home-v2-footer__brand-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.home-v2-footer__brand b {
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
  color: #ef7a63;
  font-size: 15px;
  line-height: 1.8;
}

.home-v2-footer__contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 14px;
  margin-top: 18px;
  color: #ffffffb8;
  font-style: normal;
}

.home-v2-footer__contacts a,
.home-v2-footer__contacts span {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  color: #ffffffb8;
  font-size: 13px;
}

.home-v2-footer__contacts a:hover {
  color: #fff;
  text-decoration: underline;
}

.home-v2-footer__social-block {
  margin-top: 22px;
}

.home-v2-footer__social-block > b {
  display: block;
  color: #f0cb81;
  font: 800 12px var(--home-v2-heading);
}

.home-v2-footer__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.home-v2-footer__socials > a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  padding: 0 13px;
  border: 1px solid #ffffff29;
  color: #ffffffc7;
  font-size: 11px;
  font-weight: 800;
  transition: border-color 0.3s ease, color 0.3s ease,
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-v2-footer__socials > a:hover {
  transform: translateY(-2px);
  border-color: #f0cb81;
  color: #fff;
}

.home-v2-footer__social-icon {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  background: #ffffff1a;
  color: #f2ca7c;
}

.home-v2-footer__social-icon svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.home-v2-footer__links {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 13px;
}

.home-v2-footer__links > b {
  margin-bottom: 8px;
  color: #f0cb81;
  font: 800 14px var(--home-v2-heading);
}

.home-v2-footer__links > a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: #ffffff9e;
  font-size: 14px;
}

.home-v2-footer__links > a:hover {
  color: #fff;
}

.home-v2-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 0;
  border-top: 1px solid #ffffff1a;
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
  color: #fff;
}

.home-v2-footer__powered-by {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: #e6ba62;
  font-weight: 900;
  transition: color 0.28s ease;
}

.home-v2-footer__powered-by:hover,
.home-v2-footer__powered-by:focus-visible {
  color: #f4d590;
}

@media (max-width: 900px) {
  .home-v2-footer__grid {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 680px) {
  .home-v2-footer {
    padding-top: 54px;
  }

  .home-v2-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 38px 24px;
  }

  .home-v2-footer__brand-column {
    grid-column: 1 / -1;
  }

  .home-v2-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .home-v2-footer__legal {
    justify-content: flex-start;
  }
}

@media (max-width: 430px) {
  .home-v2-footer__grid {
    grid-template-columns: 1fr;
  }

  .home-v2-footer__brand-column {
    grid-column: auto;
  }

  .home-v2-footer__brand small {
    display: none;
  }
}
</style>
