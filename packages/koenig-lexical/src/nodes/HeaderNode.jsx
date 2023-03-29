import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';

import {HeaderNode as BaseHeaderNode, INSERT_HEADER_COMMAND} from '@tryghost/kg-default-nodes';

import {ReactComponent as HeaderCardIcon} from '../assets/icons/kg-card-type-header.svg';

export {INSERT_HEADER_COMMAND} from '@tryghost/kg-default-nodes';

export class HeaderNode extends BaseHeaderNode {
    static kgMenu = {
        label: 'Header',
        desc: 'Add a header',
        Icon: HeaderCardIcon,
        insertCommand: INSERT_HEADER_COMMAND,
        matches: ['header', 'heading']
    };

    getIcon() {
        return HeaderCardIcon;
    }

    createDOM() {
        return document.createElement('div');
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()} width={this.__cardWidth}>
                <h1>Hello header</h1>
            </KoenigCardWrapper>
        );
    }
}

export const $createHeaderNode = (dataset) => {
    return new HeaderNode(dataset);
};

export function $isHeaderNode(node) {
    return node instanceof HeaderNode;
}
