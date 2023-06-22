import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';
import {HtmlNode as BaseHtmlNode} from '@tryghost/kg-default-nodes';
import {ReactComponent as HtmlCardIcon} from '../assets/icons/kg-card-type-html.svg';
import {ReactComponent as HtmlIndicatorIcon} from '../assets/icons/kg-indicator-html.svg';
import {HtmlNodeComponent} from './HtmlNodeComponent';
import {createCommand} from 'lexical';

// re-export here so we don't need to import from multiple places throughout the app
export const INSERT_HTML_COMMAND = createCommand();

export class HtmlNode extends BaseHtmlNode {
    static kgMenu = {
        label: 'HTML',
        desc: 'Insert a HTML editor card',
        Icon: HtmlCardIcon,
        insertCommand: INSERT_HTML_COMMAND,
        matches: ['html'],
        priority: 3
    };

    static getType() {
        return 'html';
    }

    getIcon() {
        return HtmlCardIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper
                IndicatorIcon={HtmlIndicatorIcon}
                nodeKey={this.getKey()}
                width={this.__cardWidth}
                wrapperStyle="wide"
            >
                <HtmlNodeComponent
                    html={this.__html}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createHtmlNode(dataset) {
    return new HtmlNode(dataset);
}

export function $isHtmlNode(node) {
    return node instanceof HtmlNode;
}
