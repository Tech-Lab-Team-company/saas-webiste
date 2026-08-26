import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import FetchMyLibraryCoursesApiService from "../../Data/api_services/fetch_my_library_courses_api_service";
import LibraryCourseModel from "../../Data/models/library_course_model";
import { extractLibraryRecords } from "../../Data/models/library_item_utils";

export default class FetchMyLibraryCoursesRepo extends RepoInterface<LibraryCourseModel[]> {
  private static instance: FetchMyLibraryCoursesRepo;

  private constructor() {
    super();
  }

  static getInstance(): FetchMyLibraryCoursesRepo {
    if (!this.instance) this.instance = new FetchMyLibraryCoursesRepo();
    return this.instance;
  }

  onParse(data: unknown): LibraryCourseModel[] {
    return extractLibraryRecords(data)
      .map(LibraryCourseModel.fromMap)
      .filter((course): course is LibraryCourseModel => course !== null);
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyLibraryCoursesApiService.getInstance();
  }
}
