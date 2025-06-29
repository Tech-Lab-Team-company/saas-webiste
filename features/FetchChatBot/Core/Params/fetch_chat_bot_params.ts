import type Params from "~/base/core/Params/params";

export default class FetchChatBotParams implements Params {
  // public id: number;
  

  constructor() {
    // this.id = id;
 
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    // if(this.id) data["id"] = this.id;
   
    return data;
  }
}
