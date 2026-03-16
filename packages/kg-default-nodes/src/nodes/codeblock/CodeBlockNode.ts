import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parseCodeBlockNode} from './codeblock-parser.js';
import {renderCodeBlockNode} from './codeblock-renderer.js';

export interface CodeBlockNode {
    code: string;
    language: string;
    caption: string;
}

export class CodeBlockNode extends generateDecoratorNode({
    nodeType: 'codeblock',
    properties: [
        {name: 'code', default: '', wordCount: true},
        {name: 'language', default: ''},
        {name: 'caption', default: '', urlType: 'html', wordCount: true}
    ],
    defaultRenderFn: renderCodeBlockNode
}) {
    static importDOM() {
        return parseCodeBlockNode(this);
    }

    isEmpty() {
        return !this.__code;
    }
}

export function $createCodeBlockNode(dataset: Record<string, unknown>) {
    return new CodeBlockNode(dataset);
}

export function $isCodeBlockNode(node: unknown): node is CodeBlockNode {
    return node instanceof CodeBlockNode;
}
