export default class SentCodeModel {
  public id: number;
  public email: string; // Use 'string' instead of 'String'

  constructor(
    id: number,
    email: string,

  ) {
    this.id = id;
    this.email = email;

  }

  static fromMap(map: { [key: string]: any }): SentCodeModel {
    return new SentCodeModel(
      map["id"],
      map["email"],
    );
  }
}

