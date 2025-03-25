import type Params from "~/base/core/Params/params";
export default class AddClaimParams implements Params {
  public receiverId: number;
  public message: string;
 

  constructor(
    receiverId: number,
    message: string,
    
  ) {
    this.receiverId = receiverId;
    this.message = message;
   
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    data["receiver_id"] = this.receiverId;
    data["message"] = this.message;

    return data;
  }
}
