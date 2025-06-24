import type Params from "~/base/core/Params/params";

export default class FetchPaymentMethodsParams implements Params {
  public type: number;

  constructor(
    type: number,
    
  ) {
    this.type = type;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["type"] = this.type;
    return data;
  }
}
