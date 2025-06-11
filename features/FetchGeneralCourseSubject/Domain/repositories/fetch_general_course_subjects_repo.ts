import { FetchListingApiService } from "~/features/FetchListingFeature/Data/api_services/fetch_listings_api_service";
import ListingModel from "~/features/FetchListingFeature/Data/models/listing_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { FetchGeneralCourseSubjectsApiService } from "../../Data/api_services/fetch_general_course_subjects_api_service";
import GeneralCoursesModel from "../../Data/models/general_course_subjects_model";

class FetchGeneralCourseSubjectsRepo extends RepoInterface<GeneralCoursesModel[]> {
  private static instance: FetchGeneralCourseSubjectsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchGeneralCourseSubjectsRepo();
    }
    return this.instance;
  }

  onParse(data: any): GeneralCoursesModel[] {
    return data.map((item: any) => GeneralCoursesModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchGeneralCourseSubjectsApiService.getInstance();
  }
}

export { FetchGeneralCourseSubjectsRepo };
