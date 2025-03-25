import type Params from "~/base/core/Params/params";

export default class FetchCommentParams implements Params {
  public blogId: string;
  constructor(
    blogId: string,
  ) {
    this.blogId = blogId;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["slug"] = this.blogId;
    return data;
  }
}
