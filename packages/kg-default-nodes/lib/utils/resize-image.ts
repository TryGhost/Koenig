interface ImageProps {
    width?: number;
    height?: number;
}

export const resizeImage = function (image: HTMLImageElement, {width: desiredWidth, height: desiredHeight}: ImageProps = {}) {
    const {width, height} = image;
    const ratio = width / height;

    if (desiredWidth) {
        const resizedHeight = Math.round(desiredWidth / ratio);

        return {
            width: desiredWidth,
            height: resizedHeight
        };
    }

    if (desiredHeight) {
        const resizedWidth = Math.round(desiredHeight * ratio);

        return {
            width: resizedWidth,
            height: desiredHeight
        };
    }
};
