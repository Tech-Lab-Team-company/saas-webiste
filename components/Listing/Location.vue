<script setup lang="ts">
import { useNuxtApp } from "#app";
import Select from "primevue/select";
import LocationParams from "~/features/ListingFeature/Core/Params/location_params";
import CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import FetchCountriesController from "~/features/FetchCountriesFeature/presentation/controllers/fetch_countries_controller";
import FetchCountriesParams from "~/features/FetchCountriesFeature/Core/Params/fetch_countries_params";
import FetchCitiesController from "~/features/FetchCitiesFeature/presentation/controllers/fetch_cities_controller";
import CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";
import FetchCitiesParams from "~/features/FetchCitiesFeature/Core/Params/fetch_cities_params";
import type LocationModel from "~/features/ListingFeature/Data/models/location_model";

const { $googleMaps } = useNuxtApp();

const props = defineProps<{ location?: LocationModel | null }>();

// Initialize `location` based on props
const location = ref<LocationParams>(
  props.location
    ? new LocationParams(
        props.location.lat ?? -34.3974,
        props.location.lng ?? 150.644,
        props.location.address ?? "",
          props.location.friendlyAddress,
        "",
        props.location.googleMapId ?? "",
        new CountryModel(
          props.location.country?.id ?? 0,
          props.location.country?.title ?? "",
          "",
        ),
        new CityModel(
          props.location.city?.id ?? 0,
          props.location.city?.title ?? "",
          "",
        ),
      )
    : new LocationParams(
        -34.3974,
        150.644,
        "",
        "",
        "",
        "",
        new CountryModel(0, "", ""),
        new CityModel(0, "", ""),
      ),
);

const searchAddress = ref([]);
const showSearchAddress = ref(false);

const emit = defineEmits<{
  (e: "update:location", location: LocationParams): void;
}>();

watch(
  () => location.value,
  () => {
    // console.log(basicInformation.value);
    emit("update:location", location.value);
  },
  { deep: true, immediate: true },
);

const initMap = async () => {
  try {
    const google = await $googleMaps.load();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: location.value.latitude, lng: location.value.longitude },
        zoom: 8,
      },
    );
    const marker = new google.maps.Marker({
      position: { lat: location.value.latitude, lng: location.value.longitude },
      map,
      draggable: true, // Makes the marker draggable
      icon: {
        url: "/marker.png",
        scaledSize: new google.maps.Size(50, 50), // Resize the icon
      },
    });

    const fetchAddress = async (latitude: number, longitude: number) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === "OK" && results.length > 0) {
            const address = results[0].formatted_address; // Full address
            const placeId = results[0].place_id; // Google Place ID
            // console.log("Address:", address);
            // console.log("Place ID:", placeId);
            location.value.address = address;
            location.value.googlePlaceId = placeId;
            // getPlaceDetails(placeId);
          } else {
            console.error("Geocoder failed due to:", status);
          }
        },
      );
    };

    marker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      location.value.latitude = newLat;
      location.value.longitude = newLng;

      fetchAddress(newLat, newLng); // Fetch address and place ID
    });
  } catch (error) {
    console.error("Error loading Google Maps:", error);
  }
};

// const getPlaceDetails = async (placeId: string) => {
//   try {
//     const google = await $googleMaps.load(); // Load Google Maps API from the plugin
//
//     const service = new google.maps.places.PlacesService(
//       document.createElement("div"), // Dummy element required by PlacesService
//     );
//
//     return new Promise((resolve, reject) => {
//       service.getDetails(
//         {
//           placeId,
//           fields: ["name", "formatted_address", "rating", "reviews"], // Specify fields
//         },
//         (place, status) => {
//           if (status === google.maps.places.PlacesServiceStatus.OK) {
//             resolve(place);
//           } else {
//             reject(`Failed to fetch place details: ${status}`);
//           }
//         },
//       );
//     });
//   } catch (error) {
//     console.error("Error fetching place details:", error);
//     throw error;
//   }
// };

const getLatLngFromPlaceId = async (placeId: string) => {
  const google = await $googleMaps.load();
  const service = new google.maps.places.PlacesService(
    document.createElement("div"),
  );

  return new Promise((resolve, reject) => {
    service.getDetails({ placeId, fields: ["geometry"] }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const location = place.geometry?.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        reject(`Failed to fetch lat/lng: ${status}`);
      }
    });
  });
};

