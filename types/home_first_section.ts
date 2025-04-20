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
    courses: [];
    blogs: [];
    
}


// "id": 84,
// "title": "ll",
// "subtitle": "aaa",
// "description": "aaa",
// "order": 1,
// "style": 1,
// "type": 7,
// "media": [],
// "courses": [],
// "blogs": []