import type ChildrenInterface from "./children_interface";
import type CourseInterface from "./course_interface";
import type MediaInterface from "./media";


export default interface AboutUsInterface {
    id: number;
    title: string;
    subtitle:string ;
    description: string;
    order: number;
    style: number;
    type: number;
    icon: string;
    media: MediaInterface[]; 
    courses: CourseInterface[];    
    blogs:[]
    children:ChildrenInterface[]
}








