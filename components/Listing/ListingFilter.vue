<script setup lang="ts">
import Slider from "primevue/slider";
import FilterListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/filter_listing_builder";
import FetchCountriesParams from "~/features/FetchCountriesFeature/Core/Params/fetch_countries_params";
import FetchCountriesController from "~/features/FetchCountriesFeature/presentation/controllers/fetch_countries_controller";
import type CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import debouncing from "~/base/persention/utils/debounce";
import FetchCitiesController from "~/features/FetchCitiesFeature/presentation/controllers/fetch_cities_controller";
import type CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";
import FetchCitiesParams from "~/features/FetchCitiesFeature/Core/Params/fetch_cities_params";
import SearchListingController from "~/features/ListingFeature/Presentation/controllers/search_listing_controller";
import { FilterStrategy } from "~/features/ListingFeature/Presentation/strategies/filter_strategy";
import { useI18n } from "vue-i18n";
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import FetchCategoriesController from "~/features/FetchCategoriesFeature/presentation/controllers/fetch_categories_controller";
import FetchCategoriesParams from "~/features/FetchCategoriesFeature/Core/Params/fetch_categories_params";

import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";

const { t: $t } = useI18n();

// Reactive state for filters
const withDistance = ref<boolean>(false);
const withPrice = ref<boolean>(false);
const distance = ref(3);
const priceRange = ref<[]>([200, 1600]);
const address = ref<string>("");

// Applied filters
const appliedFilters = ref<{ key: string; value: string | number }[]>([]);

// Selected filters
const selectedStatus = ref<number | null>(null);
const selectedCountry = ref<number | null>(null);
const selectedCity = ref<number | null>(null);
const selectedRate = ref<number | null>(null);
const selectCategory = ref<number | null>(null);

const categories = ref<CategoryModel[]>([]);
const fetchCategoriesController = FetchCategoriesController.getInstance();

const { getLocation } = useGeolocation();

// Computed property to display applied filters
const filteredItems = computed(() => {
  return appliedFilters.value.map((item) => {
    if (item.key === "status") {
      return item.value == "Open" ? $t("Open") : $t("Closed");
    }
    if (item.key === "rate") {
      return `${item.value} ${$t("stars")}`;
    }
    if (item.key === "country") {
      const countryId = parseInt(item.value); // Convert to number
      return (
        countries.value.find((country) => country.id === countryId)?.title ||
        item.value
      );
    }
    if (item.key === "city") {
      const cityId = parseInt(item.value); // Convert to number
      return (
        cities.value.find((city) => city.id === cityId)?.title || item.value
      );
    }
    return `${item.value}`;
  });
});
// Filter Listing Params Builder and Controller
const filterListingParamsBuilder = FilterListingParamsBuilder.Instance;
const searchListingController = SearchListingController.getInstance();
searchListingController.setStrategy(new FilterStrategy());

// Helper function to remove existing filter of the same type
const removeExistingFilter = (key: string) => {
  const index = appliedFilters.value.findIndex((filter) => filter.key === key);
  if (index !== -1) {
    appliedFilters.value.splice(index, 1);
  }
};

// Filter functions
const filterStatus = async (e: Event) => {
  const status = parseInt((e.target as HTMLInputElement).value);
  // console.log("Selected Status:", status); // Debugging line
  selectedStatus.value = status;

  // Remove existing status filter
  removeExistingFilter("status");

  // Add new status filter
  let statusText = "";
  if (status === 1) {
    // console.log("Open"); // Debugging line
    statusText = $t("Open");
  } else if (status === 2) {
    statusText = $t("Closed");
  } else {
    console.error("Invalid status value:", status); // Handle unexpected values
  }

  appliedFilters.value.push({
    key: "status",
    value: statusText,
  });

  const { latitude: lat, longitude: lng } = await getLocation();

  filterListingParamsBuilder.setStatus(status);
  filterListingParamsBuilder.setLat(lat);
  filterListingParamsBuilder.setLng(lng);
  searchListingController.executeStrategy(filterListingParamsBuilder.build());
};

const filterCountry = async (e: Event) => {
  const countryId = parseInt((e.target as HTMLInputElement).value);
  selectedCountry.value = countryId;

  // Remove existing country filter
  removeExistingFilter("country");

  // Add new country filter
  appliedFilters.value.push({
    key: "country",
    value: countries.value.find((c) => c.id === countryId)?.title || "",
  });

  const { latitude: lat, longitude: lng } = await getLocation();

  filterListingParamsBuilder.setLat(lat);
  filterListingParamsBuilder.setLng(lng);
  filterListingParamsBuilder.setCountryId(countryId);
  await fetchCities(countryId);
  await searchListingController.executeStrategy(
    filterListingParamsBuilder.build(),
  );
};

