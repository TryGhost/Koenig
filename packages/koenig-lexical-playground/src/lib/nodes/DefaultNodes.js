import {ListItemNode, ListNode} from '@lexical/list';
import {CodeNode} from '@lexical/code';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {LinkNode} from '@lexical/link';

const DefaultNodes = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    LinkNode
];

export default DefaultNodes;
