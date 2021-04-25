import { string } from "yargs";

export const images: {[key: string]: ImageInfo} = {};

interface ImageInfo {
    image?: HTMLImageElement,
    loaded: boolean,
}

/**
 * Asynchronously fetches an image.
 */
export function loadImage({name, path} : {name: string, path: string}) {
    if (images.hasOwnProperty(name)) {
        console.log(`Already loaded image ${name}.`);
    }

    if (!path.endsWith('/')) {
        path = path + '/';
    }
    const imagePath = `${path}${name}.png`;

    images[name] = {
        loaded: false,
        image: undefined,
    };

    const image = new Image();
    image.onload = () => {
        images[name].image = image;
        images[name].loaded = true;
    }
    image.onerror = () => {
        throw new Error(`Error loading image ${name}.`);
    }
    image.src = imagePath;
}