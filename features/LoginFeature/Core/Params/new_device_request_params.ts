import type Params from "~/base/core/Params/params";

export default class NewDeviceRequestParams implements Params {
  public name: string;
  public phone: string;
  public comment: string;

  constructor(
    name: string,
    phone: string,
    comment: string,
  ) {
    this.name = name;
    this.phone = phone;
    this.comment = comment;
  }

  toMap(): { [key: string]: any } {
    return {
      name: this.name,
      phone: this.phone,
      comment: this.comment,
    };
  }
}