/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseCodeBlockNode} from './codeblock-parser';
import {renderCodeBlockNode} from './codeblock-renderer';

export type CodeBlockNodeDataset = {
    code?: string;
    language?: string;
    caption?: string;
};

type CodeBlockNodeProps = {
    nodeType: 'codeblock';
    properties: KoenigDecoratorNodeProperties
};

const codeBlockNodeProps: CodeBlockNodeProps = {
    nodeType: 'codeblock',
    properties: [
        {name: 'code', default: '', wordCount: true},
        {name: 'language', default: ''},
        {name: 'caption', default: '', urlType: 'html', wordCount: true}
    ]
};

export class CodeBlockNode extends generateDecoratorNode(codeBlockNodeProps) {
    static importDOM() {
        return parseCodeBlockNode(this);
    }

    exportDOM(options = {}) {
        return renderCodeBlockNode(this, options);
    }

    isEmpty() {
        return !this.__code;
    }
}

export function $createCodeBlockNode(dataset: CodeBlockNodeDataset) {
    return new CodeBlockNode(dataset);
}

export function $isCodeBlockNode(node: LexicalNode) {
    return node instanceof CodeBlockNode;
}
