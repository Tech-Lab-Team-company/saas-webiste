import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type AddFavoriteParams from "../../Core/Params/add_favorite_params";
import AddFavoriteUseCase from "../../Domain/use_case/add_favorite_use_case";

export default class AddFavoriteController extends ControllerInterface<void> {
  private static instance: AddFavoriteController;
  private constructor() {
    super();
  }
  private addFavoriteUseCase = new AddFavoriteUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddFavoriteController();
    }
    return this.instance;
  }

  async addFavorite(params: AddFavoriteParams) {
    this.setLoading();
    const dataState: DataState<void> = await this.addFavoriteUseCase.call(params);
    this.setState(dataState);
    return this.state;
  }
}
