<script setup>
const cards = [
  {
    id: 1,
    btn: "تعليم",
  },
  {
    id: 2,
    btn: "تصميم",
  },
  {
    id: 3,
    btn: "برمجه",
  },
  {
    id: 4,
    btn: "تصميم",
  },
  {
    id: 5,
    btn: "تعليم",
  },
  {
    id: 6,
    btn: "تصميم",
  },
  {
    id: 7,
    btn: "برمجه",
  },
  {
    id: 8,
    btn: "تصميم",
  },
];
</script>

<template>
  <!-- sidebarone -->
  <div class="sidebarone-buttons" dir="rtl">
    <div class="sidebarone-page-articles-buttons pt-lg">
      <h2 class="sidebarone-title">الموسوعة</h2>
      <div class="sidebarone-page-buttons gap-md pt-md">
        <button
          v-for="(item, index) in cards"
          :key="'btn-' + index"
          class="sidebarone-button"
        >
          {{ item.btn }}
        </button>
      </div>
    </div>
  </div>
  <!-- end sidebarone -->
</template>
<style scoped>
/* sidebarone-button style */
.sidebarone-title {
  font-family: "regular";
  font-weight: 500;
  font-size: 25px;
  text-align: right;
  color: #000000;
}

.sidebarone-page-articles-buttons {
  margin:5px 10px;
}
.sidebarone-page-buttons {
  display: flex;
  flex-wrap: wrap;
}
.sidebarone-button {
  width: 160px;
  height: 45px;
  border-radius: 5px;
  padding: 10px;
  gap: 10px;
  background: #ffffff;
  font-family: "regular";
  font-weight: 400;
  font-size: 19px;
  text-align: center;
  color: #605b6c;
}
/* end sidebarone-button style */
</style>
