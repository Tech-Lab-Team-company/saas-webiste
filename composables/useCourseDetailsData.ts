import { FetchError } from "ofetch";
import { getWebDomain } from "~/constant/webDomain";
import CourseDetailsParams from "~/features/FetchCourseDetails/Core/Params/course_details_params";
import { fetchCourseDetails } from "~/features/FetchCourseDetails/Data/api_services/course_details_api_services";
import type CourseDetailsModel from "~/features/FetchCourseDetails/Data/models/course_details_model";

export const useCourseDetailsData = (
  courseId: Ref<string | null> | ComputedRef<string | null>,
  cacheKeyPrefix: string,
) => {
  const userStore = useUserStore();
  const webDomain = getWebDomain();

  const asyncData = useAsyncData<CourseDetailsModel>(
    `${cacheKeyPrefix}:${webDomain}:${courseId.value || "invalid"}`,
    async () => {
      if (!courseId.value) {
        throw createError({ statusCode: 404, statusMessage: "Course not found" });
      }

      try {
        return await fetchCourseDetails(
          new CourseDetailsParams(courseId.value),
          webDomain,
          userStore.user?.apiToken,
        );
      } catch (error) {
        if (error instanceof FetchError && [404, 422].includes(error.statusCode || 0)) {
          throw createError({ statusCode: 404, statusMessage: "Course not found" });
        }
        throw error;
      }
    },
    { dedupe: "defer" },
  );

  watch(courseId, () => asyncData.refresh());

  return asyncData;
};
