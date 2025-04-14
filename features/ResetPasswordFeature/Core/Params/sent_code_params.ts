import type Params  from "~/base/core/Params/params";

export default class SentCodeParams implements Params {
  public phone: string;

  constructor(phone: string) {
    this.phone = phone;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["phone"] = this.phone;
    return data;
  }
}

