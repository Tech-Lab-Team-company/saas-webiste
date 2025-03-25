import { ContactUsApiService } from "~/features/ContactUsFeature/Data/api_services/contact_us_api_service";
import ContactUsModel from "~/features/ContactUsFeature/Data/models/contact_us_model";
import RepoInterface, { ResponseType} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";



class ContactUsRepo extends RepoInterface<ContactUsModel> {
  private static instance: ContactUsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ContactUsRepo();
    }
    return this.instance;
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): ContactUsModel {
    return ContactUsModel.fromMap(data);
  }

  override get serviceInstance(): ServicesInterface {
    return ContactUsApiService.getInstance();
  }
}

export { ContactUsRepo };
