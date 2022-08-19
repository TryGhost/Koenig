import {ListItemNode, ListNode} from '@lexical/list';
import {CodeNode} from '@lexical/code';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {LinkNode} from '@lexical/link';
import {AsideNode} from './aside';

const DefaultNodes = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AsideNode,
    CodeNode,
    LinkNode
];

export default DefaultNodes;
