import BookmarkCardIcon from '../assets/icons/kg-card-type-bookmark.svg?react';
import {cleanBasicHtml} from '@tryghost/kg-clean-basic-html';
import {$generateHtmlFromNodes} from '@lexical/html';
import {BookmarkNode as BaseBookmarkNode} from '@tryghost/kg-default-nodes';
import {BookmarkNodeComponent} from './BookmarkNodeComponent';
import {KoenigCardWrapper, MINIMAL_NODES} from '../index.js';
import type {LexicalEditor} from 'lexical';
import {createCommand} from 'lexical';
import {populateNestedEditor, setupNestedEditor} from '../utils/nested-editors';

export const INSERT_BOOKMARK_COMMAND = createCommand();

export class BookmarkNode extends BaseBookmarkNode {
    __captionEditor!: LexicalEditor;
    __captionEditorInitialState: unknown;
    __createdWithUrl: boolean;

    static kgMenu = [{
        label: 'Bookmark',
        desc: 'Embed a link as a visual bookmark',
        Icon: BookmarkCardIcon,
        insertCommand: INSERT_BOOKMARK_COMMAND,
        matches: ['bookmark'],
        queryParams: ['url'],
        priority: 4,
        shortcut: '/bookmark [url]'
    }];

    getIcon() {
        return BookmarkCardIcon;
    }

    constructor(dataset: Record<string, unknown> = {}, key?: string) {
        super(dataset, key);

        this.__createdWithUrl = !!dataset.url && !dataset.metadata;

        // set up nested editor instances
        setupNestedEditor(this, '__captionEditor', {editor: dataset.captionEditor as LexicalEditor | undefined, nodes: MINIMAL_NODES});

        // populate nested editors on initial construction
        if (!dataset.captionEditor && dataset.caption) {
            populateNestedEditor(this, '__captionEditor', `${dataset.caption}`); // we serialize with no wrapper
        }
    }

    getDataset() {
        const dataset = super.getDataset();

        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.captionEditor = self.__captionEditor;
        dataset.captionEditorInitialState = self.__captionEditorInitialState;

        return dataset;
    }

    exportJSON() {
        const json = super.exportJSON();

        // convert nested editor instances back into HTML because their content may not
        // be automatically updated when the nested editor changes
        if (this.__captionEditor) {
            this.__captionEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__captionEditor, null);
                const cleanedHtml = cleanBasicHtml(html);
                json.caption = cleanedHtml ?? "";
            });
        }

        return json;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <BookmarkNodeComponent
                    author={this.author as string}
                    captionEditor={this.__captionEditor}
                    captionEditorInitialState={this.__captionEditorInitialState as string | undefined}
                    createdWithUrl={this.__createdWithUrl}
                    description={this.description as string}
                    icon={this.icon as string}
                    nodeKey={this.getKey()}
                    publisher={this.publisher as string}
                    thumbnail={this.thumbnail as string}
                    title={this.title as string}
                    url={this.url as string}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createBookmarkNode = (dataset: Record<string, unknown>) => {
    return new BookmarkNode(dataset);
};

export function $isBookmarkNode(node: unknown): node is BookmarkNode {
    return node instanceof BookmarkNode;
}
