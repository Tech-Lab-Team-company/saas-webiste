import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
// import type UserModel from "../../Data/models/education_stages_model";
import QuestionAnswerUseCase from "../../Domain/use_case/submit_question_answer_use_case";
import type QuestionAnswerModel from "../../Data/models/submit_question_answer_model";
import { routerKey } from "vue-router";

export default class QuestionAnswerController extends ControllerInterface<QuestionAnswerModel> {
  private static instance: QuestionAnswerController;
  private constructor() {
    super();
  }
  private questionAnswerUseCase = new QuestionAnswerUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new QuestionAnswerController();
    }
    return this.instance;
  }

  async SubmitQuestionAnswer(params: Params , status:string) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<QuestionAnswerModel> =
        await this.questionAnswerUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {


        if(status === "final") {
            DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Exam Finished Successfully",
          imageElement: successImage,
          messageContent: null,
        });
        const router = useRouter();
        router.push(`/course/${router.currentRoute.value.params.id}`)
        } else{

          // DialogSelector.instance.successDialog.openDialog({
          //   dialogName: "dialog",
          //   titleContent: "Answer Submitted Successfully",
          //   imageElement: successImage,
          //   messageContent: null,
          // });
        }

  
      } else {
        throw new Error(this.state.value.error?.title);
      }
    } catch (error: any) {
      // DialogSelector.instance.errorDialog.openDialog({
      //   dialogName: "dialog",
      //   titleContent: error,
      //   imageElement: errorImage,
      //   messageContent: null,
      // });
      return this.state;
    }
    return this.state;
  }
}


