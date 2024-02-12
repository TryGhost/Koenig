import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical/LexicalNode.js';
import {readCaptionFromElement} from '../../utils/read-caption-from-element.js';
import {readImageAttributesFromElement} from '../../utils/read-image-attributes-from-element.js';
import {$createImageNode, ImageNodeDataset} from './ImageNode.js';

export function parseImageNode(): DOMConversionMap | null {
    return {
        img: (): DOMConversion => ({
            conversion(domNode: HTMLElement): DOMConversionOutput | null {
                if (domNode.tagName === 'IMG') {
                    const payload: ImageNodeDataset = readImageAttributesFromElement(domNode as HTMLImageElement);

                    const node = $createImageNode(payload);
                    return {node};
                }

                return null;
            },
            priority: 1
        }),
        figure: (nodeElem: HTMLElement): DOMConversion | null => {
            const img = nodeElem.querySelector('img');
            if (img) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput | null {
                        const kgClass = domNode.className.match(/kg-width-(wide|full)/);
                        const grafClass = domNode.className.match(/graf--layout(FillWidth|OutsetCenter)/);

                        if (!img) {
                            return null;
                        }

                        const payload: ImageNodeDataset = readImageAttributesFromElement(img);

                        if (kgClass) {
                            payload.cardWidth = kgClass[1];
                        } else if (grafClass) {
                            payload.cardWidth = grafClass[1] === 'FillWidth' ? 'full' : 'wide';
                        }

                        payload.caption = readCaptionFromElement(domNode);

                        const node = $createImageNode(payload);
                        return {node};
                    },
                    priority: 0 // since we are generically parsing figure elements, we want this to run after others (like the gallery)
                };
            }
            return null;
        }
    };
}
