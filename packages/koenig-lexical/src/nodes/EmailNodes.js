import {
    ExtendedHeadingNode,
    ExtendedTextNode,
    extendedHeadingNodeReplacement,
    extendedTextNodeReplacement
} from '@tryghost/kg-default-nodes';

import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';

import {AsideNode} from './AsideNode';
import {ButtonNode} from './ButtonNode';
import {CalloutNode} from './CalloutNode';
import {HorizontalRuleNode} from './HorizontalRuleNode';

const EMAIL_NODES = [
    ExtendedTextNode,
    extendedTextNodeReplacement,
    HeadingNode,
    ExtendedHeadingNode,
    extendedHeadingNodeReplacement,
    QuoteNode,
    AsideNode,
    ListNode,
    ListItemNode,
    LinkNode,
    ButtonNode,
    CalloutNode,
    HorizontalRuleNode
];

export default EMAIL_NODES;
