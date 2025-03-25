<script setup lang="ts">
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import SentMessageController from "~/features/ChatFeature/presentation/controllers/sent_message_controller";
import SentMessageParams from "~/features/ChatFeature/Core/Params/sent_message_params";

const props = defineProps<{
  id: string;
}>();
const visibleSentMessage = ref<boolean>(false);
const note = ref("");

const sentMessageController = SentMessageController.getInstance();
const sendMessage = async () => {
    try {
        sentMessageController.SentMessage(
            new SentMessageParams(
                props.id,
                note.value,
            )
        )
        visibleSentMessage.value = false;

    } catch (error) {
        console.error("Error sending message:", error);
    }
};

</script>

<template>
  <button type="button" class="primary-button" @click="visibleSentMessage = true">
    <!--    <IconsAddRate />-->
    {{ $t("sent_message") }}
  </button>

  <Dialog
    class="add-rating-dialog"
    v-model:visible="visibleSentMessage"
    :header="$t('add_claim')"
    modal
  >
    <h4>Take control of your listing!</h4>
    <p>
      Send a message to the owner of the listing to claim it.
    </p>
    <form class="mt-4" @submit.prevent="sendMessage">

      <div class="input-wrapper">
        <label class="input-label" for="note">{{ $t("note") }}</label>
        <textarea
          class="input"
          v-model="note"
          placeholder="Enter your password"
          id="note"
        />
      </div>
      <button type="submit" class="primary-button-2">
        {{ $t("claim_now") }}
      </button>
    </form>
  </Dialog>
</template>

<style scoped></style>
