import type Params from "~/base/core/Params/params";

export default class DeleteRateImageParams implements Params {
  imageId?: number;

  constructor(imageId?: number) {
    this.imageId = imageId

  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["image_id"] = this.imageId
    return data;
  }
}