import defaultImageSrc from '~/assets/images/5907.jpg';

export function setDefaultImage(event: Event, defaultImage: string = defaultImageSrc) {
    if (event.target instanceof HTMLImageElement) event.target.src = defaultImage
}