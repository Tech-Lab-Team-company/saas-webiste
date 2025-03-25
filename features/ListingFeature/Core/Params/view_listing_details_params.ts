import type Params from "~/base/core/Params/params";

export default class ViewListingDetailsParams implements Params {
  id: string;

  constructor(id: string) {
    this.id = id;

  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["listing_id"] = this.id;
    return data;
  }
}