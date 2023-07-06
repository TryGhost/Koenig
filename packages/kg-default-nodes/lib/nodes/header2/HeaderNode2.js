import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderHeaderNode} from './HeaderRenderer2';
import {parseHeaderNode} from './HeaderParser2';

export class HeaderNode2 extends generateDecoratorNode(
    {nodeType: 'header2',
        version: 2,
        properties: [
            {name: 'size', default: 'small'}, // v1 only
            {name: 'style', default: 'dark'}, // v1 only - these might be irrelevant in v2
            {name: 'buttonEnabled', default: false}, // v1
            {name: 'buttonUrl', default: '', urlType: 'url'}, // v1
            {name: 'buttonText', default: ''}, // v1
            {name: 'header', default: '', urlType: 'html', wordCount: true}, // v1
            {name: 'subheader', default: '', urlType: 'html', wordCount: true}, // v1
            {name: 'backgroundImageSrc', default: '', urlType: 'url'}, // v1
            // enchanced new feature props
            {name: 'alignment', default: 'left'}, // v2
            {name: 'backgroundColor', default: '#F0F0F0'},
            {name: 'backgroundSize', default: 'cover'},
            {name: 'textColor', default: '#000000'},
            {name: 'buttonColor', default: '#000000'},
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

export const $createHeaderNode2 = (dataset) => {
    return new HeaderNode2(dataset);
};

export function $isHeaderNode2(node) {
    return node instanceof HeaderNode2;
}
