<script setup lang="ts">
import type Privacy from "~/types/privacy";
import { baseUrl } from "~/constant/baseUrl";

const { data: privacy } = await useAsyncData("privacy", async () => {
  const response = await $fetch<{
    data: Privacy;
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_privacy`, {
    method: "GET",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"hrarabians.org",
    },
  });
  console.log(response);

  return response.data;
});
</script>

<template>
  <section class="privacy-and-conditions" dir="rtl">
    <div class="container">
      <h1 class="title"> سياسه الخصوصيه </h1>
      <hr />

      <div v-if="privacy">
        <div  class="paragraph">
          <h2>{{ privacy.title }}</h2>
          <p v-html="privacy.text"></p>
          
        </div>
      </div>
      <div v-else>
        <p>جاري تحميل الشروط...</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.privacy-and-conditions {
  padding: 40px 20px;
  /* background-color: #f9f9f9; */
  font-family: "regular", sans-serif;
}

.container {
  max-width: 1500px;
  margin: 0 auto;
  background: #f6f6f6;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  font-family: "regular";
  margin-bottom: 20px;
  text-align: right;
  color: #000;
  font-weight: 500;
}
hr {
  border: 1px solid #ff931e;
  margin: 20px 0;
}

.paragraph  {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 15px;
  color: #666;
  font-family: "regular";
  font-weight: 500;
}
</style>
