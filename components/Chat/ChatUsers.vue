<script setup lang="ts">
import FetchMessagesController from "~/features/ChatFeature/presentation/controllers/fetch_messages_controller";
import FetchMessagesParams from "~/features/ChatFeature/Core/Params/fetch_messages_params";
import debouncing from "~/base/persention/utils/debounce";
import type ChatUsersModel from "~/features/ChatFeature/Data/models/chat_users_model";

const emit = defineEmits(["update:chat"]);
const props = defineProps<{
  chats: ChatUsersModel[];
}>();
const fetchMessagesController = FetchMessagesController.getInstance();
const state = ref(fetchMessagesController.state.value);

const word = ref("");
const fetchMessages = async () => {
  await fetchMessagesController.fetchMessages(
    new FetchMessagesParams(word.value)
  );
};

const searchChatsDebounced = debouncing(fetchMessages);

const onUserAction = async () => {
  await searchChatsDebounced.debouncedFunction();
};
</script>

<template>
  <div class="col-span-1">
    <div class="chat-users">
      <h2 class="title-messages" v-if="chats?.length > 0">
        {{ $t("all_messages") }}({{ chats.length }})
      </h2>
      <div class="input-search" v-if="chats?.length > 0">
        <div class="search-icon">
          <IconsSearch />
        </div>
        <input
          type="text"
          @keyup="onUserAction"
          placeholder="Search by title"
          v-model="word"
        />
      </div>
      <div class="users">
        <div
          class="user"
          v-for="message in chats"
          :key="message.id"
          @click="emit('update:chat', message)"
        >
          <div class="user-img">
            <NuxtImg
              :src="message?.image"
              alt="user image"
              class="user-img"
              format="webp"
            />
          </div>
          <div class="content">
            <h3 class="use-name">
              {{ message?.name }}
            </h3>
            <p class="message">{{ message?.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
