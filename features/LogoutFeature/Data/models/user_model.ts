export default class UserModel {
  public id: number;
  public name: string; // Use 'string' instead of 'String'
  public email: string; // Use 'string' instead of 'String'
  public image: string;
  public type: number;
  public apiToken: string;
  constructor(
    id: number,
    name: string,
    email: string,
    image: string,
    type: number,
    apiToken: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.image = image;
    this.type = type;
    this.apiToken = apiToken;
  }

  static fromMap(map: { [key: string]: any }): UserModel {
    return new UserModel(
      map["id"],
      map["name"],
      map["email"],
      map["image"],
      map["type"],
      map["api_token"]
    );
  }
}

