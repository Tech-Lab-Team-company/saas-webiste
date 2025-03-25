export default class ReplayModel {
    public id: number;
    public name: string; // Use 'string' instead of 'String'
    public content: string;
    public email: string; // Use 'string' instead of 'String'
    public author: string;
    public author_image: string;
    public date: string;

    constructor(
        id: number,
        name: string,
        content: string,
        email: string,
        author: string,
        author_image: string,
        date: string,
    ) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.email = email;
        this.author = author;
        this.author_image = author_image;
        this.date = date;
    }


    static fromMap(map: { [key: string]: any }): ReplayModel {
        return new ReplayModel(
            map["id"],
            map["name"],
            map["content"],
            map["email"],
            map["author"],
            map["author_image"],
            map["date"],
        );
    }
}
