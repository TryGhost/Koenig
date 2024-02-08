/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderEmailNode} from './email-renderer';

export type EmailNodeDataset = {
    html?: string;
};

type EmailNodeProps = {
    nodeType: 'email';
    properties: KoenigDecoratorNodeProperties;
};

const emailNodeProps: EmailNodeProps = {
    nodeType: 'email',
    properties: [
        {name: 'html', default: '', urlType: 'html'}
    ]
};

export class EmailNode extends generateDecoratorNode(emailNodeProps) {
    exportDOM(options = {}) {
        return renderEmailNode(this, options);
    }
}

export const $createEmailNode = (dataset: EmailNodeDataset) => {
    return new EmailNode(dataset);
};

export function $isEmailNode(node: LexicalNode) {
    return node instanceof EmailNode;
}
