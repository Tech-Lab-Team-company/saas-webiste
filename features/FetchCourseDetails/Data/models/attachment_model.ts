
export default class AttachmentModel {
  public id: number;
  public alt: string;
  public file: File;




  constructor(
    id: number,
    alt: string,
    file: File,
 


  ) {
    this.id = id;
    this.alt = alt;
    this.file = file;

 
  }


  static fromMap(map: { [key: string]: any }): UnitsModel {
    return new UnitsModel(
      map["id"],
      map["alt"],
      map["file"],
   

    );
  }
}



