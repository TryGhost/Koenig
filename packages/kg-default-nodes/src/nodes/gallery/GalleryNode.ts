import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parseGalleryNode} from './gallery-parser.js';
import {renderGalleryNode} from './gallery-renderer.js';
export interface GalleryNode {
    images: unknown[];
    caption: string;
}

export class GalleryNode extends generateDecoratorNode({
    nodeType: 'gallery',
    properties: [
        {name: 'images', default: []},
        {name: 'caption', default: '', wordCount: true}
    ],
    defaultRenderFn: renderGalleryNode
}) {
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

    static importDOM() {
        return parseGalleryNode(this);
    }

    hasEditMode() {
        return false;
    }
}

export const $createGalleryNode = (dataset: Record<string, unknown>) => {
    return new GalleryNode(dataset);
};

export function $isGalleryNode(node: unknown): node is GalleryNode {
    return node instanceof GalleryNode;
}
