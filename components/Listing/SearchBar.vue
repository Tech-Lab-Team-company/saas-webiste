<script setup lang="ts">
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import FetchCategoriesController from "~/features/FetchCategoriesFeature/presentation/controllers/fetch_categories_controller";
import FetchCategoriesParams from "~/features/FetchCategoriesFeature/Core/Params/fetch_categories_params";

const categories = ref<CategoryModel[]>([]);
const fetchCategoriesController = FetchCategoriesController.getInstance();

const fetchCategories = async () => {
  categories.value = (
    await fetchCategoriesController.fetchCategories(
      new FetchCategoriesParams(1, 10),
    )
  ).value.data!;
  console.log(categories.value);
};

onMounted(async () => {
  await fetchCategories();
});

const props = defineProps<{ listingsCount: number }>();
</script>

<template>
  <section class="search-bar">
    <div class="search-title">
      <h1 class="title">Pastry Shops :</h1>
      <span>{{ listingsCount }} results</span>
    </div>
    <div class="actions">
      <div class="dropdown">
        <button type="button" class="dropdown-button">
          {{ $t("category") }}
          <span>
            <IconsArrowDown />
          </span>
        </button>
        <GlobalDropdown :categories="categories" />
      </div>
      <!--      <div class="dropdown">-->
      <!--        <button type="button" class="dropdown-button">-->
      <!--          {{ $t("sort") }}-->
      <!--          <span>-->
      <!--            <IconsSort />-->
      <!--          </span>-->
      <!--        </button>-->
      <!--        <GlobalDropdown />-->
      <!--      </div>-->
    </div>
  </section>
</template>

<style scoped></style>
