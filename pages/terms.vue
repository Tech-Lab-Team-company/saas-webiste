<script setup lang="ts">
definePageMeta({ layout: "home-v2" });

useSeoMeta({
  title: "الشروط والأحكام",
  description: "الشروط المنظمة لاستخدام المنصة وخدماتها التعليمية.",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <InformationPageShell
    eyebrow="استخدام واضح ومسؤول"
    title="الشروط والأحكام"
    description="تعرف على القواعد والحقوق والمسؤوليات التي تنظم استخدامك للمنصة والخدمات التعليمية."
  >
    <TermsContent />
  </InformationPageShell>
</template>