const filterCity = async (e: Event) => {
  const cityId = parseInt((e.target as HTMLInputElement).value);
  selectedCity.value = cityId;

  // Remove existing city filter
  removeExistingFilter("city");

  // Add new city filter
  appliedFilters.value.push({
    key: "city",
    value: cities.value.find((c) => c.id === cityId)?.title || "",
  });

  const { latitude: lat, longitude: lng } = await getLocation();

  filterListingParamsBuilder.setLat(lat);
  filterListingParamsBuilder.setLng(lng);
  filterListingParamsBuilder.setCityId(cityId);
  await searchListingController.executeStrategy(
    filterListingParamsBuilder.build(),
  );
};

const filterRate = async (e: Event) => {
  const rate = parseInt((e.target as HTMLInputElement).value);
  selectedRate.value = rate;

  // Remove existing rate filter
  removeExistingFilter("rate");

  // Add new rate filter
  appliedFilters.value.push({ key: "rate", value: rate });

  const { latitude: lat, longitude: lng } = await getLocation();

  filterListingParamsBuilder.setLat(lat);
  filterListingParamsBuilder.setLng(lng);
  filterListingParamsBuilder.setRate(rate);
  searchListingController.executeStrategy(filterListingParamsBuilder.build());
};

const filterDistance = async () => {
  const { latitude: lat, longitude: lng } = await getLocation();
  filterListingParamsBuilder.setLat(lat);
  filterListingParamsBuilder.setLng(lng);
  filterListingParamsBuilder.setDistance(distance.value);
  await searchListingController.executeStrategy(
    filterListingParamsBuilder.build(),
  );
};
const filterDistanceDebounced = debouncing(filterDistance);
const filterDistanceOn = async () => {
  await filterDistanceDebounced.debouncedFunction();
};

const filterPriceRange = async () => {
  const { latitude: lat, longitude: lng } = await getLocation();
  filterListingParamsBuilder.setLat(lat);
  filterListingParamsBuilder.setLng(lng);
  filterListingParamsBuilder.setPriceRange(priceRange.value);
  await searchListingController.executeStrategy(
    filterListingParamsBuilder.build(),
  );
};
const filterPriceRangeDebounced = debouncing(filterPriceRange);
const filterPriceRangeOn = async () => {
  await filterPriceRangeDebounced.debouncedFunction();
};

const filterAddress = async () => {
  filterListingParamsBuilder.setAddress(address.value);
  await searchListingController.executeStrategy(
    filterListingParamsBuilder.build(),
  );
};
const filterAddressDebounced = debouncing(filterAddress);
const filterAddressOn = async () => {
  await filterAddressDebounced.debouncedFunction();
};

// Fetch countries
const countries = ref<CountryModel[]>([]);
const fetchCountriesController = FetchCountriesController.getInstance();
const fetchCountries = async () => {
  countries.value = (
    await fetchCountriesController.fetchCountries(
      new FetchCountriesParams(1, 10),
    )
  ).value.data!;
};

// Fetch cities
const cities = ref<CityModel[]>([]);
const fetchCitiesController = FetchCitiesController.getInstance();
const fetchCities = async (id: number = 1) => {
  cities.value = (
    await fetchCitiesController.fetchCities(new FetchCitiesParams(id, 1, 10))
  ).value.data!;
};

onMounted(async () => {
  await fetchCities();
});

// Clear all filters
const clearFilters = () => {
  appliedFilters.value = [];
  selectedStatus.value = null;
  selectedCountry.value = null;
  selectedCity.value = null;
  selectedRate.value = null;
  distance.value = 3;
  priceRange.value = [200, 1600];
  address.value = "";

  // Execute strategy with default state
  searchListingController.executeStrategy(filterListingParamsBuilder.build());
};

