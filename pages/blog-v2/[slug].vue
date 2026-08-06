<script setup lang="ts">
definePageMeta({ layout: "home-v2" });

const route = useRoute();
const slug = String(route.params.slug || "");

await navigateTo(`/blogs/${encodeURIComponent(slug)}`, {
  redirectCode: 301,
  replace: true,
});
</script>

<template>
  <div />
</template>
