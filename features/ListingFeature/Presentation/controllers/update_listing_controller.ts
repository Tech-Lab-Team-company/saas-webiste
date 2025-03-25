import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import UpdateListingUseCase from "~/features/ListingFeature/Domain/use_case/update_listing_use_case";
// import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class UpdateListingController extends ControllerInterface<
  ListingModel[]
> {
  private static instance: UpdateListingController;
  private constructor() {
    super();
  }
  private UpdateListingUseCase = new UpdateListingUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateListingController();
    }
    return this.instance;
  }

  async updateListing(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<ListingModel[]> =
        await this.UpdateListingUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        console.log(this.state.value.data);
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Update Listing Success",
          imageElement: successImage,
          messageContent: null,
        });
        await router.push("/dashboard/listings");
        // const userStore = useUserStore();
        // if (this.state.value.data) {
        //   console.log(this.state.value.data)
        //   userStore.setUser(this.state.value.data);
        // }
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: error,
        imageElement: errorImage,
        messageContent: null,
      });
    }
  }
}
