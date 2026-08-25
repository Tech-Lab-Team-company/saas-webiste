import type Params from "~/base/core/Params/params";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type UseCase from "~/base/Domain/UseCase/use_case";
import { ScanCodeRepo } from "~/features/ScanCode/Domain/repositories/scan_code_repo";

export default class ScanCodeUseCase
  implements UseCase<Record<string, unknown>, Params>
{
  async call(
    params: Params,
  ): Promise<DataState<Record<string, unknown>>> {
    return await ScanCodeRepo.getInstance().call(params);
  }
}
