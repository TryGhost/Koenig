/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderEmailCtaNode} from './email-cta-renderer';

export type EmailCtaNodeDataset = {
    alignment?: string;
    buttonText?: string;
    buttonUrl?: string;
    html?: string;
    segment?: string;
    showButton?: boolean;
    showDividers?: boolean;
};

type EmailCtaNodeProps = {
    nodeType: 'email-cta';
    properties: KoenigDecoratorNodeProperties;
};

const emailCtaNodeProps: EmailCtaNodeProps = {
    nodeType: 'email-cta',
    properties: [
        {name: 'alignment', default: 'left'},
        {name: 'buttonText', default: ''},
        {name: 'buttonUrl', default: '', urlType: 'url'},
        {name: 'html', default: '', urlType: 'html'},
        {name: 'segment', default: 'status:free'},
        {name: 'showButton', default: false},
        {name: 'showDividers', default: true}
    ]
};

export class EmailCtaNode extends generateDecoratorNode(emailCtaNodeProps) {
    // TODO: build options
    exportDOM(options = {}) {
        return renderEmailCtaNode(this, options);
    }
}

export const $createEmailCtaNode = (dataset: EmailCtaNodeDataset) => {
    return new EmailCtaNode(dataset);
};

export function $isEmailCtaNode(node: LexicalNode) {
    return node instanceof EmailCtaNode;
}
