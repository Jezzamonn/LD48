export const images: {[key: string]: ImageInfo} = {};

export interface ImageInfo {
    image?: HTMLImageElement;
    loaded: boolean;
    loadPromise?: Promise<ImageInfo>;
}

/**
 * Asynchronously fetches an image.
 */
export function loadImage({name, path, extension = 'png'} : {name: string, path: string, extension?: string}): Promise<ImageInfo> {
    const promise = new Promise<ImageInfo>((resolve) => {
        if (images.hasOwnProperty(name)) {
            throw new Error(`Already loaded image ${name}.`);
        }

        if (!path.endsWith('/')) {
            path = path + '/';
        }
        const imagePath = `${path}${name}.${extension}`;

        images[name] = {
            loaded: false,
            image: undefined,
            loadPromise: promise,
        };

        const image = new Image();
        image.onload = () => {
            images[name].image = image;
            images[name].loaded = true;
            resolve(images[name]);
        }
        image.onerror = () => {
            throw new Error(`Error loading image ${name}.`);
        }
        image.src = imagePath;
    });
    return promise;
}

/** Applies a filter on an image, and caches the result */
export function getFilteredImage(name: string, filter: string): ImageInfo {
    const filteredImageName = name + ':filter=' + filter;
    if (images.hasOwnProperty(filteredImageName)) {
        return images[filteredImageName];
    }

    if (!images.hasOwnProperty(name)) {
        throw new Error(`Cannot apply filter to image ${name} as it doesn\'t exist.`);
    }

    const baseImageInfo = images[name];

    images[filteredImageName] = {
        loaded: false,
        image: undefined,
        loadPromise: Promise.resolve(images[filteredImageName]),
    }

    if (baseImageInfo.image == null) {
        throw new Error(`Can't generate filtered image until base image is loaded.`);
    }

    const canvas = document.createElement('canvas');
    canvas.width = baseImageInfo.image.width;
    canvas.height = baseImageInfo.image.height;

    const context = canvas.getContext('2d')!;
    context.filter = filter;

    context.drawImage(baseImageInfo.image, 0, 0);
    const image = new Image();
    image.src = canvas.toDataURL();

    images[filteredImageName].image = image;
    images[filteredImageName].loaded = true;

    return images[filteredImageName];
}