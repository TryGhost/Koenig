import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parsePaywallNode} from './paywall-parser.js';
import {renderPaywallNode} from './paywall-renderer.js';

export class PaywallNode extends generateDecoratorNode({
    nodeType: 'paywall',
    defaultRenderFn: renderPaywallNode
}) {
    static importDOM() {
        return parsePaywallNode(this);
    }
}

export const $createPaywallNode = (dataset: Record<string, unknown>) => {
    return new PaywallNode(dataset);
};

export function $isPaywallNode(node: unknown): node is PaywallNode {
    return node instanceof PaywallNode;
}
