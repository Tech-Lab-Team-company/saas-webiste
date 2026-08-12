<script setup lang="ts">
import Logo from "~/public/icons/Logo.vue";
import PhoneIcon from "~/public/icons/PhoneIcon.vue";
import Location from "~/public/icons/Location.vue";
import FcaebookIcon from "~/public/icons/FcaebookIcon.vue";
import instagramIcon from "~/public/icons/instagramIcon.vue";
import linkedInIcon from "~/public/icons/linkedInIcon.vue";
import twitterIcon from "~/public/icons/twitterIcon.vue";
import { NuxtLink } from "#components";
import Email from "../Icons/Email.vue";
import FetchChatBotParams from "~/features/FetchChatBot/Core/Params/fetch_chat_bot_params";
import FetchChatBotController from "~/features/FetchChatBot/presentation/controllers/fetch_chat_bot_controller";
import type ChatBotModel from "~/features/FetchChatBot/Data/models/chat_bot_model";
import DesktopIcon from "../Icons/DesktopIcon.vue";

const settingStore = useSettingStore();
const setting = computed(() => settingStore.setting);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 footer-container">
    <div class="col">
      <p class="col-title">وسائل التواصل</p>

      <div class="col-description">
        <div class="col-details">
          <div>
            <p>رقم الهاتف</p>
            <p>{{ setting?.phone }}</p>
          </div>
          <PhoneIcon />
        </div>

        <div class="col-details">
          <div>
            <p>موقعنا</p>
            <p>{{ setting?.address }}</p>
          </div>
          <Location />
        </div>
        <div class="col-details">
          <div>
            <p>البريد</p>
            <p>{{ setting?.email || setting?.name }}</p>
          </div>
          <Email class="email-icon" />
        </div>
      </div>
    </div>
    <div class="col">
      <div class="col-title">
        <p>صفحات اخرى</p>
      </div>
      <div class="col-data-details">
        <NuxtLink to="/privacy">
          <p>سياسه الخصوصيه</p>
        </NuxtLink>
        <NuxtLink to="/terms">
          <p>شروط الاستخدام</p>
        </NuxtLink>
        <NuxtLink to="/fqs">
          <p>الاسئله الشائعه</p>
        </NuxtLink>
        <NuxtLink to="/blogs">
          <p>المدونه</p>
        </NuxtLink>
      </div>
    </div>
    <div class="col">
      <div class="col-title">
        <p>عن منصتنا</p>
      </div>

      <div class="col-data-details">
        <Nuxt-link to="/">
          <p>الرئيسيه</p>
        </Nuxt-link>
        <Nuxt-link to="/course">
          <p>كورساتي</p>
        </Nuxt-link>
        <Nuxt-link to="/aboutus">
          <p>من نحن</p>
        </Nuxt-link>
        <!-- <p>تواصل معنا</p> -->
      </div>
    </div>

    <div class="col logo-col">
      <NuxtImg
        v-if="settingStore.setting?.image?.img"
        :src="settingStore.setting.image.img"
        :alt="setting?.image?.alt"
        format="webp"
        class="col-logo"
      />

      <div v-html="setting?.description" class="col-data-details"></div>
      <div class="stores-logos-container">
        <a
          v-if="
            settingStore.setting?.app_store &&
            settingStore.setting?.app_store != '-'
          "
          class="stores-logos-link"
          target="_blank"
          :href="settingStore.setting?.app_store"
        >
          <NuxtImg
            class="stores-logos stores-logos-apple"
            src="/images/Download_on_the_App_Store_Badge.svg.webp"
          />
        </a>
        <a
          v-if="
            settingStore.setting?.play_store &&
            settingStore.setting?.play_store != '-'
          "
          class="stores-logos-link"
          target="_blank"
          :href="settingStore.setting?.play_store"
        >
          <NuxtImg
            class="stores-logos"
            src="/images/en_badge_web_generic.png"
          />
        </a>

        <a
          :href="settingStore.setting?.desktop_app"
          download
          v-if="settingStore.setting?.have_desktop"
          class="desktop-link"
        >
          <DesktopIcon class="desktop-icon" />
          <p>Desktop</p>
        </a>
      </div>
      <div class="social-media-icons">
        <NuxtLink :to="setting?.twitter">
          <IconsTwiter class="social-icon" />
        </NuxtLink>
        <NuxtLink :to="setting?.linkedin">
          <IconsLinked class="social-icon" />
        </NuxtLink>
        <NuxtLink :to="setting?.instagram">
          <IconsInsta class="social-icon" />
        </NuxtLink>
        <NuxtLink :to="setting?.facebook">
          <IconsFacebookIcon class="social-icon" />
        </NuxtLink>
      </div>
    </div>

    <div class="tech-lab-rights">
      <a
        class="powered-by-eduhub"
        href="https://eduhubco.com/"
        target="_blank"
        rel="noopener noreferrer"
        dir="ltr"
      >
        Powered by EduHub
      </a>
      <a
        class="tech-lab-badge"
        href="https://techlabeg.com/"
        target="_blank"
        rel="noopener noreferrer"
        dir="ltr"
        aria-label="إحدى منتجات Tech Lab"
      >
        <strong>Tech Lab</strong>
        <span dir="rtl">إحدى منتجات</span>
        <svg
          class="tech-lab-mark"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 10.3C9.2 8.4 8.5 6.4 9.4 4.7c.7-1.3 2.3-1.8 3.6-1.1 1.8.9 1.6 3.5-1 6.7Z" />
          <path d="M13.7 12c1.9-2.8 3.9-3.5 5.6-2.6 1.3.7 1.8 2.3 1.1 3.6-.9 1.8-3.5 1.6-6.7-1Z" />
          <path d="M12 13.7c2.8 1.9 3.5 3.9 2.6 5.6-.7 1.3-2.3 1.8-3.6 1.1-1.8-.9-1.6-3.5 1-6.7Z" />
          <path d="M10.3 12c-1.9 2.8-3.9 3.5-5.6 2.6-1.3-.7-1.8-2.3-1.1-3.6.9-1.8 3.5-1.6 6.7 1Z" />
          <circle cx="12" cy="12" r="1.8" />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.desktop-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  background-color: rgba(0, 0, 0, 0.925);
  border-radius: 5px;
  color: white;
  padding-inline: 20px;
}
.desktop-icon {
  width: 60px;
  height: 30px;
}
.footer-container {
  position: relative;
  @media (max-width: 768px) {
    grid-column: 1fr 1fr;
  }
}

