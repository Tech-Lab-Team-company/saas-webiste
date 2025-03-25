import { ref } from "vue";

export function useGeolocation() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getLocation = (): Promise<{ latitude: number | null; longitude: number | null }> => {
    return new Promise((resolve) => {
      // Immediately check for Geolocation support
      if (!navigator.geolocation) {
        error.value = "Geolocation is not supported by your browser.";
        resolve({ latitude: null, longitude: null });
        return;
      }

      isLoading.value = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          isLoading.value = false;
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          isLoading.value = false;
          error.value = err.message;
          resolve({ latitude: null, longitude: null });
        }
      );
    });
  };

  return { getLocation, isLoading, error };
}