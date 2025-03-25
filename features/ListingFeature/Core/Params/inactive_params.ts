import type Params from "~/base/core/Params/params";

export default class InactiveParams implements Params {
  id: number;

  constructor(id: number) {
    this.id = id;

  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["listing_id"] = this.id;
    return data;
  }
}