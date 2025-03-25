<script setup lang="ts">
// import SearchBuilder from "~/features/ListingFeature/Presentation/Builder/search_builder";
import SearchListingController from "~/features/ListingFeature/Presentation/controllers/search_listing_controller";
import FilterListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/filter_listing_builder";
import { FilterStrategy } from "~/features/ListingFeature/Presentation/strategies/filter_strategy";
import PaginationModel from "@/base/core/Models/pagination_model";

const props = defineProps<{ showMap?: boolean }>();

const searchListingController = SearchListingController.getInstance();
const filterListingParamsBuilder = FilterListingParamsBuilder.Instance;

const state = ref(searchListingController.state.value);
const pagination = ref<PaginationModel | null>(null);
const { getLocation } = useGeolocation();

const searchListing = async (page = 1) => {
  try {
    // if (filterListingParamsBuilder.categoryId || filterListingParamsBuilder.subCategoryId) {
    searchListingController.setStrategy(new FilterStrategy());

    const { latitude: lat, longitude: lng } = await getLocation();
    filterListingParamsBuilder.setLat(lat!);
    filterListingParamsBuilder.setLng(lng!);
    filterListingParamsBuilder.setPage(page);
    await searchListingController.executeStrategy(
      filterListingParamsBuilder.build()
    );
    // } else {
    //   const { latitude: lat, longitude: lng } = await getLocation();
    //   searchBuilder.setLat(lat);
    //   searchBuilder.setLng(lng);
    //   const params = searchBuilder.build();
    //
    //
    //   await searchListingController.executeStrategy(params);
    // }
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  await searchListing();
});

watch(
  () => searchListingController.state.value,
  (newValue) => {
    state.value = newValue;
    if (
      state.value.pagination.last > 1 &&
      state.value.pagination?.total > 12
    ) {
      pagination.value = PaginationModel.fromMap(state.value.pagination); //
    }

    // console.log(newValue);
  },
  { deep: true }
);

// const map = ref(props.showMap);
</script>

<template>
  <section class="listing-search-content">
    <ListingSearchBar
      :listingsCount="
        state.data?.listings?.length ?? state.data?.similarListings?.length
      "
    />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="col-span-1">
        <ListingFilter />
      </div>
      <div
        :class="[
          'col-span-1',
          showMap
            ? 'md:col-span-1'
            : 'md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        ]"
      >
        <div
          v-if="state.data?.listings?.length === 0"
          :class="[
            'col-span-1',
            showMap ? 'md:col-span-1' : 'md:col-span-2 lg:col-span-3',
          ]"
        >
          <ListingNoListingSearch />
        </div>
        <GlobalDataStatues
          class="col-span-1 md:col-span-2 lg:col-span-3"
          :status="state"
        >
          <template #loader>
            <ListingLoadingCard class="col-span-1" v-for="i in 3" :key="i" />
          </template>
          <template #initial>
            <ListingLoadingCard class="col-span-1" v-for="i in 3" :key="i" />
          </template>
          <template #empty>
            <ListingNoListing />
          </template>
          <template #failed>
            <ListingNoListing />
          </template>
          <template #success>
            <div
              class="grid gap-4"
              :class="[
                'col-span-1',
                showMap
                  ? 'col-span-1'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              ]"
              v-if="state.data?.listings?.length > 0"
            >
              <ListingListCard
                v-for="listing in state.data?.listings"
                :key="listing.id"
                class="col-span-1"
                :listing="listing"
                :showMap="showMap"
              />
            </div>
            <div
              class="grid gap-4"
              :class="[
                'col-span-1',
                showMap
                  ? 'col-span-1'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              ]"
              v-else
            >
              <ListingListCard
                v-for="listing in state.data?.similarListings"
                :key="listing.id"
                class="col-span-1"
                :listing="listing"
                :showMap="showMap"
              />
            </div>
          </template>
        </GlobalDataStatues>
      </div>
      <div class="col-span-1 md:col-span-2" v-if="showMap">
        <ListingMap
          v-if="state.data?.listings.length > 0"
          :listings="state.data?.listings"
        />

        <ListingMap v-else :listings="state.data?.similarListings" />
      </div>
    </div>
    <GlobalPagination :pagination="pagination" @changePage="searchListing" />
  </section>
</template>

<style scoped></style>
