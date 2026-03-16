import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {renderCalloutNode} from './callout-renderer.js';
import {parseCalloutNode} from './callout-parser.js';

interface CalloutData {
    calloutText?: string;
    calloutEmoji?: string;
    backgroundColor?: string;
}

export interface CalloutNode {
    calloutText: string;
    calloutEmoji: string;
    backgroundColor: string;
}

export class CalloutNode extends generateDecoratorNode({
    nodeType: 'callout',
    properties: [
        {name: 'calloutText', default: '', wordCount: true},
        {name: 'calloutEmoji', default: '💡'},
        {name: 'backgroundColor', default: 'blue'}
    ],
    defaultRenderFn: renderCalloutNode
}) {
    /* override */
    constructor({calloutText, calloutEmoji, backgroundColor}: CalloutData = {}, key?: string) {
        super({}, key);
        this.__calloutText = calloutText || '';
        this.__calloutEmoji = calloutEmoji !== undefined ? calloutEmoji : '💡';
        this.__backgroundColor = backgroundColor || 'blue';
    }

    static importDOM() {
        return parseCalloutNode(this);
    }
}

export function $isCalloutNode(node: unknown): node is CalloutNode {
    return node instanceof CalloutNode;
}

export const $createCalloutNode = (dataset: Record<string, unknown>) => {
    return new CalloutNode(dataset);
};
