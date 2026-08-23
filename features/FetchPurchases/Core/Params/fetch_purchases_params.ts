import type Params from "~/base/core/Params/params";

export default class FetchPurchasesParams implements Params {
  toMap(): { [key: string]: never } {
    return {};
  }
}
