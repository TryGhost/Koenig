import {createCommand} from 'lexical';
import {KoenigDecoratorNode} from '../../KoenigDecoratorNode';
import {ToggleParser} from './ToggleParser';
import {renderToggleNodeToDOM} from './ToggleRenderer';

export const INSERT_TOGGLE_COMMAND = createCommand();
const NODE_TYPE = 'toggle';

export class ToggleNode extends KoenigDecoratorNode {
    // payload properties
    __content;
    __contentPlaceholder;
    __header;
    __headerPlaceholder;

    static getType() {
        return NODE_TYPE;
    }

    static clone(node) {
        return new this(
            node.getDataset(),
            node.__key
        );
    }

    static get urlTransformMap() {
        return {
            content: 'html',
            contentPlaceholder: 'html',
            header: 'html',
            headerPlaceholder: 'html'
        };
    }

    getDataset() {
        const self = this.getLatest();
        return {
            content: self.__content,
            contentPlaceholder: self.__contentPlaceholder,
            header: self.__header,
            headerPlaceholder: self.__headerPlaceholder
        };
    }

    constructor({content, contentPlaceholder, header, headerPlaceholder} = {}, key) {
        super(key);
        this.__content = content || '';
        this.__contentPlaceholder = contentPlaceholder || 'Collapsible content';
        this.__header = header || '';
        this.__headerPlaceholder = headerPlaceholder || 'Toggle header';
    }

    static importJSON(serializedNode) {
        const {content, contentPlaceholder, header, headerPlaceholder} = serializedNode;
        return new this({
            content,
            contentPlaceholder,
            header,
            headerPlaceholder
        });
    }

    exportJSON() {
        const dataset = {
            type: NODE_TYPE,
            version: 1,
            content: this.getContent(),
            contentPlaceholder: this.getContentPlaceholder(),
            header: this.getHeader(),
            headerPlaceholder: this.getHeaderPlaceholder()
        };
        return dataset;
    }

    static importDOM() {
        const parser = new ToggleParser(this);
        return parser.DOMConversionMap;
    }

    exportDOM(options = {}) {
        const element = renderToggleNodeToDOM(this, options);
        return {element};
    }

    createDOM() {
        return document.createElement('div');
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return false;
    }

    getContent() {
        const self = this.getLatest();
        return self.__content;
    }

    setContent(content) {
        const writable = this.getWritable();
        return writable.__content = content;
    }

    getContentPlaceholder() {
        const self = this.getLatest();
        return self.__contentPlaceholder;
    }

    setContentPlaceholder(contentPlaceholder) {
        const writable = this.getWritable();
        return writable.__contentPlaceholder = contentPlaceholder;
    }

    getHeader() {
        const self = this.getLatest();
        return self.__header;
    }

    setHeader(header) {
        const writable = this.getWritable();
        return writable.__header = header;
    }

    getHeaderPlaceholder() {
        const self = this.getLatest();
        return self.__headerPlaceholder;
    }

    setHeaderPlaceholder(headerPlaceholder) {
        const writable = this.getWritable();
        return writable.__headerPlaceholder = headerPlaceholder;
    }

    // should be overridden
    /* c8 ignore next 3 */
    decorate() {
        return '';
    }
}

export const $createToggleNode = (dataset) => {
    return new ToggleNode(dataset);
};

export function $isToggleNode(node) {
    return node instanceof ToggleNode;
}
