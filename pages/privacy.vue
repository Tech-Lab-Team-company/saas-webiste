<script setup lang="ts">
definePageMeta({ layout: "home-v2" });

useSeoMeta({
  title: "سياسة الخصوصية",
  description: "تعرف على كيفية جمع بياناتك واستخدامها وحمايتها داخل المنصة.",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <InformationPageShell
    eyebrow="خصوصيتك أولويتنا"
    title="سياسة الخصوصية"
    description="نوضح لك بشفافية ما البيانات التي نجمعها، ولماذا نستخدمها، وكيف نحافظ على أمانها."
  >
    <PrivacyContent />
  </InformationPageShell>
</template>
