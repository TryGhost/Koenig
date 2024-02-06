/* eslint-disable ghost/filenames/match-exported-class */
import {$applyNodeReplacement, EditorConfig, LexicalNode, NodeKey, TextNode} from 'lexical';
import {SerializedTextNode} from 'lexical/nodes/LexicalTextNode';

export class TKNode extends TextNode {
    static getType(): string {
        return 'tk';
    }

    static clone(node: TKNode): TKNode {
        return new TKNode(node.__text, node.__key);
    }

    constructor(text: string, key?: NodeKey) {
        super(text, key);
    }

    createDOM(config: EditorConfig) {
        const element = super.createDOM(config);
        const classes = config.theme.tk?.split(' ') || [];
        element.classList.add(...classes);
        element.dataset.kgTk = "true";
        return element;
    }

    static importJSON(serializedNode: SerializedTextNode): TKNode {
        const node = $createTKNode(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }

    exportJSON(): SerializedTextNode {
        return {
            ...super.exportJSON(),
            type: 'tk'
        };
    }

    canInsertTextBefore(): false {
        return false;
    }

    isTextEntity(): true {
        return true;
    }
}

/**
 * Generates a TKNode, which is a string following the format of a # followed by some text, eg. #lexical.
 * @param text - The text used inside the TKNode.
 * @returns - The TKNode with the embedded text.
 */
export function $createTKNode(text: string): TKNode {
    return $applyNodeReplacement(new TKNode(text));
}

/**
 * Determines if node is a TKNode.
 * @param node - The node to be checked.
 * @returns true if node is a TKNode, false otherwise.
 */
export function $isTKNode(node: LexicalNode): node is TKNode {
    return node instanceof TKNode;
}
