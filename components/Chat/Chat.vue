<script setup lang="ts">
import SentMessageController from "~/features/ChatFeature/presentation/controllers/sent_message_controller";
import SentMessageParams from "~/features/ChatFeature/Core/Params/sent_message_params";
import MessageModel from "~/features/ChatFeature/Data/models/message_model";
import FetchMessageParams from "~/features/ChatFeature/Core/Params/fetch_message_params";
import FetchMessageController from "~/features/ChatFeature/presentation/controllers/fetch_message_controller";
import type ChatUsersModel from "~/features/ChatFeature/Data/models/chat_users_model";

const sentMessageController = SentMessageController.getInstance();

const props = defineProps<{
  chat: ChatUsersModel;
}>();

const message = ref<string>("");
const Messages = ref<MessageModel[]>([]);

function formatDateToCustomString(date = new Date()) {
  // Extract date and time components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return the formatted string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const sendMessage = async () => {
  try {
    const now = new Date();
    const formattedDate = formatDateToCustomString(now);
    sentMessageController.SentMessage(
      new SentMessageParams(props.chat.receiverId, message.value),
    );
    scrollToBottom();

    Messages.value.push({
      id: Messages.value.length + 1,
      content: message.value,
      isFromMe: true,
      date: formattedDate,
    });
    message.value = "";

  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const fetchMessageController = FetchMessageController.getInstance();

const fetchMessage = async (id: number) => {
  await fetchMessageController.FetchMessage(new FetchMessageParams(id));
  scrollToBottom();
};

watch(
    () => fetchMessageController.state.value,
    async (newValue) => {
      Messages.value = newValue.data || [];
      await scrollToBottom();
    },
    { deep: true }
);


watch(
  () => props.chat,
  (newValue) => {
    // console.log(newValue);
    fetchMessage(newValue.id);
  },
  { deep: true },
);
const scrollToBottom = () => {
  const messages = document.querySelector(".messages");
  if (messages) {
    // console.log(messages.scrollHeight);
    messages.scrollTop = messages.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});

</script>

<template>
  <div class="chat col-span-1 lg:col-span-2" v-if="Messages.length > 0">
    <div class="users">
      <div class="user">
        <div class="user-img">
          <NuxtImg :src="props.chat.image" alt="User" />
        </div>
        <div class="content">
          <h3 class="user-name">{{ props.chat.name }}</h3>
        </div>
      </div>
    </div>
    <div class="messages">
      <div
        v-for="message in Messages"
        :key="message.id"
        :class="['message', message?.isFromMe ? 'me' : '']"
      >
        <div class="message-content">
          <p class="message-text">{{ message?.content }}</p>
          <p class="message-date">{{ message?.date }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage">
      <div class="input-message">
        <input type="text" placeholder="Type a message" v-model="message" />
        <button type="submit" class="send-message">
          <!-- <IconsSend /> -->
          {{ $t("send") }}
        </button>
      </div>
    </form>
  </div>
</template>
