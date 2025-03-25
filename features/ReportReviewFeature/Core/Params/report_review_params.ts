import type Params from "~/base/core/Params/params";

export default class ReportReviewParams implements Params {
  public reviewId: number;
  constructor(
      reviewId: number,
  ) {
    this.reviewId = reviewId;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["review_id"] = this.reviewId;
    return data;
  }
}
