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
    image: ImageModel;
    app_image?: {
        img: string;
        alt: string;
    };
    cover: ImageModel;
    address: string;
    primary_color: string;
    secondary_color: string;
    whatsapp_otp_activation:number;
    join_option_status:number;
    app_store:string;
    play_store:string;
    chatbot:number;
    country_code:string;
    email_required:boolean;
    allow_parent_name:boolean;
    allow_parent_phone:boolean;
    address_required:boolean;
    allow_student_education:boolean;
    country_code_required:boolean;
    teachers_slider:boolean;
    general_subjects_slider:boolean;
    have_desktop:boolean;
    desktop_app:string;
    buy_option_status:number;
    allow_coupon:boolean;
    allow_complete_data:boolean;
}
