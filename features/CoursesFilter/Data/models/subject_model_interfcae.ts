
export default class SubjectModel {
    public id: number
    public title: string

    constructor(
      id: number,
      title: string,

    ) {
      this.id = id
      this.title = title

    }

    static fromMap(data: any): SubjectModel {
      return new SubjectModel(
          data.id,
          data.title,

      )
    }
  }



