<script setup lang="ts">
import SettingsIcon from "~/public/icons/SettingsIcon.vue";
import key from "~/public/icons/key.vue";
import QuestionBank from "~/public/icons/QuestionBank.vue";
import Logout from "~/public/icons/Logout.vue";
import CoursesNote from "~/public/icons/CoursesNote.vue";
import EditImageIcon from "~/public/icons/EditImageIcon.vue";
import type ProfileImage from "~/types/profileimage";

const SelectedOption = ref("");

const UpdateSidebar = (OptionName: string) => {
  switch (OptionName) {
    case "profile":
      SelectedOption.value = "profile";
      break;
    case "security":
      SelectedOption.value = "security";
      break;
    case "courses":
      SelectedOption.value = "courses";
      break;
    case "quetionsbank":
      SelectedOption.value = "quetionsbank";
      break;
    case "logout":
      SelectedOption.value = "logout";
      break;
  }
};

const { data: profileimage } = await useAsyncData("profileimage", async () => {
  const response = await $fetch<{
    data: ProfileImage;
    message: string;
    status: number;
  }>(`https://edu.techlabeg.com/api/website/update_profile_image`, {
    method: "POST",

    headers: {
      "Accept-Language": "ar",
      "web-domain": "abouelezz.com",
      "Authorization": `Bearer 52|8IWEVCzHBjhmBSHZEBXN7zhF2XtvXBj7HLWgYhls4f481cab`,
      "content-type": "application/json",

    },
  });

  console.log(response);
  return response.data;
  
});
</script>

<template>
  <div class="profile-sidebar-container">
    <div class="person-data">
      <div
        class="profile-image-container"
        v-if="profileimage && profileimage.image"
      >
        <img :src="profileimage.image" class="course-image" />
        <EditImageIcon class="edit-icon" />
      </div>

      <p class="person-name" > {{ profileimage && profileimage.name }}</p>
      <p class="person-stage">طالب ثانوي</p>
    </div>

    <ul class="profile-options">
      <!-- @click="$router.push('/dashboard/profile')" -->
      <li
        class="profile-option"
        @click="UpdateSidebar('profile')"
        :class="SelectedOption == 'profile' ? `active` : ``"
      >
        <p>الملف الشخصي</p>
        <SettingsIcon class="profile-icon" />
      </li>
      <li
        class="profile-option"
        @click="UpdateSidebar('security')"
        :class="SelectedOption == 'security' ? `active` : ``"
      >
        <p>الامان</p>
        <key class="profile-icon" />
      </li>
      <li
        class="profile-option"
        @click="UpdateSidebar('courses')"
        :class="SelectedOption == 'courses' ? `active` : ``"
      >
        <p>كورساتي</p>
        <CoursesNote class="profile-icon" />
      </li>
      <li
        class="profile-option"
        @click="UpdateSidebar('quetionsbank')"
        :class="SelectedOption == 'quetionsbank' ? `active` : ``"
      >
        <p>بنك اسئلتي</p>
        <QuestionBank class="profile-icon" />
      </li>
      <li
        class="profile-option"
        @click="UpdateSidebar('logout')"
        :class="SelectedOption == 'logout' ? `active` : ``"
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
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  grid-column: span 1;
  margin-top: 40px;

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
        margin-left: auto;
        margin-right: auto;
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
      }
    }

    .person-name {
      font-size: 20px;
      margin-top: 15px;
    }
    .person-stage {
      color: #6f777b;
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

      p {
      }
    }
  }
}
</style>
