import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  let googleMapsPromise: ReturnType<
    InstanceType<typeof import("@googlemaps/js-api-loader").Loader>["load"]
  > | null = null;

  const googleMaps = {
    load() {
      googleMapsPromise ??= import("@googlemaps/js-api-loader").then(({ Loader }) => {
        const loader = new Loader({
          apiKey: "AIzaSyCYG_OyFfymI3ER2N0u-Py1z6EIoZMRoYs",
          version: "weekly",
          libraries: ["places"],
        });

        return loader.load();
      });

      return googleMapsPromise;
    },
  };

  return {
    provide: {
      googleMaps,
    },
  };
});
