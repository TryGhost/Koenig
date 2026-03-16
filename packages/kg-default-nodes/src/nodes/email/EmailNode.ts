import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {renderEmailNode} from './email-renderer.js';

export interface EmailNode {
    html: string;
}

export class EmailNode extends generateDecoratorNode({
    nodeType: 'email',
    properties: [
        {name: 'html', default: '', urlType: 'html'}
    ],
    defaultRenderFn: renderEmailNode
}) {
}

export const $createEmailNode = (dataset: Record<string, unknown>) => {
    return new EmailNode(dataset);
};

export function $isEmailNode(node: unknown): node is EmailNode {
    return node instanceof EmailNode;
}
