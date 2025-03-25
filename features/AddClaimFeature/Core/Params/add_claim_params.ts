import type Params from "~/base/core/Params/params";
import email from "~/components/Icons/Email.vue";
import phone from "~/components/Icons/Phone.vue";

export default class AddClaimParams implements Params {
  public listingId: number;
  public fullName: string;
  public email: string;
  public phone: string;
  public notes: string | null;
  public images: string[];

  constructor(
    listingId: number,
    fullName: string,
    email: string,
    phone: string,
    notes: string | null,
    images: string[],
  ) {
    this.listingId = listingId;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.notes = notes;
    this.images = images;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    data["listing_id"] = this.listingId;
    data["full_name"] = this.fullName;
    data["email"] = this.email;
    data["phone"] = this.phone;
    data["comment"] = this.notes;
    data["images"] = this.images;
    return data;
  }
}
