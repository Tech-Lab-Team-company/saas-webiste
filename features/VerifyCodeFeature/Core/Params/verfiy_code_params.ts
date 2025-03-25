import type Params from "~/base/core/Params/params";

export default class VerifyCodeParams implements Params {
  public code: string;
  public email: string;

  constructor(code: string, email: string) {
    this.code = code;
    this.email = email;
  }
  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["email"] = this.email;
    data["code"] = this.code;
    return data;
  }
}

