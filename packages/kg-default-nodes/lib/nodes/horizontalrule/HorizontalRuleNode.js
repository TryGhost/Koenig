/* eslint-disable ghost/filenames/match-exported-class */
import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderHorizontalRuleNode} from './horizontalrule-renderer';
import {parseHorizontalRuleNode} from './horizontalrule-parser';

export class HorizontalRuleNode extends generateDecoratorNode({nodeType: 'horizontalrule',
    properties: [
        {name: 'size', default: 1},
        {name: 'color', default: 'grey'}
    ]}
) {
    /* override */
    constructor({color} = {}, key) {
        super(key);
        this.__size = size || 1;
        this.__color = color || 'grey';
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
