import type Params from "~/base/core/Params/params";

export default class ContactUsParams implements Params {
  public title: string;
  public email: string;
  // public phone: string;
  public description: string;

  constructor(
    title: string,
    email: string,
    // phone: string,
    description: string
  ) {
    this.title = title;
    this.email = email;
    // this.phone = phone;
    this.description = description;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["name"] = this.title;
    data["email"] = this.email;
    // data["phone"] = this.phone;
    data["message"] = this.description;
    return data;
  }
}
