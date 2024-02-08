/* eslint-disable ghost/filenames/match-exported-class */
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderCollectionNode} from './collection-renderer';
import {collectionParser} from './collection-parser';
import {LexicalNode} from 'lexical';

export type CollectionNodeDataset = {
    collection?: string;
    postCount?: number;
    layout?: string;
    columns?: number;
    header?: string;
};

type CollectionNodeProps = {
    nodeType: 'collection';
    properties: KoenigDecoratorNodeProperties
};

const collectionNodeProps: CollectionNodeProps = {
    nodeType: 'collection',
    properties: [
        {name: 'collection', default: 'latest'}, // start with empty object; might want to just store the slug
        {name: 'postCount', default: 3},
        {name: 'layout', default: 'grid'},
        {name: 'columns', default: 3},
        {name: 'header', default: '', wordCount: true}
    ]
};

export class CollectionNode extends generateDecoratorNode(collectionNodeProps) {
    static importDOM() {
        return collectionParser(this);
    }

    exportDOM(options = {}) {
        return renderCollectionNode(this, options);
    }

    hasDynamicData() {
        return true;
    }

    // TODO: build the options object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getDynamicData(options: any = {}) {
        const key = this.getKey();
        const collection = this.__collection;
        const postCount = this.__postCount;
        
        if (!options?.getCollectionPosts) {
            return;
        }

        const posts = await options.getCollectionPosts(collection, postCount);
        return {key, data: posts};
    }
}

export const $createCollectionNode = (dataset: CollectionNodeDataset) => {
    return new CollectionNode(dataset);
};

export function $isCollectionNode(node: LexicalNode) {
    return node instanceof CollectionNode;
}
