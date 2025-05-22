import type Params from "@/base/core/Params/params";


export default class SubmitHomeWorkParams implements Params {
    HomeWorkId: number;
    notes: string;
    Image: File;



  constructor(
    HomeWorkId: number,
    notes: string,
    Image: File,



  ) {
    this.HomeWorkId = HomeWorkId;
    this.notes = notes;
    this.Image = Image;



  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["home_work_id"] = this.HomeWorkId
     data["notes"] = this.notes
     data["file"] = this.Image
 
    return data;
  }
}


//  if(this.image.length > 0){data["media"] = this.image.map(image => image.toMap());}