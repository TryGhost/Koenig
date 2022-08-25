import * as React from 'react';
import {createCommand, DecoratorNode} from 'lexical';
import {KoenigCardWrapper} from '../../lib';

export const INSERT_IFRAMELOADTEST_COMMAND = createCommand();

const testEmbed = '<iframe width="560" height="315" src="https://www.youtube.com/embed/I9q-7GPQr1Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

function IframeLoadTestComponent({className, nodeKey}) {
    return (
        <KoenigCardWrapper className={className} nodeKey={nodeKey}>
            <div dangerouslySetInnerHTML={{__html: testEmbed}}></div>
        </KoenigCardWrapper>
    );
}

export class IframeLoadTestNode extends DecoratorNode {
    static getType() {
        return 'iframeloadtest';
    }

    static clone(node) {
        return new IframeLoadTestNode(node.__key);
    }

    static importJSON(serializedNode) {
        return $createIframeLoadTestNode();
    }

    exportJSON() {
        return {
            type: 'iframeloadtest',
            version: 1
        };
    }

    constructor(key) {
        super(key);
    }

    createDOM() {
        return document.createElement('div');
    }

    updateDOM() {
        return false;
    }

    getTextContent() {
        return '';
    }

    decorate(editor, config) {
        return (
            <IframeLoadTestComponent
                nodeKey={this.getKey()}
            />
        );
    }

    isTopLevel() {
        return true;
    }
}

export function $createIframeLoadTestNode() {
    return new IframeLoadTestNode();
}

export function $isIframeLoadTestNode(node) {
    return node instanceof IframeLoadTestNode;
}
