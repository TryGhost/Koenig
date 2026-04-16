import HeaderCardIcon from '../assets/icons/kg-card-type-header.svg?react';
import HeaderNodeComponent from './header/v2/HeaderNodeComponent';
import HeaderNodeComponentV1 from './header/v1/HeaderNodeComponent';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import MINIMAL_NODES from './MinimalNodes';
import {cleanBasicHtml} from '@tryghost/kg-clean-basic-html';
import {$canShowPlaceholderCurry} from '@lexical/text';
import {$generateHtmlFromNodes} from '@lexical/html';
import {HeaderNode as BaseHeaderNode} from '@tryghost/kg-default-nodes';
import type {LexicalEditor} from 'lexical';
import {createCommand} from 'lexical';
import {populateNestedEditor, setupNestedEditor} from '../utils/nested-editors';

type Alignment = 'left' | 'center';
type BackgroundSize = 'cover' | 'contain';
type Layout = 'regular' | 'wide' | 'full' | 'split';

interface HeaderNodeProperties {
    size: string;
    style: string;
    buttonEnabled: boolean;
    buttonUrl: string;
    buttonText: string;
    header: string;
    subheader: string;
    backgroundImageSrc: string;
    version: number;
    accentColor: string;
    alignment: Alignment;
    backgroundColor: string;
    backgroundImageWidth: number;
    backgroundImageHeight: number;
    backgroundSize: BackgroundSize;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    layout: Layout;
    swapped: boolean;
}

export const INSERT_HEADER_COMMAND = createCommand();

export class HeaderNode extends BaseHeaderNode {
    __headerTextEditor!: LexicalEditor;
    __subheaderTextEditor!: LexicalEditor;
    __headerTextEditorInitialState: unknown;
    __subheaderTextEditorInitialState: unknown;

    // We keep Header v1 here for testing and backwards compatibility
    // we keep it hidden in the Menu in Ghost but visible in the Demo to ensure it remains tested till we full deprecate it in the future
    static kgMenu = [
        {
            label: 'Header1',
            desc: 'Add a header',
            Icon: HeaderCardIcon,
            insertCommand: INSERT_HEADER_COMMAND,
            matches: ['v1_header', 'v1_heading'],
            priority: 11,
            insertParams: () => ({
                version: 1
            }),
            isHidden: ({config}: {config?: Record<string, unknown>}) => {
                return (config?.deprecated as Record<string, unknown> | undefined)?.headerV1 ?? true;
            },
            shortcut: '/header'
        },
        {
            label: 'Header',
            desc: 'Add a header',
            Icon: HeaderCardIcon,
            insertCommand: INSERT_HEADER_COMMAND,
            matches: ['header', 'heading'],
            priority: 11,
            insertParams: () => ({
                version: 2
            }),
            shortcut: '/header'
        }
    ];

    getIcon() {
        return HeaderCardIcon;
    }

    constructor(dataset: Record<string, unknown> = {}, key?: string) {
        super(dataset, key);

        setupNestedEditor(this, '__headerTextEditor', {editor: dataset.headerTextEditor as LexicalEditor | undefined, nodes: MINIMAL_NODES});
        setupNestedEditor(this, '__subheaderTextEditor', {editor: dataset.subheaderTextEditor as LexicalEditor | undefined, nodes: MINIMAL_NODES});

        // populate nested editors on initial construction
        if (!dataset.headerTextEditor && dataset.header) {
            populateNestedEditor(this, '__headerTextEditor', `${dataset.header}`); // we serialize with no wrapper
        }
        if (!dataset.subheaderTextEditor && dataset.subheader) {
            populateNestedEditor(this, '__subheaderTextEditor', `${dataset.subheader}`); // we serialize with no wrapper
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

    getCardWidth() {
        const version = this.version;

        if (version === 1) {
            return 'full';
        }

        if (version === 2) {
            const layout = this.layout;
            return layout === 'split' ? 'full' : layout;
        }
    }

    decorate() {
        const props = this as unknown as HeaderNodeProperties;
        // for backwards compatibility with v1 cards
        if (props.version === 1) {
            return (
                <KoenigCardWrapper nodeKey={this.getKey()} width={this.getCardWidth() as string | undefined}>
                    <HeaderNodeComponentV1
                        backgroundImageSrc={props.backgroundImageSrc}
                        button={props.buttonEnabled}
                        buttonText={props.buttonText}
                        buttonUrl={props.buttonUrl}
                        header={props.header}
                        headerTextEditor={this.__headerTextEditor}
                        headerTextEditorInitialState={this.__headerTextEditorInitialState as string | undefined}
                        nodeKey={this.getKey()}
                        size={props.size as 'small' | 'medium' | 'large'}
                        subheader={props.subheader}
                        subheaderTextEditor={this.__subheaderTextEditor}
                        subheaderTextEditorInitialState={this.__subheaderTextEditorInitialState as string | undefined}
                        type={props.style as 'dark' | 'light' | 'accent' | 'image'}
                    />
                </KoenigCardWrapper>
            );
        }

        if (props.version === 2) {
            return (
                <KoenigCardWrapper nodeKey={this.getKey()} width={this.getCardWidth() as string | undefined}>
                    <HeaderNodeComponent
                        accentColor={props.accentColor}
                        alignment={props.alignment}
                        backgroundColor={props.backgroundColor}
                        backgroundImageHeight={props.backgroundImageHeight}
                        backgroundImageSrc={props.backgroundImageSrc}
                        backgroundImageWidth={props.backgroundImageWidth}
                        backgroundSize={props.backgroundSize}
                        buttonColor={props.buttonColor}
                        buttonEnabled={props.buttonEnabled}
                        buttonText={props.buttonText}
                        buttonTextColor={props.buttonTextColor}
                        buttonUrl={props.buttonUrl}
                        header={props.header}
                        headerTextEditor={this.__headerTextEditor}
                        headerTextEditorInitialState={this.__headerTextEditorInitialState as string | undefined}
                        layout={props.layout}
                        nodeKey={this.getKey()}
                        subheader={props.subheader}
                        subheaderTextEditor={this.__subheaderTextEditor}
                        subheaderTextEditorInitialState={this.__subheaderTextEditorInitialState as string | undefined}
                        isSwapped={props.swapped}
                        textColor={props.textColor}
                    />
                </KoenigCardWrapper>
            );
        }
    }

    // override the default `isEmpty` check because we need to check the nested editors
    // rather than the data properties themselves
    isEmpty() {
        const isHtmlEmpty = this.__headerTextEditor.getEditorState().read($canShowPlaceholderCurry(false));
        const isSubHtmlEmpty = this.__subheaderTextEditor.getEditorState().read($canShowPlaceholderCurry(false));
        return isHtmlEmpty && isSubHtmlEmpty && (!this.buttonEnabled || (!this.buttonText && !this.buttonUrl)) && !this.backgroundImageSrc;
    }
}

export const $createHeaderNode = (dataset: Record<string, unknown>) => {
    return new HeaderNode(dataset);
};

export function $isHeaderNode(node: unknown): node is HeaderNode {
    return node instanceof HeaderNode;
}