.pi-comment {
  font-size: 20px;
}
.stores-logos-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  .stores-logos-link {
    width: 50%;

    .stores-logos-apple {
      width: 88%;
    }
  }
}

.powered-by-eduhub {
  color: #687b75;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.powered-by-eduhub:hover,
.powered-by-eduhub:focus-visible {
  color: #08a567;
}

.col {
  &.logo-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    position: relative;
    .chatbot {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .col-description {
    .col-details {
      .email-icon {
        background-color: #ececf2;
        // width: 20px;
        // height: 20px;
        padding: 6px;
        border-radius: 50px;
      }
    }
  }
}
.rights-hr {
  margin-top: 1rem;
  grid-column: span 4;
}
.tech-lab-rights {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  grid-column: span 4;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(4, 169, 105, 0.16);
}

.tech-lab-badge {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 5px;
  padding: 4px 8px 4px 10px;
  border: 1px solid rgba(4, 169, 105, 0.28);
  border-radius: 999px;
  background: #f1fbf6;
  color: #687b75;
  font-size: 11px;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.tech-lab-badge:hover,
.tech-lab-badge:focus-visible {
  transform: translateY(-1px);
  border-color: #08a567;
}

.tech-lab-badge strong {
  color: #08a567;
  font-size: 16px;
  font-weight: 800;
}

.tech-lab-mark {
  width: 20px;
  height: 20px;
  margin-left: 1px;
  fill: #08a567;
}

@media (max-width: 768px) {
  .tech-lab-rights {
    flex-wrap: wrap;
    grid-column: 1 / -1;
  }
}
</style>
