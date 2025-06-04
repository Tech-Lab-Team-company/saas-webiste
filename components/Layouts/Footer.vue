<script setup lang="ts">
import Logo from "~/public/icons/Logo.vue";
import PhoneIcon from "~/public/icons/PhoneIcon.vue";
import Location from "~/public/icons/Location.vue";
import FcaebookIcon from "~/public/icons/FcaebookIcon.vue";
import instagramIcon from "~/public/icons/instagramIcon.vue";
import linkedInIcon from "~/public/icons/linkedInIcon.vue";
import twitterIcon from "~/public/icons/twitterIcon.vue";
import { NuxtLink } from "#components";
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 footer-container">
    <div class="col">
      <p class="col-title">وسائل التواصل</p>

      <div class="col-description">
        <div class="col-details">
          <div>
            <p>رقم الهاتف</p>
            <p>+966543042000</p>
          </div>
          <PhoneIcon />
        </div>

        <div class="col-details">
          <div>
            <p>موقعنا</p>
            <p>706 Campfire Ave. Meriden, CT 06450</p>
          </div>
          <Location />
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
        <NuxtLink to="/blogs">
          <p>الاسئله الشائعه</p>
        </NuxtLink>
        <NuxtLink to="/fqs">
          <p>المدونه</p>
        </NuxtLink>
      </div>
    </div>
    <div class="col">
      <div class="col-title">
        <p>عن منصتنا</p>
      </div>

      <div class="col-data-details">
        <Nuxt-link to="/"> <p>الرئيسيه</p></Nuxt-link>
        <Nuxt-link to="/course"><p>كورساتي</p></Nuxt-link>
        <Nuxt-link to="/aboutus"><p>من نحن</p></Nuxt-link>
        <Nuxt-link to="/blogs"><p>تواصل معنا</p></Nuxt-link>
      </div>
    </div>

    <div class="col">
      <Logo class="col-logo" />
      <div class="col-data-details">
        <p>
          منصة شاملة تضم كورساتك و آلاف الأسئلة والتدريبات لمساعدتك على
          الاستعداد لأي اختبار ..ذاكر كورساتك ، اختبر مستواك ، حسّن مهاراتك، وكن
          مستعدًا للنجاح!
        </p>
<!--        <div class="col-icons">-->
<!--          <FcaebookIcon />-->
<!--          <instagramIcon />-->
<!--          <linkedInIcon />-->
<!--          <twitterIcon />-->
<!--        </div>-->
      </div>
    </div>

    <hr class="hr" />
  </div>
</template>

<style scoped lang="scss"></style>
