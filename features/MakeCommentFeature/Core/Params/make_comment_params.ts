import type Params from "~/base/core/Params/params";

export default class MakeCommentParams implements Params {
  public blogId: number;
  public userName: string;
  public userEmail: string;
  public comment: string;
  public parentId: number | null;

  constructor(
    blogId: number,
    userName: string,
    userEmail: string,
    comment: string,
    parentId: number | null,
  ) {
    this.blogId = blogId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.comment = comment;
    this.parentId = parentId;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["blog_id"] = this.blogId;
    data["user_name"] = this.userName;
    data["user_email"] = this.userEmail;
    data["comment"] = this.comment;
    if (this.parentId) data["parent_id"] = this.parentId;
    return data;
  }
}
