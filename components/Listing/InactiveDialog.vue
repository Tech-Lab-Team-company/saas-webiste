<script setup lang="ts">
import Dialog from "primevue/dialog";
import LogoutController from "~/features/LogoutFeature/presentation/controllers/logout_controller";
import InactiveController from "~/features/ListingFeature/Presentation/controllers/inactive_listing_controller";
import InactiveParams from "~/features/ListingFeature/Core/Params/inactive_params";

const visible = ref(false);

const router = useRouter();
const emit = defineEmits(["updateDialog"]);
const props = defineProps<{
  listingId: number;
}>()
const inactiveController = InactiveController.getInstance();

const logout = async () => {
  try {

  await inactiveController.inactiveListing(
      new InactiveParams(
          props.listingId,
      )
  );

  visible.value = false;
  emit("updateDialog");
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <li class="dropdown-item" @click="visible = true">
    <span>
      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.9999 4.98828C13.9866 4.98828 13.9666 4.98828 13.9466 4.98828C10.4199 4.63495 6.89994 4.50161 3.41328 4.85495L2.05328 4.98828C1.77328 5.01495 1.52661 4.81495 1.49994 4.53495C1.47328 4.25495 1.67328 4.01494 1.94661 3.98828L3.30661 3.85495C6.85328 3.49495 10.4466 3.63494 14.0466 3.98828C14.3199 4.01494 14.5199 4.26161 14.4933 4.53495C14.4733 4.79495 14.2533 4.98828 13.9999 4.98828Z" fill="#E80306"/>
<path d="M5.66651 4.31203C5.63984 4.31203 5.61318 4.31203 5.57984 4.30536C5.31318 4.2587 5.12651 3.9987 5.17318 3.73203L5.31984 2.8587C5.42651 2.2187 5.57318 1.33203 7.12651 1.33203H8.87318C10.4332 1.33203 10.5798 2.25203 10.6798 2.86536L10.8265 3.73203C10.8732 4.00536 10.6865 4.26536 10.4198 4.30536C10.1465 4.35203 9.88651 4.16536 9.84651 3.8987L9.69984 3.03203C9.60651 2.45203 9.58651 2.3387 8.87984 2.3387H7.13318C6.42651 2.3387 6.41318 2.43203 6.31318 3.02536L6.15984 3.89203C6.11984 4.1387 5.90651 4.31203 5.66651 4.31203Z" fill="#E80306"/>
<path d="M10.1401 15.6677H5.8601C3.53343 15.6677 3.4401 14.381 3.36676 13.341L2.93343 6.62769C2.91343 6.35436 3.12676 6.11436 3.4001 6.09436C3.6801 6.08103 3.91343 6.28769 3.93343 6.56103L4.36676 13.2744C4.4401 14.2877 4.46676 14.6677 5.8601 14.6677H10.1401C11.5401 14.6677 11.5668 14.2877 11.6334 13.2744L12.0668 6.56103C12.0868 6.28769 12.3268 6.08103 12.6001 6.09436C12.8734 6.11436 13.0868 6.34769 13.0668 6.62769L12.6334 13.341C12.5601 14.381 12.4668 15.6677 10.1401 15.6677Z" fill="#E80306"/>
<path d="M9.10672 12H6.88672C6.61339 12 6.38672 11.7733 6.38672 11.5C6.38672 11.2267 6.61339 11 6.88672 11H9.10672C9.38005 11 9.60672 11.2267 9.60672 11.5C9.60672 11.7733 9.38005 12 9.10672 12Z" fill="#E80306"/>
<path d="M9.66683 9.33203H6.3335C6.06016 9.33203 5.8335 9.10536 5.8335 8.83203C5.8335 8.5587 6.06016 8.33203 6.3335 8.33203H9.66683C9.94016 8.33203 10.1668 8.5587 10.1668 8.83203C10.1668 9.10536 9.94016 9.33203 9.66683 9.33203Z" fill="#E80306"/>
</svg>

    </span>
    <span class="link">
      {{ $t("inactive") }}
    </span>
  </li>

  <Dialog v-model:visible="visible" modal>
    <template #container>
      <div class="dialog-logout-wrapper">
        <NuxtImg src="trash.png" alt="logout" format="webp" />
        <h4>{{ $t("Are_you_sure_youre_inactive") }}</h4>
        <p>
          {{
            $t(
                "Now_youre_about_to_inactive_Your_listing_but_will_be_not_hidden_from_users",
            )
          }}
        </p>
        <div class="actions grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
              type="button"
              class="primary-button-2 col-span-1 md:col-span-2"
              @click="logout"
          >
            {{ $t("inactive") }}
          </button>
          <button
              type="button"
              class="secondary-button col-span-1"
              @click="visible = false"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
