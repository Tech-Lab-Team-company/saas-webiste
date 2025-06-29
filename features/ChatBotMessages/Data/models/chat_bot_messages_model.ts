export default class ChatBotMessagesModel {
  // public message: String;

  constructor() {
    // this.message = message;

  }

  static fromMap(map: { [key: string]: any }): ChatBotMessagesModel {
    return new ChatBotMessagesModel();
  }
}
