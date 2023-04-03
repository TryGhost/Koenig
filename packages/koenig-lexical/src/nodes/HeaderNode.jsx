import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';

import {HeaderNode as BaseHeaderNode, INSERT_HEADER_COMMAND} from '@tryghost/kg-default-nodes';

import {ReactComponent as HeaderCardIcon} from '../assets/icons/kg-card-type-header.svg';

import HeaderNodeComponent from './HeaderNodeComponent';

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
            <KoenigCardWrapper nodeKey={this.getKey()} width={'full'}>
                <HeaderNodeComponent
                    backgroundColor={this.getBackgroundImageStyle()}
                    button={this.getButtonEnabled()}
                    buttonPlaceholder={'Your button text'}
                    buttonText={this.getButtonText()}
                    buttonUrl={this.getButtonUrl()}
                    heading={this.getHeader()}
                    headingPlaceholder={'Enter heading text'}
                    nodeKey={this.getKey()}
                    size={this.getSize()}
                    subHeading={this.getSubheader()}
                    subHeadingPlaceholder={'Enter subheading text'}
                    
                />
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
