import type BlogsCard from "./blogscard";
import type CourseInterface from "./course_interface";
import type MediaInterface from "./media";

export default interface ChildrenInterface {
    id: number;
    title: string;
    subtitle: string;
    description: string | null;
    order: number;
    style: number;
    type: number;
    icon: string;
    media: MediaInterface[];
    courses: CourseInterface[];
    blogs: BlogsCard[];   
    children:   ChildrenInterface[]
}

