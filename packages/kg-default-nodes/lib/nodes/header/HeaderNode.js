import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderHeaderNode} from './HeaderRenderer';
import {parseHeaderNode} from './HeaderParser';

export class HeaderNode extends generateDecoratorNode({nodeType: 'header',
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
        {name: 'version', default: 2},
        // v2 properties
        {name: 'alignment', default: 'left'},
        {name: 'backgroundColor', default: '#F0F0F0'},
        {name: 'backgroundSize', default: 'cover'},
        {name: 'textColor', default: '#000000'},
        {name: 'buttonColor', default: 'accent'},
        {name: 'buttonTextColor', default: '#FFFFFF'},
        {name: 'layout', default: 'wide'},
        {name: 'swapped', default: false}
    ]}
) {
    static importDOM() {
        return parseHeaderNode(this);
    }

    exportDOM(options = {}) {
        return renderHeaderNode(this, options);
    }
}

export const $createHeaderNode = (dataset) => {
    return new HeaderNode(dataset);
};

export function $isHeaderNode(node) {
    return node instanceof HeaderNode;
}
