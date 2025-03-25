<script setup lang="ts">

import UpdateProfileController
  from "~/features/UpdateProfileFeature/presentation/controllers/update_profile_controller";
import UpdateProfileParams from "~/features/UpdateProfileFeature/Core/Params/update_profile_params";
//state
const firstName = ref<string>("");
const lastName = ref<string>("");
const name = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const type = ref<number>(0);
const aboutMe = ref<string>("");
const sendNotifications = ref<boolean>(false);
const facebook = ref<string>("");
const x = ref<string>("");
const instagram = ref<string>("");
const youtube = ref<string>("");
const linkedin = ref<string>("");
const whatsapp = ref<string>("");

//controller
const updateProfileController = UpdateProfileController.getInstance();

const updateProfile = async () => {
  await updateProfileController.updateProfile(
      new UpdateProfileParams(
          firstName.value,
          lastName.value,
          name.value,
          email.value,
          phone.value,
          type.value,
          aboutMe.value,
          sendNotifications.value,
          facebook.value,
          x.value,
          instagram.value,
          youtube.value,
          linkedin.value,
          whatsapp.value
      )
  );
}

const user = useUserStore().user;

onMounted(() => {
  if (user) {
    firstName.value = user.firstName!;
    lastName.value = user.lastName!;
    name.value = user.name;
    email.value = user.email;
    phone.value = user.phone!;
    type.value = user.type!;
    aboutMe.value = user.aboutMe!;
    sendNotifications.value = user.sendNotifications!;
    facebook.value = user.facebook!;
    x.value = user.x!;
    instagram.value = user.instagram!;
    youtube.value = user.youtube!;
    linkedin.value = user.linkedin!;
    whatsapp.value = user.whatsapp!;
  }

})
</script>

