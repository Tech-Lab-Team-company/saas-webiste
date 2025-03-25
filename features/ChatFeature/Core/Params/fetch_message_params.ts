import type Params from "~/base/core/Params/params";


export default class FetchMessageParams implements Params {
  public chatId: string;
  

  constructor(
    chatId: string,
    
  ) {
    this.chatId = chatId;
    
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    data["chat_id"] = this.chatId;
   
    return data;
  }
}
