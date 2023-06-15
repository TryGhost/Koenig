import {createCommand} from 'lexical';
import {KoenigDecoratorNode} from '../../KoenigDecoratorNode';
import {renderMarkdownNodeToDOM} from './MarkdownRenderer';
import readTextContent from '../../utils/read-text-content';

export const INSERT_MARKDOWN_COMMAND = createCommand();

export class MarkdownNode extends KoenigDecoratorNode {
    // payload properties
    __markdown;

    static getType() {
        return 'markdown';
    }

    static clone(node) {
        return new this(node.getDataset(), node.__key);
    }

    static get urlTransformMap() {
        return {
            markdown: 'markdown'
        };
    }

    getDataset() {
        const self = this.getLatest();
        return {
            markdown: self.__markdown
        };
    }

    static importJSON(serializedNode) {
        const {markdown} = serializedNode;
        const node = new this({markdown});
        return node;
    }

    exportJSON() {
        return {
            type: 'markdown',
            version: 1,
            markdown: this.getMarkdown()
        };
    }

    constructor({markdown} = {}, key) {
        super(key);
        this.__markdown = markdown;
    }

    exportDOM(options = {}) {
        const {element} = renderMarkdownNodeToDOM(this, options);
        return {
            element,
            type: 'inner'
        };
    }

    getMarkdown() {
        return this.__markdown;
    }

    setMarkdown(markdown) {
        const writable = this.getWritable();
        return writable.__markdown = markdown;
    }

    hasEditMode() {
        return true;
    }

    isEmpty() {
        return !this.__markdown;
    }

    /* c8 ignore start */
    createDOM() {
        return document.createElement('div');
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return false;
    }
    /* c8 ignore stop */

    getTextContent() {
        // NOTE: this varies from previous mobiledoc behaviour which used rendered markdown for word count
        const self = this.getLatest();
        const text = readTextContent(self, 'markdown');
        return text ? `${text}\n\n` : '';
    }
}

export function $createMarkdownNode(dataset) {
    return new MarkdownNode(dataset);
}

export function $isMarkdownNode(node) {
    return node instanceof MarkdownNode;
}
