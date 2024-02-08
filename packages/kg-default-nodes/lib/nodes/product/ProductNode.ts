/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseProductNode} from './product-parser';
import {renderProductNode} from './product-renderer';

export type ProductNodeDataset = {
    productImageSrc?: string;
    productImageWidth?: number;
    productImageHeight?: number;
    productTitle?: string;
    productDescription?: string;
    productRatingEnabled?: boolean;
    productStarRating?: number;
    productButtonEnabled?: boolean;
    productButton?: string;
    productUrl?: string;
};

type ProductNodeProps = {
    nodeType: 'product';
    properties: KoenigDecoratorNodeProperties;
};

const productNodeProps: ProductNodeProps = {
    nodeType: 'product',
    properties: [
        {name: 'productImageSrc', default: '', urlType: 'url'},
        {name: 'productImageWidth', default: null},
        {name: 'productImageHeight', default: null},
        {name: 'productTitle', default: '', urlType: 'html', wordCount: true},
        {name: 'productDescription', default: '', urlType: 'html', wordCount: true},
        {name: 'productRatingEnabled', default: false},
        {name: 'productStarRating', default: 5},
        {name: 'productButtonEnabled', default: false},
        {name: 'productButton', default: ''},
        {name: 'productUrl', default: ''}
    ]
};

export class ProductNode extends generateDecoratorNode(productNodeProps) {
    /* override */
    exportJSON() {
        // checks if src is a data string
        const {productImageSrc, productImageWidth, productImageHeight, productTitle, productDescription, productRatingEnabled, productStarRating, productButtonEnabled, productButton, productUrl} = this;
        const isBlob = productImageSrc.startsWith('data:');

        const dataset = {
            type: 'product',
            version: 1,
            productImageSrc: isBlob ? '<base64String>' : productImageSrc,
            productImageWidth,
            productImageHeight,
            productTitle,
            productDescription,
            productRatingEnabled,
            productStarRating,
            productButtonEnabled,
            productButton,
            productUrl

        };
        return dataset;
    }

    static importDOM() {
        return parseProductNode(this);
    }

    exportDOM(options = {}) {
        return renderProductNode(this, options);
    }

    isEmpty(): boolean {
        const isButtonFilled = this.__productButtonEnabled && this.__productUrl && this.__productButton;
        return !this.__productTitle && !this.__productDescription && !isButtonFilled && !this.__productImageSrc && !this.__productRatingEnabled;
    }
}

export const $createProductNode = (dataset: ProductNodeDataset) => {
    return new ProductNode(dataset);
};

export function $isProductNode(node: LexicalNode) {
    return node instanceof ProductNode;
}
