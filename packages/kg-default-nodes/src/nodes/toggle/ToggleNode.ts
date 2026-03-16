import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parseToggleNode} from './toggle-parser.js';
import {renderToggleNode} from './toggle-renderer.js';

export interface ToggleNode {
    heading: string;
    content: string;
}

export class ToggleNode extends generateDecoratorNode({
    nodeType: 'toggle',
    properties: [
        {name: 'heading', default: '', urlType: 'html', wordCount: true},
        {name: 'content', default: '', urlType: 'html', wordCount: true}
    ],
    defaultRenderFn: renderToggleNode
}) {
    static importDOM() {
        return parseToggleNode(this);
    }
}

export const $createToggleNode = (dataset: Record<string, unknown>) => {
    return new ToggleNode(dataset);
};

export function $isToggleNode(node: unknown): node is ToggleNode {
    return node instanceof ToggleNode;
}
