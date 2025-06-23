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
            <p>حسابنا</p>
            <p>{{ setting?.email }}</p>
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

    <div class="col">

      <NuxtImg v-if="settingStore.setting?.image?.img" :src="settingStore.setting.image.img" :alt="setting?.image?.alt"
        format="webp" class="col-logo" />

      <div v-html="setting?.description" class="col-data-details"></div>
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

    <hr class="hr" />
  </div>
</template>

<style scoped lang="scss">
.social-media-icons {
  display: flex;
  justify-content: flex-end;
  gap: 30px;

  .social-icon {
    width: 50px;
    padding: 7px;
    /* width: 48px; */
    background-color: rgba(37, 37, 173, 0.0509803922);
    height: 42px;
    border-radius: 31px;
  }

}
.col{
  .col-description{
    .col-details{
      .email-icon {
        background-color: #ECECF2;
        // width: 20px;
        // height: 20px;
        padding: 6px;
        border-radius: 50px;
      }
    }
  }
}
</style>
