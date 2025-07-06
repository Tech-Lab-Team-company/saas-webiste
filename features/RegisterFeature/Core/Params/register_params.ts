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
    const data: { [p: string]: any } = {};
    data["name"] = this.name;
    if(this.second_name)data["second_name"] = this.second_name;
    if(this.address)data["address"] = this.address;
    if(this.email)data["email"] = this.email;
    if(this.phone)data["phone"] = this.phone;
    if(this.second_phone)data["second_phone"] = this.second_phone;
    data["password"] = this.password;
    data["password_confirmation"] = this.confirmPassword;
    if(this.educationType)data["category_id"] = this.educationType;
    if(this.countryCode)data["country_code"] = this.countryCode;
    if(this.gender)data["gender"] = this.gender;
 
    return data;
   
  }
}

      


