/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderMarkdownNode} from './markdown-renderer';

export type MarkdownNodeDataset = {
    markdown?: string;
};

type MarkdownNodeProps = {
    nodeType: 'markdown';
    properties: KoenigDecoratorNodeProperties;
};

const markdownNodeProps: MarkdownNodeProps = {
    nodeType: 'markdown',
    properties: [
        {name: 'markdown', default: '', urlType: 'markdown', wordCount: true}
    ]
};

export class MarkdownNode extends generateDecoratorNode(markdownNodeProps) {
    exportDOM(options = {}) {
        return renderMarkdownNode(this, options);
    }

    isEmpty() {
        return !this.__markdown;
    }
}

export function $createMarkdownNode(dataset: MarkdownNodeDataset) {
    return new MarkdownNode(dataset);
}

export function $isMarkdownNode(node: LexicalNode) {
    return node instanceof MarkdownNode;
}
