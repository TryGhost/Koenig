// import HeaderNodeComponent from './HeaderNodeComponent';
import HeaderComponent2 from './HeaderNodeComponent2';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import MINIMAL_NODES from './MinimalNodes';
import React from 'react';
import cleanBasicHtml from '@tryghost/kg-clean-basic-html';
import {$canShowPlaceholderCurry} from '@lexical/text';
import {$generateHtmlFromNodes} from '@lexical/html';
import {HeaderNode2 as BaseHeaderNode} from '@tryghost/kg-default-nodes';
import {ReactComponent as HeaderCardIcon} from '../assets/icons/kg-card-type-header.svg';
import {createCommand} from 'lexical';
import {populateNestedEditor, setupNestedEditor} from '../utils/nested-editors';

export const INSERT_HEADER_COMMAND = createCommand();

export class HeaderNode2 extends BaseHeaderNode {
    __headerTextEditor;
    __subheaderTextEditor;
    __headerTextEditorInitialState;
    __subheaderTextEditorInitialState;

    static kgMenu = {
        label: 'Header v2',
        desc: 'Add a header - enhanced',
        Icon: HeaderCardIcon,
        insertCommand: INSERT_HEADER_COMMAND,
        matches: ['header2', 'heading2']
    };

    getIcon() {
        return HeaderCardIcon;
    }

    constructor(dataset = {}, key) {
        super(dataset, key);

        setupNestedEditor(this, '__headerTextEditor', {editor: dataset.headerTextEditor, nodes: MINIMAL_NODES});
        setupNestedEditor(this, '__subheaderTextEditor', {editor: dataset.subheaderTextEditor, nodes: MINIMAL_NODES});

        // populate nested editors on initial construction
        if (!dataset.headerTextEditor && dataset.header) {
            populateNestedEditor(this, '__headerTextEditor', `<p>${dataset.header}</p>`); // we serialize with no wrapper
        }
        if (!dataset.subheaderTextEditor && dataset.subheader) {
            populateNestedEditor(this, '__subheaderTextEditor', `<p>${dataset.subheader}</p>`); // we serialize with no wrapper
        }
    }

    exportJSON() {
        const json = super.exportJSON();

        if (this.__headerTextEditor) {
            this.__headerTextEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__headerTextEditor, null);
                const cleanedHtml = cleanBasicHtml(html, {firstChildInnerContent: true, allowBr: true});
                json.header = cleanedHtml;
            });
        }

        if (this.__subheaderTextEditor) {
            this.__subheaderTextEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__subheaderTextEditor, null);
                const cleanedHtml = cleanBasicHtml(html, {firstChildInnerContent: true, allowBr: true});
                json.subheader = cleanedHtml;
            });
        }

        return json;
    }

    getDataset() {
        const dataset = super.getDataset();

        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.headerTextEditor = self.__headerTextEditor;
        dataset.subheaderTextEditor = self.__subheaderTextEditor;
        return dataset;
    }

    // {name: 'size', default: 'small'}, // v1 only
    // {name: 'style', default: 'dark'}, // v1 only - these might be irrelevant in v2
    // {name: 'buttonEnabled', default: false}, // v1
    // {name: 'buttonUrl', default: '', urlType: 'url'}, // v1
    // {name: 'buttonText', default: ''}, // v1
    // {name: 'header', default: '', urlType: 'html', wordCount: true}, // v1
    // {name: 'subheader', default: '', urlType: 'html', wordCount: true}, // v1
    // {name: 'backgroundImageSrc', default: '', urlType: 'url'}, // v1
    // // enchanced new feature props
    // {name: 'alignment', default: 'left'}, // v2
    // {name: 'backgroundColor', default: '#F0F0F0'},
    // {name: 'backgroundSize', default: 'cover'},
    // {name: 'textColor', default: '#000000'},
    // {name: 'buttonColor', default: '#000000'},
    // {name: 'buttonTextColor', default: '#FFFFFF'},
    // {name: 'layout', default: 'wide'},
    // {name: 'swapped', default: false}

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()} width={'full'}>
                <HeaderComponent2
                    alignment={this.alignment}
                    backgroundColor={this.backgroundColor}
                    backgroundImageSrc={this.backgroundImageSrc}
                    backgroundSize={this.backgroundSize}
                    buttonColor={this.buttonColor}
                    buttonEnabled={this.buttonEnabled}
                    buttonText={this.buttonText}
                    buttonTextColor={this.buttonTextColor}
                    buttonUrl={this.buttonUrl}
                    header={this.header}
                    headerTextEditor={this.__headerTextEditor}
                    headerTextEditorState={this.__headerTextEditorInitialState}
                    isSwapped={this.swapped}
                    layout={this.layout}
                    nodeKey={this.getKey()}
                    subheader={this.subheader}
                    subheaderTextEditor={this.__subheaderTextEditor}
                    subheaderTextEditorInitialState={this.__subheaderTextEditorInitialState}
                    subheaderTextEditorState={this.__subheaderTextEditorInitialState}
                    textColor={this.textColor}
                />
            </KoenigCardWrapper>
        );
    }

    // override the default `isEmpty` check because we need to check the nested editors
    // rather than the data properties themselves
    isEmpty() {
        const isHtmlEmpty = this.__headerTextEditor.getEditorState().read($canShowPlaceholderCurry(false));
        const isSubHtmlEmpty = this.__subheaderTextEditor.getEditorState().read($canShowPlaceholderCurry(false));
        return isHtmlEmpty && isSubHtmlEmpty && (!this.buttonEnabled || (!this.buttonText && !this.buttonUrl)) && !this.backgroundImageSrc;
    }
}

export const $createHeaderNode = (dataset) => {
    return new HeaderNode2(dataset);
};

export function $isHeaderNode(node) {
    return node instanceof HeaderNode2;
}
