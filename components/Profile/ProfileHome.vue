<script setup lang="ts">
// import { ref } from "vue";
// import MultiSelect from "primevue/multiselect";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const selectedCommerce = ref();
const selectedCategory = ref();
const CommerceOptions = ref([
  { name: "New York" },
  { name: "Rome" },
  { name: "London" },
  { name: "Istanbul" },
  { name: "Paris" },
]);
const CategoryOptions = ref([
  { name: "New York" },
  { name: "Rome" },
  { name: "London" },
  { name: "Istanbul" },
  { name: "Paris" },
]);
const email = ref("");
const name = ref("");
const phone = ref("");

onMounted(() => {
  console.log("User store data: ", userStore);     
  if (userStore.user) {
    email.value = userStore?.user?.email;
    name.value = userStore?.user?.name;
    phone.value = userStore?.user?.phone;



  } else {
    console.log("User data is not available.");
  }
});
</script>

<template>
  <div class="profile-home">
    <div class="profile-home-text">
      <p>البيانات الشخصيه</p>
      <p>
        هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين
        الآخرين
      </p>

    </div>
    <hr class="profile-text-hr" />

    <div class="profile-home-information">
      <div class="profile-info-container">
        <label>الاسم بالكامل</label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input
            type="text"
            class="input"
            placeholder=" "
            v-model="name"

          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>البريد الالكتروني</label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input type="text" class="input" placeholder=""
          v-model="email"
          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>رقم الهاتف </label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input type="text" class="input" placeholder=""
          v-model="phone"
         />
        </div>
      </div>
    </div>

    <div class="hrs">
      <hr class="profile-first-hr" />
      <hr class="profile-second-hr" />
    </div>

    <div class="profile-home-text profile-home-text2">
      <p>البيانات الشخصيه</p>
      <p>
        هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين
        الآخرين
      </p>
    </div>
    <hr class="profile-text-hr" />

    <div class="profile-home-information">
      <div class="profile-info-container">
        <label>نوع التعليم</label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input type="text" class="input" placeholder="عام" />
        </div>
      </div>
      <div class="profile-info-container">
        <label>مرحله التعليم</label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input type="text" class="input" placeholder="المرحله الجامعيه" />
        </div>
      </div>
      <div class="profile-info-container">
        <label>جامعه </label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input type="text" class="input" placeholder="جامعه المنصورة" />
        </div>
      </div>
      <div class="profile-info-container">
        <label>الكليه</label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input
            type="text"
            class="input"
            placeholder="كليه الحاسبات ونظم المعلومات"
          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>الفرقه </label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input type="text" class="input" placeholder="الرابعه" />
        </div>
      </div>
    </div>

    <div class="hrs">
      <hr class="profile-first-hr" />
      <hr class="profile-second-hr" />
    </div>

    <div class="profile-home-text profile-home-text2">
      <p>المجالات المهتم بيها</p>
      <p>
        هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين
        الآخرين
      </p>
    </div>
    <hr class="profile-text-hr" />

    <div class="profile-home-information">
      <div class="profile-info-container">
        <label>متعلق بتخصصك ( Commerce )</label>

        <div class="profile-multi profile-input-container flex justify-center">
          <button>تعديل</button>
          <MultiSelect
            v-model="selectedCommerce"
            display="chip"
            :options="CommerceOptions"
            optionLabel="name"
            filter
            placeholder="Select Cities"
            :maxSelectedLabels="3"
            class="input"
          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>المجالات الأكثر شهره</label>

        <div class="profile-multi profile-input-container flex justify-center">
          <button>تعديل</button>
          <MultiSelect
            v-model="selectedCategory"
            display="chip"
            :options="CategoryOptions"
            optionLabel="name"
            filter
            placeholder="Select Cities"
            :maxSelectedLabels="3"
            class="input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
