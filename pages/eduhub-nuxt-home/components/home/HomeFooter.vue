<script setup lang="ts">
const exploreLinks = [
  { label: 'الكورسات', to: '/courses' },
  { label: 'المذكرات', to: '/library' },
  { label: 'المدونة', to: '/blog' },
  { label: 'عن مستر إسلام', to: '/about' },
  { label: 'التطبيق', to: '/#app-status' },
] as const

const studentLinks = [
  { label: 'مساحة الطالب', to: '/learn' },
  { label: 'تسجيل الدخول', to: '/loginhome' },
  { label: 'إنشاء حساب', to: '/register' },
] as const

const socialLinks = [
  {
    label: 'فيسبوك',
    href: 'https://www.facebook.com/profile.php?id=100054647100716',
    icon: 'facebook',
  },
  {
    label: 'إنستجرام',
    href: 'https://www.instagram.com/mreslamsalama',
    icon: 'instagram',
  },
  {
    label: 'واتساب',
    href: 'https://wa.me/201507659697',
    icon: 'whatsapp',
  },
] as const
</script>

<template>
  <footer>
    <div class="container footer-grid">
      <div class="footer-brand" data-motion-reveal="up">
        <NuxtLink to="/#top" class="brand" aria-label="إسلام سلامة — الرئيسية">
          <span class="teacher-brand-mark" aria-hidden="true">
            <NuxtImg src="/eslam-salama-logo.webp" alt="" width="46" height="46" loading="lazy" />
          </span>
          <span class="brand-copy">
            <b lang="en">Gamma Physics</b>
            <small>إسلام سلامة · مدرس الفيزياء للمرحلة الثانوية</small>
          </span>
        </NuxtLink>

        <p>شرح فيزياء منظم لطلاب أولى وثانية وثالثة ثانوي، من فهم القانون إلى تحليل المسألة.</p>

        <address class="site-contact-details" aria-label="بيانات التواصل">
          <a href="tel:+201008474507" dir="ltr">01008474507</a>
          <a href="mailto:eslamsalama507@gmail.com" dir="ltr">eslamsalama507@gmail.com</a>
          <span>الدقهلية — المنصورة</span>
        </address>

        <div class="site-social-block" aria-label="حسابات المدرس على السوشيال ميديا">
          <b>تابع مستر إسلام</b>
          <div class="site-socials" role="list">
            <a
              v-for="social in socialLinks"
              :key="social.href"
              :href="social.href"
              target="_blank"
              rel="noreferrer"
              role="listitem"
              :aria-label="`${social.label} — يفتح في نافذة جديدة`"
            >
              <span class="social-icon" aria-hidden="true">
                <svg v-if="social.icon === 'facebook'" viewBox="0 0 24 24">
                  <path d="M14 8h3V4.2c-.5-.1-2.2-.2-4-.2-3.9 0-6.5 2.4-6.5 6.7V14H3v4h3.5v6h4.3v-6h3.6l.6-4h-4.2v-2.9C10.8 10 11.1 8 14 8Z" />
                </svg>
                <svg v-else-if="social.icon === 'instagram'" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6ZM18.3 6.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" clip-rule="evenodd" />
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <path d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L.2 24l6.4-1.7c1.7.9 3.6 1.4 5.5 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6-3.4-8.4Zm-8.4 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 1 1 8.3 4.6Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6L9 7.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3 2.2 1 3 .9 4.1.8.7-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4Z" />
                </svg>
              </span>
              <span>{{ social.label }}</span>
            </a>
          </div>
        </div>
      </div>

      <div data-motion-reveal="up" data-motion-order="1">
        <b>استكشف</b>
        <NuxtLink v-for="link in exploreLinks" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
      </div>

      <div data-motion-reveal="up" data-motion-order="2">
        <b>مساحة الطالب</b>
        <NuxtLink v-for="link in studentLinks" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
      </div>
    </div>

    <div class="container footer-bottom">
      <span>© 2026 إسلام سلامة. جميع الحقوق محفوظة.</span>
      <nav class="footer-legal-links" aria-label="السياسات القانونية">
        <NuxtLink to="/privacy">سياسة الخصوصية</NuxtLink>
        <NuxtLink to="/terms">الشروط والأحكام</NuxtLink>
      </nav>
      <span>Powered by EduHub</span>
    </div>
  </footer>
</template>

<style scoped>
footer {
  padding-top: 70px;
  background: #102e36;
  color: #fff;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 100px;
  padding-bottom: 55px;
}

.brand {
  display: flex;
  width: max-content;
  align-items: center;
  gap: 11px;
}

.teacher-brand-mark {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #fff;
}

.teacher-brand-mark :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-copy {
  display: flex;
  flex-direction: column;
}

.brand b {
  font: 900 17px/1 var(--heading);
  letter-spacing: 0.04em;
}

.brand small {
  margin-top: 6px;
  color: #ffffffb8;
  font-size: 12px;
}

.footer-brand > p {
  max-width: 350px;
  margin-top: 22px;
  color: #ef7a63;
  font-size: 15px;
  line-height: 1.8;
}

.site-contact-details {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  font-style: normal;
}

.site-contact-details a,
.site-contact-details span {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  color: #ffffffa6;
  font-size: 13px;
}

.site-contact-details a:hover {
  color: #fff;
  text-decoration: underline;
}

.site-social-block {
  margin-top: 22px;
}

.site-social-block > b {
  display: block;
  color: #f0cb81;
  font: 800 12px var(--heading);
}

.site-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.site-socials > a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  padding: 0 13px;
  border: 1px solid #ffffff29;
  color: #ffffffc7;
  font-size: 11px;
  font-weight: 800;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}

.site-socials > a:hover {
  transform: translateY(-2px);
  border-color: #ffffff70;
  color: #fff;
}

.social-icon {
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
}

.social-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.footer-grid > div:not(:first-child) {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.footer-grid > div > b {
  margin-bottom: 8px;
  color: #f0cb81;
  font: 800 14px var(--heading);
}

.footer-grid > div > a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: #ffffff9e;
  font-size: 14px;
}

.footer-grid > div > a:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 0;
  border-top: 1px solid #ffffff1a;
  color: #ffffffb3;
  font-size: 12px;
}

.footer-legal-links {
  display: flex;
  gap: 18px;
}

.footer-legal-links a:hover {
  color: #fff;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 680px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 430px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-brand {
    grid-column: auto;
  }

  .brand small {
    display: none;
  }
}
</style>
