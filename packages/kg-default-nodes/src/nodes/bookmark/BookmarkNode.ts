import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parseBookmarkNode} from './bookmark-parser.js';
import {renderBookmarkNode} from './bookmark-renderer.js';

interface BookmarkMetadata {
    icon?: string;
    title?: string;
    description?: string;
    author?: string;
    publisher?: string;
    thumbnail?: string;
}

interface BookmarkData {
    url?: string;
    metadata?: BookmarkMetadata;
    caption?: string;
}

export interface BookmarkNode {
    title: string;
    description: string;
    url: string;
    caption: string;
    author: string;
    publisher: string;
    icon: string;
    thumbnail: string;
}

export class BookmarkNode extends generateDecoratorNode({
    nodeType: 'bookmark',
    properties: [
        {name: 'title', default: '', wordCount: true},
        {name: 'description', default: '', wordCount: true},
        {name: 'url', default: '', urlType: 'url', wordCount: true},
        {name: 'caption', default: '', wordCount: true},
        {name: 'author', default: ''},
        {name: 'publisher', default: ''},
        {name: 'icon', urlPath: 'metadata.icon', default: '', urlType: 'url'},
        {name: 'thumbnail', urlPath: 'metadata.thumbnail', default: '', urlType: 'url'}
    ],
    defaultRenderFn: renderBookmarkNode
}) {
    static importDOM() {
        return parseBookmarkNode(this);
    }

    /* override */
    constructor({url, metadata, caption}: BookmarkData = {}, key?: string) {
        super({}, key);
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
    getDataset(): Record<string, unknown> {
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
    static importJSON(serializedNode: Record<string, unknown>) {
        const {url, metadata, caption} = serializedNode as BookmarkData;
        const node = new this({
            url,
            metadata,
            caption
        });
        return node;
    }

    /* @override */
    exportJSON() {
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

    isEmpty() {
        return !this.url;
    }
}

export const $createBookmarkNode = (dataset: Record<string, unknown>) => {
    return new BookmarkNode(dataset);
};

export function $isBookmarkNode(node: unknown): node is BookmarkNode {
    return node instanceof BookmarkNode;
}
