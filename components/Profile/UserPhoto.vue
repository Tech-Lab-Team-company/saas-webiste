<script setup lang="ts">
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import UpdateProfileImageParams from "~/features/UpdateProfileImageFeature/Core/Params/update_profile_image_params";
import UpdateProfileImageController
  from "~/features/UpdateProfileImageFeature/presentation/controllers/update_profile_image_controller";
import RemoveProfileImageController
  from "~/features/RemoveProfileImageFeature/presentation/controllers/remove_profile_image_controller";

const image = ref<string>("");

const updateProfileImageController = UpdateProfileImageController.getInstance();
const removeProfileImageController = RemoveProfileImageController.getInstance();
const user = useUserStore().user;

onMounted(() => {
  if (user) {
    image.value = user.image;
  }
});

const onFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0] || null;

  if (file) {
    image.value = URL.createObjectURL(file); // Generate preview URL
    const fileBase64 = await convertToBase64(file) as string;
    await updateProfileImageController.updateProfileImage(
      new UpdateProfileImageParams(fileBase64),
    );
  }
};



const removePhoto = async () => {
  await removeProfileImageController.removeProfileImage();
  image.value = "";
}




</script>

<template>
  <div class="user-photo">
    <div class="img">
      <NuxtImg :src="image" alt="user" class="user img" format="webp" />
    </div>
    <div class="upload">
      <div class="actions">
        <label for="image" class="primary-button-2" aria-label="submit">
          <svg
            width="14"
            height="13"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_24_11808)">
              <path
                d="M13.7644 9.07155C13.6902 8.99781 13.6011 8.93957 13.5027 8.90041C13.4043 8.86124 13.2986 8.842 13.1921 8.84387H9.59963C9.48371 9.14467 9.277 9.40494 9.00623 9.59104C8.73729 9.78329 8.41095 9.88596 8.07635 9.88357H5.92318C5.58857 9.88601 5.26222 9.78334 4.9933 9.59104C4.72253 9.40494 4.51582 9.14467 4.3999 8.84387H0.808116C0.701686 8.84204 0.595997 8.86129 0.497576 8.90045C0.399154 8.93961 0.31009 8.99785 0.235883 9.07155C0.159531 9.14319 0.0992133 9.22918 0.0586621 9.32424C0.0181109 9.41929 -0.00181091 9.52138 0.000129243 9.62417V12.2244C-0.00181091 12.3272 0.0181109 12.4293 0.0586621 12.5244C0.0992133 12.6194 0.159531 12.7054 0.235883 12.7771C0.31009 12.8508 0.399154 12.909 0.497576 12.9482C0.595997 12.9873 0.701686 13.0066 0.808116 13.0047H13.1921C13.2983 13.0053 13.4035 12.9855 13.5018 12.9466C13.6 12.9076 13.6892 12.8502 13.7643 12.7777C13.8393 12.7052 13.8988 12.619 13.9391 12.5242C13.9795 12.4293 14 12.3277 13.9994 12.2252V9.62488C14.0015 9.52202 13.9818 9.41983 13.9413 9.32465C13.9009 9.22947 13.8407 9.14333 13.7644 9.07155ZM10.6098 11.8093C10.5224 11.8914 10.4083 11.9418 10.2868 11.952C10.1653 11.9622 10.0439 11.9314 9.94322 11.865C9.84251 11.7986 9.76868 11.7006 9.73426 11.5877C9.69983 11.4747 9.70692 11.3537 9.75433 11.2452C9.80174 11.1367 9.88655 11.0474 9.99437 10.9924C10.1022 10.9373 10.2264 10.92 10.3459 10.9434C10.4655 10.9667 10.5729 11.0293 10.6502 11.1204C10.7274 11.2116 10.7696 11.3257 10.7696 11.4434C10.7699 11.5113 10.7558 11.5784 10.7283 11.6408C10.7008 11.7032 10.6605 11.7596 10.6098 11.8065V11.8093ZM12.7637 11.8093C12.6764 11.8912 12.5625 11.9415 12.4411 11.9516C12.3198 11.9617 12.1987 11.931 12.0981 11.8647C11.9976 11.7983 11.9239 11.7005 11.8896 11.5877C11.8552 11.4749 11.8623 11.3541 11.9096 11.2458C11.957 11.1374 12.0416 11.0482 12.1493 10.9933C12.2569 10.9384 12.3809 10.9211 12.5003 10.9443C12.6196 10.9676 12.727 11.03 12.8041 11.121C12.8812 11.2119 12.9234 11.3259 12.9235 11.4434C12.9237 11.5113 12.9095 11.5785 12.8819 11.6409C12.8543 11.7033 12.8139 11.7597 12.763 11.8065L12.7637 11.8093Z"
                fill="white"
              />
              <path
                d="M3.2309 4.68015H5.38479V8.32012C5.38668 8.45752 5.44405 8.58878 5.54466 8.68594C5.64527 8.7831 5.78118 8.83849 5.92346 8.84032H8.07736C8.21963 8.83849 8.35555 8.7831 8.45616 8.68594C8.55677 8.58878 8.61412 8.45752 8.61601 8.32012V4.68015H10.7699C10.8778 4.68463 10.9843 4.65545 11.0737 4.59693C11.1631 4.53841 11.2306 4.45365 11.2662 4.3552C11.3155 4.26221 11.3307 4.15585 11.3093 4.05346C11.288 3.95107 11.2314 3.85867 11.1487 3.7913L7.37812 0.154152C7.32889 0.105364 7.27004 0.0665898 7.20504 0.0401148C7.14004 0.0136397 7.07022 0 6.99968 0C6.92913 0 6.85931 0.0136397 6.79431 0.0401148C6.72931 0.0665898 6.67046 0.105364 6.62123 0.154152L2.85281 3.79412C2.77005 3.86141 2.71336 3.95381 2.69202 4.05624C2.67067 4.15867 2.68593 4.26506 2.7353 4.35802C2.7714 4.45583 2.83901 4.53988 2.9282 4.59786C3.0174 4.65583 3.12348 4.68467 3.2309 4.68015Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_24_11808">
                <rect width="14" height="13" fill="white" />
              </clipPath>
            </defs>
          </svg>
          {{ $t("add_photo") }}
        </label>
        <input type="file" id="image" class="hidden" @change="onFileChange" />
        <button type="button" @click="removePhoto" class="secondary-button" aria-label="submit">
          {{ $t("remove_photo") }}
        </button>
      </div>
      <p>{{ $t("Attach_photo_not_exceeding_3_5_MB") }}</p>
    </div>
  </div>
</template>

<style scoped></style>
