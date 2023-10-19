import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ListItemNode, ListNode} from '@lexical/list';
import {LinkNode} from '@lexical/link';
import {DEFAULT_NODES} from '@tryghost/kg-default-nodes';
import {createHeadlessEditor} from '@lexical/headless';
import {CreateEditorArgs} from 'lexical';

export const defaultNodes: any[] = [
    // basic HTML nodes
    HeadingNode,
    LinkNode,
    ListItemNode,
    ListNode,
    QuoteNode,

    // Koenig nodes
    ...DEFAULT_NODES
];

export const defaultEditorConfig: CreateEditorArgs = {
    nodes: defaultNodes,
    onError(e: Error) {
        throw e;
    }
};

export const createEditor = function (config?: CreateEditorArgs) {
    const editorConfig: CreateEditorArgs = Object.assign({}, defaultEditorConfig, config);
    const editor = createHeadlessEditor(editorConfig);

    return editor;
};