// Remove a specific filter
const removeFilter = (index: number) => {
  // Remove the filter at the specified index
  const removedFilter = appliedFilters.value.splice(index, 1)[0];

  // Reset the corresponding selected filter
  switch (removedFilter.key) {
    case "status":
      selectedStatus.value = null;
      break;
    case "country":
      selectedCountry.value = null;
      cities.value = []; // Clear cities if the country is removed
      break;
    case "city":
      selectedCity.value = null;
      break;
    case "category":
      selectCategory.value = null;
      break;
    case "rate":
      selectedRate.value = null;
      break;
  }

  // Rebuild the filter parameters
  filterListingParamsBuilder.reset();
  appliedFilters.value.forEach((filter) => {
    switch (filter.key) {
      case "status":
        filterListingParamsBuilder.setStatus(
          filter.value === $t("Open") ? 1 : 2,
        );
        break;
      case "country": {
        const country = countries.value.find((c) => c.title === filter.value);
        if (country) filterListingParamsBuilder.setCountryId(country.id);
        break;
      }
      case "city": {
        const city = cities.value.find((c) => c.title === filter.value);
        if (city) filterListingParamsBuilder.setCityId(city.id);
        break;
      }
      case "category": {
        const category = categories.value.find((c) => c.title === filter.value);
        if (category) filterListingParamsBuilder.setCityId(category.id);
        break;
      }
      case "rate":
        filterListingParamsBuilder.setRate(filter.value as number);
        break;
    }
  });

  // Execute the strategy with the updated filter params
  searchListingController.executeStrategy(filterListingParamsBuilder.build());
};
onMounted(async () => {
  await fetchCountries();
});

const fetchCategories = async () => {
  categories.value = (
    await fetchCategoriesController.fetchCategories(
      new FetchCategoriesParams(1, 100),
    )
  ).value.data!;
  // console.log(categories.value);
};

onMounted(async () => {
  await fetchCategories();
  getCategory();
});

const getCategory = () => {
  if (filterListingParamsBuilder.categoryId) {
    // console.log(categories.value, "ssss");
    appliedFilters.value.push({
      key: "category",
      value:
        categories.value.find(
          (c) => c.id == filterListingParamsBuilder.categoryId,
        )?.title || "",
    });
    selectCategory.value = filterListingParamsBuilder.categoryId;
  }
};
const displayedCount = ref(5);

const showMore = () => {
  if (displayedCount.value >= cities.value.length) {
    return;
  }
  displayedCount.value += 3; // Show 3 more reviews
};
</script>

