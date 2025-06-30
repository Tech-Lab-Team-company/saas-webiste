<script setup lang="ts">
import FetchChatBotParams from '~/features/FetchChatBot/Core/Params/fetch_chat_bot_params';
import type ChatBotModel from '~/features/FetchChatBot/Data/models/chat_bot_model';
import FetchChatBotController from '~/features/FetchChatBot/presentation/controllers/fetch_chat_bot_controller';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

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

const SelectedChatBotName = ref()
const dialogStyles = computed(() => {
    if (window.innerWidth <= 768) {
        return { width: '100%', height: '50%', justifyContent: 'flex-end', display: 'none', 'z-index': '999999' };
    }
    return { width: '50%', height: '50%', justifyContent: 'flex-end', 'z-index': '999999' };
});


const SpeedDialDirection = ref('left')
const SppedDialStyle = computed(() => {
    if (window.innerWidth <= 768) {
        SpeedDialDirection.value = 'left'
    return {  top: 'calc(90% - 1rem)', right: '2rem', 'z-index': '999', position: 'fixed' };
    }
    return { top: 'calc(96% - 1rem)', right: '5rem', 'z-index': '999', position: 'fixed' };
});

watch(() => window.innerWidth, (newValue) => {
    if (newValue <= 768) {
        SpeedDialDirection.value = 'right'
    }
    else {
        SpeedDialDirection.value = 'left'
    }
})

</script>

<template>
    <SpeedDial class="chat-icons" :model="items" :direction="SpeedDialDirection" :style="SppedDialStyle">
        <template #icon>
            <DotLottieVue autoplay loop src="/lottie/ai.json" />
        </template>
        <template #item>
            <div class="chat-bots-container">
                <p @click="openPosition('bottomright', item.id); SelectedChatBotName = item.name" severity="secondary"
                    v-for="(item, index) in ChatBots" :key="index">{{ item.name }}</p>
            </div>
        </template>
    </SpeedDial>

    <Dialog class="responsive-dialog" v-model:visible="visible" :style="dialogStyles" :contentClass="'chat-bot-dialog'"
        :position="position" :draggable="false" :header="`${SelectedChatBotName}`" modal :dismissableMask="true">
        <ChatBotBots :bot="SelectedBot" />
        <template #closebutton>
            <i @click="visible = false" class="pi pi-times"></i>
        </template>
    </Dialog>
</template>

<style scoped lang="scss">
// Alternative approach using CSS custom properties and :deep()
.responsive-dialog {
    :deep(.p-dialog) {
        width: 50%;
        height: 50%;
        justify-content: flex-end;

        @media (max-width: 768px) {
            width: 100% !important;
        }
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
    transform: translate(19%, -61%);

    @media (max-width:768px) {
        display: none;
    }
}

.pi-times {
    margin-top: 20px;
    cursor: pointer;
}
</style>