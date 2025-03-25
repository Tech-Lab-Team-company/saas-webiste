import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import AddListingUseCase from "~/features/ListingFeature/Domain/use_case/add_listing_use_case";
// import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class AddListingController extends ControllerInterface<
  ListingModel[]
> {
  private static instance: AddListingController;
  private constructor() {
    super();
  }
  private AddListingUseCase = new AddListingUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddListingController();
    }
    return this.instance;
  }

  async addListing(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<ListingModel[]> =
        await this.AddListingUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        console.log(this.state.value.data);
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "AddListing Success",
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
