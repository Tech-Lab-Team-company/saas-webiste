import type Params from "~/base/core/Params/params";

export default class UpdateProfileParams implements Params {
  public firstName: string;
  public lastName: string;
  public name: string;
  public email: string;
  public phone: string;
  public type: number;
  public aboutMe: string;
  public sendNotifications: boolean;
  public facebook: string;
  public x: string;
  public instagram: string;
  public youtube: string;
  public linkedin: string;
  public whatsapp: string;

  constructor(
    firstName: string,
    lastName: string,
    name: string,
    email: string,
    phone: string,
    type: number,
    aboutMe: string,
    sendNotifications: boolean,
    facebook: string,
    x: string,
    instagram: string,
    youtube: string,
    linkedin: string,
    whatsapp: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.aboutMe = aboutMe;
    this.sendNotifications = sendNotifications;
    this.facebook = facebook;
    this.x = x;
    this.instagram = instagram;
    this.youtube = youtube;
    this.linkedin = linkedin;
    this.whatsapp = whatsapp;
  }

  toMap(): { [key: string]: any } {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      name: this.name,
      about_me: this.aboutMe,
      send_notifications: this.sendNotifications ? 1 : 0,
      social: {
        facebook: this.facebook,
        x: this.x,
        instagram: this.instagram,
        youtube: this.youtube,
        linkedin: this.linkedin,
        whatsapp: this.whatsapp,
      },
    };
  }
}
