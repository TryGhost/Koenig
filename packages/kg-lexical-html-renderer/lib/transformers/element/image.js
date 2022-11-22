const {$isImageNode} = require('../../nodes/ImageNode');
const {getAvailableImageWidths} = require('../../utils/get-available-image-widths');
const {isLocalContentImage} = require('../../utils/is-local-content-image');
const {setSrcsetAttribute} = require('../../utils/srcset-attribute');
const {resizeImage} = require('../../utils/resize-image');

module.exports = {
    export(node, options) {
        if (!$isImageNode(node)) {
            return null;
        }

        let figureClasses = 'kg-card kg-image-card';
        if (node.cardWidth !== 'regular') {
            figureClasses += ` kg-width-${node.cardWidth}`;
        }

        let img = `<img src="${node.src}" alt="${node.altText}" loading="lazy" />`;

        let imgDimensions = '';
        let srcSet = '';

        if (node.width && node.height) {
            imgDimensions = `width="${node.width}" height="${node.height}"`;
            // parse imgDimensions into img
            img = img.replace('/>', `${imgDimensions} />`);
        }

        // images can be resized to max width, if that's the case output
        // the resized width/height attrs to ensure 3rd party gallery plugins
        // aren't affected by differing sizes
        const {canTransformImage} = options;
        const {defaultMaxWidth} = options.imageOptimization || {};
        if (
            defaultMaxWidth &&
            node.width > defaultMaxWidth &&
            isLocalContentImage(node.src, options.siteUrl) &&
            canTransformImage &&
            canTransformImage(node.src)
        ) {
            const {width, height} = resizeImage(node, {width: defaultMaxWidth});
            img = img.replace(imgDimensions, `width="${width}" height="${height}"`);
        }

        if (options.target !== 'email') {
            srcSet = setSrcsetAttribute(srcSet, node, options);
            // parse srcSet into img
            if (srcSet) {
                img = img.replace('/>', `srcset="${srcSet}" />`);
            }
            if (srcSet && node.width && node.width >= 720) {
                // standard size
                if (!node.cardWidth) {
                    let sizes = `sizes="(min-width: 720px) 720px"`;
                    img = img.replace('/>', ` ${sizes} />`);
                }

                if (node.cardWidth === 'wide' && node.width >= 1200) {
                    let sizes = `sizes="(min-width: 1200px) 1200px"`;
                    img = img.replace('/>', ` ${sizes} />`);
                }
            }
        }

        if (options.target === 'email' && node.width && node.height) {
            let imageDimensions = {
                width: node.width,
                height: node.height
            };
            if (node.width >= 600) {
                imageDimensions = resizeImage(imageDimensions, {width: 600});
            }
            img = img.replace('>', ` width="${imageDimensions.width}" height="${imageDimensions.height}">`);
            
            if (isLocalContentImage(node.src, options.siteUrl) && options.canTransformImage && options.canTransformImage(node.src)) {
                // find available image size next up from 2x600 so we can use it for the "retina" src
                const availableImageWidths = getAvailableImageWidths(node, options.imageOptimization.contentImageSizes);
                const srcWidth = availableImageWidths.find(width => width >= 1200);

                if (!srcWidth || srcWidth === node.width) {
                    // do nothing, width is smaller than retina or matches the original node src
                } else {
                    const [, imagesPath, filename] = node.src.match(/(.*\/content\/images)\/(.*)/);
                    img = img.replace(node.src, `${imagesPath}/size/w${srcWidth}/${filename}`);
                }
            }
        }

        return (`
        <figure class="${figureClasses}">
            ${img}
                <figcaption>
                ${node.caption}
                </figcaption>
        </figure>
        `);
    }
};
