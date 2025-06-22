import type ImageModel from "~/features/FetchCourseDetails/Data/models/image_model";


export default interface WebStatus {
    name: string;
    status: number;
    website: string;
    email: string;
    phone: string;
    youtube: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    whatsapp: string;
    instagram: string;
    instapay: string;
    tikTok: string;
    description: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    allow_payment_gateway: boolean;
    expire_app: number;
    img: ImageModel;
    cover: ImageModel;
    primary_color: string;
    secondary_color: string;
    whatsapp_otp_activation:number;

}

