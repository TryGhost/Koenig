/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {generateDecoratorNode} from '../../generate-decorator-node';
import {parsePaywallNode} from './paywall-parser';
import {renderPaywallNode} from './paywall-renderer';

export type PaywallNodeDataset = object; // {} is the default value

type PaywallNodeProps = {
    nodeType: 'paywall';
};

const paywallNodeProps: PaywallNodeProps = {
    nodeType: 'paywall'
};

export class PaywallNode extends generateDecoratorNode(paywallNodeProps) {
    static importDOM() {
        return parsePaywallNode(this);
    }

    exportDOM(options = {}) {
        return renderPaywallNode(this, options);
    }
}

export const $createPaywallNode = () => {
    return new PaywallNode();
};

export function $isPaywallNode(node: LexicalNode) {
    return node instanceof PaywallNode;
}
