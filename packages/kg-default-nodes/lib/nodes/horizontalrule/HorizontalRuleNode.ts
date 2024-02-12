/* eslint-disable ghost/filenames/match-exported-class */
import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderHorizontalRuleNode} from './horizontalrule-renderer';
import {parseHorizontalRuleNode} from './horizontalrule-parser';
import {DOMConversionMap, LexicalNode} from 'lexical';

type HorizontalRuleNodeProps = {
    nodeType: 'horizontalrule';
};

const horizontalRuleNodeProps: HorizontalRuleNodeProps = {
    nodeType: 'horizontalrule'
};

export class HorizontalRuleNode extends generateDecoratorNode(horizontalRuleNodeProps) {
    static importDOM(): DOMConversionMap | null {
        return parseHorizontalRuleNode();
    }

    exportDOM(options = {}) {
        return renderHorizontalRuleNode(this, options);
    }

    getTextContent() {
        return '---\n\n';
    }

    hasEditMode() {
        return false;
    }
}

export function $createHorizontalRuleNode() {
    return new HorizontalRuleNode();
}

export function $isHorizontalRuleNode(node: LexicalNode) {
    return node instanceof HorizontalRuleNode;
}