<template>
  <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 mt-12 gap-4">
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="first_name">First Name</label>
        <input
          class="input"
          type="text"
          id="first_name"
          v-model="firstName"
          placeholder="Enter your First Name"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="last_name">Last Name</label>
        <input
          class="input"
          type="text"
          id="last_name"
          v-model="lastName"
          placeholder="Enter your Last Name"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="email">{{ $t("email") }}</label>
        <input
          class="input"
          type="text"
          id="email"
          v-model="email"
          placeholder="Enter your email"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="phone">{{ $t("phone") }}</label>
        <input
          class="input"
          type="text"
          id="phone"
          v-model="phone"
          placeholder="Enter your phone"
        />
      </div>
    </div>
    <div class="col-span-1 md:col-span-2">
      <div class="input-wrapper">
        <label class="input-label" for="display_name">{{
          $t("display_name")
        }}</label>
        <input
          class="input"
          type="text"
          id="display_name"
          v-model="name"
          placeholder="Enter your phone"
        />
      </div>
    </div>
    <div class="col-span-1 md:col-span-2">
      <div class="input-wrapper">
        <label class="input-label" for="about_me">{{ $t("about_me") }}</label>
        <input
          class="input"
          type="text"
          id="about_me"
          v-model="aboutMe"
          placeholder="Enter your information"
        />
      </div>
    </div>
    <div class="col-span-1 md:col-span-2">
      <div class="input-wrapper-switch">
        <label class="input-label" for="notification">{{
          $t("turn_off_notification")
        }}</label>
        <div class="switch">
          <input type="checkbox" v-model="sendNotifications" id="notification" value="true" />
          <label for="notification" class="slider"></label>
        </div>
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="whatsapp">
          <span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_24_11721)">
                <path
                  d="M9.00225 0H8.99775C4.03538 0 0 4.0365 0 9C0 10.9688 0.6345 12.7935 1.71337 14.2751L0.59175 17.6186L4.05113 16.5128C5.47425 17.4555 7.17188 18 9.00225 18C13.9646 18 18 13.9624 18 9C18 4.03763 13.9646 0 9.00225 0Z"
                  fill="#4CAF50"
                />
                <path
                  d="M14.2396 12.7092C14.0225 13.3223 13.1607 13.8308 12.4734 13.9793C12.0031 14.0795 11.3889 14.1593 9.32111 13.3021C6.67623 12.2063 4.97298 9.5187 4.84023 9.34433C4.71311 9.16995 3.77148 7.92121 3.77148 6.62971C3.77148 5.33821 4.42736 4.70933 4.69173 4.43933C4.90886 4.21771 5.26773 4.11646 5.61198 4.11646C5.72336 4.11646 5.82348 4.12208 5.91348 4.12658C6.17786 4.13783 6.31061 4.15358 6.48498 4.57096C6.70211 5.09408 7.23086 6.38558 7.29386 6.51833C7.35798 6.65108 7.42211 6.83108 7.33211 7.00546C7.24773 7.18546 7.17348 7.26533 7.04073 7.41833C6.90798 7.57133 6.78198 7.68833 6.64923 7.85258C6.52773 7.99546 6.39048 8.14846 6.54348 8.41283C6.69648 8.67158 7.22523 9.53445 8.00373 10.2275C9.00836 11.1218 9.82286 11.4076 10.1142 11.5291C10.3314 11.6191 10.5901 11.5977 10.7487 11.429C10.9501 11.2118 11.1987 10.8518 11.4519 10.4975C11.6319 10.2432 11.8591 10.2117 12.0976 10.3017C12.3406 10.3861 13.6265 11.0217 13.8909 11.1533C14.1552 11.2861 14.3296 11.3491 14.3937 11.4605C14.4567 11.5718 14.4567 12.095 14.2396 12.7092Z"
                  fill="#FAFAFA"
                />
              </g>
              <defs>
                <clipPath id="clip0_24_11721">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          {{ $t("whatsapp") }}</label
        >
        <input
          class="input"
          type="text"
          id="whatsapp"
          v-model="whatsapp"
          placeholder="Enter your link"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label"  for="twitter">
          <span>
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 2.41887C17.3306 2.7125 16.6174 2.90712 15.8737 3.00162C16.6388 2.54487 17.2226 1.82712 17.4971 0.962C16.7839 1.38725 15.9964 1.68763 15.1571 1.85525C14.4799 1.13413 13.5146 0.6875 12.4616 0.6875C10.4186 0.6875 8.77387 2.34575 8.77387 4.37863C8.77387 4.67113 8.79862 4.95237 8.85938 5.22012C5.7915 5.0705 3.07687 3.60013 1.25325 1.36025C0.934875 1.91263 0.748125 2.54488 0.748125 3.2255C0.748125 4.5035 1.40625 5.63637 2.38725 6.29225C1.79437 6.281 1.21275 6.10888 0.72 5.83775C0.72 5.849 0.72 5.86363 0.72 5.87825C0.72 7.6715 1.99912 9.161 3.6765 9.50412C3.37612 9.58625 3.04875 9.62562 2.709 9.62562C2.47275 9.62562 2.23425 9.61213 2.01038 9.56262C2.4885 11.024 3.84525 12.0984 5.4585 12.1332C4.203 13.1154 2.60888 13.7071 0.883125 13.7071C0.5805 13.7071 0.29025 13.6936 0 13.6565C1.63462 14.7106 3.57188 15.3125 5.661 15.3125C12.4515 15.3125 16.164 9.6875 16.164 4.81175C16.164 4.64862 16.1584 4.49113 16.1505 4.33475C16.8829 3.815 17.4982 3.16587 18 2.41887Z"
                fill="#03A9F4"
              />
            </svg>
          </span>
          {{ $t("twitter") }}</label
        >
        <input
          class="input"
          type="text"
          id="twitter"
          v-model="x"
          placeholder="Enter your link"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="linkedin">
          <span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.9959 17.9999L18.0004 17.9992V11.3977C18.0004 8.16817 17.3052 5.68042 13.5297 5.68042C11.7147 5.68042 10.4967 6.67642 9.99944 7.62067H9.94694V5.98192H6.36719V17.9992H10.0947V12.0487C10.0947 10.4819 10.3917 8.96692 12.3319 8.96692C14.2437 8.96692 14.2722 10.7549 14.2722 12.1492V17.9999H17.9959Z"
                fill="#0077B5"
              />
              <path
                d="M0.296875 5.98267H4.02888V17.9999H0.296875V5.98267Z"
                fill="#0077B5"
              />
              <path
                d="M2.1615 0C0.96825 0 0 0.96825 0 2.1615C0 3.35475 0.96825 4.34325 2.1615 4.34325C3.35475 4.34325 4.323 3.35475 4.323 2.1615C4.32225 0.96825 3.354 0 2.1615 0Z"
                fill="#0077B5"
              />
            </svg>
          </span>
          {{ $t("linkedin") }}</label
        >
        <input
          class="input"
          type="text"
          id="linkedin"
          v-model="linkedin"
          placeholder="Enter your link"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="facebook">
          <span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_24_11702)">
                <path
                  d="M15.75 0H2.25C1.00912 0 0 1.00912 0 2.25V15.75C0 16.9909 1.00912 18 2.25 18H15.75C16.9909 18 18 16.9909 18 15.75V2.25C18 1.00912 16.9909 0 15.75 0Z"
                  fill="#1976D2"
                />
                <path
                  d="M15.1875 9H12.375V6.75C12.375 6.129 12.879 6.1875 13.5 6.1875H14.625V3.375H12.375C10.5109 3.375 9 4.88588 9 6.75V9H6.75V11.8125H9V18H12.375V11.8125H14.0625L15.1875 9Z"
                  fill="#FAFAFA"
                />
              </g>
              <defs>
                <clipPath id="clip0_24_11702">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          {{ $t("facebook") }}</label
        >
        <input
          class="input"
          type="text"
          id="facebook"
          v-model="facebook"
          placeholder="Enter your link"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="instagram">
          <span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_24_11692)">
                <path
                  d="M1.12478 1.22472C-0.289717 2.69397 -0.000216767 4.25472 -0.000216767 8.99622C-0.000216767 12.9337 -0.687217 16.881 2.90828 17.8102C4.03103 18.099 13.979 18.099 15.1003 17.8087C16.5973 17.4225 17.8153 16.2082 17.9818 14.091C18.005 13.7955 18.005 4.20222 17.981 3.90072C17.804 1.64547 16.4158 0.345724 14.5865 0.0824738C14.1673 0.0217238 14.0833 0.00372376 11.9323 -2.62391e-05C4.30253 0.00372376 2.63003 -0.336026 1.12478 1.22472Z"
                  fill="url(#paint0_linear_24_11692)"
                />
                <path
                  d="M8.99836 2.35431C6.27511 2.35431 3.68911 2.11206 2.70136 4.64706C2.29336 5.69406 2.35261 7.05382 2.35261 9.00082C2.35261 10.7093 2.29786 12.3151 2.70136 13.3538C3.68686 15.8903 6.29386 15.6473 8.99686 15.6473C11.6046 15.6473 14.2934 15.9188 15.2931 13.3538C15.7019 12.2963 15.6419 10.9568 15.6419 9.00082C15.6419 6.40432 15.7851 4.72806 14.5259 3.46956C13.2509 2.19456 11.5266 2.35431 8.99536 2.35431H8.99836ZM8.40286 3.55206C14.0834 3.54306 14.8064 2.91157 14.4074 11.6843C14.2656 14.7871 11.9031 14.4466 8.99911 14.4466C3.70411 14.4466 3.55186 14.2951 3.55186 8.99782C3.55186 3.63906 3.97186 3.55506 8.40286 3.55056V3.55206ZM12.5459 4.65531C12.1056 4.65531 11.7486 5.01231 11.7486 5.45256C11.7486 5.89281 12.1056 6.24981 12.5459 6.24981C12.9861 6.24981 13.3431 5.89281 13.3431 5.45256C13.3431 5.01231 12.9861 4.65531 12.5459 4.65531ZM8.99836 5.58756C7.11361 5.58756 5.58586 7.11607 5.58586 9.00082C5.58586 10.8856 7.11361 12.4133 8.99836 12.4133C10.8831 12.4133 12.4101 10.8856 12.4101 9.00082C12.4101 7.11607 10.8831 5.58756 8.99836 5.58756ZM8.99836 6.78531C11.9271 6.78531 11.9309 11.2163 8.99836 11.2163C6.07036 11.2163 6.06586 6.78531 8.99836 6.78531Z"
                  fill="white"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_24_11692"
                  x1="1.1593"
                  y1="16.8503"
                  x2="17.8884"
                  y2="2.37146"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FFDD55" />
                  <stop offset="0.5" stop-color="#FF543E" />
                  <stop offset="1" stop-color="#C837AB" />
                </linearGradient>
                <clipPath id="clip0_24_11692">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          {{ $t("instagram") }}</label
        >
        <input
          class="input"
          type="text"
          id="instagram"
          v-model="instagram"
          placeholder="Enter your link"
        />
      </div>
    </div>
    <div class="col-span-1">
      <div class="input-wrapper">
        <label class="input-label" for="youtube">
          <span>
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.391373 11.4056C0.758873 12.7091 1.88312 12.9476 1.95812 12.9933C3.80837 13.4973 14.1794 13.4988 16.0574 12.9933C17.3436 12.6213 17.5799 11.4806 17.6241 11.4056C18.1139 8.80007 18.1461 5.40332 17.6016 2.44682L17.6241 2.59382C17.2566 1.29032 16.1324 1.05182 16.0574 1.00607C14.2319 0.510324 3.83387 0.491574 1.95812 1.00607C0.671873 1.37882 0.435623 2.51882 0.391373 2.59382C-0.132877 5.33207 -0.159127 8.47382 0.391373 11.4056ZM7.20587 9.73832V4.26857L11.9054 7.00757L7.20587 9.73832Z"
                fill="#E53935"
              />
            </svg>
          </span>
          {{ $t("youtube") }}</label
        >
        <input
          class="input"
          type="text"
          id="youtube"
          v-model="youtube"
          placeholder="Enter your link"
        />
      </div>
    </div>
    <div class="col-span-1 md:col-span-2">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button class="primary-button-2 col-span-1 md:col-span-2" aria-label="submit" type="submit">
          {{ $t("save") }}
        </button>
        <button class="secondary-button col-span-1 " aria-label="cancel" type="button">
          {{ $t("cancel") }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
