import type BlogsCard from "./blogscard";
import type CourseInterface from "./course_interface";
import type MediaInterface from "./media";
import type TitleInterface from "./title_intefrace";

export default interface HomeFirstSection {
    id: number;
    title: string;
    subtitle:string ;
    description: string;
    order: number;
    style: number;
    type: number;
    media: MediaInterface[];
    courses:CourseInterface[];
    blogs:BlogsCard [];
    
}


