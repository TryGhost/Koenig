/* eslint-disable ghost/filenames/match-exported-class */
import {DOMConversionMap, LexicalNode, NodeKey, SerializedLexicalNode, Spread} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseBookmarkNode} from './bookmark-parser';
import {renderBookmarkNode} from './bookmark-renderer';

export type BookmarkNodeDataset = {
    url?: string;
    metadata?: {
        icon?: string;
        title?: string;
        description?: string;
        author?: string;
        publisher?: string;
        thumbnail?: string;
    };
    caption?: string;
};

export type SerializedBookmarkNode = Spread<BookmarkNodeDataset, SerializedLexicalNode>;

type BookmarkNodeProps = {
    nodeType: 'bookmark';
    properties: KoenigDecoratorNodeProperties
};

const bookmarkNodeProps: BookmarkNodeProps = {
    nodeType: 'bookmark',
    properties: [
        {name: 'title', default: '', wordCount: true},
        {name: 'description', default: '', wordCount: true},
        {name: 'url', default: '', urlType: 'url', wordCount: true},
        {name: 'caption', default: '', wordCount: true},
        {name: 'author', default: ''},
        {name: 'publisher', default: ''},
        {name: 'icon', default: '', urlType: 'url'},
        {name: 'thumbnail', default: '', urlType: 'url'}
    ]
};

export class BookmarkNode extends generateDecoratorNode(bookmarkNodeProps) {
    static importDOM(): DOMConversionMap | null {
        return parseBookmarkNode();
    }

    exportDOM(options = {}) {
        return renderBookmarkNode(this, options);
    }

    /* override */
    constructor({url, metadata, caption}: BookmarkNodeDataset = {}, key?: NodeKey) {
        super(key);
        this.__url = url || '';
        this.__icon = metadata?.icon || '';
        this.__title = metadata?.title || '';
        this.__description = metadata?.description || '';
        this.__author = metadata?.author || '';
        this.__publisher = metadata?.publisher || '';
        this.__thumbnail = metadata?.thumbnail || '';
        this.__caption = caption || '';
    }

    /* @override */
    getDataset(): BookmarkNodeDataset {
        const self = this.getLatest();
        return {
            url: self.__url,
            metadata: {
                icon: self.__icon,
                title: self.__title,
                description: self.__description,
                author: self.__author,
                publisher: self.__publisher,
                thumbnail: self.__thumbnail
            },
            caption: self.__caption
        };
    }

    /* @override */
    static importJSON(serializedNode: SerializedBookmarkNode): BookmarkNode {
        const {url, metadata, caption} = serializedNode;
        const node = new this({
            url,
            metadata,
            caption
        });
        return node;
    }

    /* @override */
    exportJSON(): SerializedBookmarkNode {
        const dataset = {
            type: 'bookmark',
            version: 1,
            url: this.url,
            metadata: {
                icon: this.icon,
                title: this.title,
                description: this.description,
                author: this.author,
                publisher: this.publisher,
                thumbnail: this.thumbnail
            },
            caption: this.caption
        };
        return dataset;
    }

    isEmpty(): boolean {
        return !this.url;
    }
}

export const $createBookmarkNode = (dataset: BookmarkNodeDataset) => {
    return new BookmarkNode(dataset);
};

export function $isBookmarkNode(node: LexicalNode) {
    return node instanceof BookmarkNode;
}
