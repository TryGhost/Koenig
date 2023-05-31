import {createCommand} from 'lexical';
import {KoenigDecoratorNode} from '../../KoenigDecoratorNode';
import {GalleryParser} from './GalleryParser';
import {renderGalleryNodeToDOM} from './GalleryRenderer';

export const INSERT_GALLERY_COMMAND = createCommand();

export class GalleryNode extends KoenigDecoratorNode {
    // payload properties
    __images;
    __caption;

    static getType() {
        return 'gallery';
    }

    static clone(node) {
        return new this(
            node.getDataset(),
            node.__key
        );
    }

    static get urlTransformMap() {
        return {
            caption: 'html',
            images: {
                src: 'url',
                caption: 'html'
            }
        };
    }

    getDataset() {
        const self = this.getLatest();
        return {
            images: self.__images,
            caption: self.__caption
        };
    }

    constructor({images, caption} = {}, key) {
        super(key);
        this.__images = images || [];
        this.__caption = caption || '';
    }

    static importJSON(serializedNode) {
        const {images, caption} = serializedNode;
        return new this({images, caption});
    }

    exportJSON() {
        return {
            type: 'gallery',
            version: 1,
            images: this.getImages(),
            caption: this.getCaption()
        };
    }

    static importDOM() {
        const parser = new GalleryParser(this);
        return parser.DOMConversionMap;
    }

    exportDOM(options = {}) {
        const element = renderGalleryNodeToDOM(this, options);
        return {element};
    }

    getImages() {
        const self = this.getLatest();
        return self.__images;
    }

    setImages(images) {
        const writable = this.getWritable();
        return writable.__images = images;
    }

    getCaption() {
        const self = this.getLatest();
        return self.__caption;
    }

    setCaption(caption) {
        const writable = this.getWritable();
        return writable.__caption = caption;
    }

    hasEditMode() {
        return false;
    }
}

export const $createGalleryNode = (dataset) => {
    return new GalleryNode(dataset);
};

export function $isGalleryNode(node) {
    return node instanceof GalleryNode;
}
