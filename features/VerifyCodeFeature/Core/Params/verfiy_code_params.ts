import type Params from "~/base/core/Params/params";

export default class VerifyCodeParams implements Params {
  public type: string ;
  public phone: string;
  public code: string;

  constructor( phone: string,code: string ,type:string) {
    this.type = type;
    this.phone = phone;
    this.code = code;
  }
  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["type"] = this.type;
    data["phone"] = this.phone;
    data["code"] = this.code;
    return data;
  }
}

