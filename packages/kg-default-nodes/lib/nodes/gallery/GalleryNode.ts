/* eslint-disable ghost/filenames/match-exported-class */
import {DOMConversionMap, LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseGalleryNode} from './gallery-parser';
import {renderGalleryNode} from './gallery-renderer';

export type GalleryNodeDataset = {
    images?: Array<{
        src?: string;
        caption?: string;
    }>;
    caption?: string;
};

type GalleryNodeProps = {
    nodeType: 'gallery';
    properties: KoenigDecoratorNodeProperties;
};

const galleryNodeProps: GalleryNodeProps = {
    nodeType: 'gallery',
    properties: [
        {name: 'images', default: []},
        {name: 'caption', default: '', wordCount: true}
    ]
};

export class GalleryNode extends generateDecoratorNode(galleryNodeProps) {
    /* override */
    static get urlTransformMap() {
        return {
            caption: 'html',
            images: {
                src: 'url',
                caption: 'html'
            }
        };
    }

    static importDOM(): DOMConversionMap | null {
        return parseGalleryNode();
    }

    exportDOM(options = {}) {
        return renderGalleryNode(this, options);
    }

    hasEditMode() {
        return false;
    }
}

export const $createGalleryNode = (dataset: GalleryNodeDataset) => {
    return new GalleryNode(dataset);
};

export function $isGalleryNode(node: LexicalNode) {
    return node instanceof GalleryNode;
}
