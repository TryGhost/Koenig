import type {Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement} from 'lexical';
import generateEditorState from './generateEditorState';
import {MINIMAL_NODES} from '../index.js';
import {createEditor} from 'lexical';

const BLANK_EDITOR_STATE = JSON.stringify({
    root: {
        children: [
            {
                children: [],
                direction: null,
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1
            }
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1
    }
});

interface SetupNestedEditorOptions {
    editor?: LexicalEditor;
    initialEditorState?: string;
    nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
}

export function setupNestedEditor(node: Record<string, unknown>, editorProperty: string, {editor, initialEditorState = BLANK_EDITOR_STATE, nodes = MINIMAL_NODES}: SetupNestedEditorOptions = {}) {
    if (editor) {
        node[editorProperty] = editor;
    } else {
        node[editorProperty] = createEditor({nodes});

        // set up a blank document with a paragraph otherwise the editor won't receive focus
        const editorState = (node[editorProperty] as LexicalEditor).parseEditorState(initialEditorState);
        (node[editorProperty] as LexicalEditor).setEditorState(editorState, {tag: 'history-merge'}); // use history merge to prevent undo clearing the initial state
    }
}

export function populateNestedEditor(node: Record<string, unknown>, editorProperty: string, html: string | undefined) {
    if (!html) {
        return;
    }

    const nestedEditor = node[editorProperty] as LexicalEditor;
    const editorState = generateEditorState({
        editor: nestedEditor,
        initialHtml: html
    });

    nestedEditor.setEditorState(editorState, {tag: 'history-merge'}); // use history merge to prevent undo clearing the initial state

    // store the initial state separately as it's passed in to `<CollaborationPlugin />`
    // for use when there is no YJS document already stored
    node[`${editorProperty}InitialState`] = editorState;
}
