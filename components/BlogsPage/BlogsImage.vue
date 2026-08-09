<script setup lang="ts">
import type BlogsImage from "~/types/blogsimage";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const webDomain = getWebDomain();
const api = new HomePageApi(webDomain);
const { data: blogdetails } = await useAsyncData<BlogsImage | null>(
  `legacy-blog-image:${webDomain}:${slug.value}`,
  async () => (await api.fetchBlog(slug.value)) as BlogsImage,
  { default: () => null, watch: [slug] },
);
const articleImage = computed(() => {
  const attachment = blogdetails.value?.attachments?.find((item) => item.file);
  if (attachment?.file) {
    return { src: attachment.file, alt: attachment.alt || "" };
  }

  return blogdetails.value?.mail_image
    ? { src: blogdetails.value.mail_image, alt: blogdetails.value.title }
    : null;
});

</script>


<template>
  <div class="blogs-page-image" v-if="blogdetails">
    <div class="image">
      <div class="blogs-page-image-cards">
        <div
        v-if="articleImage"
        class="blogs-page-image-card"
        >
        <img
            :src="articleImage.src"
            :alt="articleImage.alt"
            class="course-image"
          />
        </div>
        <div class="des">
          <div class="blogs-page-des">
            <p
              v-if="blogdetails.subtitle"
              class="blogs-page-descc"
            >
              {{ blogdetails.subtitle }}
            </p>
            <p
              v-if="blogdetails.description"
              class="blogs-page-desc"
            >
              {{ blogdetails.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.blogs-page-image {
  border-radius: 10px;
  background: #f6f6f6;
  margin: 5px 10px;
}

/* .blogs-page-image-card {
  display: flex;
  justify-content: center;
  align-items: center;
} */
.blogs-page-image-card img {
  width: 92%;
  height: 500px;
}
.blogs-page-descc{
  font-family: "bold";
  font-weight: 500;
  font-size: 21px;
  text-align: right;
  color: #000000;
}
.blogs-page-desc{
  font-family: "regular";
  font-weight: 500;
  font-size: 19px;
  text-align: right;
  color: #6F777B;
}
.des {
  display: flex;
  margin: 0 15px;
  padding-top: 45px;
}
</style>
