import MediaInterfaceParams from "@/components/Dashboard/Sections/Core/Params/media_interface_params"

export default class TeacherModel {
    public id: number
    public name: string
    public image: MediaInterfaceParams

    constructor(
      id: number,
      name: string,
      image: MediaInterfaceParams,

    ) {
      this.id = id
      this.name = name
      this.image = image

    }

    static fromMap(data: any): TeacherModel {
      return new TeacherModel(
          data.id,
          data.name,
          data.image,

      )
    }
  }
