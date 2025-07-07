<script setup lang="ts">
import type Terms from "~/types/terms";
import { baseUrl } from "~/constant/baseUrl";
import {getWebDomain} from "~/constant/webDomain";

const { data: terms } = await useAsyncData("terms", async () => {
  const response = await $fetch<{
    data: Terms;
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_terms`, {
    method: "GET",
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain(),
    },
  });
  // console.log(response);

  return response.data;
});
</script>

<template>
  <section class="terms-and-conditions" dir="rtl">
    <div class="container">
      <h1 class="title">الشروط و الأحكام</h1>
      <hr />

      <div v-if="terms">
        <div  class="paragraph">
          <h2>{{ terms.title }}</h2>
          <p v-html="terms.text"></p>
        </div>
      </div>
      <div v-else>
        <p>جاري تحميل الشروط...</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.terms-and-conditions {
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

.paragraph {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 15px;
  color: #666;
  font-family: "regular";
  font-weight: 500;
}
</style>
