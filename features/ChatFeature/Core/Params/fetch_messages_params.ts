import type Params from "~/base/core/Params/params";

export default class FetchMessagesParams implements Params {
  public word: string;
  
  constructor(
    word: string,
  
  ) {
    this.word = word;
   
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    data["word"] = this.word;
  
    return data;
  }
}
