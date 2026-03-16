import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {renderHtmlNode} from './html-renderer.js';
import {parseHtmlNode} from './html-parser.js';

export interface HtmlNode {
    html: string;
}

export class HtmlNode extends generateDecoratorNode({
    nodeType: 'html',
    hasVisibility: true,
    properties: [
        {name: 'html', default: '', urlType: 'html', wordCount: true}
    ],
    defaultRenderFn: renderHtmlNode
}) {
    static importDOM() {
        return parseHtmlNode(this);
    }

    isEmpty() {
        return !this.__html;
    }
}

export function $createHtmlNode(dataset: Record<string, unknown>) {
    return new HtmlNode(dataset);
}

export function $isHtmlNode(node: unknown): node is HtmlNode {
    return node instanceof HtmlNode;
}
