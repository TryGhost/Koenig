/* eslint-disable ghost/filenames/match-exported-class */
import {DOMConversionMap, LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseToggleNode} from './toggle-parser';
import {renderToggleNode} from './toggle-renderer';

export type ToggleNodeDataset = {
    heading?: string;
    content?: string;
};

type ToggleNodeProps = {
    nodeType: 'toggle';
    properties: KoenigDecoratorNodeProperties;
};

const toggleNodeProps: ToggleNodeProps = {
    nodeType: 'toggle',
    properties: [
        {name: 'heading', default: '', urlType: 'html', wordCount: true},
        {name: 'content', default: '', urlType: 'html', wordCount: true}
    ]
};

export class ToggleNode extends generateDecoratorNode(toggleNodeProps) {
    static importDOM(): DOMConversionMap | null {
        return parseToggleNode();
    }

    exportDOM(options = {}) {
        return renderToggleNode(this, options);
    }
}

export const $createToggleNode = (dataset: ToggleNodeDataset) => {
    return new ToggleNode(dataset);
};

export function $isToggleNode(node: LexicalNode) {
    return node instanceof ToggleNode;
}
