import {createCommand} from 'lexical';
import {KoenigDecoratorNode} from '../../KoenigDecoratorNode';
import {renderCalloutNodeToDOM} from './CalloutRenderer';
import {CalloutParser} from './CalloutParser';

export const AVAILABLECOLOURS = [
    'blue',
    'green',
    'yellow',
    'red',
    'purple',
    'grey'
];

export const INSERT_CALLOUT_COMMAND = createCommand();
const NODE_TYPE = 'callout';

export class CalloutNode extends KoenigDecoratorNode {
    // payload properties
    __text;
    __hasEmoji;
    __backgroundColor;

    static getType() {
        return NODE_TYPE;
    }

    static clone(node) {
        return new this(
            node.getDataset(),
            node.__key
        );
    }

    // used by `@tryghost/url-utils` to transform URLs contained in the serialized JSON]
    static get urlTransformMap() {
        return {
            text: 'html',
            hasEmoji: 'html',
            backgroundColor: 'html'
        };
    }

    getDataset() {
        const self = this.getLatest();
        return {
            text: self.__text,
            hasEmoji: self.__hasEmoji,
            backgroundColor: self.__backgroundColor
        };
    }

    constructor({text, hasEmoji, backgroundColor} = {}, key) {
        super(key);
        this.__text = text || '';
        this.__hasEmoji = hasEmoji || false;
        this.__backgroundColor = backgroundColor || 'blue';
    }

    static importJSON(serializedNode) {
        const {text, hasEmoji, backgroundColor} = serializedNode;
        return new this({
            text,
            hasEmoji,
            backgroundColor
        });
    }

    exportJSON() {
        const dataset = {
            type: NODE_TYPE,
            version: 1,
            text: this.getText(),
            hasEmoji: this.__hasEmoji,
            backgroundColor: this.__backgroundColor
        };
        return dataset;
    }

    static importDOM() {
        const parser = new CalloutParser(this);
        return parser.DOMConversionMap;
    }

    exportDOM(options = {}) {
        const element = renderCalloutNodeToDOM(this, options);
        return {element};
    }

    createDom() {
        const element = document.createElement('div');
        return element;
    }

    updateDom() {
        return false;
    }

    isInline() {
        return false;
    }

    getText() {
        const self = this.getLatest();
        return self.__text;
    }

    setText(text) {
        const writeable = this.getWritable();
        writeable.__text = text;
    }

    getBackgroundColor() {
        const self = this.getLatest();
        return self.__backgroundColor;
    }

    setBackgroundColor(color) {
        const writeable = this.getWritable();
        writeable.__backgroundColor = color;
    }

    getHasEmoji() {
        const self = this.getLatest();
        return self.__hasEmoji;
    }

    setHasEmoji(hasEmoji) {
        const writeable = this.getWritable();
        writeable.__hasEmoji = hasEmoji;
    }

    decorate() {
        return '';
    }
}

export function $isCalloutNode(node) {
    return node instanceof CalloutNode;
}

export const $createCalloutNode = (dataset) => {
    return new CalloutNode(dataset);
};
