import ProductCardIcon from '../assets/icons/kg-card-type-product.svg?react';
import {cleanBasicHtml} from '@tryghost/kg-clean-basic-html';
import {$generateHtmlFromNodes} from '@lexical/html';
import {BASIC_NODES, KoenigCardWrapper, MINIMAL_NODES} from '../index.js';
import {ProductNode as BaseProductNode} from '@tryghost/kg-default-nodes';
import {ProductNodeComponent} from './ProductNodeComponent';
import type {LexicalEditor} from 'lexical';
import {createCommand} from 'lexical';
import {isEditorEmpty} from '../utils/isEditorEmpty';
import {populateNestedEditor, setupNestedEditor} from '../utils/nested-editors.js';

// re-export here, so we don't need to import from multiple places throughout the app
export const INSERT_PRODUCT_COMMAND = createCommand();
interface ProductNodeProperties {
    productButton: string;
    productUrl: string;
    productDescription: string;
    productImageHeight: number;
    productImageSrc: string;
    productImageWidth: number;
    productButtonEnabled: boolean;
    productRatingEnabled: boolean;
    productStarRating: number;
    productTitle: string;
}

export class ProductNode extends BaseProductNode {
    __productTitleEditor!: LexicalEditor;
    __productTitleEditorInitialState: unknown;
    __productDescriptionEditor!: LexicalEditor;
    __productDescriptionEditorInitialState: unknown;

    static kgMenu = [{
        label: 'Product',
        desc: 'Add a product recommendation',
        Icon: ProductCardIcon,
        insertCommand: INSERT_PRODUCT_COMMAND,
        matches: ['product'],
        priority: 16,
        shortcut: '/product'
    }];

    getIcon() {
        return ProductCardIcon;
    }

    constructor(dataset: Record<string, unknown> = {}, key?: string) {
        super(dataset, key);

        // set up nested editor instances
        setupNestedEditor(this, '__productTitleEditor', {editor: dataset.productTitleEditor as LexicalEditor | undefined, nodes: MINIMAL_NODES});
        setupNestedEditor(this, '__productDescriptionEditor', {editor: dataset.productDescriptionEditor as LexicalEditor | undefined, nodes: BASIC_NODES});

        // populate nested editors on initial construction
        if (!dataset.productTitleEditor && dataset.productTitle) {
            populateNestedEditor(this, '__productTitleEditor', `${dataset.productTitle}`); // we serialize with no wrapper
        }
        if (!dataset.productDescriptionEditor) {
            populateNestedEditor(this, '__productDescriptionEditor', dataset.productDescription as string | undefined);
        }
    }

    getDataset() {
        const dataset = super.getDataset();

        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.productTitleEditor = self.__productTitleEditor;
        dataset.productTitleEditorInitialState = self.__productTitleEditorInitialState;
        dataset.productDescriptionEditor = self.__productDescriptionEditor;
        dataset.productDescriptionEditorInitialState = self.__productDescriptionEditorInitialState;

        return dataset;
    }

    exportJSON() {
        const json = super.exportJSON();

        // convert nested editor instances back into HTML because their content may not
        // be automatically updated when the nested editor changes
        if (this.__productTitleEditor) {
            this.__productTitleEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__productTitleEditor, null);
                const cleanedHtml = cleanBasicHtml(html, {firstChildInnerContent: true, allowBr: true});
                json.productTitle = cleanedHtml ?? "";
            });
        }
        if (this.__productDescriptionEditor) {
            this.__productDescriptionEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__productDescriptionEditor, null);
                const cleanedHtml = cleanBasicHtml(html, {allowBr: true});
                json.productDescription = cleanedHtml ?? "";
            });
        }

        return json;
    }

    decorate() {
        const props = this as unknown as ProductNodeProperties;
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <ProductNodeComponent
                    buttonText={props.productButton}
                    buttonUrl={props.productUrl}
                    description={props.productDescription}
                    descriptionEditor={this.__productDescriptionEditor}
                    descriptionEditorInitialState={this.__productDescriptionEditorInitialState as string | undefined}
                    imgHeight={props.productImageHeight}
                    imgSrc={props.productImageSrc}
                    imgWidth={props.productImageWidth}
                    isButtonEnabled={props.productButtonEnabled}
                    isRatingEnabled={props.productRatingEnabled}
                    nodeKey={this.getKey()}
                    starRating={props.productStarRating}
                    title={props.productTitle}
                    titleEditor={this.__productTitleEditor}
                    titleEditorInitialState={this.__productTitleEditorInitialState as string | undefined}
                />
            </KoenigCardWrapper>
        );
    }

    // override the default `isEmpty` check because we need to check the nested editors
    // rather than the data properties themselves
    isEmpty() {
        const isTitleEmpty = isEditorEmpty(this.__productTitleEditor);
        const isDescriptionEmpty = isEditorEmpty(this.__productDescriptionEditor);
        const isButtonFilled = this.productButtonEnabled && this.productUrl && this.productButton;

        return isTitleEmpty && isDescriptionEmpty && !isButtonFilled && !this.productImageSrc && !this.productRatingEnabled;
    }
}

export const $createProductNode = (dataset: Record<string, unknown>) => {
    return new ProductNode(dataset);
};

export function $isProductNode(node: unknown): node is ProductNode {
    return node instanceof ProductNode;
}
