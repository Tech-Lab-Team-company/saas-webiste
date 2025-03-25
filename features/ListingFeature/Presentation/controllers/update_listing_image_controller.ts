import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import UpdateListingImageUseCase from "~/features/ListingFeature/Domain/use_case/update_listing_image_use_case";
// import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import type ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

export default class UpdateListingImageController extends ControllerInterface<
  ListingDetailsModel
> {
  private static instance: UpdateListingImageController;
  private constructor() {
    super();
  }
  private UpdateListingImageUseCase = new UpdateListingImageUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateListingImageController();
    }
    return this.instance;
  }

  async updateListingImage(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<ListingDetailsModel> =
        await this.UpdateListingImageUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "UpdateListingImage Success",
          imageElement: successImage,
          messageContent: null,
        });
        // await router.push("/");
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
