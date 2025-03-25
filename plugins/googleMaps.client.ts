import { defineNuxtPlugin } from "#app";
import { Loader } from "@googlemaps/js-api-loader";

export default defineNuxtPlugin(() => {
  const loader = new Loader({
    apiKey: "AIzaSyCYG_OyFfymI3ER2N0u-Py1z6EIoZMRoYs", // Replace with your API key
    version: "weekly",
    libraries: ["places"], // Include the 'places' library
  });

  return {
    provide: {
      googleMaps: loader,
    },
  };
});
