import {DecoratorNode, createCommand} from 'lexical';
import {convertImageDom} from './ImageDOMImporter';

export const INSERT_IMAGE_COMMAND = createCommand();
export const UPLOAD_IMAGE_COMMAND = createCommand();

export class ImageNode extends DecoratorNode {
    // payload properties
    __src;
    __caption;
    __altText;
    __cardWidth;
    __width;
    __height;

    static getType() {
        return 'image';
    }

    static clone(node) {
        return new ImageNode(
            {
                src: node.__src,
                caption: node.__caption,
                altText: node.__altText,
                cardWidth: node.__cardWidth,
                width: node.__width,
                height: node.__height
            },
            node.__key
        );
    }

    // from https://github.com/TryGhost/Ghost/blob/main/ghost/admin/app/components/gh-image-uploader.js#L18
    static extensionTypes = ['gif', 'jpg', 'jpeg', 'png', 'svg', 'svgz', 'webp'];
    static mimeTypes = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

    static importJSON(serializedNode) {
        const {caption, altText, src, cardWidth, width, height} = serializedNode;
        const node = $createImageNode({
            altText,
            caption,
            src,
            cardWidth,
            width,
            height
        });
        return node;
    }

    exportDOM() {
        const element = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        img.src = this.getSrc();
        figcaption.innerHTML = this.getCaption();
        element.appendChild(img);
        element.appendChild(figcaption);
        return {element};
    }

    static importDom() {
        return convertImageDom;
    }

    constructor({src, caption, altText, cardWidth, width, height} = {}, key) {
        super(key);
        this.__caption = caption || '';
        this.__altText = altText || '';
        this.__src = src || '';
        this.__cardWidth = cardWidth || 'regular';
        this.__width = width || null;
        this.__height = height || null;
    }

    exportJSON() {
        // checks if src is a data string
        const src = this.getSrc();
        const isBlob = src.startsWith('data:');
        const dataset = {
            altText: this.getAltText(),
            caption: this.getCaption(),
            src: isBlob ? '<base64String>' : this.getSrc(),
            type: 'image',
            cardWidth: this.getCardWidth(),
            width: this.getImgWidth(),
            height: this.getImgHeight()
        };
        return dataset;
    }

    createDOM() {
        const element = document.createElement('div');
        return element;
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return false;
    }

    getSrc() {
        return this.__src;
    }

    setSrc(src) {
        const writable = this.getWritable();
        return writable.__src = src;
    }

    setCardWidth(cardWidth) {
        const writable = this.getWritable();
        return writable.__cardWidth = cardWidth;
    }

    getCardWidth() {
        return this.__cardWidth;
    }

    getImgWidth() {
        return this.__width;
    }

    setImgWidth(width) {
        const writable = this.getWritable();
        return writable.__width = width;
    }

    getImgHeight() {
        return this.__height;
    }

    setImgHeight(height) {
        const writable = this.getWritable();
        return writable.__height = height;
    }

    getCaption() {
        return this.__caption;
    }

    setCaption(caption) {
        const writable = this.getWritable();
        return writable.__caption = caption;
    }

    getAltText() {
        return this.__altText;
    }

    setAltText(altText) {
        const writable = this.getWritable();
        return writable.__altText = altText;
    }

    // should be overridden
    decorate() {
        return '';
    }
}

export const $createImageNode = (dataset) => {
    return new ImageNode(dataset);
};

export function $isImageNode(node) {
    return node instanceof ImageNode;
}
