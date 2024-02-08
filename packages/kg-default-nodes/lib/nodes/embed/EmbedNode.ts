/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseEmbedNode} from './embed-parser';
import {renderEmbedNode} from './embed-renderer';

export type EmbedNodeDataset = {
    url?: string;
    embedType?: string;
    html?: string;
    metadata?: object;
    caption?: string;
};

type EmbedNodeProps = {
    nodeType: 'embed';
    properties: KoenigDecoratorNodeProperties;
};

const embedNodeProps: EmbedNodeProps = {
    nodeType: 'embed',
    properties: [
        {name: 'url', default: '', urlType: 'url'},
        {name: 'embedType', default: ''},
        {name: 'html', default: ''},
        {name: 'metadata', default: {}},
        {name: 'caption', default: '', wordCount: true}
    ]
};

export class EmbedNode extends generateDecoratorNode(embedNodeProps) {
    static importDOM() {
        return parseEmbedNode(this);
    }

    exportDOM(options = {}) {
        return renderEmbedNode(this, options);
    }

    isEmpty() {
        return !this.__url && !this.__html;
    }
}

export const $createEmbedNode = (dataset: EmbedNodeDataset) => {
    return new EmbedNode(dataset);
};

export function $isEmbedNode(node: LexicalNode) {
    return node instanceof EmbedNode;
}
