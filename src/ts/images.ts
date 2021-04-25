import { string } from "yargs";

export const images: {[key: string]: ImageInfo} = {};

interface ImageInfo {
    image?: HTMLImageElement;
    loaded: boolean;
    loadPromise?: Promise<void>;
}

/**
 * Asynchronously fetches an image.
 */
export function loadImage({name, path} : {name: string, path: string}) {
    const promise = new Promise<void>((resolve) => {
        if (images.hasOwnProperty(name)) {
            console.log(`Already loaded image ${name}.`);

            return images[name].loadPromise;
        }

        if (!path.endsWith('/')) {
            path = path + '/';
        }
        const imagePath = `${path}${name}.png`;

        images[name] = {
            loaded: false,
            image: undefined,
            loadPromise: promise,
        };

        const image = new Image();
        image.onload = () => {
            images[name].image = image;
            images[name].loaded = true;
            resolve();
        }
        image.onerror = () => {
            throw new Error(`Error loading image ${name}.`);
        }
        image.src = imagePath;
    });
    return promise;
}