const searchGoogleAddress = async () => {
  try {
    const google = await $googleMaps.load(); // Load Google Maps API from the plugin
    const service = new google.maps.places.AutocompleteService();
    const results = await service.getPlacePredictions({
      input: location.value.address,
      types: [],
    });

    // console.log(results);

    // Map results and fetch latitude/longitude for each place_id
    const searchAddressPromises = results.predictions.map(async (result) => {
      const latLng = await getLatLngFromPlaceId(result.place_id);
      return {
        name: result.description,
        placeId: result.place_id,
        description: result.description,
        lat: latLng.lat,
        lng: latLng.lng,
      };
    });

    // Wait for all Promises to resolve
    searchAddress.value = await Promise.all(searchAddressPromises);
    showSearchAddress.value = true;
    // console.log(searchAddress.value);
  } catch (error) {
    console.error("Error searching Google address:", error);
  }
};

// // Example Place ID
// const placeId = "ChIJN1t_tDeuEmsRUsoyG83frY4"; // Replace with a valid Place ID
// getPlaceDetails(placeId);

const setLocation = (address: any) => {
  location.value.address = address.description;
  location.value.googlePlaceId = address.placeId;
  location.value.latitude = address.lat;
  location.value.longitude = address.lng;
  showSearchAddress.value = false;
  initMap();
};

onMounted(() => {
  initMap();
});

//fetch countries
const countries = ref<CountryModel[]>([]);
const fetchCountriesController = FetchCountriesController.getInstance();

const fetchCountries = async () => {
  countries.value = (
    await fetchCountriesController.fetchCountries(
      new FetchCountriesParams(1, 10),
    )
  ).value.data!;
};

onMounted(async () => {
  await fetchCountries();
});

// fetch cities
const cities = ref<CityModel[]>([]);
const fetchCitiesController = FetchCitiesController.getInstance();

const fetchCities = async () => {
  cities.value = (
    await fetchCitiesController.fetchCities(
      new FetchCitiesParams(location.value.country.id, 1, 10),
    )
  ).value.data!;
};

const { getLocation } = useGeolocation();

onMounted(async () => {
  if (!props.location) {
    const { latitude: lat, longitude: lng } = await getLocation();
    location.value.latitude = lat;
    location.value.longitude = lng;
    initMap();
  }
});

onMounted(async () => {
  await fetchCities();
});

const close = () => {
  console.log("close");
  showSearchAddress.value = false;
  searchAddress.value = [];
};
</script>

<template>
  <div class="col-span-1 md:col-span-2">
    <div id="map" class="rounded-xl" style="width: 100%; height: 290px"></div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="listing_title">
        {{ $t("address") }}
      </label>
      <input
        class="input"
        v-model="location.address"
        :placeholder="$t('Search_Address')"
        @input="searchGoogleAddress"
      />
      <ul class="search-list" v-if="searchAddress && showSearchAddress">
        <li
          v-for="address in searchAddress"
          :key="address.place_id"
          @click="setLocation(address)"
          @click.self="close"
        >
          {{ address.description }}
        </li>
      </ul>
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="listing_title">
        {{ $t("friendly_address") }}
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
            {{ $t("friendly_address") }}
          </span>
        </span>
      </label>
      <input
        type="text"
        class="input"
        v-model="location.friendlyAddress"
        :placeholder="$t('friendly_address')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-2">
    <div class="input-wrapper">
      <label class="input-label" for="google_map_place_id">
        {{ $t("google_map_place_id") }}
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
            {{ $t("google_map_place_id") }}
          </span>
        </span>
      </label>
      <input
        type="text"
        class="input"
        v-model="location.googlePlaceId"
        :placeholder="$t('friendly_address')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <div class="input-wrapper">
        <label class="input-label" for="time_zone">
          {{ $t("countries") }}
        </label>
        <Select
          v-model="location.country"
          :options="countries"
          optionLabel="title"
          @update:modelValue="fetchCities"
          :placeholder="$t('Select_a_country')"
        />
      </div>
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <div class="input-wrapper">
        <label class="input-label" for="time_zone">
          {{ $t("region") }}
        </label>
        <Select
          v-model="location.city"
          :options="cities"
          optionLabel="title"
          :placeholder="$t('Select_a_region')"
        />
      </div>
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="longitude">
        {{ $t("longitude") }}
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
            {{ $t("longitude") }}
          </span>
        </span>
      </label>
      <input
        type="text"
        class="input"
        v-model="location.longitude"
        :placeholder="$t('longitude')"
      />
    </div>
  </div>
  <div class="col-span-1 md:col-span-1">
    <div class="input-wrapper">
      <label class="input-label" for="latitude">
        {{ $t("latitude") }}
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
            {{ $t("latitude") }}
          </span>
        </span>
      </label>
      <input
        type="text"
        class="input"
        v-model="location.latitude"
        :placeholder="$t('latitude')"
      />
    </div>
  </div>
</template>
