import type Params  from "~/base/core/Params/params";

export default class RegisterParams implements Params {

  public name: string;///
  public email: string;///
  public phone: string;///
  public password: string;//// 
  public confirmPassword: string;
  public educationType: number;
  public countryCode: string;
  public countryId: number;
  public NationalityId: number;
  public gender: number;



  constructor(
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    educationType: number,
    countryCode: string,
    countryId: number,
    NationalityId: number,
    gender: number,
    
    
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.educationType = educationType;
    this.countryCode = countryCode;
    this.countryId = countryId;
    this.NationalityId = NationalityId;
    this.gender = gender;


  }

  toMap(): { [p: string]: any } {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      password_confirmation: this.confirmPassword,
      category_id: this.educationType,
      country_code: this.countryCode,
      country_id: this.countryId,
      nationality_id: this.NationalityId,
      gender: this.gender,
      
    };
  }
}


