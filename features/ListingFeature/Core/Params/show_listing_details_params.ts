import type Params from "~/base/core/Params/params";

export default class ShowListingDetailsParams implements Params {
  slug: string;

  constructor(slug: string) {
    this.slug = slug;

  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["slug"] = this.slug;
    return data;
  }
}