<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useUserStore } from "~/stores/user";
import EditImageIcon from "~/public/icons/EditImageIcon.vue";
import type { ProfileImage } from "~/types/profileimage";
import UpdateProfileImageParams from "~/features/UpdateProfileImageFeature/Core/Params/update_profile_image_params";
import UpdateProfileImageController from "~/features/UpdateProfileImageFeature/presentation/controllers/update_profile_image_controller";
import { resolveStudentIdentity } from "~/utils/studentIdentity";
import { markUserOffline } from "~/utils/onlineStatusTracking";
const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const profileimage = ref<ProfileImage | null>(null);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const isMobileNavigationOpen = ref(false);

const profileSectionLabels: Record<string, string> = {
  "student-dashboard": "الرئيسية",
  "student-dashboard-course-id": "تفاصيل الكورس",
  profilecourse: "مشترياتي",
  profilefavorites: "المفضلة",
  profileexams: "اختباراتي",
  questions: "بنك الأسئلة",
  profileavailablecourses: "الكورسات",
  profilesubjectinfo: "المعلومات الدراسية",
  profile: "الملف الشخصي",
  passwordupdate: "تغيير كلمة المرور",
};

const displayedImage = computed(
  () =>
    imagePreview.value ||
    userStore.image ||
    userStore.user?.image ||
    "/images/user.png",
);
const studentIdentity = computed(() => resolveStudentIdentity(userStore.user));
const educationLabel = computed(() => {
  const info = userStore.user?.userInfo;
  return (
    info?.year_title || info?.stage_title || info?.university_title || "طالب"
  );
});
const currentSectionLabel = computed(
  () => profileSectionLabels[String(route.name || "")] || "مساحة الطالب",
);

watch(
  () => route.fullPath,
  () => {
    isMobileNavigationOpen.value = false;
  },
);

const handleLogout = async () => {
  try {
    await markUserOffline();
  } finally {
    userStore.logout();
    await router.push("/loginhome");
  }
};

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
      paramsImg,
    );
  } catch (error) {
    console.error("خطأ في رفع الصورة:", error);
    errorMessage.value = "فشل في رفع الصورة.";
  }
};
</script>

<template>
  <div class="profile-sidebar-container">
    <div class="profile-sidebar-brand">
      <span class="profile-brand-mark" aria-hidden="true">
        <span v-if="studentIdentity.initial">{{
          studentIdentity.initial
        }}</span>
        <i v-else class="pi pi-user" />
      </span>
      <div>
        <strong v-if="studentIdentity.firstName">
          مرحبًا، {{ studentIdentity.firstName }}
        </strong>
        <strong v-else>مساحة الطالب</strong>
        <small>
          {{ studentIdentity.firstName ? "مساحة الطالب" : "منصتك التعليمية" }}
        </small>
      </div>
    </div>

    <div class="person-data">
      <div class="profile-image-container">
        <img :src="displayedImage" class="course-image" alt="الصورة الشخصية" />
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
      <p class="person-name">{{ studentIdentity.fullName || "الطالب" }}</p>
      <p class="person-stage">{{ educationLabel }}</p>
      <span class="person-account-state">الحساب نشط</span>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <div class="profile-mobile-navigation">
      <div class="profile-mobile-current">
        <small>أنت الآن في</small>
        <strong>{{ currentSectionLabel }}</strong>
      </div>
      <button
        type="button"
        class="profile-mobile-navigation-toggle"
        :aria-expanded="isMobileNavigationOpen"
        aria-controls="profile-navigation-links"
        @click="isMobileNavigationOpen = !isMobileNavigationOpen"
      >
        <i class="pi pi-th-large" aria-hidden="true" />
        <span>قائمة الحساب</span>
        <i
          class="pi pi-chevron-down profile-mobile-navigation-chevron"
          aria-hidden="true"
        />
      </button>
    </div>

    <nav
      id="profile-navigation-links"
      class="profile-options"
      :class="{ 'is-mobile-open': isMobileNavigationOpen }"
      aria-label="تنقل حساب الطالب"
    >
      <NuxtLink
        :to="{ name: 'student-dashboard' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-home" />
        </span>
        <p>الرئيسية</p>
      </NuxtLink>

      <NuxtLink
        :to="{ name: 'profilecourse' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-book" />
        </span>
        <p>مشترياتي</p>
      </NuxtLink>

      <NuxtLink
        :to="{ name: 'profileexams' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-file-edit" />
        </span>
        <p>اختباراتي</p>
      </NuxtLink>
      <NuxtLink
        :to="{ name: 'profileavailablecourses' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-graduation-cap" />
        </span>
        <p>الكورسات</p>
      </NuxtLink>

      <NuxtLink
        :to="{ name: 'profilefavorites' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-heart" />
        </span>
        <p>المفضلة</p>
      </NuxtLink>
      <NuxtLink
        :to="{ name: 'profilesubjectinfo' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-graduation-cap" />
        </span>
        <p>المعلومات الدراسية</p>
      </NuxtLink>

      <NuxtLink
        :to="{ name: 'profile' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-user" />
        </span>
        <p>الملف الشخصي</p>
      </NuxtLink>
      <NuxtLink
        to="/questions"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-question-circle" />
        </span>
        <p>بنك الأسئلة</p>
      </NuxtLink>

      <NuxtLink
        :to="{ name: 'passwordupdate' }"
        exact-active-class="active"
        class="profile-option"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-lock" />
        </span>
        <p>تغيير كلمة المرور</p>
      </NuxtLink>
      <!-- <NuxtLink
        to="/"
        class="profile-option profile-site-return"
        aria-label="الانتقال إلى الموقع الرئيسي"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-external-link" />
        </span>
        <span class="profile-option-copy">
          <p>الموقع الرئيسي</p>
          <small>العودة إلى واجهة المنصة</small>
        </span>
      </NuxtLink> -->
      <button
        type="button"
        class="profile-option profile-logout"
        @click="handleLogout"
      >
        <span class="profile-icon profile-option-icon" aria-hidden="true">
          <i class="pi pi-sign-out" />
        </span>
        <p>تسجيل الخروج</p>
      </button>
    </nav>

    <div class="profile-sidebar-help">
      <span>?</span>
      <strong>محتاج مساعدة؟</strong>
      <p>راجع الأسئلة الشائعة أو تواصل معنا.</p>
      <NuxtLink to="/fqs">الأسئلة الشائعة</NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-sidebar-container {
  background-color: #f6f6f6;
  border-radius: 20px 20px 0 0;
  width: 250px;
  margin: 40px auto 20px;
  grid-column: span 1;

  @media (max-width: 768px) {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }

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
      // justify-content: end;
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

      .profile-option-icon {
        width: 34px !important;
        height: 34px !important;
        display: grid;
        flex: 0 0 34px;
        place-items: center;
        border: 1px solid currentColor;
        border-radius: 9px;
        background: color-mix(in srgb, currentColor 7%, transparent);
        opacity: 0.82;
        transition: background 180ms ease, color 180ms ease, opacity 180ms ease,
          transform 180ms ease;

        i {
          font-size: 14px;
        }
      }

      &:hover .profile-option-icon,
      &.active .profile-option-icon,
      &.router-link-exact-active .profile-option-icon {
        border-color: var(--profile-secondary, var(--secondary-color));
        background: var(--profile-secondary, var(--secondary-color));
        color: #fff;
        opacity: 1;
        transform: translateX(-2px);
      }
    }
  }
}
</style>
