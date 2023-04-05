import HeaderNodeComponent from './HeaderNodeComponent';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import MINIMAL_NODES from './MinimalNodes';
import React from 'react';
import cleanBasicHtml from '@tryghost/kg-clean-basic-html';
import populateNestedEditor from '../utils/populateNestedEditor';
import {$generateHtmlFromNodes} from '@lexical/html';
import {$getNodeByKey, createEditor} from 'lexical';
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

    constructor(dataset = {}, key) {
        super(dataset, key);

        this.__subHeaderTextEditor = dataset.subHeaderTextEditor || createEditor({node: MINIMAL_NODES});
        if (!dataset.subHeaderTextEditor) {
            populateNestedEditor({editor: this.__subHeaderTextEditor, initialHtml: dataset.subheader});
        }

        this.__headerTextEditor = dataset.headerTextEditor || createEditor({node: MINIMAL_NODES});
        if (!dataset.headerTextEditor) {
            populateNestedEditor({editor: this.__headerTextEditor, initialHtml: dataset.header});
        }
    }

    exportJSON() {
        const json = super.exportJSON();

        if (this.__headerTextEditor) {
            this.__headerTextEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__headerTextEditor, null);
                const cleanedHtml = cleanBasicHtml(html);
                json.header = cleanedHtml;
            });
        }

        if (this.__subHeaderTextEditor) {
            this.__subHeaderTextEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__subHeaderTextEditor, null);
                const cleanedHtml = cleanBasicHtml(html);
                json.subheader = cleanedHtml;
            });
        }

        return json;
    }

    createDOM() {
        return document.createElement('div');
    }

    getDataset() {
        const dataset = super.getDataset();

        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.headerTextEditor = self.__headerTextEditor;

        return dataset;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()} width={'full'}>
                <HeaderNodeComponent
                    backgroundColor={this.getBackgroundImageStyle()}
                    backgroundImageSrc={this.getBackgroundImageSrc()}
                    backgroundImageStyle={this.getBackgroundImageStyle()}
                    button={this.getButtonEnabled()}
                    buttonPlaceholder={'Your button text'}
                    buttonText={this.getButtonText()}
                    buttonUrl={this.getButtonUrl()}
                    headerTextEditor={this.__headerTextEditor}
                    heading={this.getHeader()}
                    headingPlaceholder={'Enter heading text'}
                    nodeKey={this.getKey()}
                    size={this.getSize()}
                    subHeaderTextEditor={this.__subHeaderTextEditor}
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
