import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {readCaptionFromElement} from '../../utils/read-caption-from-element';
import {$createProductNode, ProductNodeDataset} from './ProductNode';

export function parseProductNode(): DOMConversionMap | null {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isKgProductCard = nodeElem.classList?.contains('kg-product-card');
            if (nodeElem.tagName === 'DIV' && isKgProductCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput | null {
                        const title = readCaptionFromElement(domNode, {selector: '.kg-product-card-title'});
                        const description = readCaptionFromElement(domNode, {selector: '.kg-product-card-description'});

                        const payload: ProductNodeDataset = {
                            productButtonEnabled: false,
                            productRatingEnabled: false,
                            productTitle: title,
                            productDescription: description
                        };

                        const img = domNode.querySelector('.kg-product-card-image');
                        if (img && img.getAttribute('src')) {
                            const imgSrc = img.getAttribute('src');
                            payload.productImageSrc = imgSrc ? imgSrc : undefined;

                            const width = img.getAttribute('width');
                            payload.productImageWidth = width ? width : undefined;

                            const height = img.getAttribute('height');
                            payload.productImageHeight = height ? height : undefined;
                        }

                        const stars = [...domNode.querySelectorAll('.kg-product-card-rating-active')].length;
                        if (stars) {
                            payload.productRatingEnabled = true;
                            payload.productStarRating = stars;
                        }

                        const button = domNode.querySelector('a');

                        if (button) {
                            const buttonUrl = button.getAttribute('href');
                            const buttonText = getButtonText(button);

                            if (buttonUrl && buttonText) {
                                payload.productButtonEnabled = true;
                                payload.productButton = buttonText;
                                payload.productUrl = buttonUrl;
                            }
                        }

                        if (!title && !description && !img && !button) {
                            return null;
                        }

                        const node = $createProductNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}

function getButtonText(node: HTMLElement): string | null {
    let buttonText = node.textContent;
    if (buttonText) {
        buttonText = buttonText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    }
    return buttonText;
}
