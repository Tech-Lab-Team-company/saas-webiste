<script setup lang="ts">
import type { HomeSiteViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

const props = defineProps<{
  site: HomeSiteViewModel;
  teacherName: string;
  whatsappUrl: string | null;
  description: string;
}>();

const hasContactData = computed(() =>
  Boolean(
    props.site.phone ||
      props.site.email ||
      props.site.address ||
      props.whatsappUrl,
  ),
);
</script>

<template>
  <section
    class="about-teacher-section about-teacher-contact"
    aria-labelledby="teacher-contact-title"
  >
    <div v-if="!hasContactData" class="container">
      <HomeSectionEmptyState
        label="قسم التواصل"
        title="أضف بيانات التواصل"
        description="أضف رقم الهاتف أو البريد أو العنوان أو واتساب من إعدادات المنصة."
      />
    </div>

    <div v-else class="container">
      <header class="about-teacher-section__head" data-about-reveal>
        <div>
          <span>تواصل مع المنصة</span>
          <h2 id="teacher-contact-title">بيانات التواصل المنشورة.</h2>
        </div>
        <p v-if="description">{{ description }}</p>
      </header>

      <article class="about-teacher-contact__card" data-about-reveal>
        <span>تواصل</span>
        <div>
          <h3 v-if="site.phone" dir="ltr">{{ site.phone }}</h3>
          <h3 v-else-if="teacherName">{{ teacherName }}</h3>
          <p v-if="site.email" dir="ltr">{{ site.email }}</p>
          <p v-else-if="description">{{ description }}</p>
        </div>
        <a
          v-if="whatsappUrl"
          :href="whatsappUrl"
          target="_blank"
          rel="noreferrer"
        >
          تواصل على واتساب ←
        </a>
      </article>
    </div>
  </section>
</template>
