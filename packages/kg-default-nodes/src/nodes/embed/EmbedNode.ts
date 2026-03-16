import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parseEmbedNode} from './embed-parser.js';
import {renderEmbedNode} from './embed-renderer.js';

export interface EmbedNode {
    url: string;
    embedType: string;
    html: string;
    metadata: Record<string, unknown>;
    caption: string;
}

export class EmbedNode extends generateDecoratorNode({
    nodeType: 'embed',
    properties: [
        {name: 'url', default: '', urlType: 'url'},
        {name: 'embedType', default: ''},
        {name: 'html', default: ''},
        {name: 'metadata', default: {}},
        {name: 'caption', default: '', wordCount: true}
    ],
    defaultRenderFn: renderEmbedNode
}) {
    static importDOM() {
        return parseEmbedNode(this);
    }

    isEmpty() {
        return !this.__url && !this.__html;
    }
}

export const $createEmbedNode = (dataset: Record<string, unknown>) => {
    return new EmbedNode(dataset);
};

export function $isEmbedNode(node: unknown): node is EmbedNode {
    return node instanceof EmbedNode;
}
