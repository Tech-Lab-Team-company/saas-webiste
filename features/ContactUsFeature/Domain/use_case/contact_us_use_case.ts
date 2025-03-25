import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { ContactUsRepo } from "~/features/ContactUsFeature/Domain/repositories/contact_us_repo";
import ContactUsModel from "~/features/ContactUsFeature/Data/models/contact_us_model";

export default class StoreApplicationUseCase
  implements UseCase<ContactUsModel, Params>
{
  async call(params: Params): Promise<DataState<ContactUsModel>> {
    return ContactUsRepo.getInstance().call(params);
  }
}
