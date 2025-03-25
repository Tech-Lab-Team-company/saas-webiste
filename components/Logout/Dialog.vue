<script setup lang="ts">
import Dialog from "primevue/dialog";
import LogoutController from "~/features/LogoutFeature/presentation/controllers/logout_controller";

const visible = ref(false);

const router = useRouter();

const logoutController = LogoutController.getInstance();

const logout = async () => {
  await logoutController.Logout(router);
};
</script>

<template>
  <button type="button" @click="visible = true" class="flex items-center gap-2">
    <span>
      <svg
        width="19"
        height="20"
        viewBox="0 0 19 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3 2.08325H11.2417C8.70833 2.08325 7.125 3.66659 7.125 6.19992V9.40617H10.64L9.00125 7.76742C8.8825 7.64867 8.82708 7.49825 8.82708 7.34783C8.82708 7.19742 8.8825 7.047 9.00125 6.92825C9.23083 6.69867 9.61083 6.69867 9.84042 6.92825L12.4925 9.58034C12.7221 9.80992 12.7221 10.1899 12.4925 10.4195L9.84042 13.0716C9.61083 13.3012 9.23083 13.3012 9.00125 13.0716C8.77167 12.842 8.77167 12.462 9.00125 12.2324L10.64 10.5937H7.125V13.7999C7.125 16.3333 8.70833 17.9166 11.2417 17.9166H13.2921C15.8254 17.9166 17.4088 16.3333 17.4088 13.7999V6.19992C17.4167 3.66659 15.8333 2.08325 13.3 2.08325Z"
          fill="#546881"
        />
        <path
          d="M2.17676 9.40625C1.85217 9.40625 1.58301 9.67542 1.58301 10C1.58301 10.3246 1.85217 10.5938 2.17676 10.5938H7.12467V9.40625H2.17676Z"
          fill="#546881"
        />
      </svg>
    </span>
    <span class="link">
      {{ $t("logout") }}
    </span>
  </button>

  <Dialog v-model:visible="visible" modal>
    <template #container>
      <div class="dialog-logout-wrapper">
        <NuxtImg src="logout.png" alt="logout" format="webp" />
        <h4>{{ $t("Are_you_sure_youre_log_out") }}</h4>
        <p>
          {{
            $t(
              "Now_youre_about_to_log_out_You_can_log_in_again_with_ease_by_logging_in",
            )
          }}
        </p>
        <div class="actions grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            class="primary-button-2 col-span-1 md:col-span-2"
            @click="logout"
          >
            {{ $t("logout") }}
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
