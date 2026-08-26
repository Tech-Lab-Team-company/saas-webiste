import type Params from "~/base/core/Params/params";
import type { FavoriteEnum } from "../enums/favorite_params";

export default class AddFavoriteParams implements Params {
  constructor(
    public readonly type: FavoriteEnum,
    public readonly typeId: number,
  ) {
    if (!Number.isInteger(typeId) || typeId <= 0) {
      throw new Error("Favorite type_id must be a positive integer.");
    }
  }

  toMap(): Record<string, number> {
    return {
      type: this.type,
      type_id: this.typeId,
    };
  }
}
