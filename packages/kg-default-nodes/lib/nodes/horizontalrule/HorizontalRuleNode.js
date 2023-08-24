/* eslint-disable ghost/filenames/match-exported-class */
import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderHorizontalRuleNode} from './horizontalrule-renderer';
import {parseHorizontalRuleNode} from './horizontalrule-parser';

export class HorizontalRuleNode extends generateDecoratorNode({nodeType: 'horizontalrule',
    properties: [
        {name: 'color', default: 'grey'},
        {name: 'height', default: '1'},
        {name: 'width', default: '100'},
        {name: 'style', default: 'border-solid'}
    ]}
) {
    /* override */
    constructor({color, height, width, style} = {}, key) {
        super(key);
        this.__color = color || 'grey';
        this.__height = height || '1';
        this.__width = width || '100';
        this.__style = style || 'border-solid';
    }
    static importDOM() {
        return parseHorizontalRuleNode(this);
    }

    exportDOM(options = {}) {
        return renderHorizontalRuleNode(this, options);
    }

    getTextContent() {
        return '---\n\n';
    }
}

export function $createHorizontalRuleNode() {
    return new HorizontalRuleNode();
}

export function $isHorizontalRuleNode(node) {
    return node instanceof HorizontalRuleNode;
}
