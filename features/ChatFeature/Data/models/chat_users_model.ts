export default class ChatUsersModel {
    public id: number;
    public name: string; // Use 'string' instead of 'String'
    public content: string;
    public image: string; // Use 'string' instead of 'String'
    public receiverId: number; // Use 'string' instead of 'String'


    constructor(
        id: number,
        name: string,
        content: string,
        image: string,
        receiverId: number
    ) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.image = image;
        this.receiverId = receiverId;
    }


    static fromMap(map: { [key: string]: any }): ChatUsersModel {
        return new ChatUsersModel(
            map["id"],
            map["name"],
            map["messages"],
            map["image"],
            map["receiver_id"]
        );
    }
}
