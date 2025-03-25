import type Params  from "~/base/core/Params/params";

export default class SentCodeParams implements Params {
  public email: string;

  constructor(email: string) {
    this.email = email;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["email"] = this.email;
    return data;
  }
}

