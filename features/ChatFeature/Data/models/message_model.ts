
export default class MessageModel {
  public id: number;
  public name: string; // Use 'string' instead of 'String'
  public content: string; // Use 'string' instead of 'String'
  public date: string; // Use 'string' instead of 'String'
  public isFromMe: boolean = false; // Use 'boolean' instead of 'Boolean'
  public receiverId: string; // Use 'string' instead of 'String'
  constructor(
    id: number,
    name: string,
    content: string,
    date: string,
    isFromMe: boolean,
    receiverId: string
  ) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.date = date;
    this.isFromMe = isFromMe;
    this.receiverId = receiverId;
  }


  static fromMap(map: { [key: string]: any }): MessageModel {
    return new MessageModel(
      map["id"],
      map["name"],
      map["message"],
      map["date"],
      map["from_me"],
      map["receiver_id"]
    );
  }
}
