import type Params from "~/base/core/Params/params";

export default class SetNewPasswordParams implements Params {
  public phone: string;
  public Newpassword: string;
  public confirmPassword: string;

  constructor(phone: string, Newpassword: string, confirmPassword: string) {
    this.phone = phone;
    this.Newpassword = Newpassword;
    this.confirmPassword = confirmPassword;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["phone"] = this.phone;
    data["new_password"] = this.Newpassword;
    data["new_password_confirmation"] = this.confirmPassword;
    return data;
  }
}

