import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parseButtonNode} from './button-parser.js';
import {renderButtonNode} from './button-renderer.js';

export interface ButtonNode {
    buttonText: string;
    alignment: string;
    buttonUrl: string;
}

export class ButtonNode extends generateDecoratorNode({
    nodeType: 'button',
    properties: [
        {name: 'buttonText', default: ''},
        {name: 'alignment', default: 'center'},
        {name: 'buttonUrl', default: '', urlType: 'url'}
    ],
    defaultRenderFn: renderButtonNode
}) {
    static importDOM() {
        return parseButtonNode(this);
    }
}

export const $createButtonNode = (dataset: Record<string, unknown>) => {
    return new ButtonNode(dataset);
};

export function $isButtonNode(node: unknown): node is ButtonNode {
    return node instanceof ButtonNode;
}
