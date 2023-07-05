import React from 'react';
import {CollectionNode as BaseCollectionNode} from '@tryghost/kg-default-nodes';
import {ReactComponent as CollectionCardIcon} from '../assets/icons/kg-card-type-collection.svg';
import {CollectionNodeComponent} from './CollectionNodeComponent';
import {KoenigCardWrapper} from '../index.js';
import {createCommand} from 'lexical';

export const INSERT_COLLECTION_COMMAND = createCommand();

export class CollectionNode extends BaseCollectionNode {
    static kgMenu = [{
        label: 'Collection',
        desc: 'Add a collection of posts',
        Icon: CollectionCardIcon,
        insertCommand: INSERT_COLLECTION_COMMAND,
        matches: ['collection', 'post'],
        priority: 18,
        postType: 'page'
    }];

    getIcon() {
        return CollectionCardIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <CollectionNodeComponent
                    collection={this.collection}
                    columns={this.columns}
                    layout={this.layout}
                    nodeKey={this.getKey()}
                    postCount={this.postCount}
                    rows={this.rows}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createCollectionNode = (dataset) => {
    return new CollectionNode(dataset);
};

export function $isCollectionNode(node) {
    return node instanceof CollectionNode;
}
