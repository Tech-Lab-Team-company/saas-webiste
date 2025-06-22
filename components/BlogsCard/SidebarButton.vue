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
  <!-- sidebar -->
  <div class="sidebar-buttons" dir="rtl">
    <div class="sidebar-page-articles-buttons pt-lg">
      <h2 class="sidebar-title">{{ $t('encyclopedia') }}</h2>
      <div class="grid grid-cols-3 gap-md pt-md">
        <button
          v-for="(item, index) in cards"
          :key="'btn-' + index"
          class="sidebar-button"
        >
          {{ item.btn }}
        </button>
      </div>
    </div>
  </div>
  <!-- end sidebar -->
</template>
<style scoped>
/* sidebar-button style */
.sidebar-title {
  font-family: "regular";
  font-weight: 500;
  font-size: 25px;
  text-align: right;
  color: #000000;
}

.sidebar-page-articles-buttons {
  margin-top: 20px;
}
.sidebar-page-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.sidebar-button {
  width: 85px;
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
/* end sidebar-button style */
</style>
