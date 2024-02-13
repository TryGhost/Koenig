/* eslint-disable ghost/filenames/match-exported-class */
import {DOMExportOutput, LexicalEditor, LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, KoenigDecoratorRendererOutput, generateDecoratorNode} from '../../generate-decorator-node';
import {renderEmailNode} from './email-renderer';
import {RendererOptions} from '../../types';

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
    exportDOM(options: LexicalEditor): DOMExportOutput;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportDOM(options: RendererOptions): KoenigDecoratorRendererOutput

    exportDOM(options: LexicalEditor | RendererOptions) {
        if (this instanceof EmailNode) {
            return renderEmailNode(this, options as RendererOptions);
        }
        return super.exportDOM(options as unknown as LexicalEditor);
    }
}

export const $createEmailNode = (dataset: EmailNodeDataset) => {
    return new EmailNode(dataset);
};

export function $isEmailNode(node: LexicalNode) {
    return node instanceof EmailNode;
}
