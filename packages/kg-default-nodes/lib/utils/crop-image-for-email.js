import {isLocalContentImage} from './is-local-content-image';

export const getCroppedImage = (src, options) => {
    if (isLocalContentImage(src, options.siteUrl) && options.canTransformImage?.(src)) {
        const [, imagesPath, filename] = src.match(/(.*\/content\/images)\/(.*)/);
        return {
            src: `${imagesPath}/size/w256h256/${filename}`,
            width: 256,
            height: 256
        };
    }
};
