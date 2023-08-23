import * as React from 'react';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {HorizontalRuleNode as BaseHorizontalRuleNode} from '@tryghost/kg-default-nodes';
import {ReactComponent as DividerCardIcon} from '../assets/icons/kg-card-type-divider.svg';
import {HorizontalRuleNodeComponent} from './HorizontalRuleNodeComponent';
import {createCommand} from 'lexical';

export const INSERT_HORIZONTAL_RULE_COMMAND = createCommand();

export class HorizontalRuleNode extends BaseHorizontalRuleNode {
    static kgMenu = {
        label: 'Divider',
        desc: 'Insert a dividing line',
        Icon: DividerCardIcon,
        insertCommand: INSERT_HORIZONTAL_RULE_COMMAND,
        matches: ['divider', 'horizontal-rule', 'hr', 'separator'],
        priority: 5
    };

    static getType() {
        return 'horizontalrule';
    }

    getIcon() {
        return DividerCardIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
                wrapperStyle="wide"
            >
                <HorizontalRuleNodeComponent
                    alignment={this.alignment}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createHorizontalRuleNode(dataset) {
    return new HorizontalRuleNode(dataset);
}

export function $isHorizontalRuleNode(node) {
    return node instanceof HorizontalRuleNode;
}
