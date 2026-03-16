import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {renderMarkdownNode} from './markdown-renderer.js';

export interface MarkdownNode {
    markdown: string;
}

export class MarkdownNode extends generateDecoratorNode({
    nodeType: 'markdown',
    properties: [
        {name: 'markdown', default: '', urlType: 'markdown', wordCount: true}
    ],
    defaultRenderFn: renderMarkdownNode
}) {
    isEmpty() {
        return !this.__markdown;
    }
}

export function $createMarkdownNode(dataset: Record<string, unknown>) {
    return new MarkdownNode(dataset);
}

export function $isMarkdownNode(node: unknown): node is MarkdownNode {
    return node instanceof MarkdownNode;
}
