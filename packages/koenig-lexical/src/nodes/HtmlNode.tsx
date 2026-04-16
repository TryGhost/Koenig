import HtmlCardIcon from '../assets/icons/kg-card-type-html.svg?react';
import HtmlIndicatorIcon from '../assets/icons/kg-indicator-html.svg?react';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {HtmlNode as BaseHtmlNode} from '@tryghost/kg-default-nodes';
import {HtmlNodeComponent} from './HtmlNodeComponent';
import {createCommand} from 'lexical';

export const INSERT_HTML_COMMAND = createCommand();

export class HtmlNode extends BaseHtmlNode {
    static kgMenu = {
        label: 'HTML',
        desc: 'Insert a HTML editor card',
        Icon: HtmlCardIcon,
        insertCommand: INSERT_HTML_COMMAND,
        matches: ['html'],
        priority: 18,
        shortcut: '/html'
    };

    getIcon() {
        return HtmlCardIcon;
    }

    constructor(dataset: Record<string, unknown> = {}, key?: string) {
        super(dataset, key);
    }

    decorate() {
        return (
            <KoenigCardWrapper
                IndicatorIcon={HtmlIndicatorIcon}
                nodeKey={this.getKey()}
                wrapperStyle="wide"
            >
                <HtmlNodeComponent
                    html={this.__html as string}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createHtmlNode(dataset: Record<string, unknown>) {
    return new HtmlNode(dataset);
}

export function $isHtmlNode(node: unknown): node is HtmlNode {
    return node instanceof HtmlNode;
}
