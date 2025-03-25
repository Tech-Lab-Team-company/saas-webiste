import type Params  from "~/base/core/Params/params";

export default class RegisterParams implements Params {
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: string;
  public password: string;
  public confirmPassword: string;
  public type: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    type: number,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.type = type;
  }

  toMap(): { [p: string]: any } {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      password_confirmation: this.confirmPassword,
      type: this.type ?? 1,
    };
  }
}

