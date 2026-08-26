import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import ChangeOnlineStatusUseCase from "../../Domain/use_case/change_online_statue_use_case";
import UserModel from "../../Data/models/online_statue_model";

export default class ChangeOnlineStatusController extends ControllerInterface<UserModel> {
  private static instance: ChangeOnlineStatusController;
  private constructor() {
    super();
  }
  private ChangeOnlineStatusUseCase = new ChangeOnlineStatusUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeOnlineStatusController();
    }
    return this.instance;
  }

  async changeOnlineStatus(params: Params): Promise<boolean> {
    const dataState: DataState<UserModel> =
      await this.ChangeOnlineStatusUseCase.call(params);
    this.setState(dataState);

    return this.isDataSuccess();
  }
}
