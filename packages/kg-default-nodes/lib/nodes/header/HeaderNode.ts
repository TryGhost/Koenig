/* eslint-disable ghost/filenames/match-exported-class */
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderHeaderNodeV1} from './renderers/v1/header-renderer';
import {parseHeaderNode} from './parsers/header-parser';
// V2 imports below
import {renderHeaderNodeV2} from './renderers/v2/header-renderer';
import {DOMConversionMap, LexicalNode} from 'lexical';

export type HeaderNodeDataset = {
    size?: 'small' | 'large';
    style?: 'dark' | 'light' | 'image' | 'text'; // v1 uses image/text, v2 uses dark/light
    buttonEnabled?: boolean;
    buttonUrl?: string;
    buttonText?: string;
    header?: string;
    subheader?: string;
    backgroundImageSrc?: string;
    accentColor?: string;
    alignment?: 'center' | 'left' | 'right';
    backgroundColor?: string;
    backgroundImageWidth?: number;
    backgroundImageHeight?: number;
    backgroundSize?: 'cover' | 'contain';
    textColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    layout?: 'full' | 'split';
    swapped?: boolean;
    version?: 1 | 2;
};

type HeaderNodeProps = {
    nodeType: 'header';
    properties: KoenigDecoratorNodeProperties;
};

const headerNodeProps: HeaderNodeProps = {
    nodeType: 'header',
    properties: [
        {name: 'size', default: 'small'},
        {name: 'style', default: 'dark'},
        {name: 'buttonEnabled', default: false},
        {name: 'buttonUrl', default: '', urlType: 'url'},
        {name: 'buttonText', default: ''},
        {name: 'header', default: '', urlType: 'html', wordCount: true},
        {name: 'subheader', default: '', urlType: 'html', wordCount: true},
        {name: 'backgroundImageSrc', default: '', urlType: 'url'},
        // we need to initialize a new version property here so that we can separate v1 and v2
        // we should never remove old properties, only add new ones, as this could break & corrupt existing content
        // ref https://lexical.dev/docs/concepts/serialization#versioning--breaking-changes
        {name: 'version', default: 1},
        {name: 'accentColor', default: '#FF1A75'}, // this is used to have the accent color hex for email
        // v2 properties
        {name: 'alignment', default: 'center'},
        {name: 'backgroundColor', default: '#000000'},
        {name: 'backgroundImageWidth', default: null},
        {name: 'backgroundImageHeight', default: null},
        {name: 'backgroundSize', default: 'cover'},
        {name: 'textColor', default: '#FFFFFF'},
        {name: 'buttonColor', default: '#ffffff'},
        {name: 'buttonTextColor', default: '#000000'},
        {name: 'layout', default: 'full'}, // replaces size
        {name: 'swapped', default: false}
    ]
};

// This is our first node that has a custom version property
export class HeaderNode extends generateDecoratorNode(headerNodeProps) {
    static importDOM(): DOMConversionMap | null {
        return parseHeaderNode();
    }

    exportDOM(options = {}) {
        if (this.version === 1) {
            return renderHeaderNodeV1(this, options);
        } else {
            return renderHeaderNodeV2(this, options);
        }
    }
}

export const $createHeaderNode = (dataset: HeaderNodeDataset) => {
    return new HeaderNode(dataset);
};

export function $isHeaderNode(node: LexicalNode) {
    return node instanceof HeaderNode;
}
