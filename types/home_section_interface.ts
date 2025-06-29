import type BlogsCard from "./blogscard";
import type CourseInterface from "./course_interface";
import type MediaInterface from "./media";

export default interface HomeSection {
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
    course_records: number;
    course_videos: number;
    course_docs: number
    
}


