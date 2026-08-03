<script setup lang="ts">
import type { HomeSiteViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

defineProps<{
  site: HomeSiteViewModel;
  teacherName: string;
  whatsappUrl: string | null;
  description: string;
}>();
</script>

<template>
  <section
    class="about-teacher-section about-teacher-contact"
    aria-labelledby="teacher-contact-title"
  >
    <div class="container">
      <header class="about-teacher-section__head" data-about-reveal>
        <div>
          <span>تواصل مع المنصة</span>
          <h2 id="teacher-contact-title">بيانات التواصل المنشورة.</h2>
        </div>
        <p>{{ description }}</p>
      </header>

      <article class="about-teacher-contact__card" data-about-reveal>
        <span>تواصل</span>
        <div>
          <h3 v-if="site.phone" dir="ltr">{{ site.phone }}</h3>
          <h3 v-else>{{ teacherName }}</h3>
          <p v-if="site.email" dir="ltr">{{ site.email }}</p>
          <p v-else>{{ description }}</p>
        </div>
        <a
          v-if="whatsappUrl"
          :href="whatsappUrl"
          target="_blank"
          rel="noreferrer"
        >
          تواصل على واتساب ←
        </a>
        <NuxtLink v-else to="/Auth/register">أنشئ حسابك ←</NuxtLink>
      </article>
    </div>
  </section>
</template>
