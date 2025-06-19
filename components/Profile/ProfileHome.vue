<script setup lang="ts">
// import { ref } from "vue";
// import MultiSelect from "primevue/multiselect";
import { useUserStore } from "~/stores/user";
import { StudentCategoryEnum } from "~/features/RegisterFeature/Core/Enums/education_type_enum";
import UpdateProfileController
from "~/features/UpdateProfileFeature/presentation/controllers/update_profile_controller";
import UpdateProfileParams from "~/features/UpdateProfileFeature/Core/Params/update_profile_params";
const studentCategory = ref(0);

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
const university_title = ref("");
const college_title = ref("");
const university_education_type_title = ref("");
const division_title = ref("");
const department_title = ref("");
onMounted(() => {
  console.log("User store data: ", userStore);
  if (userStore.user) {
    email.value = userStore?.user?.email;
    name.value = userStore?.user?.name;
    phone.value = userStore?.user?.phone;
    university_title.value = userStore?.user?.userInfo?.university_title;
    college_title.value = userStore?.user?.userInfo?.college_title;
    university_education_type_title.value =
      userStore?.user?.userInfo?.university_education_type_title;
    division_title.value = userStore?.user?.userInfo?.division_title;
    department_title.value = userStore?.user?.userInfo?.department_title;
  } else {
    console.log("User data is not available.");
  }
});


const updateProfileController = UpdateProfileController.getInstance();
const UpdateData = async () => {

  await updateProfileController.updateProfile(
      new UpdateProfileParams(
          null,
          null,
          name.value,
          email.value,
          phone.value,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
      )
  );
}


</script>

<template>
  <div class="profile-home">
    <div class="profile-home-text">
      <p>{{ $t('البيانات الشخصيه') }}</p>
      <p>
        {{ $t('هذه البيانات التي أدخلتها عند التسجيل لا تظهر إلى أي من المستخدمين الآخرين') }}
      </p>
    </div>
    <hr class="profile-text-hr" />

    <div class="profile-home-information">
      <div class="profile-info-container">
        <label>{{ $t('الاسم بالكامل') }}</label>
        <div class="profile-input-container">
          <button>{{ $t('تعديل') }}</button>
          <input type="text" class="input" placeholder=" " v-model="name" />
        </div>
      </div>
      <div class="profile-info-container">
        <label>{{ $t('البريد الالكتروني') }}</label>
        <div class="profile-input-container">
          <button>{{ $t('تعديل') }}</button>
          <input type="text" class="input" placeholder="" v-model="email" />
        </div>
      </div>
      <div class="profile-info-container">
        <label>{{ $t('رقم الهاتف') }}</label>
        <div class="profile-input-container">
          <button>{{ $t('تعديل') }}</button>
          <input type="text" class="input" placeholder="" v-model="phone" />
        </div>
      </div>
    </div>

    <div class="button" @click="UpdateData">
      <button class="btn-save-changes">
        {{ $t('حفظ التغييرات') }}
      </button>
    </div>

    <!-- <div class="hrs">
      <hr class="profile-first-hr" />
      <hr class="profile-second-hr" />
    </div> -->

    <!-- <div class="profile-home-text profile-home-text2">
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

        <div class="profile-multi profile-input-container flex justify-center">
          <select v-model="studentCategory" class="custom-select input">
            <option value="" disabled selected>نوع التعليم</option>
            <option :value="StudentCategoryEnum.base">أساسي</option>
            <option :value="StudentCategoryEnum.university">جامعي</option>
            <option :value="StudentCategoryEnum.general">عام</option>
          </select>
        </div>
      </div>

      <div class="profile-info-container">
        <label>مرحله التعليم</label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input
            type="text"
            class="input"
            placeholder=" "
            v-model="university_education_type_title"
          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>جامعه </label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input
            type="text"
            class="input"
            placeholder=""
            v-model="university_title"
          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>الكليه</label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input
            type="text"
            class="input"
            placeholder=""
            v-model="college_title"
          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>القسم </label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input
            type="text"
            class="input"
            placeholder=""
            v-model="department_title"
          />
        </div>
      </div>
      <div class="profile-info-container">
        <label>الفرقه </label>
        <div class="profile-input-container">
          <button>تعديل</button>
          <input
            type="text"
            class="input"
            placeholder=""
            v-model="division_title"
          />
        </div>
      </div>
    </div> -->

    <!-- <div class="hrs">
      <hr class="profile-first-hr" />
      <hr class="profile-second-hr" />
    </div> -->

    <!-- <div class="profile-home-text profile-home-text2">
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
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.profile-home{
  .button{
    display: flex;
    .btn-save-changes{
      background-color:#ffb949;
      color:white;
      padding: 10px 20px;
      border-radius: 10px;
      justify-content: center;
      margin-left:auto;
      margin-right:auto;
      margin-top:20px;
    }
  }

}
</style>
