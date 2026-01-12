import {
    ExtendedHeadingNode,
    ExtendedTextNode,
    extendedHeadingNodeReplacement,
    extendedTextNodeReplacement
} from '@tryghost/kg-default-nodes';

import {HeadingNode} from '@lexical/rich-text';
import {LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';

import {ButtonNode} from './ButtonNode';
import {HorizontalRuleNode} from './HorizontalRuleNode';
import {ImageNode} from './ImageNode';

const EMAIL_TEMPLATE_NODES = [
    ExtendedTextNode,
    extendedTextNodeReplacement,
    HeadingNode,
    ExtendedHeadingNode,
    extendedHeadingNodeReplacement,
    ListNode,
    ListItemNode,
    LinkNode,
    ButtonNode,
    HorizontalRuleNode,
    ImageNode
];

export default EMAIL_TEMPLATE_NODES;
