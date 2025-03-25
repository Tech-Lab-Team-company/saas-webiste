import type Params  from "~/base/core/Params/params";


export default class AttachmentsParams implements Params {
  constructor(file: string, alt: string) {
    this.file = file;
    this.alt = alt;
  }
  public file: string;
  public alt: string;

  toMap(): { [p: string]: any } {
      const data: { [key: string]: any } = {};
      data["file"] = this.file;
      data["alt"] = this.alt;
      return data;

  }
}