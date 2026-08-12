import { ApiNames } from '~/base/core/networkStructure/apiNames'
import ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import { CrudType } from '~/base/core/Params/call_params_interface'
import type Params from '~/base/core/Params/params'
import { $fetch } from 'ofetch'
import CourseDetailsModel from '../models/course_details_model'

interface CourseDetailsEnvelope {
  status: boolean
  message: string
  data: Record<string, unknown> | null
}

export const fetchCourseDetails = async (
  params: Params,
  webDomain: string,
  apiToken?: string,
): Promise<CourseDetailsModel> => {
  const response = await $fetch<CourseDetailsEnvelope>(
    ApiNames.Instance.courseDetails,
    {
      baseURL: ApiNames.Instance.baseUrl,
      method: 'POST',
      body: params.toMap(),
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'ar',
        'Content-Type': 'application/json',
        'web-domain': webDomain,
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
      },
    },
  )

  if (!response.status || !response.data) {
    throw new Error(response.message || 'Course details are unavailable')
  }

  // Nuxt payloads must contain plain serializable objects, not class instances.
  return { ...CourseDetailsModel.fromMap(response.data) }
}

class CourseDetailsApiService extends ServicesInterface {
  private static instance: CourseDetailsApiService
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CourseDetailsApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {

    return await super.call({
      url: ApiNames.Instance.courseDetails,
      type: CrudType.POST,
      auth: true,
      params: params,
      showLoadingDialog: true,
    })
  }
}

export { CourseDetailsApiService }
