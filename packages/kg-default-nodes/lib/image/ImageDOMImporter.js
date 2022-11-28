import {$createImageNode} from './ImageNode';

export function convertImageElement(domNode) {
    if (domNode instanceof HTMLImageElement) {
        const {alt: altText, src} = domNode;
        const node = $createImageNode({altText, src});
        return {node};
    }

    return null;
}

export const convertImageDom = {
    img: (node = Node) => ({
        conversion: convertImageElement,
        priority: 1
    })
    // TODO: add <figure> and other handling from kg-parser-plugins
}
