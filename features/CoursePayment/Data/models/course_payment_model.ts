
export default class CoursePaymentModel {
  public id: number;





  constructor(
    id: number,
  
  ) {
    this.id = id;
 
  }


  static fromMap(map: { [key: string]: any }): CoursePaymentModel {
    return new CoursePaymentModel(
      map["id"],
   
    );
  }
}
