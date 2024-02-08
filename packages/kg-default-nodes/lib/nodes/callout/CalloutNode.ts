/* eslint-disable ghost/filenames/match-exported-class */
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderCalloutNode} from './callout-renderer';
import {parseCalloutNode} from './callout-parser';
import {LexicalNode, NodeKey} from 'lexical';

export type CalloutNodeDataset = {
    calloutText?: string;
    calloutEmoji?: string;
    backgroundColor?: string;
};

type CalloutNodeProps = {
    nodeType: 'callout';
    properties: KoenigDecoratorNodeProperties
};

const calloutNodeProps: CalloutNodeProps = {
    nodeType: 'callout',
    properties: [
        {name: 'calloutText', default: '', wordCount: true},
        {name: 'calloutEmoji', default: '💡'},
        {name: 'backgroundColor', default: 'blue'}
    ]
};

export class CalloutNode extends generateDecoratorNode(calloutNodeProps) {
    /* override */
    constructor({calloutText, calloutEmoji, backgroundColor}: CalloutNodeDataset = {}, key?: NodeKey) {
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

export const $createCalloutNode = (dataset: CalloutNodeDataset) => {
    return new CalloutNode(dataset);
};

export function $isCalloutNode(node: LexicalNode) {
    return node instanceof CalloutNode;
}