import type Params from "~/base/core/Params/params";

export default class ChatBotMessagesParams implements Params {
  public chatbot_id: number;
  public message: String;
  

  constructor(chatbot_id:number , message: string) {
    this.chatbot_id = chatbot_id;
    this.message = message;
 
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
     data["chatbot_id"] = this.chatbot_id;
     data["message"] = this.message;
   
    return data;
  }
}
