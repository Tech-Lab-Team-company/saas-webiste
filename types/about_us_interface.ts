import type AboutUsVisionInterface from "./about_us_vision_interface";
import type StatisticsInterface from "./statistics_interface";
import type TitleInterface from "./title_intefrace";


export default interface AboutUsInterface {
    statistics:StatisticsInterface;
    vision:AboutUsVisionInterface;
    stages:TitleInterface[]    
}


