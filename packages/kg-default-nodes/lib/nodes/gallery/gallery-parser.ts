import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical/LexicalNode.js';
import {readCaptionFromElement} from '../../utils/read-caption-from-element.js';
import {readImageAttributesFromElement} from '../../utils/read-image-attributes-from-element.js';
import {$createGalleryNode, GalleryNodeDataset} from './GalleryNode.js';

function readGalleryImageAttributesFromElement(element: HTMLImageElement, imgNum: number) {
    const image = readImageAttributesFromElement(element);

    image.fileName = element.src?.match(/[^/]*$/)?.[0];
    image.row = Math.floor(imgNum / 3);

    return image;
}

export function parseGalleryNode(): DOMConversionMap | null {
    return {
        figure: (nodeElem: HTMLElement): DOMConversion | null => {
            // Koenig gallery card
            if (nodeElem.classList?.contains('kg-gallery-card')) {
                return {
                    conversion(domNode): DOMConversionOutput {
                        const payload: GalleryNodeDataset = {};
                        const imgs = Array.from(domNode.querySelectorAll('img'));

                        payload.images = imgs.map(readGalleryImageAttributesFromElement);
                        payload.caption = readCaptionFromElement(domNode);

                        const node = $createGalleryNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }

            return null;
        },
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            // Medium "graf" galleries
            function isGrafGallery(node: HTMLElement): boolean {
                if (node.tagName === 'DIV' && node.dataset?.paragraphCount && node.querySelectorAll('img').length > 0) {
                    return true;
                }
                return false;
            }

            if (isGrafGallery(nodeElem)) {
                return {
                    conversion(domNode): DOMConversionOutput {
                        const payload: GalleryNodeDataset = {
                            caption: readCaptionFromElement(domNode)
                        };

                        // These galleries exist as a series of divs containing multiple figure+img.
                        // Grab the first set of imgs...
                        let imgs = Array.from(domNode.querySelectorAll('img'));

                        // ...and then iterate over any remaining divs until we run out of matches
                        let nextNode = domNode.nextElementSibling as HTMLElement;
                        while (nextNode && isGrafGallery(nextNode)) {
                            const currentNode = nextNode;
                            imgs = imgs.concat(Array.from(currentNode.querySelectorAll('img')));

                            const currentNodeCaption = readCaptionFromElement(currentNode);
                            if (currentNodeCaption) {
                                payload.caption = `${payload.caption} / ${currentNodeCaption}`;
                            }

                            nextNode = currentNode.nextElementSibling as HTMLElement;

                            // remove nodes as we go so that they don't go through the parser
                            currentNode.remove();
                        }

                        payload.images = imgs.map(readGalleryImageAttributesFromElement);

                        const node = $createGalleryNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }

            // Squarespace SQS galleries
            function isSqsGallery(node: HTMLElement): boolean {
                if (node.tagName === 'DIV' && node.className.match(/sqs-gallery-container/) && !node.className.match(/summary-/)) {
                    return true;
                }
                return false;
            }

            if (isSqsGallery(nodeElem)) {
                return {
                    conversion(domNode): DOMConversionOutput {
                        const payload: GalleryNodeDataset = {};

                        // Each image exists twice...
                        // The first image is wrapped in `<noscript>`
                        // The second image contains image dimensions but the src property needs to be taken from `data-src`.
                        let imgs: HTMLImageElement[] = Array.from(domNode.querySelectorAll('img.thumb-image'));

                        imgs = imgs.filter((img) => {
                            if (!img.getAttribute('src')) {
                                if (img.previousElementSibling?.tagName === 'NOSCRIPT' && img.previousElementSibling.getElementsByTagName('img').length) {
                                    const prevNode = img.previousElementSibling;
                                    const src = img.getAttribute('data-src');
                                    if (src) {
                                        img.setAttribute('src', src);
                                    }
                                    prevNode.remove();
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            return true;
                        });

                        // Process nodes into the payload
                        payload.images = imgs.map(readGalleryImageAttributesFromElement);

                        payload.caption = readCaptionFromElement(domNode, {selector: '.meta-title'});

                        const node = $createGalleryNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }

            return null;
        }
    };
}
