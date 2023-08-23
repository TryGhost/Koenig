import {readCaptionFromElement} from '../../utils/read-caption-from-element.js';
import {readImageAttributesFromElement} from '../../utils/read-image-attributes-from-element.js';

export function parseImageNode(ImageNode) {
    return {
        img: () => ({
            conversion(domNode) {
                if (domNode.tagName === 'IMG') {
                    const {src, width, height, alt, title} = readImageAttributesFromElement(domNode);

                    const node = new ImageNode({alt, src, title, width, height});
                    return {node};
                }

                return null;
            },
            priority: 1
        }),
        figure: (nodeElem) => {
            if (!nodeElem.querySelector('img')) {
                return null;
            }
            return {
                conversion(domNode) {
                    const img = domNode.querySelector('img');
                    const kgClass = domNode.className.match(/kg-width-(wide|full)/);
                    const grafClass = domNode.className.match(/graf--layout(FillWidth|OutsetCenter)/);

                    if (!img) {
                        return null;
                    }

                    const payload = readImageAttributesFromElement(img);

                    if (kgClass) {
                        payload.cardWidth = kgClass[1];
                    } else if (grafClass) {
                        payload.cardWidth = grafClass[1] === 'FillWidth' ? 'full' : 'wide';
                    }

                    payload.caption = readCaptionFromElement(domNode);

                    const {src, width, height, alt, title, caption, cardWidth, href} = payload;
                    const node = new ImageNode({alt, src, title, width, height, caption, cardWidth, href});
                    return {node};
                },
                priority: 1
            };
        }
    };
}
