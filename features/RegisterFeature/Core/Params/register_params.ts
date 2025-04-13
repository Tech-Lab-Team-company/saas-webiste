import type Params  from "~/base/core/Params/params";

export default class RegisterParams implements Params {

  public name: string;///
  public email: string;///
  public phone: string;///
  public password: string;//// 
  public confirmPassword: string;
  public studentType: number;
  public countryCode: string;
  public countryId: number;
  public NationalityId: number;



  constructor(
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    studentType: number,
    countryCode: string,
    countryId: number,
    NationalityId: number,
    
    
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.studentType = studentType;
    this.countryCode = countryCode;
    this.countryId = countryId;
    this.NationalityId = NationalityId;


  }

  toMap(): { [p: string]: any } {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      password_confirmation: this.confirmPassword,
      category_id: this.studentType,
      country_code: this.countryCode,
      country_id: this.countryId,
      nationality_id: this.NationalityId,
    };
  }
}


