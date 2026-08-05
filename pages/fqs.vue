<script setup lang="ts">
definePageMeta({ layout: "home-v2" });

useSeoMeta({
  title: "الأسئلة الشائعة",
  description: "إجابات سريعة عن أكثر الأسئلة شيوعًا حول المنصة والكورسات والحساب.",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <InformationPageShell
    eyebrow="نحن هنا لمساعدتك"
    title="الأسئلة الشائعة"
    description="إجابات مختصرة وواضحة عن الحساب والكورسات واستخدام المنصة."
  >
    <FQSContent />
  </InformationPageShell>
</template>
