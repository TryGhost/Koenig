/* eslint-disable ghost/filenames/match-exported-class */
import {DOMConversionMap, ElementFormatType, ElementNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread} from 'lexical';
import {parseAsideNode} from './aside-parser';

export type SerializedAsideNode = Spread<{
    format: ElementFormatType,
    indent: number,
    direction: 'ltr' | 'rtl' | null
}, SerializedLexicalNode>;

export class AsideNode extends ElementNode {
    static getType(): string {
        return 'aside';
    }

    static clone(node: AsideNode): AsideNode {
        return new this(
            node.__key
        );
    }

    static get urlTransformMap() {
        return {};
    }

    constructor(key?: NodeKey) {
        super(key);
    }

    static importJSON(serializedNode: SerializedAsideNode): AsideNode {
        const node = new this();
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }

    exportJSON() {
        const dataset = {
            ...super.exportJSON(),
            type: 'aside',
            version: 1
        };
        return dataset;
    }

    static importDOM(): DOMConversionMap | null {
        return parseAsideNode();
    }

    /* c8 ignore start */
    createDOM(): HTMLElement {
        return document.createElement('div');
    }

    updateDOM(): false {
        return false;
    }

    isInline(): false {
        return false;
    }

    extractWithChild(): true {
        return true;
    }
    /* c8 ignore stop */
}

export function $createAsideNode(): AsideNode {
    return new AsideNode();
}

export function $isAsideNode(node: LexicalNode | null): node is AsideNode {
    return node instanceof AsideNode;
}
