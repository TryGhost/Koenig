import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {renderEmailCtaNode} from './email-cta-renderer.js';

export interface EmailCtaNode {
    alignment: string;
    buttonText: string;
    buttonUrl: string;
    html: string;
    segment: string;
    showButton: boolean;
    showDividers: boolean;
}

export class EmailCtaNode extends generateDecoratorNode({
    nodeType: 'email-cta',
    properties: [
        {name: 'alignment', default: 'left'},
        {name: 'buttonText', default: ''},
        {name: 'buttonUrl', default: '', urlType: 'url'},
        {name: 'html', default: '', urlType: 'html'},
        {name: 'segment', default: 'status:free'},
        {name: 'showButton', default: false},
        {name: 'showDividers', default: true}
    ],
    defaultRenderFn: renderEmailCtaNode
}) {
}

export const $createEmailCtaNode = (dataset: Record<string, unknown>) => {
    return new EmailCtaNode(dataset);
};

export function $isEmailCtaNode(node: unknown): node is EmailCtaNode {
    return node instanceof EmailCtaNode;
}
