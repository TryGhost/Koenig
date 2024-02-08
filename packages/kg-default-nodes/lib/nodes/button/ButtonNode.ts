/* eslint-disable ghost/filenames/match-exported-class */
import {DOMConversionMap, LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseButtonNode} from './button-parser';
import {renderButtonNode} from './button-renderer';

export type ButtonNodeDataset = {
    buttonText?: string | null;
    alignment?: string | null;
    buttonUrl?: string | null;
};

type ButtonNodeProps = {
    nodeType: 'button';
    properties: KoenigDecoratorNodeProperties
};

const buttonNodeProps: ButtonNodeProps = {
    nodeType: 'button',
    properties: [
        {name: 'buttonText', default: ''},
        {name: 'alignment', default: 'center'},
        {name: 'buttonUrl', default: '', urlType: 'url'}
    ]
};

export class ButtonNode extends generateDecoratorNode(buttonNodeProps) {
    constructor(dataset: ButtonNodeDataset) {
        super(dataset);    
    }

    static importDOM(): DOMConversionMap | null {
        return parseButtonNode();
    }

    exportDOM(options = {}) {
        return renderButtonNode(this, options);
    }
}

export const $createButtonNode = (dataset: ButtonNodeDataset) => {
    return new ButtonNode(dataset);
};

export function $isButtonNode(node: LexicalNode) {
    return node instanceof ButtonNode;
}
