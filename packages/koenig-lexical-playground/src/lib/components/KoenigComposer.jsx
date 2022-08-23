import {LexicalComposer} from '@lexical/react/LexicalComposer';
import defaultTheme from '../themes/default';

import {ListItemNode, ListNode} from '@lexical/list';
import {CodeNode} from '@lexical/code';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {LinkNode} from '@lexical/link';
import {HorizontalRuleNode} from '../nodes/HorizontalRuleNode';
import {AsideNode} from '../nodes/AsideNode';
import {ImageNode} from '../nodes/ImageNode';

export const DEFAULT_NODES = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AsideNode,
    CodeNode,
    LinkNode,
    ImageNode,
    HorizontalRuleNode
];

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
    console.error(error); // eslint-disable-line
}

const initialConfig = {
    namespace: 'KoenigEditor',
    nodes: [...DEFAULT_NODES],
    theme: defaultTheme,
    onError
};

const KoenigComposer = ({children}) => {
    return (
        <LexicalComposer initialConfig={initialConfig}>
            {children}
        </LexicalComposer>
    );
};

export default KoenigComposer;
