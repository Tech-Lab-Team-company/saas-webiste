import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";

export default class CommentModel {
  public id: number;
  public name: string; // Use 'string' instead of 'String'
  public content: string;
  public email: string; // Use 'string' instead of 'String'
  public author: string;
  public authorImage: string;
  public date: string;
  public replies?: ReplayModel[];

  constructor(
    id: number,
    name: string,
    content: string,
    email: string,
    author: string,
    authorImage: string,
    date: string,
    replies?: ReplayModel[]
  ) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.email = email;
    this.author = author;
    this.authorImage = authorImage;
    this.date = date;
    this.replies = replies;
  }


  static fromMap(map: { [key: string]: any }): CommentModel {
    return new CommentModel(
      map["id"],
      map["name"],
      map["content"],
      map["email"],
      map["author"],
      map["author_image"],
      map["date"],
      map["replies"]
    );
  }
}
