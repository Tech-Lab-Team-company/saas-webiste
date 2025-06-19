<script setup lang="ts">
import type BlogsDetails from "~/types/blogsdetails";
import { baseUrl } from "~/constant/baseUrl";
import {getWebDomain} from "~/constant/webDomain";

const { data: blogdetails } = await useAsyncData("blogsdetails", async () => {
  try {
    const response = await $fetch<{
      data: BlogsDetails;
      message: string;
      status: number;
    }>("https://saas.crazyidea.online/api/website/show_blog", {
      method: "POST",
      headers: {
        "Accept-Language": "ar",
        "web-domain": getWebDomain,
      },
      body: { slug: useRoute().params.slug },
    });

    console.log(response.data , "bolgs card contetnt");
    return response.data;
  } catch (err) {
    console.error("فشل في جلب التدوينة:", err);
    return null;
  }
});

</script>


<template>
  
  <div class="blogs-page-articles-cards" dir="rtl">
    <!-- تكرار المدونات باستخدام v-for -->
    <!-- لم يعد هناك تكرار لأن البيانات كائن واحد -->
    <div class="blogs-header" v-if="blogdetails">
      <h2 class="sidebar-page-articles-card">{{ blogdetails.title }}</h2>
      <hr />
      <div class="sidebar-page-articles-card-info">
        <div class="blogs-name">
          <div class="blog-name-icon">
            <!-- إذا كنت ترغب في إضافة أي أيقونات هنا، يمكنك فعل ذلك -->
            <!-- <component :is="card.icon" class="sidebar-icon" /> -->
            <!-- <p class="sidebar-date">اضيف بواسطة</p>
            <p class="sidebar-text" v-html="blogdetails.subtitle"></p> -->
          </div>
        </div>
        <div class="blogs-name">
          <div class="blog-name-icon">
            <!-- إذا كنت ترغب في إضافة المزيد من الأيقونات هنا -->
            <!-- <component :is="card.icon1" class="sidebar-icon" /> -->
            <p class="sidebar-date">{{ $t('التاريخ') }}</p>
          </div>
          <p class="sidebar-text">{{ blogdetails.date }}</p>
        </div>
      </div>
    </div>

    <div class="blogs-image-banner">
      <img :src="blogdetails?.attachments?.[0]?.file" alt="">
    </div>
    <div>
      <p class="blogs-description" v-html="blogdetails?.subtitle"></p>
    </div>

    <!-- الكومنتات مضافة هنا كما طلبت -->
    <BlogsPageBlogsImage />
    <!-- <BlogsPageBlogsButton /> -->
    <BlogsPageBlogsButtonOne />
    <!-- <BlogsPageBlogsIcon /> -->
  </div>
</template>



<style scoped>

.blogs-page-articles-cards {
  border-radius: 18px;
  height: auto;
  padding: 24px;
  background: #f6f6f6;
  margin: 5px 10px;
  width: 95%;
}

.sidebar-date{
  display: flex;
  align-items: center;
  font-size: 16px;
}

.blogs-description{
  margin-top: 20px;
}
.sidebar-text{
  font-size: 16px;

}

.blogs-image-banner{
  width: 100%;
  /* height: 300px;
  border-radius: 18px;
  overflow: hidden;
  margin: 10px 0; */
}
.blogs-image-banner img{
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-height: 550px;
}
.blogs-page-articles-cards {
  border-radius: 18px;
  height: auto;
  padding: 24px;
  background: #f6f6f6;
  margin: 5px 10px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  width: 95%;
}
.blogs-header {
  font-family: "regular";
  font-weight: 500;
  font-size: 21px;
  text-align: right;
  color: #000000;
  margin: 0 10px;
}

.blogs-header .sidebar-page-articles-card{
  max-width: 500px;
}
.blogs-header hr {
  border: 1px solid #ebebeb;
  margin: 10px 0;
}
.sidebar-page-articles-card-info {
  /* display: grid;
  align-items: center;
  grid-template-columns: 1fr 3fr; */
  display: flex;
  align-items: center;
  gap: 20px;
}
.blogs-name {
  display: flex;
  align-items: center;
  margin: 10px 0;
  gap: 10px;
}
.blog-name-icon {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: "regular";
  font-weight: 400;
  font-size: 20px;
  color: #8c8896;
}
.sidebar-icon {
  width: 20px;
  height: 20px;
}
.sidebar-text {
  font-family: "regular";

font-weight: 400;
font-size: 18px;
color:#FFB949

}
/*end blogs-page-articles-cards */
</style>
