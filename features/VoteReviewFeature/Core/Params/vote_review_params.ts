import type Params from "~/base/core/Params/params";

export default class VoteReviewParams implements Params {
  public reviewId: number;
  public vote: number;
  constructor(
      reviewId: number,
      vote: number
  ) {
    this.reviewId = reviewId;
    this.vote = vote
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["review_id"] = this.reviewId;
    data["vote"] = this.vote
    return data;
  }
}
