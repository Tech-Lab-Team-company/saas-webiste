<script setup lang="ts">
import MultiSelect from "primevue/multiselect";
// import Select from "primevue/select";
import BasicInformationParams from "~/features/ListingFeature/Core/Params/basic_information_params";
import FetchCategoriesController from "~/features/FetchCategoriesFeature/presentation/controllers/fetch_categories_controller";
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import FetchCategoriesParams from "~/features/FetchCategoriesFeature/Core/Params/fetch_categories_params";
import CategoryTypeModel from "~/features/FetchCategoryTypeFeature/Data/models/category_type_model";
import FetchCategoryTypesController from "~/features/FetchCategoryTypeFeature/presentation/controllers/fetch_category_types_controller";
import FetchCategoryTypesParams from "~/features/FetchCategoryTypeFeature/Core/Params/fetch_category_types_params";
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import type BasicInformationModel from "~/features/ListingFeature/Data/models/basic_information_model";
import SubCategoryModel from "~/features/FetchSubCategoriesFeature/Data/models/sub_category_model";
import FetchSubCategoriesController from "~/features/FetchSubCategoriesFeature/presentation/controllers/fetch_sub_categories_controller";
import FetchSubCategoriesParams from "~/features/FetchSubCategoriesFeature/Core/Params/fetch_sub_categories_params";

const props = defineProps<{
  basicInformation?: BasicInformationModel | null;
}>();

// console.log(props.basicInformation)

// Initialize `basicInformation` from props
const basicInformation = ref<BasicInformationParams>(
  props.basicInformation
    ? new BasicInformationParams(
        props.basicInformation.title,
        props.basicInformation.image,
        props.basicInformation.category.map(
          (item) => new CategoryModel(item.id, item.title, item.image)
        ),
        props.basicInformation.subCategory?.map(
          (item) => new SubCategoryModel(item.id, item.title)
        )!,
        new CategoryTypeModel(
          props.basicInformation.typeCategory?.id!,
          props.basicInformation.typeCategory?.title!
        ),
        props.basicInformation.keywords,
        props.basicInformation.description,
        props.basicInformation.minPrice,
        props.basicInformation.maxPrice
      )
    : new BasicInformationParams(
        "",
        null,
        [],
        [],
        new CategoryTypeModel(0, "", ""),
        "",
        "",
        0,
        0
      )
);

const emit = defineEmits<{
  (
    e: "update:basicInformation",
    basicInformation: BasicInformationParams
  ): void;
}>();

watch(
  () => basicInformation.value,
  () => {
    // console.log(basicInformation.value);
    emit("update:basicInformation", basicInformation.value);
  },
  { deep: true, immediate: true }
);

//fetch categories

const categories = ref<CategoryModel[]>([]);
const fetchCategoriesController = FetchCategoriesController.getInstance();

const fetchCategories = async () => {
  categories.value = (
    await fetchCategoriesController.fetchCategories(
      new FetchCategoriesParams(1, 10)
    )
  ).value.data!;
  // console.log(categories.value);
};

onMounted(async () => {
  await fetchCategories();
});

//fetch category types

const categoryTypes = ref<CategoryTypeModel[]>([]);

const fetchCategoryTypesController = FetchCategoryTypesController.getInstance();

const fetchCategoryTypes = async () => {
  categoryTypes.value = (
    await fetchCategoryTypesController.fetchCategoryTypes(
      new FetchCategoryTypesParams(1, 1, 10)
    )
  ).value.data!;
};

onMounted(async () => {
  await fetchCategoryTypes();
});

const handleImage = async (image: File) => {
  basicInformation.value.logo = (await convertToBase64(image)) as string;
  // console.log(basicInformation.value.logo)
};

const subCategories = ref<SubCategoryModel[]>([]);
const fetchSubCategoriesController = FetchSubCategoriesController.getInstance();

