import type Params from "~/base/core/Params/params";

export default class ScanCodeParams implements Params {
  private static readonly QR_SUBSCRIPTION_TYPE = 3;

  constructor(public readonly code: string) {}

  toMap(): { [key: string]: string | number } {
    return {
      code: this.code.trim(),
      subscription_type: ScanCodeParams.QR_SUBSCRIPTION_TYPE,
    };
  }
}
