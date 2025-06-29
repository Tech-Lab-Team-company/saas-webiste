import type MediaInterface from "./media";
import type SidebarHashtag from "./sidebarhashtag";
import type TeacherInterface from "./teacher_interface";
import type TitleInterface from "./title_intefrace";

export default interface CourseInterface {
    id: number;
    title: string;
    description: string;
    image: {
        img: string
        alt: string
    };
    course_price: number;
    subject:SidebarHashtag;
    intro:string;
    teacher:TeacherInterface;
    course_videos: number,
    course_docs: number,
    course_records: number,
    is_paid: boolean,    
    is_subscribed: boolean,    
    currency: String,    
}
