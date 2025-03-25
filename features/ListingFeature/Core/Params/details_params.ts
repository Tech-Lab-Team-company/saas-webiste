import type Params from "~/base/core/Params/params";
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";

export default class ImagesParams implements Params {
  public images: string;

  constructor(images: string) {
    this.images = images;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["image"] = this.images;

    return data;
  }
}
