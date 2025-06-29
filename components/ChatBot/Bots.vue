<script lang="ts" setup>
import ChatBotMessagesParams from '~/features/ChatBotMessages/Core/Params/chat_bot_messages_params'
import type ChatBotMessagesModel from '~/features/ChatBotMessages/Data/models/chat_bot_messages_model'
import ChatBotMessageController from '~/features/ChatBotMessages/presentation/controllers/chat_bot_message_controller'

const ChatText = ref()
const MessageIndex = ref(1)
const Messages = ref([{
    msg: "",
    index: MessageIndex
}])
const props = defineProps({
    bot: Number
})
const botId = ref(props.bot)



const BotMessages = ref<ChatBotMessagesModel>()
const loading = ref(false)
const SendMessage = async () => {
    // Set loading to true when starting the request
    loading.value = true;

    Messages.value.push({
        msg: ChatText.value,
        index: MessageIndex.value++
    })

    const chatBotMessageParams = new ChatBotMessagesParams(botId.value, ChatText.value)
    const chatBotMessageController = ChatBotMessageController.getInstance();

    try {
        const state = await chatBotMessageController.ChatBotsMessages(chatBotMessageParams);

        if (state.value.data) {
            BotMessages.value = state.value.data;
            Messages.value.push({
                msg: state.value.data.toString(),
                index: MessageIndex.value++
            })
        }
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        loading.value = false;
    }

    ChatText.value = ""
    console.log(Messages.value)
}

watch(() => props.bot, (newValue) => {
    botId.value = newValue
})
</script>

<template>
    <div class="chat-container">

        <div class="messages-container">
            <p v-for="(message, index) in Messages.filter(m => m.msg.trim() !== '')" v-html="message.msg" :key="index"
                :class="message.index % 2 === 0 ? 'received-message' : 'sent-message'" >
            </p>
            <div class="loading-box" v-if="loading">
                <span class="loding-dot">.</span>
                <span class="loding-dot">.</span>
                <span class="loding-dot">.</span>
            </div>
        </div>

        <div class="chat-input">
            <InputText class="input-text" type="text" v-model="ChatText" />
            <i class="pi pi-send" @click="SendMessage"></i>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .messages-container {
        // background-image: url('../../public/images/background.png');
        // background-color: red;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .sent-message {
            text-align: right;
            margin-left: auto;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            color: black;
            font-size: 15px;
            width: fit-content;
            padding: 5px 15px;
        }

        .received-message {
            text-align: left;
            margin-right: auto;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            color: black;
            font-size: 15px;
            width: fit-content;
            padding: 5px 15px;
        }

        .loading-box {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 4px;
            padding: 10px;

            .loding-dot {
                font-size: 20px;
                font-weight: bold;
                color: #666;
                animation: dotBounce 1.5s infinite ease-in-out;

                &:nth-child(1) {
                    animation-delay: 0s;
                }

                &:nth-child(2) {
                    animation-delay: 0.3s;
                }

                &:nth-child(3) {
                    animation-delay: 0.6s;
                }
            }
        }

        @keyframes dotBounce {

            0%,
            60%,
            100% {
                transform: translateY(0);
            }

            30% {
                transform: translateY(-10px);
            }
        }
    }

    .chat-area {
        background: none;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        width: 100%;


    }

    .chat-input {
        display: flex;
        align-items: center;
        gap: 20px;

        .input-text {

            &:focus {

                outline: #cbd5e1;
                border: 1px solid #cbd5e1;
            }
        }

        .pi-send {
            cursor: pointer;
            color: #b0becf;
            border: 1px solid #cbd5e1;
            padding: 10px;
            border-radius: 50%;
        }
    }
}
</style>