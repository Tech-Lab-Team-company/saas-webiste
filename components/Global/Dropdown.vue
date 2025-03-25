<script setup lang="ts">
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import FilterListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/filter_listing_builder";
import SearchListingController from "~/features/ListingFeature/Presentation/controllers/search_listing_controller";
import { FilterStrategy } from "~/features/ListingFeature/Presentation/strategies/filter_strategy";
import wordSlice from "~/base/persention/utils/word_slice";

const props = defineProps<{ categories: CategoryModel[] }>();

const searchListingController = SearchListingController.getInstance();
searchListingController.setStrategy(new FilterStrategy());

const filterListingParamsBuilder = FilterListingParamsBuilder.Instance;
const setCategory = async (id: number) => {
  const categoryIds = [];
  categoryIds.push(id);
  filterListingParamsBuilder.setCategoryID(categoryIds);
  await searchListingController.executeStrategy(
    filterListingParamsBuilder.build()
  );
};

const setSubCategory = async(id: number) => {
  const subCategoriesIds = [];
  subCategoriesIds.push(id);
  filterListingParamsBuilder.setSubCategoryID(subCategoriesIds);
  await searchListingController.executeStrategy(
    filterListingParamsBuilder.build()
  );
};

const showChildrenStates = ref<{ [key: number]: boolean }>({});

// Toggle the visibility of subcategories for a specific category
const toggleSubCategory = (categoryId: number) => {
  showChildrenStates.value = {};
  showChildrenStates.value[categoryId] = !showChildrenStates.value[categoryId];
  // showChildrenStates.value = {
  //   ...showChildrenStates.value,
  //   [categoryId]: !showChildrenStates.value[categoryId],
  // };
};
</script>
<template>
  <div class="dropdown-content">
    <ul>
      <li
        class="dropdown-item"
        v-for="(category, index) in categories"
        :key="index"
      >
        <button
          class="sub-category"
          v-if="category.subCategory.length > 0"
          @click="toggleSubCategory(category.id)"
          :class="{ active: showChildrenStates[category.id] }"
        >
          {{ wordSlice(category.title, 20) }}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_61_564)">
              <path
                d="M11.06 5.72656L8 8.7799L4.94 5.72656L4 6.66656L8 10.6666L12 6.66656L11.06 5.72656Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_61_564">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <ul
            class="sub-category-list right"
            v-if="showChildrenStates[category.id] && category.subCategory"
          >
            <li
              v-for="subCategory in category.subCategory"
              @click.stop="setSubCategory(subCategory.id)"
            >
              {{ wordSlice(subCategory.title, 20) }}
            </li>
          </ul>
        </button>
        <button v-else @click="setCategory(category.id)">
          {{ wordSlice(category.title, 20) }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
