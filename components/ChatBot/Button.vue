<script setup lang="ts">
import FetchChatBotParams from '~/features/FetchChatBot/Core/Params/fetch_chat_bot_params';
import type ChatBotModel from '~/features/FetchChatBot/Data/models/chat_bot_model';
import FetchChatBotController from '~/features/FetchChatBot/presentation/controllers/fetch_chat_bot_controller';

const UserSetting = useSettingStore();

const items = [
    {
        label: 'Add',
        icon: 'pi pi-phone',
        command: () => {
            window.location.href = `tel:${UserSetting.setting?.phone}`
        }

    },
];

const ChatBots = ref<ChatBotModel[]>([])
const FetchChatBots = async () => {
    const fetchChatBotParams = new FetchChatBotParams();
    const fetchChatBotController = FetchChatBotController.getInstance();
    const state = await fetchChatBotController.fetchChatBots(fetchChatBotParams);
    if (state.value.data) {
        ChatBots.value = state.value.data;


    }
}


onMounted(() => {
    FetchChatBots();
})
const position = ref('center');
const visible = ref(false);
const SelectedBot = ref()

const openPosition = (pos, id: Number) => {
    position.value = pos;
    visible.value = true;
    SelectedBot.value = id;

}


//  width: window.innerWidth <= 768 ? '100%' : '50%',

const style ={
    width: window.innerWidth <= 768 ? '100%' : '50%',
    
}

</script>

<template>

    <SpeedDial class="chat-icons" :model="items" direction="left">
        <template #icon>
            <i class="pi pi-comment"></i>
        </template>
        <template #item>
            <div class="chat-bots-container">
                <p @click="openPosition('bottomright', item.id)" severity="secondary" v-for="(item, index) in ChatBots"
                    :key="index">{{ item.name }}</p>
            </div>
        </template>
    </SpeedDial>

    <Dialog class="responsive-dialog " v-model:visible="visible" :style="{ width: '50%', height: '50%', justifyContent: 'flex-end'  }"
        :contentClass="'chat-bot-dialog'" :position="position" :draggable="false" modal :dismissableMask="true">
        <ChatBotBots :bot="SelectedBot" />
        <template #closebutton>
            <i @click="visible = false" class="pi pi-times"></i>
        </template>
    </Dialog>

</template>

<style scoped lang="scss">
.responsive-dialog {
    width: 50%;
    height: 50%;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .responsive-dialog {
        width: 100%;
    }
}
.chat-bots-container {
    display: flex;
    gap: 10px;

    p {
        background-color: #061147;
        color: white;
        border-radius: 10px;
        padding: 7px;
        font-size: 15px;
        cursor: pointer;

    }
}

.chat-icons {
    position: absolute;
    right: 0;
    top: 0;
    right: 0;
    transform: translate(19%, -61%);
}

.pi-times {
    margin-top: 20px;
    cursor: pointer;
}
</style>
