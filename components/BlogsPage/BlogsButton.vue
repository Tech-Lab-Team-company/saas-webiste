<script setup>
import eye from "~/public/icons/eye.vue";

const cards = [
  {
    id: 1,
    title: "عدد الزوار",
    num: 10100,
    icon: eye,
  },
];
</script>

<template>
  <div class="blog_button_container pt-lg">
    <div class="blog_button" v-for="card in cards" :key="card.id">
      <div class="blog_button_title">
        <p>{{ card.title }}</p>
        <div class="blog_btn">
          <div class="blog_button_content">
            <div class="item">
              <div class="blog_button_icon">
                <component :is="card.icon" />
              </div>
              <div class="blog_button_num">
                <p>{{ card.num }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog_button_container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 20px;
}
.blog_button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 5px 10px;
  padding: 10px;
  width: 200px;
}
.blog_button_title {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.blog_button_title p {
  font-family: "regular";
  font-weight: 400;
  font-size: 24px;
  line-height: 140%;
  letter-spacing: 0%;
  text-align: right;
  margin: 10px 10px;
}
.blog_button_content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 50px;
  background: var(--secondary-color);
  border-radius: 10px;
  cursor: pointer;
}
.blog_btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.blog_button_icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.blog_button_icon svg {
  width: 20px;
  height: 20px;
}
.blog_button_num {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.blog_button_num p {
  font-family: "regular";
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  margin: 0 10px;
}

.item{
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
}
</style>
