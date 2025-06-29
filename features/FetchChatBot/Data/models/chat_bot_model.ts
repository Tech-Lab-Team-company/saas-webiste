export default class ChatBotModel {
  public id: number;
  public name: string;
  public description?: string;

  constructor(id: number, name: string, description?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromMap(map: { [key: string]: any }): ChatBotModel {
    return new ChatBotModel(map["id"], map["name"], map["description"]);
  }
}
