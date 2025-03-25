import type Params  from "~/base/core/Params/params";


export default class UpdateProfileImageParams implements Params {
  public image: string;



  constructor(image: string) {
    this.image = image;

  }

  toMap(): { [key: string]: any } {
    return {
      image: this.image,
    };
  }
}