const fetchSubCategories = async () => {
  // console.log(basicInformation.value.subCategories)
  subCategories.value = (
    await fetchSubCategoriesController.fetchSubCategories(
      new FetchSubCategoriesParams(
        basicInformation.value.categories.map((item) => item.id),
        1,
        100
      )
    )
  ).value.data!;
};
</script>

<template>
  <div class="col-span-1 md:col-span-2">
    <GlobalUploadImage
      :initialImage="basicInformation.logo!"
      @update:image="handleImage"
    />
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="listing_title">
        {{ $t("listing_title") }}
      </label>
      <input
        type="text"
        class="input"
        v-model="basicInformation.title"
        :placeholder="$t('listing_title')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="keywords">
        {{ $t("keywords") }}
        <span class="tooltip">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C13.125 16.5 16.5 13.125 16.5 9C16.5 4.875 13.125 1.5 9 1.5C4.875 1.5 1.5 4.875 1.5 9C1.5 13.125 4.875 16.5 9 16.5Z"
              stroke="#E80306"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 6V9.75"
              stroke="#E80306"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.99609 12H9.00283"
              stroke="#E80306"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="tooltip-text">
            {{ $t("keywords_description") }}
          </span>
        </span>
      </label>
      <input
        type="text"
        class="input"
        v-model="basicInformation.keywords"
        :placeholder="$t('keywords')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-2">
    <div class="input-wrapper">
      <label class="input-label" for="listing_title">
        {{ $t("service_category") }}
      </label>
      <Select
        v-model="basicInformation.serviceCategory"
        :options="categoryTypes"
        optionLabel="title"
        :placeholder="$t('Select_service_category')"
      />
    </div>
  </div>

  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="category">
        {{ $t("category") }}
      </label>
      <MultiSelect
        v-model="basicInformation.categories"
        :options="categories"
        filter
        display="chip"
        :maxSelectedLabels="3"
        optionLabel="title"
        @update:modelValue="fetchSubCategories"
        :placeholder="$t('Select_category')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="sub_category">
        {{ $t("sub_category") }}
      </label>
      <MultiSelect
        v-model="basicInformation.subCategories"
        :options="subCategories"
        optionLabel="title"
        filter
        optionGroupLabel="title"
        optionGroupChildren="sub"
        display="chip"
        :maxSelectedLabels="3"
        :placeholder="$t('Select_sub_category')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="minimum_price_range">
        {{ $t("minimum_price_range") }}
        <span class="tooltip">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C13.125 16.5 16.5 13.125 16.5 9C16.5 4.875 13.125 1.5 9 1.5C4.875 1.5 1.5 4.875 1.5 9C1.5 13.125 4.875 16.5 9 16.5Z"
              stroke="#E80306"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 6V9.75"
              stroke="#E80306"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.99609 12H9.00283"
              stroke="#E80306"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="tooltip-text">
            {{ $t("minimum_price_range") }}
          </span>
        </span>
      </label>
      <input
        type="number"
        inputmode="numeric"
        class="input"
        min="0"
        v-model="basicInformation.minimumPriceRange"
        :placeholder="$t('minimum_price_range')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="maximum_price_range">
        {{ $t("maximum_price_range") }}
        <span class="tooltip">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C13.125 16.5 16.5 13.125 16.5 9C16.5 4.875 13.125 1.5 9 1.5C4.875 1.5 1.5 4.875 1.5 9C1.5 13.125 4.875 16.5 9 16.5Z"
              stroke="#E80306"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 6V9.75"
              stroke="#E80306"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.99609 12H9.00283"
              stroke="#E80306"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="tooltip-text">
            {{ $t("maximum_price_range") }}
          </span>
        </span>
      </label>
      <input
        type="number"
        inputmode="numeric"
        class="input"
        min="0"
        v-model="basicInformation.maximumPriceRange"
        :placeholder="$t('maximum_price_range')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-2">
    <div class="input-wrapper">
      <label class="input-label" for="description">
        {{ $t("description") }}
      </label>
      <textarea
        class="input"
        v-model="basicInformation.description"
        :placeholder="$t('description')"
      />
    </div>
  </div>
</template>

<style scoped></style>