<template>
  <aside class="listing-filter">
    <div class="flex gap-2 items-center">
      <IconsFilterSetting />
      <h2 class="filter-title">{{ $t("Filters") }}</h2>
    </div>
    <div class="applied-filter">
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("Applied_Filters") }}</h3>
        <button type="button" class="clear-filter" @click="clearFilters">
          {{ $t("Clear_Filters") }}
        </button>
      </div>
      <div class="filtered-items">
        <span
          class="filtered-item"
          v-for="(filter, index) in filteredItems"
          :key="index"
        >
          {{ filter }}
          <button
            class="remove"
            type="button"
            @click="removeFilter(index)"
            aria-label="remove"
          >
            <IconsRemove />
          </button>
        </span>
      </div>
    </div>
    <div class="applied-filter">
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("Current_status") }}</h3>
      </div>
      <div class="filter-items">
        <div class="filter-item">
          <input
            type="radio"
            @change="filterStatus"
            id="open"
            name="status"
            class="hidden"
            :value="1"
            :checked="selectedStatus === 1"
          />
          <label for="open" class="filter-item"> {{ $t("Open") }} </label>
        </div>
        <div class="filter-item">
          <input
            type="radio"
            @change="filterStatus"
            id="close"
            name="status"
            class="hidden"
            :value="2"
            :checked="selectedStatus === 2"
          />
          <label for="close" class="filter-item"> {{ $t("Closed") }} </label>
        </div>
      </div>
    </div>
    <div>
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("state") }}</h3>
      </div>
      <div class="filter-items">
        <span
          class="filter-item"
          v-for="country in countries"
          :key="country?.id"
        >
          <input
            type="radio"
            :id="`country${country?.id}`"
            name="country"
            class="hidden"
            @change="filterCountry"
            :value="country.id"
            :checked="selectedCountry === country.id"
          />
          <label :for="`country${country?.id}`">
            {{ country?.title }}
          </label>
        </span>
      </div>
    </div>
    <div>
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("region") }}</h3>
      </div>
      <div class="filter-items">
        <span
          class="filter-item"
          v-for="city in cities.slice(0, displayedCount)"
          :key="city?.id"
        >
          <input
            type="radio"
            :id="`city${city?.id}`"
            name="city"
            @change="filterCity"
            :value="city?.id"
            class="hidden"
            :checked="selectedCity === city.id"
          />
          <label :for="`city${city?.id}`">
            {{ city?.title }}
          </label>
        </span>
      </div>
      <button
        v-if="cities.length > 5"
        type="button"
        class="clear-filter"
        @click="showMore"
      >
        {{ $t("show_more") }}
      </button>
    </div>
    <div>
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("Rating") }}</h3>
      </div>
      <div class="filter-items">
        <span class="filter-item">
          <input
            type="radio"
            id="1"
            name="rate"
            class="hidden"
            :value="1"
            @change="filterRate"
            :checked="selectedRate === 1"
          />
          <label for="1"> 1 <IconsStar /> </label>
        </span>
        <span class="filter-item">
          <input
            type="radio"
            @change="filterRate"
            id="2"
            name="rate"
            class="hidden"
            :value="2"
            :checked="selectedRate === 2"
          />
          <label for="2"> 2 <IconsStar /> </label>
        </span>
        <span class="filter-item">
          <input
            type="radio"
            @change="filterRate"
            id="3"
            name="rate"
            class="hidden"
            :value="3"
            :checked="selectedRate === 3"
          />
          <label for="3"> 3 <IconsStar /> </label>
        </span>
        <span class="filter-item">
          <input
            type="radio"
            @change="filterRate"
            id="4"
            name="rate"
            class="hidden"
            :value="4"
            :checked="selectedRate === 4"
          />
          <label for="4"> 4 <IconsStar /> </label>
        </span>
        <span class="filter-item">
          <input
            type="radio"
            @change="filterRate"
            id="5"
            name="rate"
            class="hidden"
            :value="5"
            :checked="selectedRate === 5"
          />
          <label for="5"> 5 <IconsStar /> </label>
        </span>
      </div>
    </div>
    <div class="range-filter">
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("distance_radius") }}</h3>
      </div>
      <div class="input-wrapper-switch flex justify-end">
        <div class="switch">
          <input type="checkbox" v-model="withDistance" id="distance" />
          <label for="distance" class="slider"></label>
        </div>
      </div>
      <div class="range">
        <span>1 Km</span>
        <span>150 Km</span>
      </div>
      <div class="range-slider">
        <Slider
          v-model="distance"
          :disabled="!withDistance"
          @update:modelValue="filterDistanceOn"
          :max="150"
        />
      </div>
    </div>
    <div class="range-filter">
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("price_range") }}</h3>
      </div>
      <div class="input-wrapper-switch flex justify-end">
        <div class="switch">
          <input type="checkbox" id="price_range" v-model="withPrice" />
          <label for="price_range" class="slider"></label>
        </div>
      </div>
      <div class="range">
        <span>100 $</span>
        <span>2000 $</span>
      </div>
      <div class="range-slider">
        <Slider
          v-model="priceRange"
          @update:modelValue="filterPriceRangeOn"
          range
          :disabled="!withPrice"
          :min="100"
          :max="2000"
        />
      </div>
    </div>
    <div>
      <div class="flex items-center justify-between">
        <h3 class="filter-title">{{ $t("On Map") }}</h3>
      </div>
      <div class="filter-items">
        <div class="input-wrapper">
          <label class="input-label" for="category">
            {{ $t("address") }}
          </label>
          <input
            type="text"
            class="input"
            id="category"
            @keyup="filterAddressOn"
            v-model="address"
            :placeholder="$t('enter_address')"
          />
        </div>
      </div>
    </div>
  </aside>
  <div class="listing-filter-accordion">
    <Accordion>
      <AccordionPanel value="0">
        <AccordionHeader>
          <div class="flex gap-2 items-center">
            <IconsFilterSetting />
            <h2 class="filter-title">{{ $t("Filters") }}</h2>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <div class="applied-filter">
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("Applied_Filters") }}</h3>
              <button type="button" class="clear-filter" @click="clearFilters">
                {{ $t("Clear_Filters") }}
              </button>
            </div>
            <div class="filtered-items">
              <span
                class="filtered-item"
                v-for="(filter, index) in filteredItems"
                :key="index"
              >
                {{ filter }}
                <button
                  class="remove"
                  type="button"
                  @click="removeFilter(index)"
                  aria-label="remove"
                >
                  <IconsRemove />
                </button>
              </span>
            </div>
          </div>
          <div class="applied-filter">
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("Current_status") }}</h3>
            </div>
            <div class="filter-items">
              <div class="filter-item">
                <input
                  type="radio"
                  @change="filterStatus"
                  id="open"
                  name="status"
                  class="hidden"
                  :value="1"
                  :checked="selectedStatus === 1"
                />
                <label for="open" class="filter-item"> {{ $t("Open") }} </label>
              </div>
              <div class="filter-item">
                <input
                  type="radio"
                  @change="filterStatus"
                  id="close"
                  name="status"
                  class="hidden"
                  :value="2"
                  :checked="selectedStatus === 2"
                />
                <label for="close" class="filter-item">
                  {{ $t("Closed") }}
                </label>
              </div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("state") }}</h3>
            </div>
            <div class="filter-items">
              <span
                class="filter-item"
                v-for="country in countries"
                :key="country?.id"
              >
                <input
                  type="radio"
                  :id="`country${country?.id}`"
                  name="country"
                  class="hidden"
                  @change="filterCountry"
                  :value="country.id"
                  :checked="selectedCountry === country.id"
                />
                <label :for="`country${country?.id}`">
                  {{ country?.title }}
                </label>
              </span>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("region") }}</h3>
            </div>
            <div class="filter-items">
              <span
                class="filter-item"
                v-for="city in cities.slice(0, displayedCount)"
                :key="city?.id"
              >
                <input
                  type="radio"
                  :id="`city${city?.id}`"
                  name="city"
                  @change="filterCity"
                  :value="city?.id"
                  class="hidden"
                  :checked="selectedCity === city.id"
                />
                <label :for="`city${city?.id}`">
                  {{ city?.title }}
                </label>
              </span>
            </div>
            <button
              v-if="cities.length > 5"
              type="button"
              class="clear-filter"
              @click="showMore"
            >
              {{ $t("show_more") }}
            </button>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("Rating") }}</h3>
            </div>
            <div class="filter-items">
              <span class="filter-item">
                <input
                  type="radio"
                  id="1"
                  name="rate"
                  class="hidden"
                  :value="1"
                  @change="filterRate"
                  :checked="selectedRate === 1"
                />
                <label for="1"> 1 <IconsStar /> </label>
              </span>
              <span class="filter-item">
                <input
                  type="radio"
                  @change="filterRate"
                  id="2"
                  name="rate"
                  class="hidden"
                  :value="2"
                  :checked="selectedRate === 2"
                />
                <label for="2"> 2 <IconsStar /> </label>
              </span>
              <span class="filter-item">
                <input
                  type="radio"
                  @change="filterRate"
                  id="3"
                  name="rate"
                  class="hidden"
                  :value="3"
                  :checked="selectedRate === 3"
                />
                <label for="3"> 3 <IconsStar /> </label>
              </span>
              <span class="filter-item">
                <input
                  type="radio"
                  @change="filterRate"
                  id="4"
                  name="rate"
                  class="hidden"
                  :value="4"
                  :checked="selectedRate === 4"
                />
                <label for="4"> 4 <IconsStar /> </label>
              </span>
              <span class="filter-item">
                <input
                  type="radio"
                  @change="filterRate"
                  id="5"
                  name="rate"
                  class="hidden"
                  :value="5"
                  :checked="selectedRate === 5"
                />
                <label for="5"> 5 <IconsStar /> </label>
              </span>
            </div>
          </div>
          <div class="range-filter">
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("distance_radius") }}</h3>
            </div>
            <div class="input-wrapper-switch flex justify-end">
              <div class="switch">
                <input type="checkbox" v-model="withDistance" id="distance" />
                <label for="distance" class="slider"></label>
              </div>
            </div>
            <div class="range">
              <span>1 Km</span>
              <span>150 Km</span>
            </div>
            <div class="range-slider">
              <Slider
                v-model="distance"
                :disabled="!withDistance"
                @update:modelValue="filterDistanceOn"
                :max="150"
              />
            </div>
          </div>
          <div class="range-filter">
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("price_range") }}</h3>
            </div>
            <div class="input-wrapper-switch flex justify-end">
              <div class="switch">
                <input type="checkbox" id="price_range" v-model="withPrice" />
                <label for="price_range" class="slider"></label>
              </div>
            </div>
            <div class="range">
              <span>100 $</span>
              <span>2000 $</span>
            </div>
            <div class="range-slider">
              <Slider
                v-model="priceRange"
                @update:modelValue="filterPriceRangeOn"
                range
                :disabled="!withPrice"
                :min="100"
                :max="2000"
              />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <h3 class="filter-title">{{ $t("On Map") }}</h3>
            </div>
            <div class="filter-items">
              <div class="input-wrapper">
                <label class="input-label" for="category">
                  {{ $t("address") }}
                </label>
                <input
                  type="text"
                  class="input"
                  id="category"
                  @keyup="filterAddressOn"
                  v-model="address"
                  :placeholder="$t('enter_address')"
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
