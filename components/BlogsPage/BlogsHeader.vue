<script setup>
import clock from "~/public/icons/clock.vue";
import frame from "~/public/icons/frame.vue";

const cards = [
  {
    title: "رحلة نحو المعرفة والتفوق",
  },
];

const cards_one = [
  {
    add: " اضيف بواسطه",
    name: "احمد حوام",
    icon: frame,
  },
  {
    add_one: "التاريخ",
    date: "2025-12-1",
    icon1: clock,
  },
];
</script>

<template>
  <div class="blogs-page-articles-cards" dir="rtl">
    <div class="blogs-header">
      <h2
        class="sidebar-page-articles-card"
        v-for="(card, index) in cards"
        :key="index"
      >
        {{ card.title }}
      </h2>
      <hr />
      <div class="sidebar-page-articles-card-info">
        <div class="blogs-name">
          <div class="blog-name-icon">
            <component
              :is="item.icon"
              class="sidebar-icon"
              v-for="(item, index) in cards_one"
              :key="index"
            />
            <p
              class="sidebar-date"
              v-for="(item, index) in cards_one"
              :key="index"
            >
              {{ item.add }}
            </p>
          </div>

          <p
            class="sidebar-text"
            v-for="(item, index) in cards_one"
            :key="index"
          >
            {{ item.name }}
          </p>
        </div>
        <div class="blogs-name">
          <div class="blog-name-icon">
            <component
              :is="item.icon1"
              class="sidebar-icon"
              v-for="(item, index) in cards_one"
              :key="index"
            />
            <p
              class="sidebar-date"
              v-for="(item, index) in cards_one"
              :key="index"
            >
              {{ item.add_one }}
            </p>
          </div>

          <p
            class="sidebar-text"
            v-for="(item, index) in cards_one"
            :key="index"
          >
            {{ item.date }}
          </p>
        </div>
        
      </div>
  <BlogsPageBlogsImage />
  <BlogsPageBlogsButton />
  <BlogsPageBlogsButtonOne />
  <BlogsPageBlogsIcon />




    </div>
  </div>

</template>

<style scoped>
.blogs-page-articles-cards {
  border-radius: 18px;
  height: auto;
  padding: 24px;
  background: #f6f6f6;
  margin: 5px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
.blogs-header hr {
  border: 1px solid #ebebeb;
  margin: 10px 0;
}
.sidebar-page-articles-card-info {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 3fr;
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
