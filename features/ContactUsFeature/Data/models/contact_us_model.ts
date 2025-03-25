export default class ContactUsModel {
  public title: string;
  public email: string;
  public phone: string;
  public description: string;

  constructor(
    title: string,
    email: string,
    phone: string,
    description: string
  ) {
    this.title = title;
    this.email = email;
    this.phone = phone;
    this.description = description;
  }

  static fromMap(map: { [key: string]: any }): ContactUsModel {
    return new ContactUsModel(
      map["id"],
      map["name"],
      map["email"],
      map["phone_code"]
    );
  }
}
