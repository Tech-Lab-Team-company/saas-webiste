import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import { ScanCodeApiService } from "~/features/ScanCode/Data/api_services/scan_code_api_service";

class ScanCodeRepo extends RepoInterface<Record<string, unknown>> {
  private static instance: ScanCodeRepo;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) this.instance = new ScanCodeRepo();
    return this.instance;
  }

  get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: unknown): Record<string, unknown> {
    return data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};
  }

  get serviceInstance(): ServicesInterface {
    return ScanCodeApiService.getInstance();
  }
}

export { ScanCodeRepo };
