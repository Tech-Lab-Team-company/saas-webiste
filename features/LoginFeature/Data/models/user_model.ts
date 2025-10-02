import  UserInfo from "./user_info";

export default class UserModel {
  public id: number;
  public name: string; // Use 'string' instead of 'String'
  public email: string; // Use 'string' instead of 'String'
  public image: string
  public isVerified: boolean
  public phone?: string;
  public firstName?: string;
  public lastName?: string;
  public type?: number;
  public apiToken: string;
  public aboutMe?: string;
  public sendNotifications?: boolean;
  public facebook?: string;
  public x?: string;
  public instagram?: string;
  public youtube?: string;
  public linkedin?: string;
  public whatsapp?: string;
  public userInfo?:UserInfo;
  public category_id?:Number
  public join_option_status?:Number


  constructor(
    id: number,
    name: string,
    email: string,
    apiToken: string,
    image: string,
    isVerified: boolean,
    phone?: string,
    firstName?: string,
    lastName?: string,
    type?: number,
    aboutMe?: string,
    sendNotifications?: boolean,
    facebook?: string,
    x?: string,
    instagram?: string,
    youtube?: string,
    linkedin?: string,
    whatsapp?: string,
    userInfo?: UserInfo,
    category_id?: Number,
    join_option_status?: Number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.image = image;
    this.isVerified = isVerified;
    this.firstName = firstName;
    this.lastName = lastName;
    this.type = type;
    this.phone = phone;
    this.apiToken = apiToken;
    this.aboutMe = aboutMe;
    this.sendNotifications = sendNotifications;
    this.facebook = facebook;
    this.x = x;
    this.instagram = instagram;
    this.youtube = youtube;
    this.linkedin = linkedin;
    this.whatsapp = whatsapp;
    this.userInfo = userInfo;
    this.category_id = category_id;
    this.join_option_status = join_option_status;
  }

  static fromMap(map: { [key: string]: any }): UserModel {
    return new UserModel(
      map["id"],
      map["name"],
      map["email"],
      map["token"],
      map["image"],
      map["is_verified"],
      map["phone"],
      map["first_name"],
      map["last_name"],
      map["type"],
      map["bio"],
      map["send_notifications"],
      map["facebook"],
      map["X"],
      map["instagram"],
      map["youtube"],
      map["linkedin"],
      map["whatsapp"],
      map["user_info"] ? UserInfo.fromMap(map["user_info"]) : undefined,
      map["category_id"],
      map["join_option_status"],
    );
  }
}
