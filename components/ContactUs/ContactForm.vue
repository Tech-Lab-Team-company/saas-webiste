<script setup lang="ts">
import { useNuxtApp } from "#app";
import ContactUsController from "~/features/ContactUsFeature/presentation/controllers/contact_us_controller";
import ContactUsParams from "~/features/ContactUsFeature/Core/Params/contact_us_params";

const { $googleMaps } = useNuxtApp();


const initMap = async () => {
  try {
    const google = await $googleMaps.load();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: Number(props.latitude), lng: Number(props.longitude) },
        zoom: 8,
      },
    );
    const marker = new google.maps.Marker({
      position: { lat: Number(props.latitude), lng: Number(props.longitude) },
      map,
      draggable: true, // Makes the marker draggable
      icon: {
        url: "/marker.png",
        scaledSize: new google.maps.Size(50, 50), // Resize the icon
      },
    });

  } catch (error) {
    console.error("Error loading Google Maps:", error);
  }
};

onMounted(() => {
  initMap();
});

const email = ref("");
const name = ref("");
const message = ref("");

const contactUsController = ContactUsController.getInstance();

const sentContactUs = async () => {
  try {

    await contactUsController.contactUs(
        new ContactUsParams(
            name.value,
            email.value,
            message.value,
        )
    );
  } catch (error) {
    // console.log(error);
  }
};

const props = defineProps<{
  latitude: number,
  longitude: number
}>();

</script>

<template>
  <div class="contact-form grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="form col-span-1">
      <form @submit.prevent="sentContactUs" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-1">
          <div class="input-wrapper">
            <label class="input-label" for="name">{{ $t("name") }}</label>
            <input
              class="input"
              placeholder="Enter your name"
              type="text"
              name="name"
              id="name"
              v-model="name"
            />
          </div>
        </div>
        <div class="col-span-1">
          <div class="input-wrapper">
            <label class="input-label" for="email">{{ $t("email") }}</label>
            <input
              class="input"
              type="text"
              placeholder="Enter your email"
              name="email"
              id="email"
              v-model="email"
            />
          </div>
        </div>
        <div class="col-span-1 md:col-span-2">
          <div class="input-wrapper">
            <label class="input-label" for="message">{{
              $t("type_a_message")
            }}</label>
            <textarea
              class="input h-64"
              placeholder="Type a message"
              type="text"
              name="message"
              id="message"
              v-model="message"
            />
          </div>
        </div>
        <div class="col-span-1 md:col-span-2">
          <button class="primary-button" >
            {{ $t("send") }}
          </button>
        </div>
      </form>
    </div>
    <div class="map col-span-1">
      <div id="map" class="rounded-xl" style="width: 100%; height: 345px"></div>
    </div>
  </div>
</template>

<style scoped></style>
