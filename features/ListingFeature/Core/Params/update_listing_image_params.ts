import type Params from "~/base/core/Params/params";

export default class UpdateListingImageParams implements Params {
  id: string;
  image: string;

  constructor(id: string, image: string) {
    this.image = image;
    this.id = id;
    

  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["image"] = this.image;
    data["listing_id"] = this.id;
    return data;
  }
}