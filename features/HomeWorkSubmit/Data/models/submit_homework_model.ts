
export default class SubmitHomeWorkModel {
  public id: number;





  constructor(
    id: number,
  
  ) {
    this.id = id;
 
  }


  static fromMap(map: { [key: string]: any }): SubmitHomeWorkModel {
    return new SubmitHomeWorkModel(
      map["id"],
   
    );
  }
}
