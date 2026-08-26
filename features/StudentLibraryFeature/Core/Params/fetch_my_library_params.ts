import type Params from "~/base/core/Params/params";

/** Both library endpoints currently require no request body. */
export default class FetchMyLibraryParams implements Params {
  toMap(): Record<string, never> {
    return {};
  }
}
