export default class SubModel {
    public id: number;
    public title: string;
  
    constructor(id: number, title: string) {
      this.id = id;
      this.title = title;
    }
  
    static fromMap(map: { [key: string]: any }): SubModel {
      return new SubModel(map["id"], map["name"]);
    }
  }
  