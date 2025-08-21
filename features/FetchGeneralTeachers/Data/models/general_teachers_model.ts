export default class GeneralTeachersModel {
  public id: number;
  public name: string;
  public image: string;
  public phone: string;
  public email: string;
  public intro: string;
  public mini_description: string;
  public description: string;
  public address: string;
  public number_of_courses: number;
  public number_of_revisions: number;
  public api_token: string;

  constructor(
    id: number,
     name: string,
      image: string,
      phone: string,
      email: string,
      intro: string,
      mini_description: string,
      description: string,
      address: string,  
      number_of_courses: number,
      number_of_revisions: number,
      api_token: string
    ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.phone = phone;
    this.email = email;
    this.intro = intro;
    this.mini_description = mini_description;
    this.description = description;
    this.address = address;
    this.number_of_courses = number_of_courses;
    this.number_of_revisions = number_of_revisions;
    this.api_token = api_token;

  }

  static fromMap(map: { [key: string]: any }): GeneralTeachersModel {
    return new GeneralTeachersModel(
      map["id"],
      map["name"],
      map["image"],
      map["phone"],
      map["email"],
      map["intro"],
      map["mini_description"],
      map["description"],
      map["address"],
      map["number_of_courses"],
      map["number_of_revisions"],
      map["api_token"]
    );
  }
}

