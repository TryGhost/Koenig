import EmailCtaCardIcon from '../assets/icons/kg-card-type-email-cta.svg?react';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {cleanBasicHtml} from '@tryghost/kg-clean-basic-html';
import {$generateHtmlFromNodes} from '@lexical/html';
import {BASIC_NODES} from '../index.js';
import {CallToActionNode as BaseCallToActionNode} from '@tryghost/kg-default-nodes';
import {CallToActionNodeComponent} from './CallToActionNodeComponent';
import type {LexicalEditor} from 'lexical';
import {createCommand} from 'lexical';
import {populateNestedEditor, setupNestedEditor} from '../utils/nested-editors';

export const INSERT_CALL_TO_ACTION_COMMAND = createCommand();

interface CallToActionNodeProperties {
    alignment: string;
    backgroundColor: string;
    buttonColor: string;
    buttonText: string;
    buttonTextColor: string;
    buttonUrl: string;
    hasSponsorLabel: boolean;
    href: string;
    imageUrl: string;
    layout: string;
    linkColor: string;
    showButton: boolean;
    showDividers: boolean;
    textValue: string;
}

export class CallToActionNode extends BaseCallToActionNode {
    __callToActionHtmlEditor!: LexicalEditor;
    __callToActionHtmlEditorInitialState: unknown;
    __sponsorLabelHtmlEditor!: LexicalEditor;
    __sponsorLabelHtmlEditorInitialState: unknown;

    static kgMenu = {
        label: 'Call to action',
        desc: 'Add a call to action to your post',
        Icon: EmailCtaCardIcon,
        insertCommand: INSERT_CALL_TO_ACTION_COMMAND,
        matches: ['cta', 'call-to-action', 'email', 'email-cta', 'ad', 'sponsored', 'hidden'],
        priority: 7,
        shortcut: '/cta',
        isHidden: () => false
    };

    static getType() {
        return 'call-to-action';
    }

    getIcon() {
        return EmailCtaCardIcon;
    }

    constructor(dataset: Record<string, unknown> = {}, key?: string) {
        super(dataset, key);

        // set up nested editor instances
        setupNestedEditor(this, '__callToActionHtmlEditor', {editor: dataset.callToActionHtmlEditor as LexicalEditor | undefined, nodes: BASIC_NODES});
        setupNestedEditor(this, '__sponsorLabelHtmlEditor', {editor: dataset.sponsorLabelHtmlEditor as LexicalEditor | undefined, nodes: BASIC_NODES});

        // populate nested editors on initial construction
        if (!dataset.callToActionHtmlEditor && dataset.textValue) {
            populateNestedEditor(this, '__callToActionHtmlEditor', `${dataset.textValue}`); // we serialize with no wrapper
        }
        if (!dataset.sponsorLabelHtmlEditor) {
            populateNestedEditor(this, '__sponsorLabelHtmlEditor', `${dataset.sponsorLabel || '<p><span style="white-space: pre-wrap;">SPONSORED</span></p>'}`);
        }
    }

    getDataset() {
        const dataset = super.getDataset();
        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.callToActionHtmlEditor = self.__callToActionHtmlEditor;
        dataset.callToActionHtmlEditorInitialState = self.__callToActionHtmlEditorInitialState;
        dataset.sponsorLabelHtmlEditor = self.__sponsorLabelHtmlEditor;
        dataset.sponsorLabelHtmlEditorInitialState = self.__sponsorLabelHtmlEditorInitialState;

        return dataset;
    }

    exportJSON() {
        const json = super.exportJSON();

        // convert nested editor instance back into HTML because `text` may not
        // be automatically updated when the nested editor changes
        if (this.__callToActionHtmlEditor) {
            this.__callToActionHtmlEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__callToActionHtmlEditor, null);
                const cleanedHtml = cleanBasicHtml(html, {allowBr: true});
                json.textValue = cleanedHtml;
            });
        }

        if (this.__sponsorLabelHtmlEditor) {
            this.__sponsorLabelHtmlEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__sponsorLabelHtmlEditor, null);
                const cleanedHtml = cleanBasicHtml(html, {allowBr: false});
                json.sponsorLabel = cleanedHtml;
            });
        }

        return json;
    }

    decorate() {
        const props = this as unknown as CallToActionNodeProperties;
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
                wrapperStyle={props.backgroundColor === 'none' ? 'wide' : 'regular'}
            >
                <CallToActionNodeComponent
                    alignment={props.alignment}
                    backgroundColor={props.backgroundColor}
                    buttonColor={props.buttonColor}
                    buttonText={props.buttonText}
                    buttonTextColor={props.buttonTextColor}
                    buttonUrl={props.buttonUrl}
                    hasSponsorLabel={props.hasSponsorLabel}
                    href={props.href}
                    htmlEditor={this.__callToActionHtmlEditor}
                    htmlEditorInitialState={this.__callToActionHtmlEditorInitialState as string | undefined}
                    imageUrl={props.imageUrl}
                    layout={props.layout}
                    linkColor={props.linkColor}
                    nodeKey={this.getKey()}
                    showButton={props.showButton}
                    showDividers={props.showDividers}
                    sponsorLabelHtmlEditor={this.__sponsorLabelHtmlEditor}
                    sponsorLabelHtmlEditorInitialState={this.__sponsorLabelHtmlEditorInitialState as string | undefined}
                    textValue={props.textValue}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createCallToActionNode(dataset: Record<string, unknown>) {
    return new CallToActionNode(dataset);
}

export function $isCallToActionNode(node: unknown): node is CallToActionNode {
    return node instanceof CallToActionNode;
}
