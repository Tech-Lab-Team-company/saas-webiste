<script setup>
import facebook from "~/public/icons/facebook.vue";
import twiter from "~/public/icons/twiter.vue";
import insta from "~/public/icons/insta.vue";
import instgram from "~/public/icons/instgram.vue";

const cards = [
  {
    title: "مشاركة المدونة",
    icon: facebook,
  },
  {
    icon: instgram,
  },
  {
    icon: insta,
  },
  {
    icon: twiter,
  },
];
</script>

<template>
  <div class="blogs-page-icon pt-lg">
    <p class="blogs-icon-title">{{ cards[0].title }}</p>

    <div class="blogs-icons-row">
      <div
        v-for="(item, index) in cards"
        :key="index"
        class="blogs-icon-container"
      >
        <component :is="item.icon" class="blogs-icon" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.blogs-page-icon {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.blogs-icons-row {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin: 4px 10px;
}

.blogs-icon {
  width: 40px;
  height: 40px;
}

.blogs-icon-title {
  font-family: "regular";
  font-weight: 400;
  font-size: 26px;
  margin-bottom: 10px;
  color: #ffb949;
}

.blogs-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pri, #032855);
  border-radius: 30px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.blogs-icon {
  width: 23px;
  height: 20px;
}
</style>
