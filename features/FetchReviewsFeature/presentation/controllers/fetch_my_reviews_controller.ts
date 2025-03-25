import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import MyReviews from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchMyReviewsUseCase from "~/features/FetchReviewsFeature/Domain/use_case/fetch_my_reviews_use_case";

export default class FetchMyReviewsController extends ControllerInterface<
  MyReviews[]
> {
  private static instance: FetchMyReviewsController;
  private constructor() {
    super();
  }
  private FetchMyReviewsUseCase = new FetchMyReviewsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyReviewsController();
    }
    return this.instance;
  }

  async fetchMyReviews(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<MyReviews[]> =
        await this.FetchMyReviewsUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      return this.state;
    }
  }

  async fetchMyReviewsPagination(params: Params) {
    if (this.isFetching) return; // Prevent multiple requests

    this.startPaginationLoading();
    // console.log("fetchMyReviewsPagination");
    // console.log(this.getPaginationLoading());
    try {
      // Check if pagination is already at the last page or if pagination is already loading
      if (
        this.state.value.pagination?.current! >
          this.state.value.pagination?.last! ||
        this.getPaginationLoading()
      ) {
        return this.state;
      }
  
      // Fetch new data
      const dataState: DataState<MyReviews[]> =
        await this.FetchMyReviewsUseCase.call(params);
  
      // Check if the data fetch was successful
      if (this.isDataSuccess()) {
        // If there is existing data, concatenate the new data with the existing data
        if (this.state.value.data) {
          const updatedData = [...this.state.value.data, ...dataState.value.data];
          this.setState({
            ...this.state.value,
            data: updatedData,
            pagination: dataState.value?.pagination, // Update pagination info
          });
        } else {
          // If there is no existing data, just set the new data
          this.setState(dataState);
        }
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title);
      }
    } catch (error: any) {
      // Handle errors and return the current state
      return this.state;
    } finally {
      this.stopPaginationLoading();
    }
  }
}
