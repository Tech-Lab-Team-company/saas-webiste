import type Params from '~/base/core/Params/params'
import { SectionTypeEnum } from '~/components/Home/home/enum/section_type_enum'

export class TopStudentsParams implements Params {
  constructor() {}

  toJson() {
    return {
      type: SectionTypeEnum.TopStudents,
    }
  }
}
