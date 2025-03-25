import type Params from "~/base/core/Params/params";

export default class DeleteListingImageParams implements Params {
  id: string;
  imageId?: number;

  constructor(id: string,imageId?: number) {
    this.id = id;
    this.imageId = imageId

  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["listing_id"] = this.id;
    data["image_id"] = this.imageId
    return data;
  }
}