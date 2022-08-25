import React from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ListItemNode, ListNode} from '@lexical/list';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {LinkNode} from '@lexical/link';
import {HorizontalRuleNode} from '../nodes/HorizontalRuleNode';
import {AsideNode} from '../nodes/AsideNode';
import {ImageNode} from '../nodes/ImageNode';
import defaultTheme from '../themes/default';

export const DEFAULT_NODES = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AsideNode,
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

const defaultConfig = {
    namespace: 'KoenigEditor',
    theme: defaultTheme,
    onError
};

const KoenigComposer = ({nodes = [...DEFAULT_NODES], children}) => {
    const initialConfig = React.useMemo(() => Object.assign({}, defaultConfig, {nodes}), [nodes]);

    return (
        <LexicalComposer initialConfig={initialConfig}>
            {children}
        </LexicalComposer>
    );
};

export default KoenigComposer;
