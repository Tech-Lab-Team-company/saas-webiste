import type Params  from "~/base/core/Params/params";

export default class RegisterParams implements Params {

  public name: string;///
  public second_name: string | null;///
  public address: string | null;///
  public email: string | null; ///
  public phone: string;///
  public second_phone: string | null;///
  public password: string;//// 
  public confirmPassword: string;
  public educationType: number;
  public countryCode: string;
  public gender: number;



  constructor(
    name: string,
    second_name: string| null,
    address: string| null,
    email: string| null,
    phone: string,
    second_phone: string| null,
    password: string,
    confirmPassword: string,
    educationType: number,
    countryCode: string,
    gender: number,
    
    
  ) {
    this.name = name;
    this.second_name = second_name;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.second_phone = second_phone;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.educationType = educationType;
    this.countryCode = countryCode;
    this.gender = gender;


  }

  toMap(): { [p: string]: any } {
    return {
      name: this.name,
      second_name: this.second_name,
      address: this.address,
      email: this.email,
      phone: this.phone,
      second_phone: this.second_phone,
      password: this.password,
      password_confirmation: this.confirmPassword,
      category_id: this.educationType,
      country_code: this.countryCode,
      gender: this.gender,
      
    };
  }
}


