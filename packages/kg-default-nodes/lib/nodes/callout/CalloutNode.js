import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderCalloutNode} from './CalloutRenderer';
import {parseCalloutNode} from './CalloutParser';

export class CalloutNode extends generateDecoratorNode({nodeType: 'callout',
    properties: [
        {name: 'calloutText', default: '', wordCount: true},
        {name: 'calloutEmoji', default: '💡'},
        {name: 'backgroundColor', default: 'blue'}
    ]}
) {
    /* override */
    constructor({calloutText, calloutEmoji, backgroundColor} = {}, key) {
        super(key);
        this.__calloutText = calloutText || '';
        this.__calloutEmoji = calloutEmoji !== undefined ? calloutEmoji : '💡';
        this.__backgroundColor = backgroundColor || 'blue';
    }

    static importDOM() {
        return parseCalloutNode(this);
    }

    exportDOM(options = {}) {
        return renderCalloutNode(this, options);
    }
}

export function $isCalloutNode(node) {
    return node instanceof CalloutNode;
}

export const $createCalloutNode = (dataset) => {
    return new CalloutNode(dataset);
};
