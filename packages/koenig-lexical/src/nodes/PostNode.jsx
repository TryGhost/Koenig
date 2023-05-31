import React from 'react';
import cleanBasicHtml from '@tryghost/kg-clean-basic-html';
import {$canShowPlaceholderCurry} from '@lexical/text';
import {$generateHtmlFromNodes} from '@lexical/html';
import {BASIC_NODES, KoenigCardWrapper} from '../index.js';
import {PostNode as BasePostNode} from '@tryghost/kg-default-nodes';
import {ReactComponent as PostCardIcon} from '../assets/icons/kg-card-type-other.svg';
import {PostNodeComponent} from './PostNodeComponent.jsx';
import {createCommand} from 'lexical';
import {populateNestedEditor, setupNestedEditor} from '../utils/nested-editors';

// re-export here so we don't need to import from multiple places throughout the app
export const INSERT_POST_COMMAND = createCommand();

export class PostNode extends BasePostNode {
    __contentEditor;
    __contentEditorInitialState;

    static kgMenu = [{
        label: 'Post content',
        desc: 'Only visible in web posts, not emails',
        Icon: PostCardIcon,
        insertCommand: INSERT_POST_COMMAND,
        matches: ['post content'],
        priority: 7
    }];

    getIcon() {
        return PostCardIcon;
    }

    constructor(dataset = {}, key) {
        super(dataset, key);

        // set up nested editor
        setupNestedEditor(this, '__contentEditor', {editor: dataset.contentEditor, nodes: BASIC_NODES});

        // populate nested editor
        if (!dataset.contentEditor) {
            populateNestedEditor(this, '__contentEditor', dataset.content);
        }
    }

    getDataset() {
        const dataset = super.getDataset();

        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.contentEditor = self.__contentEditor;
        dataset.contentEditorInitialState = self.__contentEditorInitialState;

        return dataset;
    }

    exportJSON() {
        const json = super.exportJSON();

        // convert nested editor instances back into HTML because their content may not
        // be automatically updated when the nested editor changes
        if (this.__contentEditor) {
            this.__contentEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__contentEditor, null);
                const cleanedHtml = cleanBasicHtml(html, {removeCodeWrappers: true});
                json.content = cleanedHtml;
            });
        }

        return json;
    }

    decorate() {
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
                width={this.__cardWidth}
                wrapperStyle="wide" >
                <PostNodeComponent
                    contentEditor={this.__contentEditor}
                    contentEditorInitialState={this.__conentEditorInitialState}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }

    // override the default `isEmpty` check because we need to check the nested editors
    // rather than the data properties themselves
    isEmpty() {
        return this.__contentEditor.getEditorState().read($canShowPlaceholderCurry(false));
    }
}

export const $createPostNode = (dataset) => {
    return new PostNode(dataset);
};

export function $isPostNode(node) {
    return node instanceof PostNode;
}