<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";
import PdfIcon from "@/public/icons/AddImage.vue";
import WordIcon from "@/public/icons/AddImage.vue";
import ExcelIcon from "@/public/icons/AddImage.vue";
import MediaIcon from "~/public/icons/mediaIcon.vue";

// const props = defineProps<{ initialImages?: string[]; index?: number; label?: string }>()
const props = defineProps({
  accept: {
    type: String,
    default: "image/jp2, image/jpeg, image/jpg, image/png, image/webp",
  },
  initialImages: {
    type: Array,
    default: () => [],
  },
  initialFiles: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: "",
  },
});
const emit = defineEmits<{
  (e: "update:images", files: File[], index?: number): void;
}>();

// Reactive variables to store image previews and file objects
const imagePreviews = ref([...props.initialImages]);

watch(
  () => props.initialImages,
  (newImages) => {
    imagePreviews.value = newImages;
  },
);
const imageFiles = ref<File[]>([]);

// Define file type icons as string URLs to placeholder images/icons
const placeholderIcons = {
  pdf: "/icons/pdf-placeholder.png",
  word: "/icons/word-placeholder.png",
  excel: "/icons/excel-placeholder.png",
  generic: "/icons/file-placeholder.png",
};

// Determine file type placeholder
function getPlaceholder(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return placeholderIcons.pdf;
    case "doc":
    case "docx":
      return placeholderIcons.word;
    case "xls":
    case "xlsx":
      return placeholderIcons.excel;
    default:
      return placeholderIcons.generic;
  }
}

// Handle file changes
function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;

  if (files) {
    Array.from(files).forEach((file) => {
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : getPlaceholder(file.name);

      imagePreviews.value.push(preview);
      imageFiles.value.push(file);
    });
    emit("update:images", imageFiles.value, props.index);
  }
}

// Fallback for broken images
function handleImageError(index: number) {
  imagePreviews.value[index] = placeholderIcons.generic;
}

// Remove an image
function removeImage(index: number) {
  imagePreviews.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
  emit("update:images", imageFiles.value); // Emit updated file list
}


</script>

<template>
  <div class="col-span-4 md:col-span-4 multi-image-uploader">
    <!-- Upload Button -->
    <div class="input-image">
      <label :for="`images${index}`" class="input-label-images">
        <AddImage v-if="props.index == 0" />
        <MediaIcon v-if="props.index == 1" />
        <span>
            أرفق صورة لا يتجاوز حجمها 3.5 ميجابايت.
        </span>
      </label>
      <input
        type="file"
        :accept="accept"
        :id="`images${index}`"
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
        <img
          :src="img"
          @error="handleImageError(index)"
          alt="Previewed Image"
        />
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

<style scoped lang=scss>

.multi-image-uploader {
  display: flex;
  flex-direction: column;
  height: 100%;
    .input-image{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  .input-label {
    font-family: "medium", sans-serif;
    font-size: 0.9rem;
    color: var(--primary-color);
    margin-bottom: var(--space-xs) / 2;
    display: block;
    cursor: pointer;
  }
  .input-label-images {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    cursor: pointer;
    border-radius: var(--radius-sm);
    // padding: calc(10 / var(--base-height) * 100vh);
    padding: 30px;
    transition: all var(--transition-sm) ease-in-out;
    width: 100%;
    height: 100%;
    background-color: transparent;
    span {
      font-family: "regular", sans-serif;
      color: rgba(87, 107, 116, 1);
      font-size: var(--sm-size);
      small {
        margin-top: var(--space-sm);
        display: block;
        color: var(--text-color-2);
      }
    }
  }
  .image {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    width: 200px;
    height: 120px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  input[type="file"] {
    display: none;
  }
}


  .image-gallery {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
    


    .image-item {
      position: relative;
      width: calc(85 / var(--base-height) * 100vh);
      height: calc(70 / var(--base-height) * 100vh);
      border-radius: var(--radius-sm);
      overflow: hidden;
      padding: var(--space-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(250, 250, 250, 1);
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .remove-btn {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #ffffff;
        color: var(--danger-color);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
}

</style>
