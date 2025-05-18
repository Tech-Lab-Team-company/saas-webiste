<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "~/stores/user";
import EditImageIcon from "~/public/icons/EditImageIcon.vue";
import type { ProfileImage } from "~/types/profileimage";
import UpdateProfileImageParams from "~/features/UpdateProfileImageFeature/Core/Params/update_profile_image_params";
import UpdateProfileImageController from "~/features/UpdateProfileImageFeature/presentation/controllers/update_profile_image_controller";
const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const profileimage = ref<ProfileImage | null>(null);
const userStore = useUserStore();
const isLoggedIn = ref(false);

const router = useRouter();

onMounted(() => {
  isLoggedIn.value = localStorage.getItem("auth") === "true";

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    userStore.setUser(JSON.parse(storedUser));
  }

  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    userStore.setImage(savedImage);
  }
});

const handleLogout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("user");
  userStore.logout();
  isLoggedIn.value = false;
  router.push("/");
};

onMounted(() => {
  if (userStore.image) {
    imagePreview.value = userStore.image;
  }
});

const handleImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  if (
    !["image/jpeg", "image/png"].includes(file.type) ||
    file.size > 5 * 1024 * 1024
  ) {
    errorMessage.value = "يرجى اختيار صورة JPEG أو PNG بحجم أقل من 5MB.";
    return;
  }

  selectedImage.value = file;
  imagePreview.value = URL.createObjectURL(file);
  errorMessage.value = null;

  userStore.setImage(imagePreview.value);

  await uploadImage();
};

const uploadImage = async () => {
  if (!selectedImage.value) return;

  const paramsImg = new UpdateProfileImageParams(selectedImage.value);
  try {
    await UpdateProfileImageController.getInstance().updateProfileImage(
      paramsImg
    );
  } catch (error) {
    console.error("خطأ في رفع الصورة:", error);
    errorMessage.value = "فشل في رفع الصورة.";
  }
};
</script>

<template>
  <div class="profile-sidebar-container">
    <div class="person-data">
      <div class="profile-image-container">
        <img :src="imagePreview || ''" class="course-image" />
        <label for="profile-image-input">
          <EditImageIcon class="edit-icon" />
        </label>
        <input
          id="profile-image-input"
          type="file"
          accept="image/*"
          @change="handleImageChange"
          style="display: none"
        />
      </div>
      <p class="person-name">{{ userStore.user.name }}</p>
      <p class="person-stage">طالب ثانوي</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <ul class="profile-options">
      <NuxtLink
        to="/profile"
        exactActiveClass="active"
        class="profile-option"
        @click="UpdateSidebar('profile')"
        :class="{ active: SelectedOption === 'profile' }"
      >
        <p>الملف الشخصي</p>
        <SettingsIcon class="profile-icon" />
      </NuxtLink>

      <NuxtLink
        to="/passwordupdate"
        exactActiveClass="active"
        class="profile-option"
        @click="UpdateSidebar('security')"
        :class="{ active: SelectedOption === 'security' }"
      >
        <p>الامان</p>
        <KeyIcon class="profile-icon" />
      </NuxtLink>
      <NuxtLink
        exactActiveClass="active"
        to="/profilecourse"
        class="profile-option"
        @NuxtLinkck="UpdateSidebar('courses')"
        :class="{ active: SelectedOption === 'courses' }"
      >
        <p>كورساتي</p>
        <CoursesNote class="profile-icon" />
      </NuxtLink>
      <li
        class="profile-option"
        @click="UpdateSidebar('questionsbank')"
        exactActiveClass="active"
        :class="{ active: SelectedOption === 'questionsbank' }"
      >
        <p>بنك اسئلتي</p>
        <QuestionBank class="profile-icon" />
      </li>
      <li
        class="profile-option"
        @click="handleLogout"
        exactActiveClass="active"
        :class="{ active: SelectedOption === 'logout' }"
      >
        <p>تسجيل الخروج</p>
        <Logout class="profile-icon" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.profile-sidebar-container {
  background-color: #f6f6f6;
  border-radius: 20px 20px 0 0;
  width: 250px;
  margin: 40px auto 20px;
  grid-column: span 1;

  .person-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateY(-60px);
    padding-bottom: 20px;
    border-bottom: 1px solid #d9d9d9;

    .profile-image-container {
      position: relative;
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 10px solid white;
      }
      .edit-icon {
        width: 25px;
        position: absolute;
        top: 80%;
        left: 30px;
        cursor: pointer;
      }
    }

    .person-name {
      font-size: 20px;
      margin-top: 15px;
    }
    .person-stage {
      color: #6f777b;
    }
    .error-message {
      color: red;
      margin-top: 10px;
    }
  }

  .profile-options {
    .profile-option {
      display: flex;
      justify-content: end;
      gap: 5px;
      align-items: center;
      padding: 20px 10px;
      border-bottom: 1px dashed #8c889631;
      cursor: pointer;

      &.active {
        background-color: #fff6e6;
      }
      .profile-icon {
        width: 20px;
      }
    }
  }
}
</style>
