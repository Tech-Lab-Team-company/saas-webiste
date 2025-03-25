<script setup lang="ts">
import ImageModel from "~/features/ListingFeature/Data/models/image_model";
import DeleteListingImageController from "~/features/ListingFeature/Presentation/controllers/delete_listing_image_controller";
import DeleteListingImageParams from "~/features/ListingFeature/Core/Params/delete_listing_image_params";
import DeleteRateImageController
  from "~/features/EditRateFeature/presentation/controllers/delete_rate_image_controller";
import DeleteRateImageParams from "~/features/EditRateFeature/Core/Params/delete_rate_image_params";

const props = withDefaults(
    defineProps<{
      initialImages?: ImageModel[];
      type: number;
    }>(),
    {
      type: 0, // Default value for 'type'
    }
);
const emit = defineEmits<{ (e: "update:images", files: File[]): void }>();

// Reactive variables to store image previews and file objects
const imagePreviews = ref<ImageModel[]>(props.initialImages || []);
const imageFiles = ref<File[]>([]);

const deleteListingImageController = DeleteListingImageController.getInstance();

// Handle file changes
function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;

  if (files) {
    Array.from(files).forEach((file) => {
      const preview = URL.createObjectURL(file);
      imagePreviews.value.push(new ImageModel(0, preview));
      imageFiles.value.push(file);
    });
    emit("update:images", imageFiles.value); // Emit updated file list
  }
}

// Remove an image
function removeImage(index: number) {
  const imageToRemove = imagePreviews.value[index];

  // Check if the image has an ID
  if (imageToRemove.id) {
    // Remove image by ID
    if (props.type === 0) {
    deleteListingImageController.DeleteListingImage(
        new DeleteListingImageParams(
            useRoute().params.id as string,
            imageToRemove.id,
        ),
    );
    imagePreviews.value = imagePreviews.value.filter(
        (img) => img.id !== imageToRemove.id,
    );
    }
   else {

    DeleteRateImageController.getInstance().deleteRateImage(
      new DeleteRateImageParams(
          imageToRemove.id,
      ),
  )
    // If no ID, remove by index
    imagePreviews.value.splice(index, 1);
    imageFiles.value.splice(index, 1);
  }
  }

  // Emit updated file list
  emit("update:images", imageFiles.value);
}
</script>

<template>
  <div class="multi-image-uploader">
    <!-- Upload Button -->
    <div class="input-image">
      <label for="images" class="input-label">
        <svg
          width="56"
          height="51"
          viewBox="0 0 56 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M43.7564 44.0545H34.7054H32.2681H31.7417V32.9979H35.7123C36.7192 32.9979 37.3143 31.9558 36.7192 31.2055L28.9955 21.4723C28.5035 20.8471 27.4851 20.8471 26.9931 21.4723L19.2693 31.2055C18.6743 31.9558 19.2579 32.9979 20.2763 32.9979H24.2468V44.0545H23.7205H21.2832H10.7904C4.783 43.7523 0 38.6356 0 33.0917C0 29.2672 2.27707 25.9325 5.65264 24.1297C5.34369 23.3689 5.18349 22.5561 5.18349 21.7016C5.18349 17.7937 8.65059 14.6362 12.9416 14.6362C13.8684 14.6362 14.7609 14.7821 15.5962 15.0635C18.0793 10.2698 23.4344 6.94556 29.6592 6.94556C37.7148 6.95598 44.3515 12.5729 45.1067 19.732C51.2971 20.7012 56 25.9221 56 31.8307C56 38.1458 50.5991 43.6168 43.7564 44.0545Z"
            fill="#D0D2D7"
          />
        </svg>
        <span>{{ $t("Attach_photo_not_exceeding_3_5_MB") }}</span>
      </label>
      <input
        type="file"
        accept="image/jp2, image/jpeg, image/jpg, image/png, image/webp"
        id="images"
        class="input"
        multiple
        @change="onFileChange"
      />
    </div>

    <!-- Preview Images -->
    <div class="image-gallery" v-if="imagePreviews.length">
      <div
        class="image-item"
        v-for="(img, index) in imagePreviews"
        :key="index"
      >
        <img :src="img.image" alt="Previewed Image" />
        <button class="remove-btn" type="button" @click="removeImage(index)">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke="#B91F13"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.16998 14.8299L14.83 9.16992"
              stroke="#B91F13"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.83 14.8299L9.16998 9.16992"
              stroke="#B91F13"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
