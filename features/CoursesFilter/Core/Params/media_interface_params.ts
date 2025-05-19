import type Params from "@/base/core/Params/params";

export default class MediaInterfaceParams implements Params {
    file:File;
    alt: string;

  constructor(
    file:File,
    alt: string,

  ) {

    this.file = file;
    this.alt = alt;


  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["file"] = this.file
    data["alt"] = this.alt
    return data;
  }
}
